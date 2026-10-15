import { createServer } from "node:http";
import { readFile, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";
import assert from "node:assert/strict";

const root = fileURLToPath(new URL("../", import.meta.url));
const output = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(path.join(root, "package.json"));
const { chromium } = require("playwright");
const { getDocument } = await import(
  pathToFileURL(require.resolve("pdfjs-dist/legacy/build/pdf.mjs")).href
);
const resume = JSON.parse(await readFile(path.join(root, "src/data/resume.json"), "utf8"));
const variants = JSON.parse(await readFile(path.join(output, "variantes.json"), "utf8"));
const dist = path.join(root, "dist");
const server = createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
    const resolved = path.resolve(
      dist,
      "." + (pathname.endsWith("/") ? pathname + "index.html" : pathname),
    );
    if (!resolved.startsWith(dist + path.sep)) throw new Error("Invalid path");
    const types = {
      ".html": "text/html; charset=utf-8",
      ".css": "text/css",
      ".js": "text/javascript",
    };
    response.setHeader("content-type", types[path.extname(resolved)] ?? "application/octet-stream");
    response.end(await readFile(resolved));
  } catch {
    response.writeHead(404).end();
  }
});
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const origin = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch();
const report = [];
try {
  for (const variant of variants)
    for (const locale of ["fr", "en"]) {
      const page = await browser.newPage({ viewport: { width: 794, height: 1123 } });
      await page.goto(origin + (locale === "fr" ? "/cv/" : "/en/resume/"), {
        waitUntil: "networkidle",
      });
      assert.equal(
        await page.locator(".resume-summary").innerText(),
        resume[locale].summary,
        "Rebuild the portfolio before generating variants",
      );
      await page.evaluate(
        ({ variant, locale, source }) => {
          document.querySelector(".resume-role").textContent = variant[locale].role;
          document.querySelector(".resume-summary").textContent = variant[locale].summary;
          const list = document.querySelector(".resume-entry ul");
          list.replaceChildren(
            ...variant.highlights.map((index) => {
              const li = document.createElement("li");
              const text = source.experience[0].highlights[index];
              const split = text.indexOf(" — ");
              if (split < 0) li.textContent = text;
              else {
                const strong = document.createElement("strong");
                strong.textContent = text.slice(0, split);
                li.append(strong, text.slice(split));
              }
              return li;
            }),
          );
          const skills = document.querySelector(".resume-skill-list");
          const elements = [...skills.children];
          skills.replaceChildren(
            ...variant.skills.map(
              (id) => elements[source.skillGroups.findIndex((group) => group.id === id)],
            ),
          );
        },
        { variant, locale, source: resume[locale] },
      );
      await page.emulateMedia({ media: "print" });
      const stem = `ethan-brosselard-${variant.id}-${locale}`;
      await page.pdf({
        path: path.join(output, `${stem}.pdf`),
        format: "A4",
        printBackground: true,
        preferCSSPageSize: true,
        tagged: true,
        outline: true,
      });
      const styles = await page.evaluate(() =>
        [...document.styleSheets]
          .map((sheet) => [...sheet.cssRules].map((rule) => rule.cssText).join("\n"))
          .join("\n"),
      );
      const article = await page.locator(".resume-document").evaluate((el) => el.outerHTML);
      const html = `<!doctype html><html lang="${locale}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${locale === "fr" ? "CV" : "Resume"} — Ethan Brosselard</title><style>${styles}</style></head><body>${article}</body></html>`;
      const htmlPath = path.join(output, `${stem}.html`);
      await writeFile(
        htmlPath,
        html
          .split("\n")
          .map((line) => line.trimEnd())
          .join("\n") + "\n",
      );
      // Verify the standalone HTML, including its offline styles and language.
      await page.goto(pathToFileURL(htmlPath).href, { waitUntil: "load" });
      await page.emulateMedia({ media: "print" });
      assert.equal(await page.locator("html").getAttribute("lang"), locale);
      assert.equal(await page.locator(".resume-role").innerText(), variant[locale].role);
      const loading = getDocument({ url: pathToFileURL(path.join(output, `${stem}.pdf`)).href });
      const pdf = await loading.promise;
      assert.equal(pdf.numPages, 1, `${stem} must fit on one page`);
      const info = await pdf.getMetadata();
      assert.equal(info.info.Language, locale);
      assert.equal(info.hasStructTree, true);
      const content = (await (await pdf.getPage(1)).getTextContent()).items
        .map((item) => item.str)
        .join(" ")
        .replace(/\s+/g, " ");
      for (const text of [
        variant[locale].role,
        resume[locale].objective,
        "Thésorimed",
        "Primotheus",
        "ID-Xplore",
      ])
        assert(content.includes(text), `${stem}: missing ${text}`);
      assert(!/\bjunior\b|Professional working proficiency/.test(content));
      await loading.destroy();
      await page.close();
      report.push({ file: `${stem}.pdf`, language: locale, pages: 1, tagged: true });
      console.log("Validated", `${stem}.pdf`);
    }
  await writeFile(
    path.join(output, "validation.json"),
    JSON.stringify({ generatedAt: new Date().toISOString(), variants: report }, null, 2) + "\n",
  );
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}
