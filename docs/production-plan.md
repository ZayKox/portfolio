# Portfolio roadmap

> Current post-launch roadmap for maintaining and extending the portfolio. Historical implementation details remain available in the dated QA reports and operational runbooks.

## Project status

| Item                | Current value                            |
| ------------------- | ---------------------------------------- |
| Owner               | Ethan Brosselard                         |
| Repository          | <https://github.com/ZayKox/portfolio>    |
| Working branch      | `develop`, still transitional            |
| Production branch   | `main`                                   |
| Hosting             | Cloudflare Workers with Static Assets    |
| Canonical domain    | `ethanbrosselard.com`, without `www`     |
| Languages           | French at the root, English under `/en/` |
| Public milestone    | Minimal public release completed         |
| Last roadmap review | September 8, 2026                        |

## Current outcome

The portfolio is publicly available at <https://ethanbrosselard.com>. It presents Ethan as a versatile software developer and digital maker. AI remains one area of interest rather than an exclusive specialization.

The current public scope includes:

- complete French and English navigation;
- home, projects, about, resume, contact, legal, and privacy pages;
- factual teaser pages for Palimia and Ludosaic;
- HTML resumes and generated PDF files in both languages;
- light, dark, and system themes;
- canonical URLs, reciprocal language alternates, JSON-LD, sitemap, robots directives, and social sharing images;
- a static deployment with no application server, database, form, browser analytics, tracking cookies, or embedded third-party content.

The portrait, complete project case studies, screenshots, videos, and unvalidated personal details remain intentionally absent. Their absence does not make the current release incomplete.

## Verified baseline

### Repository and automated checks

- [x] Astro static output, strict TypeScript, Tailwind CSS, and typed MDX collections.
- [x] French and English route parity.
- [x] Project frontmatter and narrative parity checks.
- [x] Media provenance, dimensions, hashes, and byte budgets.
- [x] Resume source and PDF freshness checks.
- [x] Static validation for metadata, CSP, links, accessibility landmarks, responsive behavior, and build budgets.
- [x] Browser tests in Chromium, Firefox, WebKit, and mobile emulations.
- [x] Lighthouse thresholds met on the representative release pages.
- [x] Clean-source installation and build verified with `npm ci` and `npm run verify`.
- [x] GitHub Actions validation configured for pushes and pull requests.
- [x] Preview and production workflows isolated behind explicit deployment gates.

### Production

- [x] GitHub deployment environments, secrets, and deployment switches configured.
- [x] Production built with `SITE_URL=https://ethanbrosselard.com` and `SITE_NOINDEX=false`.
- [x] Cloudflare Workers Static Assets deployment completed.
- [x] Canonical apex domain connected with TLS.
- [x] HTTP redirects permanently to HTTPS.
- [x] `www` redirects permanently to the canonical apex while preserving the path and query string.
- [x] Production smoke test covers all 18 bilingual routes, the real 404 response, headers, cache policies, metadata, sitemap, robots directives, and sharing images.
- [x] Production responses set no tracking or analytics cookies.
- [x] Google Search Console domain property verified and sitemap submitted.

### Human verification

Ethan confirmed on September 8, 2026 that the human verification work was completed. Detailed QA working records remain local and are intentionally excluded from the remote repository.

- [x] Review every public page in French and English.
- [x] Navigate the complete site with a keyboard.
- [x] Verify focus order, focus visibility, and the skip link in light and dark themes.
- [x] Check headings, landmarks, lists, links, buttons, and accessible control names.
- [x] Confirm that color is not the only way information is conveyed.
- [x] Check touch targets and layout at 320 px.
- [x] Check browser zoom and reflow at 200% and 400%.
- [x] Check reduced-motion behavior.
- [x] Review image alternatives and the absence of untranscribed informative video.
- [x] Perform a screen-reader pass on the home, project, contact, and resume pages.
- [x] Check French and English document language and pronunciation behavior.
- [x] Check light, dark, and system themes on representative screen sizes.
- [x] Review the HTML and PDF resumes, including reading order, page breaks, margins, links, and grayscale readability.

## Remaining work

### P0 — close the current release state

- [ ] Integrate the validated work currently present on `develop` but not on `main`, including:
  - `62be2a0 docs(seo): document indexing runbook`;
  - `a6dd427 content(legal): align notices with production`;
  - the English documentation and roadmap update recorded after those commits.
- [ ] Confirm the production deployment created from the resulting `main` SHA.
- [ ] Archive a concise release record containing the version, timestamp, Git SHA, CI run, production deployment identifier, smoke-test result, and rollback target.
- [ ] Create the `v0.1.0` tag after the final production SHA and release record are confirmed.
- [ ] Retire the transitional `develop` workflow and use short-lived branches opened from `main` for future work.

### P1 — post-launch observation

