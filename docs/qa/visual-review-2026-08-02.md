# Local visual review — August 2, 2026

## Scope

- Revision inspected: `0f8c3f6`.
- Browser: Chromium headless supplied with Playwright 1.62.1.
- Server: static Astro artifact served locally by `astro preview`.
- routes: the twelve French and English public routes.

## Matrix executed

### Themes

Thirty-six full-page captures were generated at 1440 × 900 px:

- twelve routes with clear explicit preference;
- twelve routes with explicit dark preference;
- twelve routes without saved preferences and with the system in dark mode.

Each rendering had a visible main title and main region. No horizontal overflow or console error messages were detected. The contact sheets and several full-resolution captures have been proofread: the hierarchy, visual contrasts, spacing, project compositions and active states remain consistent in French and English.

### Screen formats

Thirty additional captures covered the FR/EN welcome, the project page which became Palimia and the contact in the two themes:

| Profile       | Display area   |
| ------------- | -------------- |
| Narrow mobile | 320 × 800 px   |
| Tablet        | 768 × 900 px   |
| Widescreen    | 1920 × 1080 px |

No horizontal overflow, cropped content, navigation collision, or composition break was observed. At 320 px, navigation moves to a second line, grids become single columns, and buttons, cards, technical labels, and addresses remain readable.

### Reduced movement

Ten controls covered the five representative pages in both themes with `prefers-reduced-motion: reduce`. The maximum durations calculated were `0,00001 s` for both animations and transitions. No useful content or state depends on movement.

## Result

The local review does not reveal any blocking visual defect for milestone A. It confirms the current consistency of Violet Field on the routes, themes and widths inspected.

## Limits preserved

This proof does not replace:

- a test on a physical Android phone or on an iPhone/Safari;
- the WebKit matrix, unavailable locally due to lack of system libraries;
- the actual browser zoom at 200% and 400%;
- the complete human keyboard path and screen reader pass;
- the remote acceptance test on a Workers preview protected by Access.

These elements remain open in `docs/production-plan.md`.
