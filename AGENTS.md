# Portfolio contributor instructions

These instructions apply to the entire repository.

## Mission

Maintain Ethan Brosselard’s bilingual portfolio as a fast, static, accessible, factual, and easy-to-evolve website. Until Ethan validates a final title, preserve a broad provisional positioning and do not reduce his identity to web, Android, the two initial projects, or AI.

## Required workflow

Before changing project files:

1. Read `skills/maintain-portfolio/SKILL.md` completely.
2. Record the current branch and `git status --short`, then preserve all pre-existing changes.
3. Read the relevant parts of:
   - `docs/architecture.md` for technical structure;
   - `docs/site-content-questionnaire.md` for Ethan’s approved inputs;
   - `docs/content-backlog.md` for remaining editorial work;
   - `docs/production-plan.md` for release requirements;
   - `src/data/profile.ts`, `src/i18n/copy.ts`, and `src/content.config.ts` for runtime content rules.
4. Identify every affected French and English route before editing.
5. Implement the smallest coherent change that satisfies the request.
6. Run the required validation.
7. Create a local commit according to the Git policy below unless Ethan explicitly asks not to commit.

## Sources of truth

| Information                                      | Canonical location                                                           |
| ------------------------------------------------ | ---------------------------------------------------------------------------- |
| Raw answers and publication decisions from Ethan | `docs/site-content-questionnaire.md`                                         |
| Shared public identity, links, portrait, CV link | `src/data/profile.ts`                                                        |
| Interface copy and short page content            | `src/i18n/copy.ts`                                                           |
| Project card metadata and long case studies      | paired files under `src/content/projects/fr/` and `src/content/projects/en/` |
| Content schema                                   | `src/content.config.ts`                                                      |
| Design tokens and global behavior                | `src/styles/global.css`                                                      |
| Architecture decisions                           | `docs/architecture.md`                                                       |
| Production readiness                             | `docs/production-plan.md`                                                    |

The questionnaire is an input document, not runtime content. Convert only approved answers into the appropriate runtime source. Do not make pages read from `docs/` at build time.

`docs/content-backlog.md` is a derived convenience summary, not a source of truth. When it disagrees with the questionnaire, use the questionnaire and update the backlog in the same task.

## Factual and privacy rules

- Use only facts already present in the repository or explicitly supplied by Ethan.
- Treat questionnaire entries marked `À REMPLIR`, `À CONFIRMER`, `BROUILLON`, or `PRIVÉ` as unavailable for publication.
- Publish an answer only when its status is `PUBLIC — VALIDÉ` or Ethan explicitly validates it in the current task.
- When Ethan validates new public, non-sensitive information in a task, record that validation in the questionnaire during the same task so the canonical input remains current.
- Never invent biography, role, dates, experience, education, certification, client, employer, impact, user count, performance, testimonial, production status, public URL, or availability.
- Label local tests and repository measurements as technical evidence, never as user impact or production results.
- Do not expose secrets, private addresses, phone numbers, private repositories, credentials, internal URLs, real phone-call data, or third-party personal data.
- Do not commit sensitive answers to the questionnaire. Record only `PRIVÉ — transmis séparément` when private information is required.
- Hide incomplete optional sections. Never render `TBD`, `TODO`, “coming soon,” guessed copy, empty cards, fake testimonials, or decorative metrics.
- Keep the public email out of structured data unless Ethan explicitly accepts the additional scraping exposure.

## Content and bilingual rules

- French is the default language at `/`; English lives under `/en/`.
- Write and fact-check the French source first, then produce natural English with the same meaning.
- Preserve matching slugs, facts, links, metrics, publication states, and equivalent language-switch routes.
- Update both languages in the same task. A missing translation blocks publication of the affected content.
- Keep shared facts in `src/data/profile.ts`; do not duplicate them across components.
- Keep UI translations in `src/i18n/copy.ts`.
- Keep long project narratives in paired MDX entries.
- Keep a project as `teaser` until the case study, factual review, applicable media, and applicable proof are ready. A repository, demo, metric, or download may remain absent when that absence is explicitly documented and validated.
- Keep the CV navigation and download links hidden until HTML and PDF exist in both languages from one structured source.
- Prefer precise, plain language. Avoid exaggerated expertise claims, generic marketing language, skill percentages, and long technology inventories without evidence.

## Architecture rules

- Preserve Astro static output. Do not add SSR, an API, database, authentication, CMS, form backend, or runtime service without an explicit requirement.
- Keep the build independent from `/home/ethan/Development/MyVerse`, `/home/ethan/Development/filtre-appels-android`, or any other sibling repository.
- Curate approved text and media into this repository.
- Use TypeScript strictness and typed content collections.
- Add client JavaScript only for useful progressive enhancement.
- Avoid adding dependencies when the platform or a small local implementation is sufficient.
- Do not commit generated directories such as `dist/`, `.astro/`, or `node_modules/`.

