# Production Readiness Audit — September 5, 2026

> Follow-up: `audit-remediation-2026-09-06.md` logs additional fixes and new domain probes. The open points below describe the situation of this first pass.

> Historical status: production was subsequently deployed on September 8, 2026, and Ethan confirmed completion of the human verification checklist on the same date. See `human-verification-2026-09-08.md` and the current `../production-plan.md` roadmap. Statements below that describe production or human review as pending remain part of the dated audit evidence.

## Verdict

The technical defects confirmed by this review have been fixed locally. The site retains its static Astro architecture and its FR/EN parity. **The production GO remains open**: certain factual validations, the human review and evidence on the real infrastructure are still missing.

Initial state: branch `develop`, HEAD `3dddafdffa3879a40f16e86d5b76935a52f6d21d`, clean working tree and indexes. No push, deployment, DNS change or external account modification done in this task.

## Scope

- Astro/TypeScript code, components, CSS, progressive JavaScript, MDX schema and collections.
- Eighteen public routes: home, Projects, About, CV, Contact, legal, confidentiality and two overviews in each language; 404 separate bilingual.
- Light/dark rendering, system theme, keyboard, no JavaScript, clipboard, mobile and reflow; captures of the nineteen documents in the two themes, in 1440 and 320 px, additional measurements at 800 px.
- Alignment of the sixteen interior pages; Chromium also covers 1024 px and both sides of the breakpoint 768 px. The reception retains its title of greatest hero, the 404 its specific composition.
- SEO, links, CSP, dependencies, technical privacy, CI/Worker configurations, PDF and media.
- Canonical questionnaire, priority decisions of sections 21–24, backlog and production plan. The review does not constitute legal or WCAG certification.

## Defects corrected

| Priority | Verified finding                                                                                                                                                                       | Correction and proof                                                                                                                                                                                                                                                                                |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| P1       | Headings shifted by page: at 1440 px, Projects/About start at y = 147.39 px, CV at 127.39 px and Contact/legal at 119.39 px. Previews add one more row of navigation before the title. | `PageHero.astro` shared, removal of local padding overloads and margin/gap accumulation, same size `--h1` on interior pages. Return to projects placed after the summary. After correction, these titles start at x = 80 px, y = 131.39 px to 1440 px. Regression covered in `page-layout.spec.ts`. |
| P1       | The Palimia visual announces five media, while the scope validated on August 31 covers films, series and video games. The same gap exists in the welcome hero, CV and social card.     | FR/EN texts and composition limited to the three media, derived counter, social card and regenerated PDF. MDXs continue to explicitly explain deferred categories.                                                                                                                                  |
| P1       | The fixed ratio frame can crop Palimia's internal labels on mobile without causing page overflow.                                                                                      | Height determined by the content for this composition; testing the top and bottom edges of the bookcase in its frame.                                                                                                                                                                               |
| P2       | WebKit mobile adds a 3 px border to the root after navigating the tested environment, shifting all content.                                                                            | Explicit reset `html { border: 0; }`, controlled by the interpage alignment test.                                                                                                                                                                                                                   |
| P2       | The theme accepts an invalid persisted value, does not track a system change during the visit, and its initialization depends on storage access.                                       | Only `light`/`dark` values allowed, system fallback independent of storage, listening to the system preference up to the visitor choice, synchronized accessible state. FR/EN tests on storage refused and invalid preference.                                                                      |
| P2       | Display styles can override `hidden`, leaving inoperative buttons visible without JavaScript.                                                                                          | Explicitly hiding theme and copy buttons; navigation and email link remain usable.                                                                                                                                                                                                                  |
| P2       | The email copy does not have a status announcement and its opt-out is silent.                                                                                                          | Region `role="status"`, localized success and error, prevention of concurrent calls, email link preserved. Success tests, refusal then retry, and absence of JavaScript.                                                                                                                            |
| P2       | The generated PDFs do not contain any language, marked structure or navigation plan.                                                                                                   | Playwright generation with `tagged: true` and `outline: true`. Control of both PDFs: language `fr`/`en`, markup, plan, two A4 pages, extractable text and three links. This does not constitute PDF/UA certification.                                                                               |
| P2       | The link checker considers some non-2xx responses, notably 401/403, as successful.                                                                                                     | Non-2xx statuses classified as indeterminate; 404/410 remain errors. Balance sheet distinguishing verified, indeterminate and broken. Twelve network response/fallback/error scenarios monitored during review.                                                                                     |
| P2       | The backlog still requires decisions that have already been validated; the plan shows CV pages and downloads as missing.                                                               | Derivative documents updated without inventing new editorial validation.                                                                                                                                                                                                                            |
| P2       | Lighthouse does not include public CVs.                                                                                                                                                | Added FR/EN CVs to the four existing representative routes.                                                                                                                                                                                                                                         |

