# Violet Field visual system — editorial edition

This document describes the system actually rendered by the portfolio. The executable source remains `src/styles/global.css`: any evolution of a value must modify the CSS and this reference in the same change.

## Principles

- Black, white and grays structure the identity, surfaces and main actions.
- Purple is a secondary color: it signals focus, editorial cues, statuses and some branding details without dominating the pages.
- Green and yellow are not used as accents.
- Hierarchy is based first on typography, spacing, contrasts, borders and surfaces.
- Light, dark and system themes keep the same structure and semantic roles.
- The effects remain simple, non-essential and compatible with the reduction of animations.
- Controls maintain visible focus and a touch target of approximately 44 px.

## Colors

| Token                 | Light                       | Dark                         | Role                                  |
| --------------------- | --------------------------- | ---------------------------- | ------------------------------------- |
| `--bg`                | `#faf9f7`                   | `#141418`                    | Neutral main background               |
| `--surface`           | `#ffffff`                   | `#1d1d23`                    | Cards and controls                    |
| `--surface-subtle`    | `#f0efed`                   | `#25252d`                    | Secondary surface                     |
| `--surface-strong`    | `#e4e2e8`                   | `#32323c`                    | Elevated surfaces and graphic shadows |
| `--text`              | `#202024`                   | `#f0eff4`                    | Main text                             |
| `--text-muted`        | `#606069`                   | `#aaa9b5`                    | Secondary text                        |
| `--border`            | `#d9d8de`                   | `#3e3d48`                    | Useful separators and outlines        |
| `--primary`           | `#242329`                   | `#f0eff4`                    | Actions and main surfaces reversed    |
| `--primary-hover`     | `#3f4146`                   | `#b8b7b1`                    | Primary-action hover                  |
| `--primary-contrast`  | `#ffffff`                   | `#1d1d23`                    | Content on main surface               |
| `--accent`            | `#6241cc`                   | `#9e88ed`                    | Secondary purple signal and focus     |
| `--accent-hover`      | `#4d31aa`                   | `#ae9af5`                    | Secondary-element hover               |
| `--accent-soft`       | `#eee9fb`                   | `#302944`                    | Discreet purple background            |
| `--accent-contrast`   | `#ffffff`                   | `#18151f`                    | Text on purple background             |
| `--accent-on-primary` | `#b39eff`                   | `#593abd`                    | Purple accent on main surface         |
| `--info`              | `#2563eb`                   | `#60a5fa`                    | Information                           |
| `--danger`            | `#d43f5e`                   | `#ff7a8a`                    | Error or danger                       |
| `--selection`         | `#c9bfee`                   | `#4d4173`                    | Text selection                        |
| `--shadow`            | `rgba(41, 42, 46, 0.13)`    | `rgba(0, 0, 0, 0.3)`         | Shadows                               |
| `--grid-line`         | `rgba(41, 42, 46, 0.07)`    | `rgba(216, 215, 209, 0.055)` | Decorative grid                       |
| `--header-bg`         | `rgba(250, 249, 247, 0.94)` | `rgba(20, 20, 24, 0.94)`     | Translucent header background         |

The system theme reuses dark values exactly when `prefers-color-scheme: dark` is active and no choices have been saved. The main text/background and purple/contrasting text pairs are checked at build with a threshold of `4.5:1`. Axe and browser tests complete this control over rendered components.

Large compositions are no longer inverted to light in the dark theme: the hero's identity and navigation panel as well as the contact strip remain on anthracite surfaces. The hero board combines the public signature with links to the selected projects so that this surface is informative and interactive, rather than just decorative. Highly inverted contrasts are reserved for small controls and accents to limit luminance peaks.

## Typography

Fonts remain local to the system, without third-party requests:

- `--font-display`: Avenir Next or Segoe UI if present, then Helvetica or Arial;
- `--font-body`: Inter if present, then a system interface stack;
- `--font-mono`: JetBrains Mono if present, then a monospace system stack.

Smooth scaling is defined by `--display`, `--h1`, `--h2`, `--h3` and `--body-large`. Headings use restrained letter spacing, tight line height, and balanced wrapping, with the same level `--h1` for the welcome and page titles, then distinct levels for sections and cards. The body remains at `1rem` with a line height of `1.65`; `--text-small` and `--text-meta` standardize secondary texts and editorial marks.

## Geometry and layout

| Token                     | Value                         | Usage                                               |
| ------------------------- | ----------------------------- | --------------------------------------------------- |
| `--radius-control`        | `0.6rem`                      | Buttons and small controls                          |
| `--radius-card`           | `1.25rem`                     | Cards and large panels                              |
| `--container`             | `76rem`                       | Maximum content width                               |
| `--gutter`                | `clamp(1.25rem, 4vw, 3rem)`   | Responsive page gutter                              |
| `--space-1`               | `0.6rem`                      | Micro gap                                           |
| `--space-2`               | `0.75rem`                     | Compact gap                                         |
| `--space-3`               | `1rem`                        | Standard gap                                        |
| `--space-4`               | `clamp(1.25rem, 2vw, 1.5rem)` | Internal card spacing                               |
| `--space-5`               | `clamp(1.75rem, 3vw, 2.5rem)` | Gap between content groups                          |
| `--space-6`               | `clamp(1.75rem, 3.5vw, 3rem)` | Major vertical rhythm                               |
| `--section-space`         | `clamp(3.5rem, 7vw, 6.5rem)`  | Shared vertical rhythm of sections                  |
| `--section-heading-space` | `var(--space-5)`              | Gap between introduction and content of a section   |
| `--page-hero-top-space`   | `clamp(2.5rem, 5vw, 4.5rem)`  | Distance between the header and the start of a page |

