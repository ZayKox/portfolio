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

test("localized navigation controls expose names and states", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "chromium", "One browser proof is enough");

  for (const expectation of [
    {
      route: "/",
      locale: "fr",
      navigationName: "Navigation principale",
      switchLanguage: "en",
      switchName: "View this page in English",
      initialThemeName: "Activer le thème sombre",
      toggledThemeName: "Activer le thème clair",
    },
    {
      route: "/en/",
      locale: "en",
      navigationName: "Main navigation",
      switchLanguage: "fr",
      switchName: "Voir cette page en français",
      initialThemeName: "Use dark theme",
      toggledThemeName: "Use light theme",
    },
  ] as const) {
    await page.goto(expectation.route);
    await expect(page.locator("html")).toHaveAttribute("lang", expectation.locale);
    await expect(page.getByRole("navigation", { name: expectation.navigationName })).toBeVisible();

    const languageSwitch = page.getByRole("link", { name: expectation.switchName });
    await expect(languageSwitch).toHaveAttribute("lang", expectation.switchLanguage);
    await expect(languageSwitch).toHaveAttribute("hreflang", expectation.switchLanguage);

    const themeToggle = page.getByRole("button", { name: expectation.initialThemeName });
    await expect(themeToggle).toHaveAttribute("aria-pressed", "false");
    await themeToggle.click();
    await expect(page.getByRole("button", { name: expectation.toggledThemeName })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await page.evaluate(() => localStorage.removeItem("portfolio-theme"));
  }
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

test("keyboard focus follows DOM order and stays visible in both themes", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "chromium", "One desktop browser proof is enough");
  test.slow();

  const focusableSelector = [
    "a[href]",
    "button:not([disabled])",
    "input:not([disabled]):not([type='hidden'])",
    "select:not([disabled])",
    "textarea:not([disabled])",
    "[tabindex]:not([tabindex='-1'])",
  ].join(",");

  for (const route of publicRoutes) {
    for (const theme of ["light", "dark"] as const) {
      await page.goto(route);
      const focusableCount = await page.evaluate(
        ({ selector, selectedTheme }) => {
          document.documentElement.dataset.theme = selectedTheme;
          if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
          window.scrollTo(0, 0);

          const elements = [...document.querySelectorAll<HTMLElement>(selector)].filter(
            (element) => {
              const style = getComputedStyle(element);
              return (
                style.display !== "none" &&
                style.visibility !== "hidden" &&
                element.getClientRects().length > 0 &&
                !element.closest("[inert]")
              );
            },
          );

          elements.forEach((element, index) => {
            element.dataset.testFocusOrder = String(index);
          });
          return elements.length;
        },
        { selector: focusableSelector, selectedTheme: theme },
      );

      expect(focusableCount, `${route} in ${theme} theme should expose controls`).toBeGreaterThan(
        0,
      );

      for (let expectedOrder = 0; expectedOrder < focusableCount; expectedOrder += 1) {
        await page.keyboard.press("Tab");
        const context = `${route} in ${theme} theme, focus position ${expectedOrder}`;

        const readFocusState = () =>
          page.evaluate(() => {
            const element = document.activeElement;
            if (!(element instanceof HTMLElement)) return null;

            const rect = element.getBoundingClientRect();
            const style = getComputedStyle(element);
            return {
              order: element.dataset.testFocusOrder ?? null,
              outlineColor: style.outlineColor,
              outlineStyle: style.outlineStyle,
              outlineWidth: Number.parseFloat(style.outlineWidth),
              visibleInViewport:
                rect.width > 0 &&
                rect.height > 0 &&
                rect.bottom > 0 &&
                rect.right > 0 &&
                rect.top < window.innerHeight &&
                rect.left < window.innerWidth,
            };
          });

        const focusState = await readFocusState();
        expect(focusState, context).not.toBeNull();
        expect(focusState?.order, context).toBe(String(expectedOrder));
        expect(focusState?.outlineStyle, context).not.toBe("none");
        expect(focusState?.outlineWidth ?? 0, context).toBeGreaterThanOrEqual(2);
        expect(focusState?.outlineColor, context).not.toBe("rgba(0, 0, 0, 0)");
        await expect
          .poll(async () => (await readFocusState())?.visibleInViewport, {
            message: `${context} should be visible in the viewport`,
            timeout: 1_000,
          })
          .toBe(true);
      }

      await page.evaluate(() => {
        document.querySelectorAll<HTMLElement>("[data-test-focus-order]").forEach((element) => {
          delete element.dataset.testFocusOrder;
        });
        if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
        window.scrollTo(0, 0);
      });
    }
  }
});

