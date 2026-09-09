import { expect, test } from "@playwright/test";

for (const route of ["/", "/en/"] as const) {
  for (const blockedStorage of [false, true]) {
    test(`${route} supports explicit themes and returning to system (blocked storage: ${blockedStorage})`, async ({
      page,
    }) => {
      const runtimeErrors: string[] = [];
      page.on("pageerror", (error) => runtimeErrors.push(error.message));
      if (blockedStorage) {
        await page.addInitScript(() => {
          Object.defineProperty(window, "localStorage", {
            get() {
              throw new DOMException("Storage is unavailable", "SecurityError");
            },
          });
        });
      } else {
        await page.addInitScript(() => {
          if (localStorage.getItem("portfolio-theme") === null)
            localStorage.setItem("portfolio-theme", "violet");
        });
      }
      await page.emulateMedia({ colorScheme: "dark" });
      await page.goto(route);
      const root = page.locator("html");
      const select = page.getByRole("combobox", { name: route === "/" ? "Thème" : "Theme" });
      await expect(select).toHaveValue("system");
      await expect(root).toHaveAttribute("data-theme", "dark");
      await page.emulateMedia({ colorScheme: "light" });
      await expect(root).toHaveAttribute("data-theme", "light");
      await select.selectOption("dark");
      await expect(root).toHaveAttribute("data-theme", "dark");
      if (!blockedStorage) {
        expect(await page.evaluate(() => localStorage.getItem("portfolio-theme"))).toBe("dark");
        await page.reload();
        await expect(select).toHaveValue("dark");
        await expect(root).toHaveAttribute("data-theme", "dark");
      }
      await select.selectOption("light");
      await page.emulateMedia({ colorScheme: "dark" });
      await expect(root).toHaveAttribute("data-theme", "light");
      await select.selectOption("system");
      await expect(root).toHaveAttribute("data-theme", "dark");
      if (!blockedStorage) {
        expect(await page.evaluate(() => localStorage.getItem("portfolio-theme"))).toBeNull();
        await page.reload();
        await expect(select).toHaveValue("system");
      }
      await page.emulateMedia({ colorScheme: "light" });
      await expect(root).toHaveAttribute("data-theme", "light");
      expect(runtimeErrors).toEqual([]);
    });
  }
}

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });
  for (const route of ["/", "/en/"] as const) {
    test(`${route} hides the unavailable theme control and keeps the header in document flow`, async ({
      page,
    }) => {
      await page.goto(route);
      await expect(page.locator("[data-theme-select]")).toBeHidden();
      await expect(page.locator(".language-switch")).toBeVisible();
      await expect(page.locator(".site-header")).toHaveCSS("position", "relative");
    });
  }
});