The “solo” mention of the two projects in the CV was also removed, due to lack of validation found. The preview status is now conditional on `publication: teaser` on cards and detail pages.

## Points remaining before publication

### P0 — Review the traceability of certain personal details

These elements predate the audit. They are not proven false, but their explicit validation has not been found in the canonical sources. The provisions of `AGENTS.md` reserve publication for validated facts; the decisions in sections 21–24 do not cover the details below. You must confirm them and record this decision in the questionnaire, or remove the relevant passages from both languages and regenerate the PDFs.

| Current source                                                       | Details to be confirmed                                                                                               | Canonical source examined                                                                             |
| -------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `src/i18n/copy.ts`, `about.paragraphs[0]` FR/EN                      | Click for IT while trying to understand how video games work.                                                         | Questionnaire §4, questions on the original route still unanswered.                                   |
| `src/i18n/copy.ts`, `about.paragraphs[3]` FR/EN                      | Palimia was born from an inspiration linked to Letterboxd.                                                            | Questionnaire §9, motivation and previous alternative not provided.                                   |
| `src/i18n/copy.ts`, `home.interests` and `about.paragraphs[3]` FR/EN | List of personal interests.                                                                                           | Questionnaire §3: `PUBLIC — REVIEW REQUIRED`, not `PUBLIC — VALIDATED`.                               |
| `src/data/resume.json`, Intento experience FR/EN                     | Main application, collaboration with the master of learning, first collective experience and C++.                     | §21 valid position, company, dates and Paris, without these details.                                  |
| `src/data/resume.json`, Studio Beyowi experience FR/EN               | Assignment of Svelte, Docker, Git and PL/SQL to this experiment.                                                      | §23 validates another detailed list; these four attributions do not appear there.                     |
| `src/data/resume.json`, studies FR/EN                                | Precise sites, detailed BUT course and baccalaureate specialties/options (NSI, mathematics, EPS, expert mathematics). | §21 validates establishments, diplomas, dates and mention; §23 specifies the name of the high school. |

Title remains provisional and broad in accordance with the filing instructions. The ZayKo signature, the public email, its exclusion from JSON-LD and the personal character of the site are already validated: they do not require a new decision for this review.

### P0 — Prove failover and hosting operation

Public probes on September 5 confirm HTTP → HTTPS (308), but HTTPS apex still redirects to another service (301) and `www` does not resolve. The portfolio is therefore not currently verified in its target domain. Details of the existing service are not reproduced here.

Follow `docs/deployment-runbook.md` for:

1. Check the final SHA CI, GitHub environments, their protections and secrets on the real accounts; no authenticated inspection of these settings has been carried out here.
2. Deploy the private preview and prove the refusal of anonymous visitors by Access, then the success of the authenticated smoke test.
3. Preserve existing records, including messaging, before any Cloudflare/DNS switch. Test HTTP → HTTPS and `www` → apex with preservation of path and request.
4. After the GO release, check the eighteen routes, true 404, TLS, cache, headers, canonical, alternates, robots, sitemap and JSON-LD on Workers with `test:deployment`.
5. Document the deployed version, CI, editorial validation and perform the rollback exercise.

