import assert from "node:assert/strict";

import { validateCanonicalRedirects } from "./deployment-checks.mjs";

const canonicalOrigin = "https://example.com";
const redirectOrigins = ["https://www.example.com", "https://technical.example.com"];
const requests = [];

function redirectResponse(status, location) {
  return new Response(null, { status, headers: { location } });
}

const validatedOrigins = await validateCanonicalRedirects({
  redirectOrigins,
  expectedSiteOrigin: canonicalOrigin,
  fetchImplementation: async (url) => {
    requests.push(url.href);
    return redirectResponse(308, new URL(`${url.pathname}${url.search}`, canonicalOrigin));
  },
});

assert.deepEqual(validatedOrigins, redirectOrigins);
assert.deepEqual(requests, [
  "https://www.example.com/",
  "https://www.example.com/en/projects/palimia/?redirect_probe=1",
  "https://technical.example.com/",
  "https://technical.example.com/en/projects/palimia/?redirect_probe=1",
]);

await assert.rejects(
  validateCanonicalRedirects({
    redirectOrigins: ["https://www.example.com"],
    expectedSiteOrigin: canonicalOrigin,
    fetchImplementation: async () => redirectResponse(302, canonicalOrigin),
  }),
  /expected a permanent redirect/,
);

await assert.rejects(
  validateCanonicalRedirects({
    redirectOrigins: ["https://www.example.com"],
    expectedSiteOrigin: canonicalOrigin,
    fetchImplementation: async (url) =>
      redirectResponse(308, new URL(url.pathname, "https://wrong.example.com")),
  }),
  /does not redirect to the equivalent canonical URL/,
);

await assert.rejects(
  validateCanonicalRedirects({
    redirectOrigins: ["https://www.example.com"],
    expectedSiteOrigin: canonicalOrigin,
    fetchImplementation: async () => redirectResponse(308, canonicalOrigin),
  }),
  /does not redirect to the equivalent canonical URL/,
);

await assert.rejects(
  validateCanonicalRedirects({
    redirectOrigins: ["https://www.example.com"],
    expectedSiteOrigin: canonicalOrigin,
    fetchImplementation: async (url) =>
      new Response(null, {
        status: 308,
        headers: {
          location: new URL(`${url.pathname}${url.search}`, canonicalOrigin),
          "set-cookie": "redirect-probe=unexpected",
        },
      }),
  }),
  /redirect unexpectedly sets a cookie/,
);

await assert.rejects(
  validateCanonicalRedirects({
    redirectOrigins: [canonicalOrigin],
    expectedSiteOrigin: canonicalOrigin,
    fetchImplementation: async () => redirectResponse(308, canonicalOrigin),
  }),
  /already the canonical origin/,
);

console.log(
  "Validated permanent canonical redirects, deep-link preservation, and rejection paths.",
);
