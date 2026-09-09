import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { validateDocument } from "./deployment-checks.mjs";

const html = readFileSync("dist/index.html", "utf8");
const check = (document) =>
  validateDocument(document, "/", "fr", "production", new URL("https://portfolio.example"));
test("the generated indexable document passes the deployment guard", () => {
  check(html);
});
for (const [name, mutate, message] of [
  ["canonical", (source) => source.replace(/<link\b[^>]*rel="canonical"[^>]*>/, ""), /canonical/],
  [
    "French alternate",
    (source) => source.replace(/<link\b[^>]*hreflang="fr"[^>]*>/, ""),
    /alternate/,
  ],
  [
    "CSP",
    (source) => source.replace(/<meta\b[^>]*http-equiv="content-security-policy"[^>]*>/i, ""),
    /CSP/,
  ],
  [
    "unsafe inline scripts",
    (source) => source.replace("default-src 'self'", "default-src 'unsafe-inline'"),
    /CSP/,
  ],
  [
    "JSON-LD language",
    (source) => source.replace('"inLanguage":"fr"', '"inLanguage":"en"'),
    /language/,
  ],
]) {
  test(`the guard rejects a broken ${name}`, () => {
    const changed = mutate(html);
    assert.notEqual(changed, html, "The fixture mutation must affect the actual build");
    assert.throws(() => check(changed), message);
  });
}
test("a production document is rejected in preview mode", () => {
  assert.throws(
    () => validateDocument(html, "/", "fr", "preview", new URL("https://portfolio.example")),
    /preview/,
  );
});
