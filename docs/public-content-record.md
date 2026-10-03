# Public content record

This file records approved publication decisions that are not already fully represented in the portfolio’s runtime sources. It contains no raw questionnaire answers, private drafts, editorial backlog, or internal roadmap.

## Current public scope

- Ethan Brosselard also uses the ZayKo signature.
- The provisional positioning remains broad: software developer and digital maker. It must not be narrowed to one platform, stack, project, or AI.
- French is the default language at `/`; equivalent English content lives under `/en/`.
- The public portfolio includes bilingual HTML and PDF resumes generated from one structured source.
- On September 28, 2026, Ethan approved a general junior software developer resume for remote permanent or fixed-term employment (CDI/CDD), with offer-specific keyword tailoring deferred. This application title does not replace the portfolio’s broader positioning.
- The bilingual resume records apprenticeship experience since 2022 and an AI-engineering master's degree completed in 2026. Remote work is a search preference, not a claim about past working arrangements, immediate availability, or eligibility to work in any country.
- Ethan confirmed that the Studio Beyowi apprenticeship ends in September 2026. The resume retains the employer as a work-history fact; introductory copy no longer describes him as currently working there.
- Palimia and Ludosaic are independently developed projects with paired French and English case studies approved on September 9, 2026.
- Project dates, user metrics, public repositories, public demos, and project screenshots remain absent where they have not been explicitly approved or do not exist.
- Palimia is not presented as being in production. Ludosaic is presented as under active development without an external production deployment.
- On September 29, 2026, Ethan approved making his job search visible on the portfolio while retaining broad software-developer positioning. The two apprenticeships in the structured resume support the homepage statement of more than three years of professional experience.
- On September 30, 2026, Ethan requested portfolio improvements for job applications while keeping the resume general and tailoring it separately to individual offers. The homepage and contact page surface the existing resume employment objective; professional experience and education continue to come from the structured resume.
- Ethan confirmed that Palimia's launch is blocked pending clarification of permissions for some provider data. Ludosaic's complete MVP remains unfinished, and it has not been deployed externally. Neither project has a public demo, public repository or published user metrics. Screenshots were originally omitted until the October 2 approval below.
- On October 2, 2026, Ethan approved the proposed bilingual updates: Palimia's explainable recommendations, personal data export and account deletion; Ludosaic's pending-result synchronization, duplicate prevention and private-room recovery. Their existing launch limitations remain in force.
- On October 2, 2026, Ethan approved a bilingual technical overview of ZaykoHub, his personal homelab in preparation: versioned inventories, Docker Compose configurations, Ansible playbooks, Python validation, and preparation of monitoring, backups and restoration. The project remains a `teaser`, with local preparation and testing only and no deployed services. Private topology, infrastructure addresses and repository links remain excluded.
- In the same request, Ethan explicitly authorized taking and including application screenshots with demonstration data. This supersedes the earlier decision to omit screenshots; each retained capture must record its source version, rights, demonstration-data review and localized alternatives in `docs/media-provenance.json`.
- On October 3, 2026, Ethan requested new Palimia captures in dark mode with a fuller demonstration database. The retained frames show six entries from a 12-work private library and six of nine calculated recommendations. The works and all personal tracking data remain fictional; no provider artwork or real account data is included.
- The production portfolio is a static site with no form, browser-side analytics, tracking cookies, user account, database, or embedded third-party content.
- The canonical public origin is `https://ethanbrosselard.com`; `www` redirects to the apex domain.

## Publication rules

- Only facts already present in a canonical tracked source or explicitly approved by Ethan as public may be published.
- Private notes, drafts, unanswered questions, and unconfirmed claims stay outside the tracked repository.
- New shared facts belong in `src/data/profile.ts` or `src/data/resume.json`; localized interface copy belongs in `src/i18n/copy.ts`; project facts and review evidence belong in paired project entries.
- French and English facts, links, publication states, and route equivalents must remain aligned.
- Missing optional information stays hidden rather than being replaced with a placeholder or an inference.

## Canonical tracked sources

- `src/data/profile.ts` for public identity, links, location, and resume URLs.
- `src/data/resume.json` for approved resume facts and localized descriptions.
- `src/i18n/copy.ts` for short public copy and translations.
- `src/content/projects/fr/` and `src/content/projects/en/` for project publication status, review evidence, metadata, and narratives.
- `docs/architecture.md` for the technical and content model.
- `docs/deployment-runbook.md` for deployment and rollback procedures.
