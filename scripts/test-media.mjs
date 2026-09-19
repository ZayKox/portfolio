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
        { path: undefined },
        { path: `private/fixture.${format}` },
        { sha256: undefined },
        { sha256: "invalid" },
        { provenance: " " },
        { maxBytes: 1.5 },
        { maxBytes: 0 },
        { width: 5 },
        { width: 0 },
        { height: 4 },
        { height: 1.5 },
        { maxBytes: 1 },
        { sha256: "0".repeat(64) },
        { generator: "scripts/fake.mjs" },
        { approval: undefined },
        { approval: { by: "Someone else", date: "2026-09-09" } },
        { approval: { by: "Ethan Brosselard" } },
        { approval: { by: "Ethan Brosselard", date: "09/09/2026" } },
        { approval: { by: "Ethan Brosselard", date: "2026-02-30" } },
        { sourceVersion: " " },
        { rights: " " },
        { alt: { fr: "Only French" } },
        { alt: { en: "Only English" } },
        { contentSafety: "unreviewed" },
      ])
        await assert.rejects(validateMediaAsset({ ...asset, ...mutation }, root));
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });
}

test("generated media requires a real generator and exact static image format", async (t) => {
  const root = await mkdtemp(path.join(os.tmpdir(), "portfolio-generated-media-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  await mkdir(path.join(root, "public"));
  await mkdir(path.join(root, "scripts"));
  await writeFile(path.join(root, "scripts/generate-fixture.mjs"), "// fixture");
  const bytes = await sharp({
    create: { width: 4, height: 3, channels: 3, background: "#000000" },
  })
    .png()
    .toBuffer();
  await writeFile(path.join(root, "public/fixture.png"), bytes);
  const asset = {
    path: "public/fixture.png",
    kind: "generated-brand",
    generator: "scripts/generate-fixture.mjs",
    provenance: "Generated test fixture",
    width: 4,
    height: 3,
    maxBytes: 4096,
    sha256: createHash("sha256").update(bytes).digest("hex"),
  };
  await validateMediaAsset(asset, root);
  await validateMediaAsset({ ...asset, kind: "generated-project-brand" }, root);
  await assert.rejects(validateMediaAsset({ ...asset, generator: "bad.js" }, root), /generator/);
  await assert.rejects(validateMediaAsset({ ...asset, generator: undefined }, root), /generator/);
  await assert.rejects(
    validateMediaAsset({ ...asset, generator: "scripts/missing.mjs" }, root),
    /ENOENT/,
  );
  await assert.rejects(validateMediaAsset({ ...asset, kind: "unknown" }, root), /unsupported/);

  await writeFile(path.join(root, "public/fixture.webp"), bytes);
  await assert.rejects(
    validateMediaAsset(
      {
        ...asset,
        path: "public/fixture.webp",
        sha256: createHash("sha256").update(bytes).digest("hex"),
      },
      root,
    ),
    /format differs/,
  );
});

test("approved captures reject embedded metadata", async (t) => {
  const root = await mkdtemp(path.join(os.tmpdir(), "portfolio-metadata-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  await mkdir(path.join(root, "public"));
  const bytes = await sharp({
    create: { width: 4, height: 3, channels: 3, background: "#000000" },
  })
    .jpeg()
    .withExif({ IFD0: { Artist: "Fixture" } })
    .toBuffer();
  await writeFile(path.join(root, "public/fixture.jpeg"), bytes);
  await assert.rejects(
    validateMediaAsset(
      {
        path: "public/fixture.jpeg",
        kind: "approved-capture",
        provenance: "Metadata fixture",
        sourceVersion: "fixture",
        rights: "Test fixture",
        contentSafety: "demo-data-only",
        approval: { by: "Ethan Brosselard", date: "2026-09-09" },
        alt: { fr: "Fixture", en: "Fixture" },
        width: 4,
        height: 3,
        maxBytes: 4096,
        sha256: createHash("sha256").update(bytes).digest("hex"),
      },
      root,
    ),
    /embedded/,
  );

  const xmpBytes = await sharp({
    create: { width: 4, height: 3, channels: 3, background: "#000000" },
  })
    .jpeg()
    .withXmp('<?xpacket begin="﻿"?><x:xmpmeta xmlns:x="adobe:ns:meta/"/>')
    .toBuffer();
  await writeFile(path.join(root, "public/xmp.jpeg"), xmpBytes);
  await assert.rejects(
    validateMediaAsset(
      {
        path: "public/xmp.jpeg",
        kind: "approved-capture",
        provenance: "XMP fixture",
        sourceVersion: "fixture",
        rights: "Test fixture",
        contentSafety: "demo-data-only",
        approval: { by: "Ethan Brosselard", date: "2026-09-09" },
        alt: { fr: "Fixture", en: "Fixture" },
        width: 4,
        height: 3,
        maxBytes: 4096,
        sha256: createHash("sha256").update(xmpBytes).digest("hex"),
      },
      root,
    ),
    /embedded/,
  );
});

test("animated images are rejected even when their format matches", async (t) => {
  const root = await mkdtemp(path.join(os.tmpdir(), "portfolio-animation-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  await mkdir(path.join(root, "public"));
  await mkdir(path.join(root, "scripts"));
  await writeFile(path.join(root, "scripts/generate-fixture.mjs"), "// fixture");
  const frames = await Promise.all(
    ["#000000", "#ffffff"].map((background) =>
      sharp({ create: { width: 4, height: 3, channels: 4, background } })
        .png()
        .toBuffer(),
    ),
  );
  const bytes = await sharp(frames, { join: { animated: true } })
    .webp()
    .toBuffer();
  await writeFile(path.join(root, "public/animated.webp"), bytes);
  await assert.rejects(
    validateMediaAsset(
      {
        path: "public/animated.webp",
        kind: "generated-brand",
        generator: "scripts/generate-fixture.mjs",
        provenance: "Animated fixture",
        width: 4,
        height: 6,
        maxBytes: 4096,
        sha256: createHash("sha256").update(bytes).digest("hex"),
      },
      root,
    ),
    /animation/,
  );
});
