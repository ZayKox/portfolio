import { spawnSync } from "node:child_process";
import process from "node:process";

import { validateDeployment } from "./deployment-checks.mjs";

const previewMode = process.argv.includes("--preview");
const mode = previewMode ? "preview" : "public";
const suffix = `${process.pid}-${Date.now()}`;
const image = `portfolio-smoke-${mode}:${suffix}`;
const container = `portfolio-smoke-${mode}-${suffix}`;
const siteUrl = previewMode ? "https://preview.portfolio.example" : "https://portfolio.example";

function docker(args, { quiet = false, includeStderr = false } = {}) {
  const result = spawnSync("docker", args, {
    encoding: "utf8",
    env: {
      ...process.env,
      SITE_URL: siteUrl,
      SITE_NOINDEX: String(previewMode),
      PORTFOLIO_CADDY_NETWORK: "portfolio-smoke-edge",
    },
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
  return `${result.stdout}${includeStderr ? result.stderr : ""}`.trim();
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
  const compose = JSON.parse(
    docker(["compose", "--file", "docker-compose.production.yml", "config", "--format", "json"], {
      quiet: true,
    }),
  );
  const service = compose.services?.portfolio;
  if (!service) throw new Error("Docker Compose does not define the portfolio service");
  if (service.read_only !== true) throw new Error("portfolio root filesystem is not read-only");
  if (!service.cap_drop?.includes("ALL"))
    throw new Error("portfolio does not drop all capabilities");
  if (!service.security_opt?.includes("no-new-privileges:true")) {
    throw new Error("portfolio does not enforce no-new-privileges");
  }
  if (!service.tmpfs?.some((entry) => entry.startsWith("/tmp:"))) {
    throw new Error("portfolio does not provide a bounded writable /tmp filesystem");
  }
  if (JSON.stringify(service.expose) !== JSON.stringify(["8080"])) {
    throw new Error("portfolio must expose only the internal port 8080");
  }
  if (!service.networks?.["caddy-edge"] || compose.networks?.["caddy-edge"]?.external !== true) {
    throw new Error("portfolio must join only the external Caddy edge network");
  }
  if (compose.networks?.["caddy-edge"]?.name !== "portfolio-smoke-edge") {
    throw new Error("portfolio Caddy edge network does not use the configured name");
  }
  for (const field of ["ports", "volumes", "secrets", "configs", "environment", "devices"]) {
    if (service[field]?.length || Object.keys(service[field] ?? {}).length) {
      throw new Error(`portfolio must not define ${field}`);
    }
  }
  if (service.privileged || [service.network_mode, service.pid, service.ipc].includes("host")) {
    throw new Error("portfolio enables a privileged or host namespace mode");
  }
  if (
    service.build?.args?.SITE_URL !== siteUrl ||
    service.build?.args?.SITE_NOINDEX !== String(previewMode)
  ) {
    throw new Error("portfolio build arguments do not match the requested deployment mode");
  }
  if (service.restart !== "unless-stopped") {
    throw new Error("portfolio restart policy must remain unless-stopped");
  }
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
  docker([
    "run",
    "--detach",
    "--name",
    container,
    "--read-only",
    "--cap-drop",
    "ALL",
    "--security-opt",
    "no-new-privileges=true",
    "--tmpfs",
    "/tmp:rw,nosuid,noexec,size=16m,mode=1777",
    "--publish",
    "127.0.0.1::8080",
    image,
  ]);
  const runtimeUser = docker(["inspect", "--format", "{{.Config.User}}", container], {
    quiet: true,
  });
  if (!runtimeUser || /^(?:0|root)(?::|$)/.test(runtimeUser)) {
    throw new Error(`portfolio image runs as a privileged user: ${runtimeUser || "(unset)"}`);
  }
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

  const logProbe = `privacy-probe-${suffix}`;
  const probeResponse = await fetch(`${origin}/?${logProbe}=query-value`, {
    headers: {
      referer: `https://${logProbe}.example/private-referrer`,
      "user-agent": `${logProbe}-user-agent`,
      "x-forwarded-for": "203.0.113.77",
    },
  });
  await probeResponse.arrayBuffer();
  await wait(100);
  const accessLogs = docker(["logs", container], { quiet: true, includeStderr: true });
  for (const privateValue of [logProbe, "query-value", "private-referrer", "203.0.113.77"]) {
    if (accessLogs.includes(privateValue)) {
      throw new Error(`portfolio access logs expose the privacy probe: ${privateValue}`);
    }
  }
  if (!accessLogs.includes(" GET /index.html 200 ")) {
    throw new Error("portfolio minimal access log does not retain the expected operational event");
  }
  report.checks.push("privacy-minimized container access logs");

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
