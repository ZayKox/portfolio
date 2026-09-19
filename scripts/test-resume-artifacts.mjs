import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, writeFile, rm, symlink } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import {
  jobs,
  manifestPath,
  artifactManifest,
  sourceFingerprint,
  validateResumeArtifacts,
} from "./resume-artifacts.mjs";

test("PDF validation rejects changed, added, removed sources and missing or tampered PDFs", async (t) => {
  const root = await mkdtemp(path.join(tmpdir(), "resume-proof-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  for (const dir of ["src/nested", "scripts", "docs", "public/cv"])
    await mkdir(path.join(root, dir), { recursive: true });
  for (const file of [
    "src/nested/content.ts",
    "astro.config.mjs",
    "tsconfig.json",
    "package.json",
    "package-lock.json",
    "scripts/generate-resume-pdfs.mjs",
    "scripts/resume-artifacts.mjs",
    ...jobs.map((j) => `public/cv/${j.filename}`),
  ]) {
    await writeFile(path.join(root, file), "original");
  }
  const record = async () =>
    writeFile(path.join(root, manifestPath), JSON.stringify(await artifactManifest(root)));
  await record();
  await validateResumeArtifacts(root);
  const saved = JSON.parse(await readFile(path.join(root, manifestPath), "utf8"));
  await writeFile(path.join(root, manifestPath), JSON.stringify({ ...saved, version: 2 }));
  await assert.rejects(validateResumeArtifacts(root), /stale/);
  await writeFile(path.join(root, manifestPath), JSON.stringify({ ...saved, outputs: undefined }));
  await assert.rejects(validateResumeArtifacts(root), /stale/);
  await record();
  await writeFile(path.join(root, "src/nested/content.ts"), "changed");
  await assert.rejects(validateResumeArtifacts(root), /stale/);
  await record();
  await writeFile(path.join(root, "src/nested/new.ts"), "new import");
  await assert.rejects(validateResumeArtifacts(root), /stale/);
  await record();
  await rm(path.join(root, "src/nested/new.ts"));
  await assert.rejects(validateResumeArtifacts(root), /stale/);
  await record();
  await writeFile(path.join(root, "public/cv", jobs[0].filename), "tampered");
  await assert.rejects(validateResumeArtifacts(root), /stale/);
  await record();
  await rm(path.join(root, "public/cv", jobs[1].filename));
  await assert.rejects(validateResumeArtifacts(root), /ENOENT/);
});

test("resume source fingerprints reject symbolic links", async (t) => {
  const root = await mkdtemp(path.join(tmpdir(), "resume-symlink-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  await mkdir(path.join(root, "src"));
  await writeFile(path.join(root, "target.ts"), "fixture");
  await symlink("../target.ts", path.join(root, "src", "linked.ts"));
  await assert.rejects(sourceFingerprint(root), /Unsupported symlink/);
});