## Design and accessibility rules

- Preserve the “Violet Field” visual language in `src/styles/global.css`.
- Keep violet as the primary accent; avoid green and yellow accents.
- Support light, dark, and system themes.
- Prefer typography, spacing, borders, restrained gradients, and CSS composition over decorative imagery.
- Do not add model-authored SVG illustrations, custom cursors, autoplay media, or essential hover-only interactions.
- Preserve semantic HTML, visible focus, keyboard access, reduced motion, useful alternative text, and touch targets around 44 px.
- Check mobile from 320 px, zoom/reflow, light/dark contrast, and absence of horizontal overflow.
- Use only optimized, licensed, privacy-safe media with explicit dimensions.

## Adding or publishing a project

1. Complete the project section in `docs/site-content-questionnaire.md`.
2. Add or update one FR and one EN MDX entry with the typed schema.
3. Use `draft` for non-public work, `teaser` for a factual preview, and `published` only for a reviewed case study.
4. Copy approved media under `src/assets/projects/<slug>/`.
5. Add explicit route equivalents for the language switcher.
6. Verify cards, metadata, media, links, mobile layout, both themes, and both languages.

## Validation

When the initial worktree is clean, run:

```sh
npm run format
npm run verify
```

When the initial worktree contains pre-existing user changes, do not run the repository-wide write formatter. Format only explicit task-owned files, then run the read-only repository checks:

```sh
npx prettier --write <task-owned-paths>
npm run verify
```

If `npm run verify` fails only because of an unrelated pre-existing file, do not modify or commit that file. Report the blocker and leave the task uncommitted.

Also perform targeted checks when relevant:

- inspect both FR and EN routes for visible content changes;
- test keyboard, theme, reduced motion, and mobile layout for UI changes;
- validate links, metadata, sitemap, JSON-LD, headers, and 404 behavior for SEO or deployment changes;
- run E2E, accessibility, and link checks once their scripts exist.

Fix in-scope failures before finishing. If validation cannot pass, do not create the automatic commit; report the exact blocker.

## Git and automatic local commits

`AGENTS.md` instructs coding agents; it is not a background process or file watcher. It cannot automatically commit manual edits made outside an agent task.

When an agent completes a requested task that changes code, content, tests, configuration, or documentation:

1. Inspect the initial and final worktree state.
2. Run the validation required above.
3. Confirm that the current branch is not `main`.
4. Confirm the index did not already contain staged changes before the task.
5. Inspect `git diff`, `git diff --check`, and `git status --short`.
6. Stage only files created or modified for the current task, using explicit paths.
7. Inspect `git diff --cached` before committing.
8. Create one local, focused commit after successful validation.
9. Report the commit hash, subject, tests run, and any unrelated changes left untouched.

Commit rules:

- Use Conventional Commits in English: `type(optional-scope): imperative summary`.
- Choose among `feat`, `fix`, `refactor`, `style`, `content`, `docs`, `test`, `ci`, and `chore`.
- Keep the subject concise and describe the delivered outcome.
- Prefer one commit per user request. Split only when changes are independently useful and reversible.
- Never create an automatic commit directly on `main`. Leave the changes uncommitted and report the branch blocker unless Ethan explicitly requested that exact commit on `main`.
- Never include pre-existing or unrelated user changes.
- If the index already contained staged changes before the task, do not create an automatic commit unless Ethan explicitly asks to include those exact staged changes.
- If a task overlaps an existing user change and cannot be staged safely, do not commit; explain why.
- Never stage a questionnaire answer or other manual edit that existed before the task unless Ethan explicitly asks to include it.
- Always stage explicit paths with `git add -- <path>...`; never use `git add .`, `git add -A`, or a broad glob.
- Never use `git commit -a`.
- Never commit secrets, `.env` files, build output, dependency folders, screenshots containing private data, or private questionnaire answers.
- Never bypass failing hooks or checks with `--no-verify`.
- Never amend, rebase, reset, force-push, tag, delete branches, or rewrite history unless Ethan explicitly asks.
- Never push, open a pull request, merge, deploy, modify DNS, or publish externally unless Ethan explicitly asks.
- Do not create a commit for read-only analysis, an unanswered clarification, or a task with no file change.
- If Ethan says “ne commit pas,” leave the task changes uncommitted.

Examples:

```text
feat(projects): publish MyVerse case study
content(about): add validated career history
fix(i18n): align English project metadata
docs: add portfolio content questionnaire
ci: add accessibility checks
```

## Definition of done

A task is complete only when:

- the requested behavior or content is implemented;
- no unrelated worktree change was overwritten or staged;
- facts and publication permission are verified;
- French and English remain aligned;
- incomplete content remains hidden;
- relevant accessibility, privacy, responsive, and theme checks pass;
- `npm run format` and `npm run verify` pass;
- a focused local commit exists, unless an allowed exception above applies;
- the handoff states exactly what changed and what remains.
