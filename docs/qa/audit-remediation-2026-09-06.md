# Audit remediation — September 6, 2026

> Historical status: the infrastructure and human-review conditions listed as open in this dated report were subsequently completed or explicitly confirmed on September 8, 2026. See `human-verification-2026-09-08.md` and the current `../production-plan.md` roadmap.

Continued from report `production-audit-2026-09-05.md`. Initial state: branch `develop`, commit `2cec73cd671dd435d236145aeedc1882c128c3fc`, clean index and tree. The change to the name of the Worker already committed is retained.

## Corrections delivered

- FR/EN removal of interests, IT origin story and Letterboxd inspiration without canonical validation. Routes: `/`, `/en/`, `/a-propos/`, `/en/about/`.
- CV limited to validated information: removal of Intento details, course sites and descriptions, Svelte/Docker/Git/PL-SQL attributions to Beyowi and unvalidated developments of the Sealed Air mission. The positions, companies, establishments and periods remain present. Absent fields do not emit an empty paragraph or list. Routes: `/cv/`, `/en/resume/` and their two PDFs.
- PDF generation preceded by a domain-independent build. Versioned manifest of the fingerprints of the sources and the two outputs; `check:resume` blocks outdated or modified artifacts in `verify`, therefore also in CI. Negative tests cover edit, add, remove source, edited PDF, and missing PDF. Verification does not require a browser; regeneration requires Chromium.
- Ax blocks all violations, including minor/moderate, on all eighteen routes and the 404, light/dark in all five browser profiles.
- Conservation of browser and Lighthouse reports in CI also upon success, for seven days, to be able to attach the evidence to a release.

No new personal response is considered validated. The questionnaire remains unchanged; Removed details can be reintroduced after explicit validation.

## Local checks

- `npm run format` and `npm run verify`: passed, including PDF freshness and negative tests; Nineteen documents and eighteen routes validated in the three build modes.
- Isolated copy of versioned files and new files from this task, without `node_modules`, `.astro`, `dist` or dependency on a neighboring repository: `npm ci` then `npm run verify` succeeded. Installation: zero vulnerabilities reported.
- Chromium, Firefox and mobile Chromium: 117 passed, 15 not applicable ignored.
- WebKit desktop/mobile in official Playwright pinned image from initial report: 75 passed, 13 not applicable ignored. Total: **192 passes, zero failures**.
- Lighthouse: 100/100 in all four categories on all six routes; LCP 902–903 ms, maximum CLS 0.001, TBT zero.
- PDF: two pages per language, `/Lang` FR/EN, markup present, removal of passages controlled by textual extraction; all four pages have been returned and reviewed, with no content cut.

These results are local, synthetic evidence, not WCAG/PDF-UA certification or production measurements.

## Infrastructure: current findings and remaining work

The authentic domain is `ethanbrosselard.com` (§25 of the questionnaire). Probes from this pass show an HTTPS apex responding 200, with no expected canonical, and `www.ethanbrosselard.com` not resolving. `test:deployment` fails from `/` with `canonical does not match https://ethanbrosselard.com/`; the following assertions are therefore not deemed verified. The initial report's finding that Apex redirects to another service should not be used to decide the current failover.

The [CI of initial commit 2cec73c](https://github.com/ZayKox/portfolio/actions/runs/33977120451) is successful. The [last viewed production workflow](https://github.com/ZayKox/portfolio/actions/runs/33977408310) is ignored (`skipped`) and carries the previous SHA; This is not proof of deployment of fixes for this task. The remote CI of the future commit remains to be executed after authorized Git publication.

Wrangler indicates that the session is not authenticated. No secrets, account settings, DNS, deployment, push, or PRs were changed during this pass. Remains necessary:

1. Authenticated access to the Cloudflare account and verification of GitHub environments/protections/secrets, then private Access preview with anonymous refusal and authenticated smoke test.
2. Inventory and preservation of existing DNS, association of the correct Worker to the domain, HTTP/HTTPS and `www` redirections; after the explicit GO, complete remote acceptance test and rollback exercise according to `docs/deployment-runbook.md`.
3. Human review with screen reader, real zoom, macOS Safari and physical phones; reviewing of hosting mentions with the settings actually deployed.
4. Manual LinkedIn link verification: Automated rejection does not prove a broken link.

Local corrections do not remove these production conditions.
