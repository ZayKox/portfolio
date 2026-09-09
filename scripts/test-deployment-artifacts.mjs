import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdtemp, mkdir, writeFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import {
  deploymentArtifact,
  validateRemoteArtifact,
  validatePdfResponse,
} from "./deployment-artifacts.mjs";

const pdf = Buffer.from("%PDF-1.7\nfixture\n%%EOF");
test("PDF validation rejects HTML fallbacks and truncated downloads", async () => {
  assert.equal(
    (
      await validatePdfResponse(
        new Response(pdf, { headers: { "content-type": "application/pdf" } }),
        "/cv/test.pdf",
      )
    ).sha256,
    createHash("sha256").update(pdf).digest("hex"),
  );
  await assert.rejects(validatePdfResponse(new Response("<html>"), "/cv/test.pdf"), /content type/);
  await assert.rejects(
    validatePdfResponse(
      new Response("%PDF-1.7", { headers: { "content-type": "application/pdf" } }),
      "/cv/test.pdf",
    ),
    /incomplete PDF/,
  );
});
test("artifact comparison detects an old PDF and maps static routes correctly", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "portfolio-artifact-"));
  try {
    await mkdir(path.join(root, "cv"));
    await writeFile(path.join(root, "index.html"), "home");
    await writeFile(path.join(root, "404.html"), "missing");
    await writeFile(path.join(root, "cv/test.pdf"), pdf);
    await writeFile(path.join(root, "_headers"), "not served");
    const artifact = await deploymentArtifact(root, "a".repeat(40));
    assert.equal(artifact.files.length, 3);
    assert(artifact.files.some((file) => file.route === "/"));
    const request = async (route, status) => {
      if (route.includes("missing")) assert.equal(status, 404);
      return new Response(route === "/" ? "home" : route.includes("missing") ? "missing" : pdf);
    };
    assert.equal((await validateRemoteArtifact(artifact, request)).verifiedFiles, 3);
    await assert.rejects(
      validateRemoteArtifact(artifact, async (route, status) =>
        route.endsWith("pdf") ? new Response("old PDF") : request(route, status),
      ),
      /deployed bytes differ/,
    );
    await assert.rejects(deploymentArtifact(root, "short-sha"), /full expected Git revision/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
