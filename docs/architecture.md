# Portfolio architecture

## Principles

1. Generate a fast static site that is straightforward to host.
2. Maintain factual and structural parity between French and English.
3. Separate shared facts, localized interface copy, and project narratives.
4. Hide incomplete fields and never invent personal information.
5. Add client-side JavaScript only for useful progressive enhancement.

The implemented visual system is documented in [`docs/design-system.md`](design-system.md). `src/styles/global.css` remains the executable source for its tokens.

## Content flow

```text
profile.ts + copy.ts + projects/*.mdx
                 ↓
          Astro components
                 ↓
          FR and EN pages
                 ↓
           static build
```

## Internationalization

French is the default language. English routes live under `/en/`. Every route explicitly provides its translated equivalent to the language selector; the site performs no automatic locale redirect.

Indexable pages publish reciprocal French, English, and `x-default` alternates. `x-default` points to French. Build validation checks that every alternate resolves and points back correctly. The bilingual 404 page publishes no canonical URL, alternate, or structured data.

## Projects

Each project has one MDX entry per language. `src/lib/project-schema.mjs` is shared by Astro and the Node content validator; `js-yaml` parses frontmatter with a data-only JSON schema and rejects duplicate keys. Frontmatter contains card, metadata, publication, visual, stack, and optional metric data. The body contains the longer narrative.

Supported publication states:

- `draft`: not rendered;
- `teaser`: a short technical overview based only on validated facts;
- `published`: a reviewed complete case study.

Solo contribution is validated for both current projects; dates remain intentionally omitted. Further maturity, dates and product metrics remain absent until Ethan explicitly validates them for publication in a task. A `teaser` does not imply production readiness.

`scripts/validate-content-parity.mjs` requires one French and one English entry for every slug. It checks publication state, order, featured state, stack, visual, metric values, and equivalent narrative depth. Titles, labels, summaries, and narratives remain naturally localizable.

## Domain, indexing, and social metadata

The build never invents a domain.

- Without `SITE_URL`, internal links remain relative and the build emits no canonical URL, sitemap, or absolute social-image URL.
- With a valid final HTTPS origin in `SITE_URL`, Astro emits canonical URLs, `og:url`, absolute JSON-LD URLs, `robots.txt`, the official sitemap, and absolute social-image URLs.
- The 404 page is excluded from the sitemap.
- With `SITE_NOINDEX=true`, every page becomes `noindex, nofollow`; `robots.txt` blocks crawling; sitemap, canonical, alternates, JSON-LD, and social metadata are removed.

The `noindex` mode reduces accidental indexing risk but does not replace Cloudflare Access or another network restriction for previews.

`scripts/generate-brand-assets.mjs` generates the 64 × 64 favicon, 180 × 180 Apple touch icon, general 1200 × 630 social card, and one 1200 × 630 social card per project from deterministic HTML and CSS based on Violet Field tokens. Generated PNG files are versioned under `public/`; production builds do not run Chromium.

`docs/media-provenance.json` records every publishable media file, its source, SHA-256 hash, dimensions when applicable, and byte budget. Validation rejects missing or unlisted media, modified hashes or dimensions, budget overruns, and bundled fonts. Apart from the five generated brand assets, the current interface distributes no image, video, third-party visual, or font file.

## Security and privacy

Astro generates a CSP for each page. Inline theme and JSON-LD scripts appear after the CSP meta element, and their exact contents are authorized through SHA-256 hashes that build validation recalculates.

`public/_headers` defines the security headers supported by Workers Static Assets. The Cloudflare custom domain terminates TLS and advertises one year of HSTS without `includeSubDomains` or preload while the broader subdomain policy remains deliberately limited.

The public artifact contains no Worker runtime code, Function, binding, origin service, database, application secret, form, account, or dynamic API. Only the static contents of `dist/` are deployed.

The only browser storage used by the application is the `portfolio-theme` preference. The artifact sets no response cookie. Validation blocks unauthorized external resources, embeds, storage or sending APIs, tracking mechanisms, and `Set-Cookie` responses.

