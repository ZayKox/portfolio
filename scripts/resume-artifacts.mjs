import { createHash } from "node:crypto";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

export const jobs = [
  { route: "/cv/", filename: "ethan-brosselard-cv-fr.pdf" },
  { route: "/en/resume/", filename: "ethan-brosselard-resume-en.pdf" },
];
export const manifestPath = "docs/resume-artifacts.json";
const hash = (contents) => createHash("sha256").update(contents).digest("hex");

async function walk(root, directory) {
  const entries = await readdir(path.join(root, directory), { withFileTypes: true });
  return (
    await Promise.all(
      entries.map(async (entry) => {
        const file = `${directory}/${entry.name}`;
        if (entry.isSymbolicLink()) throw new Error(`Unsupported symlink: ${file}`);
        return entry.isDirectory() ? walk(root, file) : [file];
      }),
    )
  ).flat();
}

export async function sourceFingerprint(root) {
  // Conservative dependency closure: new imports, styles and assets invalidate the PDFs too.
  const files = [
    ...(await walk(root, "src")),
    "astro.config.mjs",
    "tsconfig.json",
    "package.json",
    "package-lock.json",
    "scripts/generate-resume-pdfs.mjs",
    "scripts/resume-artifacts.mjs",
  ];
  const inputs = await Promise.all(
    files.sort().map(async (file) => [file, hash(await readFile(path.join(root, file)))]),
  );
  return hash(JSON.stringify(inputs));
}

export async function artifactManifest(root) {
  const outputs = {};
  for (const job of jobs) {
    outputs[job.filename] = hash(await readFile(path.join(root, "public/cv", job.filename)));
  }
  return { version: 1, sourceSha256: await sourceFingerprint(root), outputs };
}

export async function validateResumeArtifacts(root) {
  const saved = JSON.parse(await readFile(path.join(root, manifestPath), "utf8"));
  const current = await artifactManifest(root);
  if (
    saved.version !== current.version ||
    saved.sourceSha256 !== current.sourceSha256 ||
    JSON.stringify(Object.entries(saved.outputs ?? {}).sort()) !==
      JSON.stringify(Object.entries(current.outputs).sort())
  ) {
    throw new Error(
      "Resume PDFs are stale or modified. Run npm run generate:resume-pdfs and review both languages.",
    );
  }
}
