import { spawnSync } from "node:child_process";
import process from "node:process";

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

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function validateResponse(origin, pathname, expectedStatus) {
  const response = await fetch(new URL(pathname, origin), { redirect: "manual" });
  assert(
    response.status === expectedStatus,
    `${pathname} returned ${response.status}, expected ${expectedStatus}`,
  );
  return { response, body: await response.text() };
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
  assert(port, `could not resolve the published port from: ${portOutput}`);
  const origin = `http://127.0.0.1:${port}`;

  const home = await validateResponse(origin, "/", 200);
  assert(home.body.includes("Ethan Brosselard"), "home page does not contain the public name");

  const expectedHeaders = {
    "content-security-policy": ["frame-ancestors 'none'", "upgrade-insecure-requests"],
    "permissions-policy": ["camera=()", "microphone=()", "geolocation=()"],
    "referrer-policy": ["strict-origin-when-cross-origin"],
    "x-content-type-options": ["nosniff"],
    "x-frame-options": ["DENY"],
  };
  for (const [name, fragments] of Object.entries(expectedHeaders)) {
    const value = home.response.headers.get(name) ?? "";
    for (const fragment of fragments) {
      assert(value.includes(fragment), `${name} is missing ${fragment}`);
    }
  }

  const notFound = await validateResponse(origin, "/route-absente-pour-test/", 404);
  assert(notFound.body.includes("Cette page n’existe pas."), "404 page is missing French copy");
  assert(notFound.body.includes("This page does not exist."), "404 page is missing English copy");

  const robots = await validateResponse(origin, "/robots.txt", 200);
  if (previewMode) {
    assert(
      home.body.includes('<meta name="robots" content="noindex, nofollow">'),
      "preview home page is missing noindex, nofollow",
    );
    for (const forbiddenSignal of [
      'rel="canonical"',
      'rel="alternate"',
      'rel="sitemap"',
      'type="application/ld+json"',
      'property="og:',
    ]) {
      assert(!home.body.includes(forbiddenSignal), `preview exposes ${forbiddenSignal}`);
    }
    assert(robots.body.includes("Disallow: /"), "preview robots.txt does not block crawling");
    assert(!robots.body.includes("Sitemap:"), "preview robots.txt exposes a sitemap");
    await validateResponse(origin, "/sitemap-index.xml", 404);
  } else {
    assert(
      robots.body.includes(`${siteUrl}/sitemap-index.xml`),
      "robots.txt does not reference the expected sitemap",
    );
  }

  console.log(
    `Validated ${mode} container health, headers, 404 handling, and SEO endpoints at ${origin}.`,
  );
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
