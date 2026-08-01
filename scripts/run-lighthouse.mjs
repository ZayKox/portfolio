import { spawn } from "node:child_process";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { createServer } from "node:net";
import path from "node:path";
import process from "node:process";

import { chromium } from "@playwright/test";
import lighthouse from "lighthouse";

const root = process.cwd();
const reportDirectory = path.join(root, "lighthouse-reports");
const routes = [
  { path: "/", name: "home" },
  { path: "/projets/", name: "projects" },
  { path: "/projets/myverse/", name: "myverse" },
  { path: "/projets/filtre-appels/", name: "filtre-appels" },
];
const minimumScores = {
  performance: 0.95,
  accessibility: 0.95,
  "best-practices": 0.95,
  seo: 0.95,
};

function availablePort() {
  return new Promise((resolve, reject) => {
    const server = createServer();
    server.unref();
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      if (!address || typeof address === "string") {
        server.close(() => reject(new Error("Could not allocate a Lighthouse preview port.")));
        return;
      }
      server.close(() => resolve(address.port));
    });
  });
}

async function waitForPreview(origin, preview) {
  const deadline = Date.now() + 30_000;
  while (Date.now() < deadline) {
    if (preview.exitCode !== null) {
      throw new Error(`Astro preview exited early with code ${preview.exitCode}.`);
    }
    try {
      const response = await fetch(origin);
      if (response.ok) return;
    } catch {
      // The server is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error(`Astro preview did not become ready at ${origin}.`);
}

async function waitForChrome(port, chrome) {
  const endpoint = `http://127.0.0.1:${port}/json/version`;
  const deadline = Date.now() + 30_000;
  while (Date.now() < deadline) {
    if (chrome.exitCode !== null) {
      throw new Error(`Chromium exited early with code ${chrome.exitCode}.`);
    }
    try {
      const response = await fetch(endpoint);
      if (response.ok) return;
    } catch {
      // Chromium is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error(`Chromium did not expose its debugging endpoint on port ${port}.`);
}

async function stopProcess(child) {
  if (child.exitCode !== null) return;
  child.kill("SIGTERM");
  await Promise.race([
    new Promise((resolve) => child.once("exit", resolve)),
    new Promise((resolve) => setTimeout(resolve, 5_000)),
  ]);
  if (child.exitCode === null) child.kill("SIGKILL");
}

function score(category) {
  return Math.round((category?.score ?? 0) * 100);
}

function numericAudit(lhr, id) {
  const value = lhr.audits[id]?.numericValue;
  if (typeof value !== "number") throw new Error(`${id} did not return a numeric value.`);
  return value;
}

const port = await availablePort();
const origin = `http://127.0.0.1:${port}`;
const astroBin = path.join(root, "node_modules", "astro", "bin", "astro.mjs");
const preview = spawn(
  process.execPath,
  [astroBin, "preview", "--host", "127.0.0.1", "--port", `${port}`],
  {
    cwd: root,
    env: { ...process.env, ASTRO_TELEMETRY_DISABLED: "1" },
    stdio: ["ignore", "pipe", "pipe"],
  },
);
let previewError = "";
preview.stderr.on("data", (chunk) => {
  previewError += chunk.toString();
});

const chromePort = await availablePort();
const chromeDataDirectory = await mkdtemp("/tmp/portfolio-lighthouse-");
const chrome = spawn(
  chromium.executablePath(),
  [
    "--headless=new",
    "--no-sandbox",
    "--disable-gpu",
    `--remote-debugging-port=${chromePort}`,
    `--user-data-dir=${chromeDataDirectory}`,
    "about:blank",
  ],
  { stdio: "ignore" },
);
const failures = [];

try {
  await waitForPreview(origin, preview);
  await mkdir(reportDirectory, { recursive: true });
  await waitForChrome(chromePort, chrome);

  for (const route of routes) {
    const result = await lighthouse(`${origin}${route.path}`, {
      port: chromePort,
      output: ["html", "json"],
      logLevel: "error",
      onlyCategories: Object.keys(minimumScores),
      formFactor: "mobile",
      throttlingMethod: "simulate",
    });
    if (!result) throw new Error(`Lighthouse returned no result for ${route.path}.`);

    const [htmlReport, jsonReport] = result.report;
    await Promise.all([
      writeFile(path.join(reportDirectory, `${route.name}.html`), htmlReport),
      writeFile(path.join(reportDirectory, `${route.name}.json`), jsonReport),
    ]);

    const lhr = result.lhr;
    const scores = Object.fromEntries(
      Object.keys(minimumScores).map((category) => [category, score(lhr.categories[category])]),
    );
    const lcp = numericAudit(lhr, "largest-contentful-paint");
    const cls = numericAudit(lhr, "cumulative-layout-shift");
    const tbt = numericAudit(lhr, "total-blocking-time");

    console.log(
      `${route.path} — performance ${scores.performance}, accessibility ${scores.accessibility}, ` +
        `best practices ${scores["best-practices"]}, SEO ${scores.seo}; ` +
        `LCP ${Math.round(lcp)} ms, CLS ${cls.toFixed(3)}, TBT ${Math.round(tbt)} ms`,
    );

    for (const [category, minimum] of Object.entries(minimumScores)) {
      const actual = lhr.categories[category]?.score ?? 0;
      if (actual < minimum) {
        failures.push(
          `${route.path}: ${category} score ${score(lhr.categories[category])} < ${minimum * 100}`,
        );
      }
    }
    if (lcp > 2_500) failures.push(`${route.path}: LCP ${Math.round(lcp)} ms > 2500 ms`);
    if (cls > 0.1) failures.push(`${route.path}: CLS ${cls.toFixed(3)} > 0.1`);
    if (tbt > 200) failures.push(`${route.path}: TBT ${Math.round(tbt)} ms > 200 ms`);
  }
} finally {
  await Promise.all([stopProcess(chrome), stopProcess(preview)]);
  await rm(chromeDataDirectory, { recursive: true, force: true });
}

if (previewError.trim()) console.error(previewError.trim());
if (failures.length > 0) {
  throw new Error(`Lighthouse budgets failed:\n- ${failures.join("\n- ")}`);
}

console.log(`Lighthouse budgets passed for ${routes.length} representative pages.`);
