import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import test from "node:test";

// Resolve exactly what Astro resolves, not a separate test-only copy.
const astroRequire = createRequire(import.meta.resolve("astro"));
const CachePolicy = astroRequire("http-cache-semantics");
const installed = JSON.parse(
  readFileSync(astroRequire.resolve("http-cache-semantics/package.json"), "utf8"),
);
const request = {
  url: "https://cache.example/image",
  method: "GET",
  headers: { host: "cache.example" },
};
const response = (headers) => ({ status: 200, headers });
const policyFor = (headers, requestHeaders = {}, options = {}) => {
  const policy = new CachePolicy(
    { ...request, headers: { ...request.headers, ...requestHeaders } },
    response(headers),
    options,
  );
  policy.now = () => policy._responseTime + 1000;
  return policy;
};

test("Astro resolves the reviewed local security fork", () => {
  assert.equal(installed.name, "@portfolio/http-cache-semantics");
  assert.equal(installed.version, "4.2.0-portfolio.1");
});

const restricted = [
  ["shared session cookie", { "set-cookie": "session=synthetic-user" }],
  ["proxy revalidation", { "cache-control": "proxy-revalidate" }],
  ["no-cache", { "cache-control": "no-cache" }],
  ["no-store", { "cache-control": "no-store" }],
  ["private shared response", { "cache-control": "private" }],
  ["must-revalidate", { "cache-control": "must-revalidate" }],
  ["wildcard vary", { vary: "*" }],
  ["authenticated shared response", {}, { authorization: "Bearer synthetic" }],
  ["request no-store", {}, { "cache-control": "no-store" }],
];
for (const [label, headers, requestHeaders] of restricted) {
  test(`${label} cannot bypass reuse restrictions through stale directives`, () => {
    const policy = policyFor(headers, requestHeaders);
    for (const directive of ["max-stale", "max-stale=999999999"]) {
      const incoming = {
        ...request,
        headers: { ...request.headers, ...requestHeaders, "cache-control": directive },
      };
      assert.equal(policy.satisfiesWithoutRevalidation(incoming), false);
      const result = policy.evaluateRequest(incoming);
      assert.equal(result.response, undefined);
      assert.equal(result.revalidation.synchronous, true);
      const restored = CachePolicy.fromObject(policy.toObject());
      restored.now = policy.now;
      assert.equal(restored.satisfiesWithoutRevalidation(incoming), false);
    }
    const stalePolicy = policyFor(
      {
        ...headers,
        "cache-control": `${headers["cache-control"] ?? ""}, stale-while-revalidate=600, stale-if-error=600`,
      },
      requestHeaders,
    );
    assert.equal(stalePolicy.useStaleWhileRevalidate(), false);
    const revalidated = stalePolicy.revalidatedPolicy(request, { status: 503, headers: {} });
    assert.notEqual(revalidated.policy, stalePolicy);
    assert.equal(revalidated.modified, true);
  });
}

test("ordinary expiry may still honor max-stale and stale fallbacks", () => {
  const policy = policyFor({
    "cache-control": "max-age=0, stale-while-revalidate=600, stale-if-error=600",
  });
  assert.equal(
    policy.satisfiesWithoutRevalidation({
      ...request,
      headers: { ...request.headers, "cache-control": "max-stale=600" },
    }),
    true,
  );
  assert.equal(policy.useStaleWhileRevalidate(), true);
  assert.equal(policy.revalidatedPolicy(request, { status: 503, headers: {} }).policy, policy);
});

test("public cache freshness, cookie opt-ins and private cache semantics remain compatible", () => {
  for (const [headers, options] of [
    [{ "cache-control": "public, max-age=60" }, {}],
    [{ "cache-control": "public, max-age=60", "set-cookie": "synthetic=1" }, {}],
    [{ "cache-control": "immutable, max-age=60", "set-cookie": "synthetic=1" }, {}],
    [{ "cache-control": "private, max-age=60", "set-cookie": "synthetic=1" }, { shared: false }],
  ]) {
    const policy = policyFor(headers, {}, options);
    assert.equal(policy.storable(), true);
    assert.equal(policy.satisfiesWithoutRevalidation(request), true);
    assert.equal(policy.timeToLive(), 59000);
  }
});

test("remote-image ETag revalidation still refreshes a public cache entry", () => {
  const policy = policyFor({ "cache-control": "public, max-age=60", etag: '"image-v1"' });
  assert.equal(policy.revalidationHeaders(request)["if-none-match"], '"image-v1"');
  const result = policy.revalidatedPolicy(request, {
    status: 304,
    headers: { etag: '"image-v1"', "cache-control": "public, max-age=120" },
  });
  assert.equal(result.modified, false);
  assert.equal(result.matches, true);
  assert.equal(result.policy.maxAge(), 120);
});