The versioned configuration disables Workers Logs, log exports, Wrangler telemetry, dependency instrumentation, and browser-side analytics. Cloudflare still processes network data needed to deliver and protect the site and can produce aggregate technical metrics. The privacy policy documents this distinction. Any change to this scope must update CSP, applicable legal text, and build validation in the same task.

## Hosting and deployment

Node.js 22 generates `dist/`; Cloudflare Workers Static Assets publishes only that directory. `wrangler.jsonc` preserves Astro trailing-slash URLs and serves `404.html` with an HTTP 404 status. No Astro Cloudflare adapter is required while output remains static. Because `SITE_URL` is build-time data, a domain change requires a new build and deployment.

GitHub Actions is the normal publication path:

1. Pull requests run the complete validation suite without Cloudflare secrets.
2. An authorized maintainer can trigger a private preview from the workflow definition on `main`, with an exact Git reference and alias.
3. A secret-free job validates the requested reference and builds `dist/` with `SITE_NOINDEX=true`.
4. A separate protected job loads trusted tooling from `main`, revalidates the artifact, receives the Cloudflare token, and uploads an unpromoted Workers version.
5. The preview workflow proves that anonymous access is blocked by Cloudflare Access before running an authenticated smoke test.
6. A production deployment runs only after complete validation of the current `main` SHA, with `SITE_URL=https://ethanbrosselard.com` and `SITE_NOINDEX=false`.

Secrets remain in protected GitHub environments and never enter the repository, build artifact, or report. Preview and production workflows remain governed by separate explicit enablement variables.

Workers uses revalidation for HTML and long-lived immutable browser caching only for fingerprinted `/_astro/` assets. Remote smoke tests verify both policies. Cloudflare manages the custom-domain DNS record and TLS certificate. `www` permanently redirects to the apex while preserving the path and query string.

## Static validation

`npm run verify` checks:

- formatting;
- Node, npm, CI, Wrangler, and Dependabot consistency;
- Workers configuration;
- bilingual project parity;
- media provenance;
- resume PDF freshness;
- Astro and TypeScript diagnostics;
- an indexable build with a reserved HTTPS origin;
- a fully `noindex` preview build;
- a build without a domain.

`scripts/validate-build.mjs` checks routes, internal reachability, French/English pairs, titles, descriptions, Open Graph locales, sitemap, robots directives, CSP hashes, JSON-LD, document languages, heading hierarchy, main landmarks, current-page state, control names, external-resource restrictions, tracking restrictions, required Violet Field tokens, theme parity, primary contrast ratios, HTML/CSS/JavaScript budgets, placeholders, and common secret patterns.

## Browser validation

`npm run test:e2e` tests all public routes in Chromium, Firefox, WebKit, and mobile Chromium and WebKit profiles. Coverage includes rendering, JavaScript and CSP errors, themes, saved and system preferences, localized control names and states, major links, real 404 behavior, skip-link behavior, DOM tab order, focus visibility, reduced motion, touch targets, 320 px overflow, and axe violations.

Chromium also checks viewport widths corresponding to 200% and 400% reflow from a 1280 px desktop viewport. The site remains readable and navigable without JavaScript. Synthetic checks do not replace real browser zoom, a physical device, or screen-reader review.

Representative pages must remain below a CLS of 0.1 and an encoded transfer budget of 300 KiB. `npm run test:lighthouse` requires scores of at least 95 for performance, accessibility, best practices, and SEO, with LCP at or below 2.5 seconds, CLS at or below 0.1, and TBT at or below 200 ms. These are synthetic technical measurements, not field Core Web Vitals or user-impact claims.

## Deployment validation

`npm run test:deployment -- --url <https-origin> --mode <production|preview>` performs read-only assertions against a Workers origin. It checks all 18 bilingual routes, the real 404 response, CSP and headers, HTML and fingerprinted-asset cache policies, icons, metadata, robots directives, and sitemap behavior.

Production mode checks canonical URLs, alternates, JSON-LD, social cards, and the exact sitemap. Preview mode checks removal of all indexing signals. `--check-http-redirect` verifies a permanent HTTP-to-HTTPS redirect. Repeatable `--redirect-from` options verify permanent canonical redirects with preserved paths and query strings. Preview authentication headers are read only from external secrets and are never written to the optional JSON report.

