import { createHash } from "node:crypto";
import { access, readFile, readdir } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const manifestPath = path.join(root, "docs", "media-provenance.json");
const mediaPattern = /\.(?:avif|gif|jpe?g|mp3|mp4|otf|png|svg|ttf|wav|webm|webp|woff2?)$/i;
const errors = [];

async function exists(file) {
  return access(file).then(
    () => true,
    () => false,
  );
}

async function walk(directory) {
  if (!(await exists(directory))) return [];
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(directory, entry.name);
      return entry.isDirectory() ? walk(entryPath) : [entryPath];
    }),
  );
  return files.flat();
}

let manifest;
try {
  manifest = JSON.parse(await readFile(manifestPath, "utf8"));
} catch (error) {
  throw new Error(`Could not read docs/media-provenance.json: ${error.message}`);
}

if (manifest.version !== 1) errors.push("media manifest version must be 1");
if (manifest.policy?.fonts !== "system-only") {
  errors.push("media manifest must keep the current system-only font policy");
}
if (manifest.policy?.icons !== "text-and-css-only") {
  errors.push("media manifest must keep the current text-and-CSS-only icon policy");
}
if (manifest.policy?.thirdPartyMedia !== false) {
  errors.push("third-party media must remain disabled until its rights and credits are reviewed");
}
if (!Array.isArray(manifest.assets)) errors.push("media manifest assets must be an array");

const assets = Array.isArray(manifest.assets) ? manifest.assets : [];
const manifestPaths = new Set();
for (const asset of assets) {
  const normalizedPath = String(asset.path ?? "")
    .split(path.sep)
    .join("/");
  if (
    !normalizedPath.match(/^(?:public|src\/assets)\//) ||
    normalizedPath.includes("..") ||
    !mediaPattern.test(normalizedPath)
  ) {
    errors.push(`invalid manifest media path: ${normalizedPath || "(missing)"}`);
    continue;
  }
  if (manifestPaths.has(normalizedPath)) {
    errors.push(`duplicate manifest media path: ${normalizedPath}`);
    continue;
  }
  manifestPaths.add(normalizedPath);
  if (!String(asset.kind ?? "").trim()) errors.push(`${normalizedPath}: kind is missing`);
  if (!String(asset.provenance ?? "").trim()) {
    errors.push(`${normalizedPath}: provenance is missing`);
  }
  if (!/^[a-f0-9]{64}$/.test(asset.sha256 ?? "")) {
    errors.push(`${normalizedPath}: SHA-256 is invalid`);
  }

  const absolutePath = path.join(root, normalizedPath);
  const contents = await readFile(absolutePath).catch(() => undefined);
  if (!contents) {
    errors.push(`${normalizedPath}: declared media file is missing`);
  } else {
    const actualHash = createHash("sha256").update(contents).digest("hex");
    if (actualHash !== asset.sha256) {
      errors.push(`${normalizedPath}: SHA-256 differs from the reviewed media manifest`);
    }
  }

  const generator = String(asset.generator ?? "");
  if (!generator || generator.includes("..") || !(await exists(path.join(root, generator)))) {
    errors.push(`${normalizedPath}: generator is missing or does not exist`);
  }
}

const publishedMedia = (
  await Promise.all([walk(path.join(root, "public")), walk(path.join(root, "src", "assets"))])
)
  .flat()
  .filter((file) => mediaPattern.test(file))
  .map((file) => path.relative(root, file).split(path.sep).join("/"));

for (const mediaPath of publishedMedia) {
  if (!manifestPaths.has(mediaPath)) errors.push(`${mediaPath}: published media has no provenance`);
}
for (const mediaPath of manifestPaths) {
  if (!publishedMedia.includes(mediaPath))
    errors.push(`${mediaPath}: manifest entry is not published`);
}

const globalStyles = await readFile(path.join(root, "src", "styles", "global.css"), "utf8");
if (/@font-face\b/i.test(globalStyles)) {
  errors.push("src/styles/global.css: bundled fonts conflict with the system-only policy");
}

if (errors.length > 0) {
  console.error(errors.map((error) => `- ${error}`).join("\n"));
  process.exitCode = 1;
} else {
  console.log(
    `Validated provenance for ${publishedMedia.length} published media assets; no fonts are bundled.`,
  );
}
