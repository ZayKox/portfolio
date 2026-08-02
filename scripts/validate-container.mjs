import { spawnSync } from "node:child_process";
import process from "node:process";

import { validateDeployment } from "./deployment-checks.mjs";

const previewMode = process.argv.includes("--preview");
const mode = previewMode ? "preview" : "public";
const suffix = `${process.pid}-${Date.now()}`;
const image = `portfolio-smoke-${mode}:${suffix}`;
const container = `portfolio-smoke-${mode}-${suffix}`;
const siteUrl = previewMode ? "https://preview.portfolio.example" : "https://portfolio.example";

function docker(args, { quiet = false } = {}) {
  const result = spawnSync("docker", args, {
    encoding: "utf8",
    maxBuffer: 50 * 1024 * 1024,
  });
  if (result.status !== 0) {
    throw new Error(
      [`docker ${args.join(" ")} failed`, result.stdout, result.stderr].filter(Boolean).join("\n"),
    );
  }
  if (!quiet) {
    if (result.stdout) process.stdout.write(result.stdout);
    if (result.stderr) process.stderr.write(result.stderr);
  }
  return result.stdout.trim();
}

const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

async function waitForHealthy() {
  const deadline = Date.now() + 45_000;
  while (Date.now() < deadline) {
    const health = docker(
      ["inspect", "--format", "{{if .State.Health}}{{.State.Health.Status}}{{end}}", container],
      { quiet: true },
    );
    if (health === "healthy") return;
    if (health === "unhealthy") throw new Error("container healthcheck reported unhealthy");
    await wait(500);
  }
  throw new Error("container did not become healthy within 45 seconds");
}

try {
  console.log(`Building the ${mode} production container...`);
  docker([
    "build",
    "--quiet",
    "--build-arg",
    `SITE_URL=${siteUrl}`,
    "--build-arg",
    `SITE_NOINDEX=${previewMode}`,
    "--tag",
    image,
    ".",
  ]);

  console.log("Starting the production container on a random loopback port...");
  docker(["run", "--detach", "--name", container, "--publish", "127.0.0.1::8080", image]);
  await waitForHealthy();

  const portOutput = docker(["port", container, "8080/tcp"], { quiet: true });
  const port = portOutput.match(/:(\d+)$/)?.[1];
  if (!port) throw new Error(`could not resolve the published port from: ${portOutput}`);
  const origin = `http://127.0.0.1:${port}`;

  const report = await validateDeployment({
    requestOrigin: origin,
    expectedSiteOrigin: siteUrl,
    mode: previewMode ? "preview" : "production",
  });

  console.log(`Validated ${mode} container at ${origin}: ${report.checks.join(", ")}.`);
} finally {
  const removeContainer = spawnSync("docker", ["rm", "--force", container], {
    encoding: "utf8",
  });
  if (removeContainer.status !== 0 && !removeContainer.stderr.includes("No such container")) {
    process.stderr.write(`WARN: could not remove ${container}: ${removeContainer.stderr}`);
  }

  const removeImage = spawnSync("docker", ["image", "rm", "--force", image], {
    encoding: "utf8",
  });
  if (removeImage.status !== 0 && !removeImage.stderr.includes("No such image")) {
    process.stderr.write(`WARN: could not remove ${image}: ${removeImage.stderr}`);
  }
}
