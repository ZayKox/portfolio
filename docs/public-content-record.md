# Public content record

This file records approved publication decisions that are not already fully represented in the portfolio’s runtime sources. It contains no raw questionnaire answers, private drafts, editorial backlog, or internal roadmap.

## Current public scope

- Ethan Brosselard also uses the ZayKo signature.
- The provisional positioning remains broad: software developer and digital maker. It must not be narrowed to one platform, stack, project, or AI.
- French is the default language at `/`; equivalent English content lives under `/en/`.
- The public portfolio includes bilingual HTML and PDF resumes generated from one structured source.
- Palimia and Ludosaic are independently developed projects with paired French and English case studies approved on September 9, 2026.
- Project dates, user metrics, public repositories, public demos, and project screenshots remain absent where they have not been explicitly approved or do not exist.
- Palimia is not presented as being in production. Ludosaic is presented as under active development without an external production deployment.
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
