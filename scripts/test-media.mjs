import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdtemp, mkdir, writeFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import sharp from "sharp";
import { validateMediaAsset } from "./media-provenance.mjs";

for (const format of ["png", "jpeg", "webp"]) {
  test(`${format} capture requires approval and matching bytes/dimensions`, async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), "portfolio-media-"));
    try {
      await mkdir(path.join(root, "public"));
      const bytes = await sharp({
        create: { width: 4, height: 3, channels: 3, background: "#000000" },
      })
        .toFormat(format)
        .toBuffer();
      const asset = {
        path: `public/fixture.${format}`,
        kind: "approved-capture",
        provenance: "Generated fixture, not public content",
        sourceVersion: "fixture",
        rights: "Test fixture",
        contentSafety: "demo-data-only",
        approval: { by: "Ethan Brosselard", date: "2026-09-09" },
        alt: { fr: "Fixture", en: "Fixture" },
        width: 4,
        height: 3,
        maxBytes: 4096,
        sha256: createHash("sha256").update(bytes).digest("hex"),
      };
      await writeFile(path.join(root, asset.path), bytes);
      await validateMediaAsset(asset, root);
      for (const mutation of [
        { width: 5 },
        { maxBytes: 1 },
        { sha256: "0".repeat(64) },
        { approval: undefined },
        { alt: { fr: "Only French" } },
        { contentSafety: "unreviewed" },
      ])
        await assert.rejects(validateMediaAsset({ ...asset, ...mutation }, root));
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });
}
