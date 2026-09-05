import { expect, test, type Page } from "@playwright/test";

async function settleSystemChanges(page: Page) {
  // Media query change events are delivered during rendering updates.
  await page.evaluate(
    () =>
      new Promise<void>((resolve) => {
        requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
      }),
  );
}

for (const route of ["/", "/en/"] as const) {
  test(`${route} ignores invalid saved themes and follows system changes until a visitor chooses`, async ({
    page,
  }) => {
    await page.addInitScript(() => localStorage.setItem("portfolio-theme", "violet"));
    await page.emulateMedia({ colorScheme: "dark" });
    await page.goto(route);

    const root = page.locator("html");
    const toggle = page.locator("[data-theme-toggle]");
    await expect(root).toHaveAttribute("data-theme", "dark");
    await expect(toggle).toBeVisible();
    await expect(toggle).toHaveAttribute("aria-pressed", "true");

    await page.emulateMedia({ colorScheme: "light" });
    await expect(root).toHaveAttribute("data-theme", "light");
    await expect(toggle).toHaveAttribute("aria-pressed", "false");
    await expect(toggle).toHaveAccessibleName(
      route === "/" ? "Activer le thème sombre" : "Use dark theme",
    );

    await toggle.click();
    await expect(root).toHaveAttribute("data-theme", "dark");
    expect(await page.evaluate(() => localStorage.getItem("portfolio-theme"))).toBe("dark");

    await page.emulateMedia({ colorScheme: "dark" });
    await settleSystemChanges(page);
    await page.emulateMedia({ colorScheme: "light" });
    await settleSystemChanges(page);
    await expect(root).toHaveAttribute("data-theme", "dark");
    await expect(toggle).toHaveAttribute("aria-pressed", "true");
  });

  test(`${route} keeps system fallback and the theme control working when storage is blocked`, async ({
    page,
  }) => {
    const runtimeErrors: string[] = [];
    page.on("pageerror", (error) => runtimeErrors.push(error.message));
    await page.addInitScript(() => {
      Object.defineProperty(window, "localStorage", {
        get() {
          throw new DOMException("Storage is unavailable", "SecurityError");
        },
      });
    });
    await page.emulateMedia({ colorScheme: "dark" });
    await page.goto(route);

    const root = page.locator("html");
    const toggle = page.locator("[data-theme-toggle]");
    await expect(root).toHaveAttribute("data-theme", "dark");
    await expect(toggle).toHaveAttribute("aria-pressed", "true");

    await page.emulateMedia({ colorScheme: "light" });
    await expect(root).toHaveAttribute("data-theme", "light");
    await expect(toggle).toHaveAttribute("aria-pressed", "false");
    await toggle.click();
    await expect(root).toHaveAttribute("data-theme", "dark");
    await expect(toggle).toHaveAccessibleName(
      route === "/" ? "Activer le thème clair" : "Use light theme",
    );

    await page.emulateMedia({ colorScheme: "dark" });
    await settleSystemChanges(page);
    await page.emulateMedia({ colorScheme: "light" });
    await settleSystemChanges(page);
    await expect(root).toHaveAttribute("data-theme", "dark");
    await expect(toggle).toHaveAttribute("aria-pressed", "true");
    expect(runtimeErrors).toEqual([]);
  });
}

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  for (const route of ["/", "/en/"] as const) {
    test(`${route} hides the unavailable theme control`, async ({ page }) => {
      await page.goto(route);

      await expect(page.locator("[data-theme-toggle]")).toBeHidden();
      await expect(page.locator(".language-switch")).toBeVisible();
      await expect(page.locator("main h1")).toBeVisible();
    });
  }
});
