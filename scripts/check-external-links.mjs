import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const outputDirectory = path.join(process.cwd(), "dist");
const timeoutMilliseconds = 15_000;

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  return (
    await Promise.all(
      entries.map((entry) => {
        const entryPath = path.join(directory, entry.name);
        return entry.isDirectory() ? walk(entryPath) : [entryPath];
      }),
    )
  ).flat();
}

function externalLinks(html) {
  return [...html.matchAll(/\bhref=["'](https:\/\/[^"']+)["']/gi)].map((match) => match[1]);
}

async function request(url, method) {
  return fetch(url, {
    method,
    redirect: "follow",
    signal: AbortSignal.timeout(timeoutMilliseconds),
    headers: {
      "user-agent": "Ethan-Brosselard-Portfolio-Link-Check/1.0",
      ...(method === "GET" && { range: "bytes=0-0" }),
    },
  });
}

async function check(url) {
  try {
    let response = await request(url, "HEAD");
    if ([405, 501].includes(response.status)) response = await request(url, "GET");

    if ([404, 410].includes(response.status)) {
      return { level: "error", message: `${url} returned ${response.status}` };
    }
    if (!response.ok) {
      return {
        level: "warning",
        message: `${url} returned ${response.status}; verification is inconclusive and needs manual review`,
      };
    }
    return { level: "ok", message: `${url} returned ${response.status}` };
  } catch (error) {
    return {
      level: "warning",
      message: `${url} could not be checked (${error instanceof Error ? error.message : "network error"}); needs manual review`,
    };
  }
}

const htmlFiles = (await walk(outputDirectory)).filter((file) => file.endsWith(".html"));
const links = new Set();
for (const file of htmlFiles) {
  for (const url of externalLinks(await readFile(file, "utf8"))) links.add(url);
}

const results = await Promise.all([...links].sort().map(check));
for (const result of results) {
  const label = result.level === "warning" ? "WARN" : result.level.toUpperCase();
  console.log(`${label}: ${result.message}`);
}

const failures = results.filter(({ level }) => level === "error");
const verified = results.filter(({ level }) => level === "ok");
const inconclusive = results.filter(({ level }) => level === "warning");
console.log(
  `Checked ${results.length} external links: ${verified.length} verified, ${inconclusive.length} inconclusive, ${failures.length} broken.`,
);
if (failures.length > 0) process.exitCode = 1;