test("reduced motion shortens transitions", async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: "reduce" });
  const page = await context.newPage();
  await page.goto("/");

  const durations = await page.locator("[data-theme-toggle]").evaluate((element) =>
    getComputedStyle(element)
      .transitionDuration.split(",")
      .map((value) => value.trim())
      .map((value) =>
        value.endsWith("ms") ? Number.parseFloat(value) : Number.parseFloat(value) * 1_000,
      ),
  );
  expect(durations.every((duration) => duration <= 0.1)).toBe(true);
  await context.close();
});

test("navigation and contact remain useful without JavaScript", async ({ browser }, testInfo) => {
  test.skip(testInfo.project.name !== "chromium", "One progressive-enhancement proof is enough");

  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

  await page.getByRole("link", { name: "Explorer mes projets" }).click();
  await expect(page).toHaveURL(/\/projets\/$/);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

  await page.goto("/contact/");
  await expect(page.getByRole("link", { name: /ethan\.brosselard@gmail\.com/ })).toHaveAttribute(
    "href",
    "mailto:ethan.brosselard@gmail.com",
  );
  await context.close();
});

test("representative pages stay within CLS and transfer budgets", async ({ page }, testInfo) => {
  test.skip(!testInfo.project.name.includes("chromium"), "Chromium performance metrics only");

  await page.addInitScript(() => {
    const state = { cls: 0 };
    Object.assign(globalThis, { __portfolioPerformance: state });
    new PerformanceObserver((entries) => {
      for (const entry of entries.getEntries()) {
        const shift = entry as PerformanceEntry & {
          hadRecentInput: boolean;
          value: number;
        };
        if (!shift.hadRecentInput) state.cls += shift.value;
      }
    }).observe({ type: "layout-shift", buffered: true });
  });

  for (const route of ["/", "/projets/", "/projets/myverse/", "/projets/filtre-appels/"] as const) {
    await page.goto(route);
    await page.waitForTimeout(250);
    const metrics = await page.evaluate(() => {
      const resources = performance.getEntriesByType("resource") as PerformanceResourceTiming[];
      const navigation = performance.getEntriesByType(
        "navigation",
      )[0] as PerformanceNavigationTiming;
      const state = globalThis as typeof globalThis & {
        __portfolioPerformance?: { cls: number };
      };
      return {
        cls: state.__portfolioPerformance?.cls ?? 0,
        encodedBytes:
          navigation.encodedBodySize +
          resources.reduce((total, resource) => total + resource.encodedBodySize, 0),
      };
    });

    expect(metrics.cls, `${route} CLS`).toBeLessThanOrEqual(0.1);
    expect(metrics.encodedBytes, `${route} encoded transfer budget`).toBeLessThanOrEqual(
      300 * 1_024,
    );
  }
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

test("desktop pages reflow at 200 and 400 percent viewport equivalents", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "chromium", "One desktop reflow proof is enough");

  for (const { label, width } of [
    { label: "200%", width: 640 },
    { label: "400%", width: 320 },
  ] as const) {
    await page.setViewportSize({ width, height: 720 });

    for (const route of publicRoutes) {
      await page.goto(route);
      await expect(page.locator("h1"), `${route} at ${label}`).toBeVisible();

      const dimensions = await page.evaluate(() => ({
        bodyWidth: document.body.scrollWidth,
        documentWidth: document.documentElement.scrollWidth,
        viewportWidth: document.documentElement.clientWidth,
      }));
      expect(
        Math.max(dimensions.bodyWidth, dimensions.documentWidth),
        `${route} at ${label} should reflow without page-level horizontal scrolling`,
      ).toBeLessThanOrEqual(dimensions.viewportWidth);
    }
  }
});

test("primary mobile controls keep 44px touch targets", async ({ page }, testInfo) => {
  test.skip(!testInfo.project.name.startsWith("mobile"), "Mobile project only");

  for (const route of publicRoutes) {
    await page.goto(route);
    const controls = page.locator(".language-switch, [data-theme-toggle], .button");
    for (let index = 0; index < (await controls.count()); index += 1) {
      const box = await controls.nth(index).boundingBox();
      expect(box, `${route} control ${index} should be rendered`).not.toBeNull();
      expect(box?.width ?? 0, `${route} control ${index} width`).toBeGreaterThanOrEqual(44);
      expect(box?.height ?? 0, `${route} control ${index} height`).toBeGreaterThanOrEqual(44);
    }
  }
});
