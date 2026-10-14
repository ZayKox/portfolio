import { expect, test } from "@playwright/test";

for (const route of ["/", "/en/", "/cv/", "/en/resume/"]) {
  test(`${route} exposes professional examples by keyboard without mobile overflow or print expansion`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 720 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(route);
    const details = page.locator(".experience-details");
    const summary = details.locator("summary");
    await expect(summary).toHaveText(
      route.startsWith("/en/") ? "Examples of contributions" : "Exemples de réalisations",
    );
    expect((await summary.boundingBox())!.height).toBeGreaterThanOrEqual(44);
    await expect(details).toHaveJSProperty("open", false);
    await summary.focus();
    await page.keyboard.press("Enter");
    await expect(details).toHaveJSProperty("open", true);
    await expect(
      details.getByRole("heading", { name: /Primotheus.*(estimer|value)/ }),
    ).toBeVisible();
    for (const term of ["DVF", "PostgreSQL", "Pandas", "OCR", "n8n"])
      await expect(details).toContainText(term);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    await page.keyboard.press("Enter");
    await expect(details).toHaveJSProperty("open", false);
    await summary.click();
    await expect(details).toHaveJSProperty("open", true);
    await page.setViewportSize({ width: 1280, height: 900 });
    const layout = await details.evaluate((element) => {
      const parent = element.parentElement!;
      const style = getComputedStyle(parent);
      const items = [...element.querySelectorAll("article")].map((item) => {
        const rect = item.getBoundingClientRect();
        return { top: rect.top, left: rect.left, right: rect.right };
      });
      return {
        width: element.getBoundingClientRect().width,
        availableWidth:
          parent.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight),
        items,
      };
    });
    expect(layout.width).toBeGreaterThanOrEqual(layout.availableWidth * 0.98);
    const [first, second] = layout.items;
    if (!first || !second) throw new Error("Expected at least two professional examples");
    expect(Math.abs(first.top - second.top)).toBeLessThan(1);
    expect(second.left).toBeGreaterThanOrEqual(first.right);
    await page.emulateMedia({ media: "print" });
    await expect(details).toBeHidden();
  });
}
