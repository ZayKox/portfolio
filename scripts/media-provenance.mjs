import { createHash } from "node:crypto";
import { access, readFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

export async function validateMediaAsset(asset, root) {
  const fail = (message) => {
    throw new Error(`${asset.path}: ${message}`);
  };
  if (!/^(?:public|src\/assets)\/[a-zA-Z0-9/_-]+\.(?:png|jpe?g|webp)$/.test(asset.path ?? ""))
    fail("only reviewed PNG, JPEG and WebP images are currently supported");
  if (!/^[a-f0-9]{64}$/.test(asset.sha256 ?? "")) fail("invalid SHA-256");
  if (!asset.provenance?.trim()) fail("missing provenance");
  if (!Number.isSafeInteger(asset.maxBytes) || asset.maxBytes <= 0) fail("invalid byte budget");
  if (asset.kind === "approved-capture") {
    if (asset.generator) fail("captures must not claim a generator");
    const approval = asset.approval;
    if (
      approval?.by !== "Ethan Brosselard" ||
      !/^\d{4}-\d{2}-\d{2}$/.test(approval?.date ?? "") ||
      !Number.isFinite(Date.parse(approval.date)) ||
      new Date(approval.date).toISOString().slice(0, 10) !== approval.date
    )
      fail("capture needs explicit dated publication approval");
    if (!asset.sourceVersion?.trim() || !asset.rights?.trim())
      fail("capture needs its source version and rights");
    if (asset.contentSafety !== "demo-data-only")
      fail("capture must use reviewed demonstration data");
    if (!asset.alt?.fr?.trim() || !asset.alt?.en?.trim())
      fail("capture needs French and English alternatives");
  } else if (["generated-brand", "generated-project-brand"].includes(asset.kind)) {
    if (!/^scripts\/[a-z0-9-]+\.mjs$/.test(asset.generator ?? "")) fail("invalid generator");
    await access(path.join(root, asset.generator));
  } else fail("unsupported provenance kind");
  const contents = await readFile(path.join(root, asset.path));
  if (contents.length > asset.maxBytes) fail("byte budget exceeded");
  if (createHash("sha256").update(contents).digest("hex") !== asset.sha256)
    fail("SHA-256 differs from reviewed media");
  const metadata = await sharp(contents).metadata();
  if (asset.kind === "approved-capture" && (metadata.exif || metadata.xmp || metadata.iptc))
    fail("remove embedded EXIF/XMP/IPTC metadata before review");
  const expectedFormat = /\.jpe?g$/.test(asset.path) ? "jpeg" : path.extname(asset.path).slice(1);
  if (metadata.format !== expectedFormat || (metadata.pages ?? 1) > 1)
    fail("image format differs or animation is unsupported");
  for (const dimension of ["width", "height"]) {
    if (
      !Number.isSafeInteger(asset[dimension]) ||
      asset[dimension] <= 0 ||
      metadata[dimension] !== asset[dimension]
    )
      fail(`${dimension} differs from reviewed dimensions`);
  }
}