## Resume artifacts

The HTML and PDF resumes share `src/data/resume.json`. PDF generation uses Playwright's `tagged` and `outline` options to preserve language and navigation structure.

`check:resume`, included in `verify`, compares each PDF with a conservative manifest covering relevant sources, Astro and TypeScript configuration, npm manifests, the lockfile, and the generator. A source change may therefore require `npm run generate:resume-pdfs` even when the visible resume does not change. Freshness validation detects stale artifacts; it does not certify visual quality or PDF/UA compliance.

## Future content

The content model can add future AI work, tools, articles, and projects from other domains without changing the overall architecture. Ethan's positioning must not depend on one stack or the two initial projects.

## Audit remediation contracts — September 2026

- `src/data/routes.json` holds the static FR/EN routes used by interface copy. `scripts/route-catalog.mjs` derives project routes, language pairs and metadata types from schema-validated paired content. Build, deployment and browser checks share that catalogue, while retaining independent assertions for public identity, privacy, reciprocal alternates and document metadata.
- `visual` selects a presentation (`cultural-library`, `game-tiles`, or neutral `typographic`), not a project identity. Titles, short summaries and game labels come from each project. A third project requires paired content and any approved media; it does not require another manual route list.
- A `published` project requires a dated `review` with factual and translation approval by Ethan and an explicit media/evidence disposition (`included`, `not-applicable`, or `withheld`, each explained). This records a real review; it is never a replacement for obtaining that review. Metrics require unique IDs, their nature, measurement date, context, source and explicit approval; these facts must match across languages and are displayed with the value.
- `src/data/resume.json` separates shared timeline facts from localized descriptions. `resume-schema.mjs` validates IDs, paired entries, dates, organizations and project links. `resume.ts` formats periods for each language; a null end means an explicitly confirmed ongoing position. Contact values and the canonical portfolio URL come from `profile.ts` and are shared by HTML and PDF.
- Media provenance accepts the existing generated brand assets and explicitly approved captures. Captures require dated publication approval, source version, rights, demo-data review and FR/EN alternatives, without pretending to have a generator. PNG, JPEG and WebP dimensions and byte hashes are verified; other formats are rejected until a suitable validation path exists. No new capture was supplied or implicitly approved by the audit correction request.
- The theme uses a native system/light/dark select with a stable accessible label. The sticky header reserves its measured height and falls back to normal flow without JavaScript or when too tall. Focus is checked in both keyboard directions. Long headings wrap when visitor text spacing increases; cross-document animations are opt-in for `no-preference` only.
- External link checks retain dated structured results for verified, broken and inconclusive links; transient failures receive one bounded retry. CI uploads `docs/qa/external-links.json`. An inconclusive result still requires review and does not certify availability.
- Deployment smoke tests download both complete PDFs. With `--artifact-directory dist --revision <full SHA>`, they compare every served artifact file (HTML, scripts, styles, media, PDFs, robots and sitemap) byte-for-byte. `_headers` and `_redirects` are platform configuration and are checked separately, not fetched as public files. Reports retain the expected revision and artifact hash. Both deployment workflows require this comparison; manual availability-only checks explicitly report no verified artifact.

### Dependency exception

Astro 7.3.2 and SVGO 4.1.0 replace affected versions. Sharp is pinned to 0.35.4 for the build and media validator; the npm override also replaces Miniflare's pinned 0.35.2 through Wrangler 4.130.0. Remove the override only after the upstream dependency graph itself resolves a corrected Sharp version and `npm ci`, `npm audit --audit-level=high`, builds, PDF generation, media tests and Wrangler's local dry run succeed.

Primary references: [Astro AVIF advisory](https://github.com/withastro/astro/security/advisories/GHSA-26w7-cxv4-gfx2), [Sharp advisory](https://github.com/lovell/sharp/security/advisories/GHSA-rgj7-g3m4-5g8c). The additional direct `js-yaml` and Sharp development dependencies expose libraries already used by the build, so repository validators do not rely on undeclared transitive imports.