The composition uses an off-white background, white surfaces and discreet light dividers; the dark transposes this hierarchy on three anthracite levels. Shadows are diffuse, corners softened, and purple accents limited to cues, controls, and depth of visuals.

Container is limited to 76rem. The desktop header measures at least 4.75rem; the controls keep their targets of 2.75rem and the theme selector is circular. On mobile, the navigation remains visible on a second line, with no menu to open. The footer separates navigation links from secondary information with a rule and a second row.

The welcome presents the introduction and the signature panel, then the projects, the method, the background and contact. The panel retains its navigation function, with two links separated by rules, and pairs the signature with the validated location. On desktop it stretches to match the introduction. A localized word in the home title receives the secondary violet accent without changing the sentence or heading scale. On tablet it becomes horizontal; on mobile it returns to one column. The title remains at the same scale as the other pages: `--h1` is `clamp(2.75rem, 5.4vw, 5.25rem)`, with a line height of 1.04. Section titles use `clamp(2.1rem, 3.6vw, 3.5rem)`.

Project cards form two columns above 48rem and one column below. A sub-grid aligns their visuals and the beginning of the texts despite compositions of different heights. Each card retains its DOM order: visual, title, status, summary, technologies, link. The actions line up at the bottom of the cards. Visuals use rounded upper corners and a straight join with their text panel. Hover adds a restrained border and shadow without moving the visual away from its card; keyboard focus highlights the border and the action retains its visible outline. The existing CSS compositions of Palimia and Ludosaic remain evocations, hidden from assistive technologies; no actual captures or new features are claimed. The visuals adapt their height to the content so as not to crop any wording.

The sections use a rhythm of 3.5rem to 6.5rem. The home hero has no bottom padding; the projects section supplies one full section gap and a thin heading rule to clearly separate the introduction from the work. The heading rule is limited to the projects section; the method section uses its existing full-width boundary without a second inner divider or extra heading padding. The contact band uses the full section spacing to give the final invitation more room. The interior pages share the `PageHero.astro` component, the same top gap, and the same heading alignments; project overviews also follow this grid. Projects and About use `--space-5` on both sides of the introduction/content boundary, bringing the main content forward without changing heading sizes or top alignment. Their lead paragraphs align vertically with the titles; About keeps a single boundary line. The story maintains a centered reading column. CV printing styles remain dedicated to paper and PDFs are regenerated after any source change.

French and English home heroes also use `--h1` and a fixed top alignment. At 480px and below, hero markers reserve two lines, including when their text is short, to keep titles at the same height when the home label collapses. The alignment test covers the eighteen routes, including both home pages.

## Movement and interaction

| Token               | Value                            | Usage                |
| ------------------- | -------------------------------- | -------------------- |
| `--duration-fast`   | `140ms`                          | Control response     |
| `--duration-base`   | `220ms`                          | Component transition |
| `--duration-reveal` | `450ms`                          | Non-essential reveal |
| `--ease-out`        | `cubic-bezier(0.2, 0.8, 0.2, 1)` | Common curve         |

Theme change neutralizes transitions during one frame to avoid insufficient intermediate contrast. With `prefers-reduced-motion: reduce`, animations and transitions become almost instantaneous. No content or action depends on movement, hover, or color alone.

Keyboard focus uses secondary purple with an outline of `0.19rem` and an offset of `0.22rem`. Primary interactive elements aim for at least `2.75rem` or `3rem` in height. The theme tracks system preference changes until a valid choice has been saved; unavailable storage does not block control. The theme and copy buttons remain hidden without JavaScript. The address copy announces its success or refusal in an accessible status region.

## Brand and media

The public signature is `ZayKo` when it provides a useful reference. No abbreviated monogram is used. The favicon is based on a geometric sign without letters; the Apple touch icon and social cards are generated deterministically from the same tokens. They use a neutral dark base and reserve purple for signal and depth details.

Future project media must be approved, cleaned of any private data, explicitly sized and optimized before integration. Images never replace essential textual information.

## Evolution rules

1. Reuse an existing token before adding a local value.
2. Give any new token a role, not the name of a page or component.
3. Add together its light, dark and system variants when it depends on the theme.
4. Keep the main actions monochrome and reserve purple for secondary signals.
5. Check contrast, focus, reduced motion, 320 px and both languages for any visible components.
6. Update this document and build validation when a required token changes.
