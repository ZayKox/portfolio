import { createHash } from "node:crypto";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");
export async function deploymentArtifact(directory, revision) {
  if (!/^[a-f0-9]{40}$/.test(revision ?? ""))
    throw new Error("Artifact comparison requires the full expected Git revision");
  const files = [];
  async function walk(relative = "") {
    for (const entry of await readdir(path.join(directory, relative), { withFileTypes: true })) {
      const file = path.posix.join(relative, entry.name);
      if (entry.isSymbolicLink()) throw new Error(`Artifact symlink is not supported: ${file}`);
      if (entry.isDirectory()) await walk(file);
      else if (!["_headers", "_redirects"].includes(file)) {
        const route =
          file === "404.html"
            ? "/remote-smoke-missing-route/"
            : `/${file}`.replace(/index\.html$/, "");
        files.push({
          route,
          status: file === "404.html" ? 404 : 200,
          sha256: sha256(await readFile(path.join(directory, file))),
        });
      }
    }
  }
  await walk();
  files.sort((a, b) => a.route.localeCompare(b.route));
  if (!files.length) throw new Error("Artifact is empty");
  return { revision, sha256: sha256(JSON.stringify(files)), files };
}

export async function validateRemoteArtifact(artifact, request) {
  for (const file of artifact.files) {
    const response = await request(file.route, file.status);
    const actual = sha256(Buffer.from(await response.arrayBuffer()));
    if (actual !== file.sha256)
      throw new Error(
        `${file.route}: deployed bytes differ from the expected artifact at ${artifact.revision}`,
      );
  }
  return {
    revision: artifact.revision,
    sha256: artifact.sha256,
    verifiedFiles: artifact.files.length,
  };
}

export async function validatePdfResponse(response, pathname) {
  if (!response.headers.get("content-type")?.startsWith("application/pdf"))
    throw new Error(`${pathname}: content type is not PDF`);
  const bytes = Buffer.from(await response.arrayBuffer());
  if (
    !bytes.subarray(0, 5).equals(Buffer.from("%PDF-")) ||
    !bytes.subarray(-1024).includes(Buffer.from("%%EOF"))
  )
    throw new Error(`${pathname}: invalid or incomplete PDF`);
  return { path: pathname, bytes: bytes.length, sha256: sha256(bytes) };
}