Local security contracts are consistent: static generation, hashed CSP, JSON-LD escaped without email, pinned actions, separation of preview secrets, and production-SHA verification. Headers and Access rules were compared with the [Static Assets headers](https://developers.cloudflare.com/workers/static-assets/headers/) and [Cloudflare Access](https://developers.cloudflare.com/workers/configuration/cloudflare-access/) documentation. Their actual configuration still had to be tested at the time of this audit.

### P0 — Complete the human review required by the plan

Automated checks and captures are not a substitute for a screen reader, real browser zoom, and a physical phone. No testing on Safari macOS, real iPhone, or real Android is claimed. Also review the legal texts with the Cloudflare settings actually deployed; full legal compliance is not certified by this audit.

### P2 — Maintenance and documentary evidence

- PDFs have been compared to their source for modified passages, but no automatic freshness check yet links downloaded files to all sources. Any evolution of the CV always requires `npm run generate:resume-pdfs`.
- LinkedIn refuses automated check with HTTP 999: manual check required. No broken links are demonstrated by this refusal.
- CI blocks serious/critical axe violations. The additional pass of this audit also examines minor/moderate levels; it does not replace human controls.

## Validation results and limits

The final results are reported below after running checks on the corrected files. These are local and synthetic measurements, distinct from user impact or production results.

| Control                                              | Result                                                                                                                                                                                    |
| ---------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run format`, `npm run verify`                   | Passed: format, Node/npm string, FR/EN collections, media, redirects, Astro typing, indexable/preview/domainless builds. Nineteen HTML documents and eighteen reachable routes validated. |
| Playwright Chromium, Firefox, mobile Chromium        | **117 passed, 15 not applicable ignored**, 44.3 sec.                                                                                                                                      |
| Playwright WebKit desktop and mobile, official image | **75 passed, 13 not applicable ignored**, 30.9 sec.                                                                                                                                       |
| Total matrix browser                                 | **192 passed, 28 not applicable ignored, zero failures** on the last run of each profile.                                                                                                 |
| Complementary visual pass                            | 114 route/theme/width combinations measured (19 × 2 × 3), no overflow at 320, 800 or 1440 px; desktop/mobile captures reviewed on main templates.                                         |
| Complementary axe, all levels                        | No violations on 19 documents in light/dark at 1440 px, via real theme change control. E2E testing also covers both mobile profiles.                                                      |
| `npm run test:lighthouse`                            | **100/100** in all four categories on each of the six routes; LCP 903–904 ms, maximum CLS rounded 0.001, TBT 0 ms.                                                                        |
| External HTTPS links                                 | 4 replies 200, LinkedIn 999 undetermined, no broken links confirmed.                                                                                                                      |
| `npm audit --json`                                   | **0 known vulnerabilities** in the installed tree, development/deployment tooling included.                                                                                               |
| PDF FR/EN                                            | Two A4 pages each, text extracted, links present, title, language, markup and plan checked with pypdf; four pages rendered and reviewed with pypdfium2.                                   |
| Git                                                  | Diff and format controlled; only the files in this task are intended for local commit.                                                                                                    |

Host environment: Node.js 22.23.0, npm 10.9.8, Playwright 1.62.1. Native WebKit fails to start due to lack of GTK/GStreamer libraries; The tests were successfully run in the already available Playwright image, without modifying the host libraries. The first mobile WebKit alignment test then revealed the corrected 3px offset above; his last execution is green.

Browser review commands:

```sh
npm run test:e2e -- --project=chromium --project=firefox --project=mobile-chromium --workers=4

docker run --rm --init --ipc=host \
  --user 1000:1000 --env HOME=/tmp \
  --volume /home/ethan/Development/portfolio:/work --workdir /work \
  mcr.microsoft.com/playwright:v1.62.1-noble@sha256:dcc5531e97840b9b5e794f2814476b21571c5124a3fca2267d73041f56e7580e \
  npx playwright test --project=webkit --project=mobile-webkit --workers=4

npm run test:lighthouse
node scripts/check-external-links.mjs
npm audit --json
```

Lighthouse keeps its six HTML/JSON reports under `lighthouse-reports/`. Playwright reports are under `playwright-report/` and `test-results/` (the last command replaces the previous report). This review uses the existing local installation; the installation from a clean checkout and the remote CI of the final commit remain to be attached to the proof of release.

Captures and detailed reports are local, non-versioned artifacts. This report contains the findings, scope and results; the controls are reproducible from the scripts and tests in the repository.
