import { expect, test } from "@playwright/test";

for (const route of ["/", "/en/", "/cv/", "/en/resume/", "/contact/", "/en/contact/"]) {
  test(`${route} keeps keyboard focus clear of the header at 320px`, async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 720 });
    await page.goto(route);
    for (const theme of ["light", "dark"]) {
      await page.locator("[data-theme-select]").selectOption(theme);
      const count = await page.evaluate(() => {
        const controls = [
          ...document.querySelectorAll<HTMLElement>(
            "a[href], button:not([disabled]), select:not([disabled])",
          ),
        ].filter((element) => element.getClientRects().length);
        controls.forEach((element, index) => (element.dataset.auditOrder = String(index)));
        (document.activeElement as HTMLElement)?.blur();
        window.scrollTo(0, 0);
        return controls.length;
      });
      // Starting after a programmatic selection can leave the sequential focus start
      // at that select. Reset it explicitly to the first control before traversing.
      await page.locator('[data-audit-order="0"]').focus();
      const steps = [
        ...Array.from({ length: count - 1 }, (_, index) => ({ key: "Tab", index: index + 1 })),
        ...Array.from({ length: count - 1 }, (_, index) => ({
          key: "Shift+Tab",
          index: count - index - 2,
        })),
      ];
      for (const { key, index } of steps) {
        await page.keyboard.press(key);
        await expect
          .poll(
            () =>
              page.evaluate(() => {
                const element = document.activeElement as HTMLElement;
                const rect = element.getBoundingClientRect();
                const header = document.querySelector(".site-header")!.getBoundingClientRect();
                const exempt = element.closest(".site-header, .skip-link");
                return {
                  order: Number(element.dataset.auditOrder),
                  visible:
                    rect.top >= (exempt ? 0 : Math.max(0, header.bottom)) - 1 &&
                    rect.bottom <= innerHeight + 1,
                };
              }),
            { message: `${route}, ${theme}, ${key}, control ${index}` },
          )
          .toEqual({ order: index, visible: true });
      }
    }
  });
}

for (const route of ["/", "/en/"]) {
  test(`${route} keeps navigation readable with WCAG text spacing`, async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 720 });
    await page.goto(route);
    await page.evaluate(() => {
      // Apply the visitor's spacing via CSSOM, without relaxing the site's CSP.
      for (const element of document.querySelectorAll<HTMLElement>("*")) {
        element.style.setProperty("line-height", "1.5", "important");
        element.style.setProperty("letter-spacing", ".12em", "important");
        element.style.setProperty("word-spacing", ".16em", "important");
        if (element.tagName === "P") element.style.setProperty("margin-bottom", "2em", "important");
      }
    });
    for (const control of await page
      .locator(".main-nav a, .brand, .language-switch, [data-theme-select]")
      .all()) {
      const rect = await control.boundingBox();
      expect(rect).not.toBeNull();
      expect(rect!.x).toBeGreaterThanOrEqual(0);
      expect(rect!.x + rect!.width).toBeLessThanOrEqual(321);
      await control.focus();
      await expect(control).toBeFocused();
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
      320,
    );
  });

  test(`${route} disables actual document transitions when reduced motion is requested`, async ({
    page,
    browserName,
  }) => {
    test.skip(
      browserName !== "chromium",
      "Cross-document transition lifecycle is inspected in Chromium",
    );
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.addInitScript(() => {
      window.addEventListener("pagereveal", (event) => {
        document.documentElement.dataset.hadViewTransition = String(
          Boolean((event as Event & { viewTransition?: unknown }).viewTransition),
        );
      });
    });
    await page.goto(route);
    await page.locator(".hero-copy .button--primary").click();
    await expect(page).toHaveURL(route === "/" ? /\/projets\/$/ : /\/en\/projects\/$/);
    await expect(page.locator("html")).toHaveAttribute("data-had-view-transition", "false");
  });
}
