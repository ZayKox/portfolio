import { readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const errors = [];

async function source(relativePath) {
  return readFile(path.join(root, relativePath), "utf8");
}

function requireCondition(condition, message) {
  if (!condition) errors.push(message);
}

function majorFromMinimum(value, label) {
  const match = String(value ?? "").match(/^>=(\d+)\.\d+\.\d+$/);
  if (!match) {
    errors.push(`${label} must be a single explicit minimum version`);
    return undefined;
  }
  return Number(match[1]);
}

const [
  packageSource,
  lockSource,
  nvmSource,
  npmrc,
  dockerfile,
  dockerignore,
  workflow,
  dependabot,
] = await Promise.all([
  source("package.json"),
  source("package-lock.json"),
  source(".nvmrc"),
  source(".npmrc"),
  source("Dockerfile"),
  source(".dockerignore"),
  source(".github/workflows/ci.yml"),
  source(".github/dependabot.yml"),
]);

const packageJson = JSON.parse(packageSource);
const packageLock = JSON.parse(lockSource);
const nodeMajor = Number(nvmSource.trim());
requireCondition(/^\d+$/.test(nvmSource.trim()), ".nvmrc must contain one Node major version");

const engineNodeMajor = majorFromMinimum(packageJson.engines?.node, "package.json engines.node");
const engineNpmMajor = majorFromMinimum(packageJson.engines?.npm, "package.json engines.npm");
const packageManager = String(packageJson.packageManager ?? "").match(/^npm@(\d+)\.\d+\.\d+$/);
requireCondition(packageManager, "package.json packageManager must pin an exact npm version");
requireCondition(
  nodeMajor === engineNodeMajor,
  `.nvmrc Node ${nodeMajor} differs from the engines.node major ${engineNodeMajor}`,
);
requireCondition(
  Number(packageManager?.[1]) === engineNpmMajor,
  "packageManager and engines.npm must use the same major version",
);
requireCondition(
  JSON.stringify(packageLock.packages?.[""]?.engines) === JSON.stringify(packageJson.engines),
  "package-lock.json root engines differ from package.json",
);
requireCondition(
  packageJson.scripts?.["test:deployment-redirects"] ===
    "node scripts/test-deployment-redirects.mjs",
  "package.json must expose the canonical redirect test",
);
requireCondition(
  packageJson.scripts?.verify?.includes("npm run test:deployment-redirects"),
  "npm run verify must include the canonical redirect test",
);

const nodeBase = dockerfile.match(/^FROM node:(\d+)-alpine@sha256:([a-f0-9]{64}) AS builder$/m);
requireCondition(nodeBase, "Dockerfile builder must pin node:<major>-alpine by SHA-256 digest");
requireCondition(
  Number(nodeBase?.[1]) === nodeMajor,
  `Dockerfile Node ${nodeBase?.[1] ?? "(missing)"} differs from .nvmrc Node ${nodeMajor}`,
);
requireCondition(
  /^FROM nginxinc\/nginx-unprivileged:\d+\.\d+-alpine@sha256:[a-f0-9]{64}$/m.test(dockerfile),
  "Dockerfile runtime must pin nginx-unprivileged:<major.minor>-alpine by SHA-256 digest",
);

const npmOptions = new Set(
  npmrc
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean),
);
requireCondition(npmOptions.has("engine-strict=true"), ".npmrc must enforce package engines");
requireCondition(npmOptions.has("save-exact=true"), ".npmrc must keep dependency versions exact");

const ignored = new Set(
  dockerignore
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#")),
);
for (const entry of [".env", ".env.*", ".git", "dist", "node_modules"]) {
  requireCondition(ignored.has(entry), `.dockerignore must exclude ${entry}`);
}

requireCondition(
  !/^\s*pull_request_target:/m.test(workflow),
  "CI must not use pull_request_target",
);
requireCondition(
  /^permissions:\s*\n\s+contents: read$/m.test(workflow),
  "CI permissions must be read-only",
);
requireCondition(
  /persist-credentials:\s*false/.test(workflow),
  "CI checkout must not persist Git credentials",
);
requireCondition(
  /node-version-file:\s*\.nvmrc/.test(workflow),
  "CI must obtain its Node version from .nvmrc",
);
for (const action of [...workflow.matchAll(/^\s*uses:\s*(\S+)\s*(?:#.*)?$/gm)].map(
  (match) => match[1],
)) {
  requireCondition(
    /@[a-f0-9]{40}$/.test(action),
    `GitHub Action is not pinned by commit: ${action}`,
  );
}
for (const command of [
  "npm ci",
  "npm audit --omit=dev --audit-level=high",
  "npm run verify",
  "npm run test:container",
  "npm run test:container:preview",
  "npm run test:lighthouse",
  "npm run test:e2e",
  "npm run check:links",
]) {
  requireCondition(workflow.includes(`run: ${command}`), `CI is missing: ${command}`);
}

const ecosystems = new Set(
  [...dependabot.matchAll(/package-ecosystem:\s*([a-z-]+)/g)].map((match) => match[1]),
);
for (const ecosystem of ["npm", "github-actions", "docker"]) {
  requireCondition(ecosystems.has(ecosystem), `Dependabot does not cover ${ecosystem}`);
}

if (errors.length > 0) {
  console.error(errors.map((error) => `- ${error}`).join("\n"));
  process.exitCode = 1;
} else {
  console.log(
    `Validated Node ${nodeMajor}, exact npm tooling, pinned build dependencies, and the complete CI toolchain.`,
  );
}
