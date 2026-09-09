import { checkLink } from "./link-checks.mjs";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const outputDirectory = path.join(process.cwd(), "dist");

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

const htmlFiles = (await walk(outputDirectory)).filter((file) => file.endsWith(".html"));
const links = new Set();
for (const file of htmlFiles) {
  for (const url of externalLinks(await readFile(file, "utf8"))) links.add(url);
}

const results = await Promise.all([...links].sort().map((url) => checkLink(url)));
const counts = Object.fromEntries(
  ["verified", "inconclusive", "broken"].map((status) => [
    status,
    results.filter((result) => result.status === status).length,
  ]),
);
const reportPath = path.resolve(process.env.LINK_CHECK_REPORT ?? "docs/qa/external-links.json");
await mkdir(path.dirname(reportPath), { recursive: true });
await writeFile(
  reportPath,
  JSON.stringify({ checkedAt: new Date().toISOString(), counts, results }, null, 2) + "\n",
);
for (const result of results)
  console.log(
    `${result.status.toUpperCase()}: ${result.url}${result.reason ? ` — ${result.reason}` : ""}`,
  );
console.log(
  `Checked ${results.length} external links: ${counts.verified} verified, ${counts.inconclusive} inconclusive, ${counts.broken} broken. Report: ${path.relative(process.cwd(), reportPath)}`,
);
if (counts.broken > 0) process.exitCode = 1;
