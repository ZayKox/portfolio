# Frontend redesign — September 6, 2026

## Scope

Redesign authorized by Ethan to present the portfolio to companies, with preservation of the content. Initial state: clean branch `develop`, worktree and indexes.

- Light off-white/white palette, dark anthracite and enhanced contrasts; preserved secondary violet.
- Reworked typography, reading width, navigation, buttons, surfaces and footer.
- Projects placed after the introduction of the welcome; cards in two columns with aligned visuals and actions, then one column on mobile.
- CSS Palimia and Ludosaic compositions refined without third-party images or new product claims.
- Runtime editorial sources, stories, facts, links, status and metadata unchanged. No JavaScript or dependencies added.
- Eighteen FR/EN routes and 404 affected by shared styles. Regenerated PDF and five brand images; updated fingerprints.

## Local validation

| Control                                       | Result                                                                           |
| --------------------------------------------- | -------------------------------------------------------------------------------- |
| `npm run format` and `npm run verify`         | Success, including types, parity, media, PDF freshness and three build modes     |
| Playwright Chromium, Firefox, mobile Chromium | 120 passed, 15 ignored according to profile                                      |
| Playwright WebKit and mobile WebKit           | 77 passed, 13 ignored according to profile                                       |
| Mobile lighthouse, six representative routes  | 100/100 in performance, accessibility, best practices and SEO                    |
| Lighthouse Budgets                            | LCP 902–903 ms, maximum CLS 0.001, TBT 0 ms                                      |
| External links                                | 4 verified, 0 broken, LinkedIn inconclusive (HTTP 999)                           |
| PDF FR/EN                                     | Two pages per language, four pages review visually without any trimming observed |

First native run could not launch WebKit due to lack of system libraries. The review then succeeded in the already available image `mcr.microsoft.com/playwright:v1.62.1-noble`, with the local user and the repository mounted in `/work`. No system libraries have been installed.

Tests cover JavaScript and CSP errors, axe accessibility checks, light, dark, and system themes, unavailable storage, keyboard and focus behavior, address copying, no-JavaScript mode, reduced motion, touch targets, and reflow from 320 px. The new `page-layout.spec.ts` scenario checks visual and action alignment and mobile vertical order on French and English home pages and project lists. Title-alignment checks include 320, 375, 480, 768, 769, 1024, and 1440 px in Chromium.

Replaying captures of the light/dark and mobile FR welcome, the EN welcome at 768 px, the EN list at 1024 px, About EN, Contact FR and EN mobile, the FR CV, dark Palimia and the three social cards. Intermediate captures and logs are local, non-versioned artifacts. Lighthouse reports are in `lighthouse-reports/`, also ignored by Git.

## Limits

These measurements are local technical evidence, not user or production results. Emulations do not replace a real phone, Safari on Apple hardware, real browser zoom or a screen-reader review. The final aesthetic validation belongs to Ethan. No external deployment or release has been made.