- [ ] Inspect the French home page, English home page, and both project teasers in Google Search Console.
- [ ] Review selected canonical URLs, structured-data reports, and indexing status after Google has had time to crawl the site.
- [ ] Verify social previews after platform caches have refreshed.
- [ ] Review field Core Web Vitals when enough real-user data exists; do not present synthetic Lighthouse results as field data.
- [ ] Monitor unexpected 404 responses without adding an unapproved browser-side tracker.
- [ ] Add the canonical portfolio domain to the public GitHub and LinkedIn profiles if desired.
- [ ] Confirm Cloudflare's actual account-level security, logging, aggregate metrics, and retention settings against the legal and privacy text.

### P1 — editorial completion

- [ ] Refine the final professional title if the current broad wording changes.
- [ ] Review the visible French and English copy after the next editorial change.
- [ ] Complete and approve a full French case study for Palimia, then produce the equivalent English version.
- [ ] Complete and approve a full French case study for Ludosaic, then produce the equivalent English version.
- [ ] Add only validated dates, roles, metrics, user feedback, deployment claims, and public links.
- [ ] Add project screenshots or videos only after privacy, licensing, metadata, responsive-format, alternative-text, and transcription checks.
- [ ] Add certifications only when they exist and are explicitly approved for publication.
- [ ] Add a portrait only if Ethan explicitly chooses to publish one.

Detailed missing editorial inputs remain listed in [`docs/content-backlog.md`](content-backlog.md) and the canonical answers remain in [`docs/site-content-questionnaire.md`](site-content-questionnaire.md).

### P2 — optional improvements

- [ ] Decide whether to keep the system font stack or adopt self-hosted fonts with verified licenses.
- [ ] Add ESLint only if a focused rule set catches issues not already covered by Astro, TypeScript, Prettier, and the existing validators.
- [ ] Improve project media presentation only when real approved media is available.
- [ ] Consider a contact form or privacy-preserving analytics only through a separate, explicitly approved change that updates the technical and legal documentation.

## Release workflow

```text
short-lived branch from main
  → pull request
  → secret-free CI validation
  → private noindex preview when required
  → human approval
  → merge to main
  → gated production deployment
  → production smoke test
  → release record
```

Rules:

- `main` must represent production.
- Do not deploy directly from a feature branch.
- Keep Cloudflare and Access credentials in protected GitHub environments.
- A preview must use `SITE_NOINDEX=true` and Cloudflare Access.
- Production must use `SITE_URL=https://ethanbrosselard.com` and `SITE_NOINDEX=false`.
- Stage and commit French and English changes together.
- Do not publish incomplete, private, guessed, or unapproved information.
- Do not change DNS, deploy, merge, tag, or publish externally without Ethan's explicit authorization.

## Validation commands

For a clean worktree:

```sh
nvm use
npm ci
npm run format
npm run verify
npm run test:e2e
npm run test:lighthouse
npm run check:links
```

For production verification:

```sh
npm run test:deployment -- \
  --url https://ethanbrosselard.com \
  --mode production \
  --check-http-redirect \
  --redirect-from https://www.ethanbrosselard.com
```

## Maintenance cadence

### For every change

- [ ] Update French and English facts together.
- [ ] Check all affected links, metadata, routes, and media.
- [ ] Run the required formatting and verification commands.
- [ ] Use a preview before production when the risk or visible scope warrants it.

### Monthly

- [ ] Review Dependabot pull requests and GitHub security alerts.
- [ ] Review Workers deployments, certificate errors, and token expiration dates.
- [ ] Check the primary external links.

### Quarterly

- [ ] Repeat a focused manual accessibility review.
- [ ] Repeat Lighthouse and compare it with earlier synthetic evidence.
- [ ] Review all French and English pages for stale facts.
- [ ] Review project status, media, and validated results.
- [ ] Check domain renewal and account 2FA.
- [ ] Exercise a rollback when operational risk justifies it.

### Yearly

- [ ] Review positioning, biography, resume, and project selection.
- [ ] Review the legal notice and privacy policy.
- [ ] Reconfirm media and font licenses.
- [ ] Review major Astro, Node.js, Tailwind CSS, Playwright, and Wrangler upgrades in a dedicated branch.

## Definition of done for future releases

A future release is complete only when:

- the intended scope is explicit;
- the worktree is reproducible with `npm ci` and the required checks pass;
- remote CI is green on the exact production SHA;
- all visible content is factual, approved, bilingual, and reviewed;
- no placeholder, broken link, secret, or private information is published;
- project maturity is represented honestly;
- accessibility, functionality, security, and performance checks appropriate to the change are accepted;
- production metadata, redirects, headers, and routes pass the deployment smoke test;
- the deployed revision matches the announced Git SHA;
- a rollback target is known;
- the release record is archived.

## Operational references

- [`docs/deployment-runbook.md`](deployment-runbook.md)
- [`docs/seo-indexing-runbook.md`](seo-indexing-runbook.md)
- [`docs/architecture.md`](architecture.md)
- [`docs/design-system.md`](design-system.md)
