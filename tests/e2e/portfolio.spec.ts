import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const publicRoutes = [
  "/",
  "/a-propos/",
  "/contact/",
  "/projets/",
  "/projets/filtre-appels/",
  "/projets/myverse/",
  "/en/",
  "/en/about/",
  "/en/contact/",
  "/en/projects/",
  "/en/projects/filtre-appels/",
  "/en/projects/myverse/",
] as const;

for (const route of publicRoutes) {
  test(`${route} renders without runtime or serious accessibility errors`, async ({ page }) => {
    const runtimeErrors: string[] = [];
    page.on("pageerror", (error) => runtimeErrors.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error") runtimeErrors.push(message.text());
    });

    const response = await page.goto(route);

    expect(response?.ok()).toBe(true);
    await expect(page.locator("main")).toBeVisible();
    await expect(page.locator("h1")).toHaveCount(1);

    for (const theme of ["light", "dark"] as const) {
      if ((await page.locator("html").getAttribute("data-theme")) !== theme) {
        await page.locator("[data-theme-toggle]").click();
      }
      await expect(page.locator("html")).toHaveAttribute("data-theme", theme);

      const results = await new AxeBuilder({ page }).analyze();
      const blockingViolations = results.violations.filter(({ impact }) =>
        ["serious", "critical"].includes(impact ?? ""),
      );
      expect(blockingViolations, `${route} in ${theme} theme`).toEqual([]);
    }

    expect(runtimeErrors).toEqual([]);
  });
}

test("theme follows the system preference and persists the visitor choice", async ({ browser }) => {
  const context = await browser.newContext({ colorScheme: "dark" });
  const page = await context.newPage();

  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(page.locator("[data-theme-toggle]")).toHaveAttribute("aria-pressed", "true");

  await page.locator("[data-theme-toggle]").click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  expect(await page.evaluate(() => localStorage.getItem("portfolio-theme"))).toBe("light");

  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await context.close();
});

test("primary links expose the expected destinations", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("link", { name: "Explorer mes projets" })).toHaveAttribute(
    "href",
    "/projets/",
  );
  await expect(page.getByRole("link", { name: /Voir mon GitHub/ })).toHaveAttribute(
    "href",
    "https://github.com/ZayKox",
  );

  await page.goto("/contact/");
  await expect(page.getByRole("link", { name: /ethan\.brosselard@gmail\.com/ })).toHaveAttribute(
    "href",
    "mailto:ethan.brosselard@gmail.com",
  );
  await expect(page.getByRole("link", { name: "GitHub ↗", exact: true })).toHaveAttribute(
    "href",
    "https://github.com/ZayKox",
  );
  await expect(page.getByRole("link", { name: "LinkedIn ↗", exact: true })).toHaveAttribute(
    "href",
    "https://www.linkedin.com/in/ethan-brosselard-507334237/",
  );
});

test("unknown paths return the bilingual 404 page", async ({ page }) => {
  const response = await page.goto("/route-absente-pour-test/");

  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: "Cette page n’existe pas." })).toBeVisible();
  await expect(page.getByText("This page does not exist.", { exact: false })).toBeVisible();
});

test("keyboard navigation exposes the skip link", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");

  const skipLink = page.getByRole("link", { name: "Aller au contenu" });
  await expect(skipLink).toBeFocused();
  await expect(skipLink).toBeVisible();

  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/#main-content$/);
});

test("mobile pages do not overflow horizontally", async ({ page }, testInfo) => {
  test.skip(!testInfo.project.name.startsWith("mobile"), "Mobile project only");

  for (const route of publicRoutes) {
    await page.goto(route);
    const dimensions = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
    }));
    expect(dimensions.scrollWidth, `${route} should not overflow`).toBeLessThanOrEqual(
      dimensions.clientWidth,
    );
  }
});
