# Remaining content backlog

This working list is not rendered on the public site. The canonical source for Ethan's answers and publication decisions remains [`docs/site-content-questionnaire.md`](site-content-questionnaire.md).

## Current public release

- The production site, domain, canonical redirects, metadata, legal pages, resume pages, and French/English PDF files are live.
- GitHub Actions production, protected environment secrets, and deployment switches were configured and validated on September 8, 2026.
- Ethan confirmed completion of the human verification checklist on September 8, 2026. Detailed QA working records remain local and are intentionally excluded from the remote repository.
- Palimia and Ludosaic have reviewed FR/EN case studies, approved on September 9, 2026 (questionnaire section 30). Their local editorial state is `published`; deployment of this revision is still pending. Screenshots, public demos, repositories and metrics may remain absent.
- The September 6 editorial redesign, Violet Field social cards, and ZayKo signature have been reviewed for the current release.
- The validated public contact email remains in use. A dedicated address is still optional.
- The email address remains absent from JSON-LD to limit scraping.
- The site launches without browser-side analytics, tracking cookies, a form, or embedded third-party content.
- The site remains a personal publication. Any private legal information that becomes necessary must be provided separately and never committed here.

The portrait, screenshots, and videos may remain absent. The two reviewed case studies are complete for the approved scope; the additions below are optional enrichments or readiness work for the products themselves.

## Identity

- Refine the final professional title if the current broad wording changes.
- Add certifications when they exist and are approved for publication.
- Add a portrait only if Ethan explicitly chooses to publish one.

## Resume

- Studio Beyowi is ongoing, as confirmed on September 9, 2026; do not reinstate the previously planned September 2026 end date.

- Update the structured resume source, HTML pages, and both generated PDFs together whenever an experience, education entry, skill selection, or project changes.

## Palimia case study

- Obtain and review the written authorizations required for the intended supplier-data scope before Palimia itself enters production.
- Complete deployment, operations, backup and recovery, monitoring, staging, and legal-review evidence for Palimia's target environment.
- Explicitly validate every displayed date and metric.
- Document the initial motivation and personal problem.
- Solo development is validated in questionnaire section 29; dates remain intentionally omitted. Approximate time spent and additional personal context are still unconfirmed.
- Public repository and demonstration links remain absent by explicit approval (section 30).
- Add real tester feedback and outcomes, clearly separated from local technical validation.
- Explain major decisions, rejected approaches, trade-offs, and lessons learned.
- Prepare recent screenshots and an optional demonstration video using privacy-safe demo data.
- Decide which security and operational details may be published.

## Ludosaic case study

- Complete and validate MVP criteria for the three games and connected services.
- Complete an external deployment and validate backup, recovery, TLS/WSS, monitoring, and critical journeys before presenting Ludosaic as production-ready.
- Explicitly validate every displayed date and metric.
- Document the motivation and target audience. Solo development is validated in section 29; dates remain intentionally omitted.
- Public repository and demonstration links remain absent by explicit approval (section 30).
- Add real tester feedback and outcomes, clearly separated from local and connected technical validation.
- Explain decisions and trade-offs concerning deterministic rules, offline behavior, and multiplayer authority.
- Prepare screenshots of Reflex Rush, Merge Forge, and Grid Duel using demonstration profiles and scores.
- Decide which repository and operational details may be published.

## Media requirements

For any future screenshot, diagram, or video:

- use demonstration data only;
- remove real email addresses, phone numbers, keys, identifiers, and private notifications;
- verify rights for visible logos, posters, covers, and third-party material;
- remove unnecessary metadata;
- provide optimized responsive formats with explicit dimensions;
- add localized alternative text;
- add a transcript when a video conveys information;
- keep autoplay disabled;
- verify clarity, file size, and layout stability.

## Post-launch follow-up

- Inspect the French home page, English home page, and both project teasers in Google Search Console.
- Review indexing, selected canonical URLs, structured-data reports, and social previews after crawler and platform caches update.
- Review field Core Web Vitals when enough data exists.
- Confirm Cloudflare's actual account-level logging, aggregate metrics, security, and retention settings against the legal and privacy text.
- Keep browser-side analytics disabled unless a separate approved change documents its technical and legal impact.

## Material intentionally removed after the September 5 audit

Interests, the personal origin story in computing, and the Letterboxd inspiration remain absent until explicitly validated. The resumes retain approved positions, dates, institutions, and skills. Unvalidated Intento details, course descriptions, and selected Beyowi technologies were removed from both languages. Reintroducing any of them requires updating the questionnaire, the French and English runtime sources, and the generated PDFs in the same change.
