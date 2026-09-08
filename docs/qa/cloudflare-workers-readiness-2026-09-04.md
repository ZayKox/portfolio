# Cloudflare Workers Readiness Review — September 4, 2026

> Historical status: this report predates the first production deployment of September 8, 2026. Use `../production-plan.md` and `../deployment-runbook.md` for the current operational state.

## Scope

This review covers versioned static portfolio configuration,
GitHub Actions workflows, build variants, FR/EN legal texts and
smoke tests planned for Cloudflare Workers Static Assets. It does not constitute
proof of deployment: no Cloudflare account, GitHub secret, DNS,
certificate, Access policy, or public domain has not been modified.

Local branch examined: `develop`. The working shaft was clean before
task.

## Result

The local configuration is ready for a first private preview after the
external runbook operations. The deployment remains deliberately neutralized
by two separate activation variables as Cloudflare Access, the
GitHub environments and toggle window are not ready.

The pipeline threat review led to the following safeguards:

- the preview workflow must itself be launched from `main`;
- the requested reference is installed, validated and built without any secrecy;
- only `dist/` passes in an immutable GitHub artifact to the job
  deployment;
- the job partitioned in the environment `preview` reloads its tools from
  `main` and revalidates `dist/` before receiving the Cloudflare token;
- a probe without an identifier must be refused by Access before the smoke test
  authenticated;
- production refuses a validated SHA which is no longer the HEAD of `main`;
- production gate and human approval are separate, and the runbook
  prepares HTTP → HTTPS and `www` → apex before failover.

## Validations executed

| Control                                                                             | Result                                                                                                       |
| ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `npm ci --no-audit --no-fund`                                                       | 562 packages installed from lockfile                                                                         |
| `npm run format` then `npm run verify`                                              | successful                                                                                                   |
| `astro check`                                                                       | 50 files, 0 errors, 0 warnings, 0 indications                                                                |
| Indexable variants, preview `noindex` and without `SITE_URL`                        | 19 HTML documents, 18 routes and 23 internal references validated for each contract                          |
| `npm audit --audit-level=high`                                                      | 0 vulnerabilities in installed tree, Wrangler included                                                       |
| Playwright Chromium, Firefox and mobile Chromium                                    | 78 passed, 15 ignored depending on the responsibilities of each project                                      |
| Playwright WebKit and mobile WebKit in `mcr.microsoft.com/playwright:v1.62.1-noble` | 49 passed, 13 ignored depending on the responsibilities of each project                                      |
| Mobile Lighthouse                                                                   | 100 in performance, accessibility, best practices and SEO on all 4 pages; LCP 903 to 905 ms, CLS 0, TBT 0 ms |
| `npm run check:links`                                                               | 5 targets checked, no targets confirmed broken; LinkedIn refused probe with non-blocking status 999          |
| YAML analysis of the 3 workflows                                                    | successful ; 1 CI job, 2 preview jobs and 1 production job                                                   |
| Resolving GitHub Actions Tags                                                       | the four pinned SHAs correspond to the documented tags                                                       |
| Build production then `wrangler deploy --dry-run`                                   | successful with Wrangler 4.129.0, 49 static files read, no binding                                           |
| Build preview then `wrangler versions upload --dry-run --preview-alias staging`     | succeeded with Wrangler 4.129.0                                                                              |
| `wrangler telemetry status`                                                         | disabled by project configuration                                                                            |
| `git diff --check`                                                                  | successful                                                                                                   |

The first local Playwright run also revealed two assertions that
were looking for the email address as an accessible name whereas the link now bears
the label “Open mail”. They have been aligned with the interface
existing. WebKit could not start directly on the host due to lack of
system libraries; the official Playwright image of the same version allowed
to cover the remaining 62 cases without modifying the system.

## Evidence still required

Before production, it remains to execute and record:

- the creation of the Worker, the two separate Cloudflare tokens and
  protected GitHub environments;
- proof that Access blocks an anonymous request and accepts the token service on
  the actual preview URL;
- the visual review, keyboard, mobile and themes on this preview;
- the inventory then the migration of the zone without altering MX, SPF, DKIM, DMARC or
  other services;
- permanent redirects HTTP → HTTPS and `www` → apex, the certificate, the
  true 404, headers and cache on Cloudflare network;
- a first deployment, its remote smoke test and a rollback exercise.

These steps are ordered in `docs/deployment-runbook.md`. They require
explicit external actions and were not simulated by dry-runs.
