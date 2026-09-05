import { expect, test } from "@playwright/test";

const locales = [
  {
    route: "/contact/",
    button: "Copier l’adresse",
    success: "Adresse copiée",
    error: "La copie a échoué. Vous pouvez sélectionner l’adresse ou ouvrir votre messagerie.",
    mailLink: "Ouvrir la messagerie",
  },
  {
    route: "/en/contact/",
    button: "Copy address",
    success: "Address copied",
    error: "The address could not be copied. You can select it or open your email app.",
    mailLink: "Open email app",
  },
] as const;

for (const locale of locales) {
  for (const rejectFirstAttempt of [false, true]) {
    test(`${locale.route} announces clipboard ${rejectFirstAttempt ? "refusal and allows a retry" : "success"}`, async ({
      page,
    }) => {
      await page.addInitScript((shouldRejectFirstAttempt) => {
        const copiedAddresses: string[] = [];
        Object.assign(window, { __copiedAddresses: copiedAddresses });
        Object.defineProperty(navigator, "clipboard", {
          configurable: true,
          value: {
            writeText: async (address: string) => {
              copiedAddresses.push(address);
              if (shouldRejectFirstAttempt && copiedAddresses.length === 1) {
                throw new DOMException("Clipboard access denied", "NotAllowedError");
              }
            },
          },
        });
      }, rejectFirstAttempt);

      await page.goto(locale.route);
      const button = page.getByRole("button", { name: locale.button, exact: true });
      const status = page.getByRole("status");
      await expect(button).toBeVisible();
      await expect(status).toHaveAttribute("aria-live", "polite");
      await expect(status).toHaveAttribute("aria-atomic", "true");
      await expect(status).toBeEmpty();

      await button.click();
      await expect(status).toHaveText(rejectFirstAttempt ? locale.error : locale.success);
      await expect(button).toBeEnabled();
      await expect(button).toHaveText(locale.button);
      await expect(page.getByRole("link", { name: locale.mailLink })).toHaveAttribute(
        "href",
        "mailto:ethan.brosselard@gmail.com",
      );

      if (rejectFirstAttempt) {
        await button.click();
        await expect(status).toHaveText(locale.success);
        await expect(button).toBeEnabled();
      }

      const copiedAddresses = await page.evaluate(
        () => (window as typeof window & { __copiedAddresses: string[] }).__copiedAddresses,
      );
      expect(copiedAddresses).toEqual(
        Array(rejectFirstAttempt ? 2 : 1).fill("ethan.brosselard@gmail.com"),
      );
    });
  }

  test(`${locale.route} keeps email usable without JavaScript`, async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();

    try {
      await page.goto(locale.route);
      await expect(page.locator("[data-copy-email]")).toBeHidden();
      await expect(page.getByRole("link", { name: locale.mailLink })).toBeVisible();
      await expect(page.getByRole("link", { name: locale.mailLink })).toHaveAttribute(
        "href",
        "mailto:ethan.brosselard@gmail.com",
      );
    } finally {
      await context.close();
    }
  });
}
