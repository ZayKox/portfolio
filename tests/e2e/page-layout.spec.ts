import { expect, test } from "@playwright/test";

const interiorRoutes = [
  "/projets/",
  "/a-propos/",
  "/cv/",
  "/contact/",
  "/mentions-legales/",
  "/confidentialite/",
  "/projets/palimia/",
  "/projets/ludosaic/",
  "/en/projects/",
  "/en/about/",
  "/en/resume/",
  "/en/contact/",
  "/en/legal-notice/",
  "/en/privacy/",
  "/en/projects/palimia/",
  "/en/projects/ludosaic/",
];

test("interior page headings share alignment and typography across routes", async ({
  page,
}, testInfo) => {
  // Chromium also checks both sides of the tablet breakpoint. Other projects
  // cover their native desktop/mobile viewport and font rendering.
  const widths =
    testInfo.project.name === "chromium"
      ? [1440, 1024, 769, 768, 320]
      : [page.viewportSize()!.width];
  await page.emulateMedia({ reducedMotion: "reduce" });

  for (const width of widths) {
    await page.setViewportSize({ width, height: 900 });
    let reference: { x: number; offset: number; font: string; lineHeight: string } | undefined;

    for (const route of interiorRoutes) {
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
