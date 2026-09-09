import { publicRoutes as routeCatalog } from "../../scripts/route-catalog.mjs";
import { expect, test } from "@playwright/test";

const pageRoutes = routeCatalog.map((entry) => entry.path);

test("page headings including both homepages share alignment and typography across routes", async ({
  page,
}, testInfo) => {
  // Chromium also checks both sides of the tablet breakpoint. Other projects
  // cover their native desktop/mobile viewport and font rendering.
  const widths =
    testInfo.project.name === "chromium"
      ? [1440, 1024, 769, 768, 480, 375, 320]
      : [page.viewportSize()!.width];
  await page.emulateMedia({ reducedMotion: "reduce" });

  for (const width of widths) {
    await page.setViewportSize({ width, height: 900 });
    let reference: { x: number; offset: number; font: string; lineHeight: string } | undefined;

    for (const route of pageRoutes) {
      await page.goto(route);
      const heading = await page.locator("h1").evaluate((element) => {
        const box = element.getBoundingClientRect();
        const header = document.querySelector(".site-header")!.getBoundingClientRect();
        const style = getComputedStyle(element);
        return {
          x: box.x,
          offset: box.y - header.bottom,
          font: style.fontSize,
          lineHeight: style.lineHeight,
        };
      });
      reference ??= heading;
      const label = `${route} at ${width}px`;
      expect(Math.abs(heading.x - reference.x), `${label}: left edge`).toBeLessThanOrEqual(1);
      expect(Math.abs(heading.offset - reference.offset), `${label}: top edge`).toBeLessThanOrEqual(
        1,
      );
      expect(heading.font, `${label}: font size`).toBe(reference.font);
      expect(heading.lineHeight, `${label}: line height`).toBe(reference.lineHeight);

      const overflow = await page.evaluate(
        () =>
          Math.max(document.body.scrollWidth, document.documentElement.scrollWidth) -
          document.documentElement.clientWidth,
      );
      expect(overflow, `${label}: reflow`).toBeLessThanOrEqual(0);

      // A page can avoid horizontal overflow while a fixed-ratio project
      // illustration silently crops its own labels at narrow widths.
      for (const library of await page.locator(".palimia-library").all()) {
        const bounds = await library.evaluate((element) => {
          const content = element.getBoundingClientRect();
          const frame = element.closest(".project-visual")!.getBoundingClientRect();
          return { top: content.top - frame.top, bottom: frame.bottom - content.bottom };
        });
        expect(
          bounds.top,
          `${label}: Palimia header remains inside its visual`,
        ).toBeGreaterThanOrEqual(0);
        expect(
          bounds.bottom,
          `${label}: Palimia footer remains inside its visual`,
        ).toBeGreaterThanOrEqual(0);
      }
    }
  }
});

test("project cards align their visuals and actions while preserving mobile reading order", async ({
  page,
}, testInfo) => {
  const widths =
    testInfo.project.name === "chromium"
      ? [1440, 1024, 769, 768, 320]
      : [page.viewportSize()!.width];
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of widths) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of ["/", "/en/", "/projets/", "/en/projects/"]) {
      await page.goto(route);
      const cards = await page.locator(".project-card").evaluateAll((elements) =>
        elements.map((element) => {
          const card = element.getBoundingClientRect();
          const visual = element.querySelector(".project-card-visual")!.getBoundingClientRect();
          const content = element.querySelector(".project-card-content")!.getBoundingClientRect();
          const action = element
            .querySelector(".project-card-content > .text-link")!
            .getBoundingClientRect();
          return {
            x: card.x,
            top: card.top,
            bottom: card.bottom,
            visualBottom: visual.bottom,
            contentTop: content.top,
            actionBottom: action.bottom,
          };
        }),
      );
      expect(cards.length).toBeGreaterThan(0);
      const [first, second] = cards;

      for (const card of cards) {
        expect(
          card.contentTop,
          `${route} at ${width}px: visual precedes content`,
        ).toBeGreaterThanOrEqual(card.visualBottom - 1);
        expect(card.actionBottom).toBeLessThanOrEqual(card.bottom);
      }
      if (first && second && width > 768) {
        expect(second.x).toBeGreaterThan(first.x);
        for (const key of ["top", "bottom", "visualBottom", "actionBottom"] as const) {
          expect(
            Math.abs(first[key] - second[key]),
            `${route} at ${width}px: ${key}`,
          ).toBeLessThanOrEqual(1);
        }
      } else if (first && second) {
        expect(second.top).toBeGreaterThan(first.bottom);
      }
    }
  }
});
