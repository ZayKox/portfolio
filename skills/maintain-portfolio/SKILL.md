---
name: maintain-portfolio
description: Maintain Ethan Brosselard's bilingual Astro portfolio while preserving its content model, visual language, accessibility, performance, and factual accuracy. Use when adding or updating portfolio pages, project case studies, translations, navigation, design tokens, SEO metadata, CV content, links, or media.
---

# Maintain Portfolio

Preserve a broad, evolving identity: Ethan is a software developer and digital maker, not a specialist limited to the first two projects.

## Start every change

1. Read `AGENTS.md`, `docs/architecture.md`, `src/data/profile.ts`, `src/i18n/copy.ts`, and `src/content.config.ts` as relevant.
2. Inspect the current worktree and preserve unrelated user changes.
3. Determine every affected French and English route before editing.
4. Use only facts present in the repository or explicitly supplied by Ethan.

## Maintain content

- Keep shared identity facts in `src/data/profile.ts`.
- Keep interface translations in `src/i18n/copy.ts`.
- Keep long project narratives in paired `src/content/projects/fr` and `src/content/projects/en` entries.
- Preserve matching slugs, facts, links, metrics, and publication states across locales.
- Translate meaning naturally; do not copy untranslated text into the other locale.
- Omit absent fields. Never render `TBD`, fake testimonials, guessed roles, fabricated impact, or unverified production metrics.
- Label local validation numbers as technical evidence, never as user impact.
- Keep the CV link hidden until both the HTML page and downloadable file exist.

## Maintain design

- Use the Violet Field tokens in `src/styles/global.css`.
- Keep violet as the main accent and avoid green or yellow semantic colors.
- Prefer typography, whitespace, borders, gradients, and CSS composition over decorative images.
- Use no model-authored SVG illustration, custom cursor, autoplay media, or essential hover-only interaction.
- Preserve both light and dark themes, visible focus, 44px touch targets, and reduced-motion behavior.

## Add a project

1. Add one FR and one EN MDX entry with the typed schema.
2. Start as `teaser` unless a complete reviewed case study exists.
3. Add curated media under `src/assets/projects/<slug>/`; never reference sibling repositories at build time.
4. Add explicit route equivalents for the language switcher.
5. Check project cards, metadata, mobile layout, and both theme variants.

## Validate

Run `npm run format`, then `npm run verify`. Fix failures before finishing. Check both language routes manually when the change affects visible content.
