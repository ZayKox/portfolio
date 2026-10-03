# Temporary local security fork

This private package vendors `http-cache-semantics` **4.2.0**, distributed under BSD-2-Clause. The original license is preserved in `LICENSE`.

- Upstream: <https://github.com/kornelski/http-cache-semantics>
- Original npm `index.js` SHA-256: `01b7d66c854b2fe53ac05c98feb6e0d64722ab8898a778e2d2426a8b468d178f`
- Advisory: <https://github.com/advisories/GHSA-ch52-4w7c-c8xp>
- Upstream remediation discussion: <https://github.com/kornelski/http-cache-semantics/issues/56>

The local patch adds `_reuseForbidden()` and applies it before cache reuse in `evaluateRequest()`, `useStaleWhileRevalidate()` and `_useStaleIfError()`. Non-storable responses, `no-cache`, `must-revalidate`, `Vary: *`, shared `proxy-revalidate` and shared cookies without upstream's explicit `public`/`immutable` opt-ins require revalidation. Ordinary expiry and valid public caching remain supported. Remaining upstream logic is retained; formatting is normalized by Prettier.

The package deliberately identifies itself as `@portfolio/http-cache-semantics@4.2.0-portfolio.1`, not a nonexistent upstream fixed release. The root npm override installs it at Astro's existing `http-cache-semantics` import. This is a code correction, not an audit allowlist or an unreviewed remote fork. `scripts/test-cache-security.mjs` resolves Astro's actual installed dependency and tests the prohibited reuse paths, serialization and compatible caching/revalidation.

Remove the override and this directory once an upstream release explicitly fixes the advisory and passes the same regression tests (update the identity assertion accordingly). Recheck npm audit and browser/build validation. Any future upstream refresh must be compared with this fork and retain the regression coverage until the official fix is established.
