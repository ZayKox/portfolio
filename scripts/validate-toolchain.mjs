import { access, readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const errors = [];

async function source(relativePath) {
  return readFile(path.join(root, relativePath), "utf8");
}

async function exists(relativePath) {
  try {
    await access(path.join(root, relativePath));
    return true;
  } catch {
    return false;
  }
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

function validatePinnedActions(workflow, label) {
  for (const action of [...workflow.matchAll(/^\s*uses:\s*(\S+)\s*(?:#.*)?$/gm)].map(
    (match) => match[1],
  )) {
    requireCondition(
      /@[a-f0-9]{40}$/.test(action),
      `${label} GitHub Action is not pinned by commit: ${action}`,
    );
  }
}

function exactKeys(value, expectedKeys) {
  return (
    value &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    JSON.stringify(Object.keys(value).sort()) === JSON.stringify([...expectedKeys].sort())
  );
}

function parseJsonc(value) {
  const withoutLineComments = value.replace(/^\s*\/\/.*$/gm, "");
  const withoutBlockComments = withoutLineComments.replace(/\/\*[\s\S]*?\*\//g, "");
  return JSON.parse(withoutBlockComments.replace(/,(\s*[}\]])/g, "$1"));
}

const [
  packageSource,
  lockSource,
  nvmSource,
  npmrc,
  wranglerSource,
  ciWorkflow,
  productionWorkflow,
  previewWorkflow,
  dependabot,
] = await Promise.all([
  source("package.json"),
  source("package-lock.json"),
  source(".nvmrc"),
  source(".npmrc"),
  source("wrangler.jsonc"),
  source(".github/workflows/ci.yml"),
  source(".github/workflows/deploy-production.yml"),
  source(".github/workflows/deploy-preview.yml"),
  source(".github/dependabot.yml"),
]);

const packageJson = JSON.parse(packageSource);
const packageLock = JSON.parse(lockSource);
const wrangler = parseJsonc(wranglerSource);
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

const wranglerVersion = packageJson.devDependencies?.wrangler;
requireCondition(
  /^\d+\.\d+\.\d+$/.test(wranglerVersion ?? ""),
  "package.json must pin an exact Wrangler version",
);
requireCondition(
  packageLock.packages?.["node_modules/wrangler"]?.version === wranglerVersion,
  "package-lock.json must contain the Wrangler version pinned in package.json",
);
requireCondition(
  packageJson.scripts?.["deploy:preview"] === "wrangler versions upload",
  "package.json must expose the non-production version upload command",
);
requireCondition(
  packageJson.scripts?.["deploy:production"] === "wrangler deploy",
  "package.json must expose the production deploy command",
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
requireCondition(
  !Object.keys(packageJson.scripts ?? {}).some((name) => name.includes("container")),
  "package.json must not retain obsolete container validation commands",
);

requireCondition(wrangler.name === "zaykohub", "Wrangler Worker name must be zaykohub");
requireCondition(
  exactKeys(wrangler, [
    "$schema",
    "name",
    "compatibility_date",
    "send_metrics",
    "dependencies_instrumentation",
    "workers_dev",
    "preview_urls",
    "observability",
    "assets",
    "routes",
  ]),
  "Wrangler config must not add a Worker script, bindings, or logging settings",
);
requireCondition(
  wrangler.compatibility_date === "2026-09-04",
  "Wrangler compatibility date must match the reviewed platform date",
);
requireCondition(wrangler.send_metrics === false, "Wrangler usage metrics must remain disabled");
requireCondition(
  exactKeys(wrangler.dependencies_instrumentation, ["enabled"]) &&
    wrangler.dependencies_instrumentation.enabled === false,
  "Wrangler dependency instrumentation must remain disabled",
);
requireCondition(
  wrangler.workers_dev === false,
  "the production workers.dev route must be disabled",
);
requireCondition(wrangler.preview_urls === true, "version preview URLs must be explicitly enabled");
requireCondition(!wrangler.main, "the static portfolio must not declare a Worker script");
requireCondition(
  exactKeys(wrangler.observability, ["enabled"]) && wrangler.observability.enabled === false,
  "Workers observability must remain explicitly disabled",
);
requireCondition(
  exactKeys(wrangler.assets, ["directory", "html_handling", "not_found_handling"]),
  "Wrangler assets must not declare a binding or Worker-first routing",
);
requireCondition(
  wrangler.assets?.directory === "./dist",
  "Wrangler static assets directory must be ./dist",
);
requireCondition(
  wrangler.assets?.html_handling === "force-trailing-slash",
  "Wrangler must force trailing slashes for HTML routes",
);
requireCondition(
  wrangler.assets?.not_found_handling === "404-page",
  "Wrangler must serve the generated 404 page with a real 404 response",
);
requireCondition(
  wrangler.routes?.length === 1 &&
    exactKeys(wrangler.routes[0], ["pattern", "custom_domain"]) &&
    wrangler.routes[0]?.pattern === "ethanbrosselard.com" &&
    wrangler.routes[0]?.custom_domain === true,
  "Wrangler must expose exactly the ethanbrosselard.com custom domain",
);

const npmOptions = new Set(
  npmrc
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean),
);
requireCondition(npmOptions.has("engine-strict=true"), ".npmrc must enforce package engines");
requireCondition(npmOptions.has("save-exact=true"), ".npmrc must keep dependency versions exact");

const gitignore = await source(".gitignore");
for (const ignoredPath of [".dev.vars", ".dev.vars.*", ".wrangler/"]) {
  requireCondition(
    gitignore.split(/\r?\n/).includes(ignoredPath),
    `.gitignore must exclude ${ignoredPath}`,
  );
}

for (const [label, workflow] of [
  ["CI", ciWorkflow],
  ["production deploy", productionWorkflow],
  ["preview deploy", previewWorkflow],
]) {
  requireCondition(
    !/^\s*pull_request_target:/m.test(workflow),
    `${label} workflow must not use pull_request_target`,
  );
  requireCondition(
    /^permissions:\s*\n\s+contents: read$/m.test(workflow),
    `${label} workflow permissions must be read-only`,
  );
  requireCondition(
    /persist-credentials:\s*false/.test(workflow),
    `${label} checkout must not persist Git credentials`,
  );
  requireCondition(
    /node-version-file:\s*\.nvmrc/.test(workflow),
    `${label} workflow must obtain its Node version from .nvmrc`,
  );
  validatePinnedActions(workflow, label);
}

for (const command of [
  "npm ci",
  "npm audit --audit-level=high",
  "npm run verify",
  "npm run test:lighthouse",
  "npm run test:e2e",
  "npm run check:links",
]) {
  requireCondition(ciWorkflow.includes(`run: ${command}`), `CI is missing: ${command}`);
}
requireCondition(!ciWorkflow.includes("container"), "CI must not retain container smoke tests");
requireCondition(
  !/CLOUDFLARE_|CF_ACCESS_|wrangler\s+(?:deploy|versions\s+upload)/.test(ciWorkflow),
  "CI for pull requests must not receive Cloudflare credentials or deploy",
);

for (const fragment of [
  "workflow_run:",
  "workflows: [CI]",
  "github.event.workflow_run.conclusion == 'success'",
  "github.event.workflow_run.event == 'push'",
  "github.event.workflow_run.head_branch == 'main'",
  "vars.CLOUDFLARE_PRODUCTION_ENABLED == 'true'",
  "ref: ${{ github.event.workflow_run.head_sha }}",
  'deployment_sha="$(git rev-parse HEAD)"',
  "SITE_URL: https://ethanbrosselard.com",
  'SITE_NOINDEX: "false"',
  'gh api "repos/${GITHUB_REPOSITORY}/git/ref/heads/main"',
  'current_sha" != "$DEPLOYMENT_SHA',
  "npm run deploy:production",
  "npm run test:deployment",
  "--redirect-from https://www.ethanbrosselard.com",
  "for attempt in {1..6}",
]) {
  requireCondition(
    productionWorkflow.includes(fragment),
    `production deploy workflow is missing: ${fragment}`,
  );
}

for (const fragment of [
  "workflow_dispatch:",
  "github.ref == 'refs/heads/main'",
  "vars.CLOUDFLARE_PREVIEWS_ENABLED == 'true'",
  "needs: build",
  "CLOUDFLARE_WORKERS_SUBDOMAIN",
  "CF_ACCESS_CLIENT_ID: ${{ secrets.CF_ACCESS_CLIENT_ID }}",
  "CF_ACCESS_CLIENT_SECRET: ${{ secrets.CF_ACCESS_CLIENT_SECRET }}",
  'deployment_sha="$(git rev-parse HEAD)"',
  "SITE_NOINDEX=true",
  "name: preview-assets",
  "actions/download-artifact@",
  "ref: main",
  "npm run validate:build",
  "npm run deploy:preview",
  "--preview-alias",
  "Prove preview rejects unauthenticated visitors",
  "/cdn-cgi/access/login/",
  "npm run test:deployment",
  "--mode preview",
  "for attempt in {1..6}",
]) {
  requireCondition(
    previewWorkflow.includes(fragment),
    `preview deploy workflow is missing: ${fragment}`,
  );
}
requireCondition(
  !/^\s*(?:pull_request|push):/m.test(previewWorkflow),
  "preview deployments must remain explicit workflow_dispatch runs",
);
const previewBuildJob = previewWorkflow.match(/^  build:\n([\s\S]*?)(?=^  deploy:)/m)?.[1];
requireCondition(previewBuildJob, "preview workflow must separate its untrusted build job");
requireCondition(
  previewBuildJob &&
    !/secrets\.|CLOUDFLARE_(?:ACCOUNT_ID|API_TOKEN)|CF_ACCESS_CLIENT_(?:ID|SECRET)/.test(
      previewBuildJob,
    ),
  "the requested preview revision must build without deployment or Access secrets",
);
requireCondition(
  /Checkout trusted deployment tooling[\s\S]*?ref: main[\s\S]*?Download immutable preview assets/.test(
    previewWorkflow,
  ),
  "preview upload must use trusted tooling from main and the immutable build artifact",
);
requireCondition(
  !/^\s*(?:pull_request|push|workflow_dispatch):/m.test(productionWorkflow),
  "production deployments must only follow a successful CI workflow run",
);
requireCondition(
  !productionWorkflow.includes('"GitHub ${GITHUB_SHA}"') &&
    !previewWorkflow.includes('"GitHub ${GITHUB_SHA}"'),
  "deployment messages must use the revision actually checked out",
);

const ecosystems = new Set(
  [...dependabot.matchAll(/package-ecosystem:\s*([a-z-]+)/g)].map((match) => match[1]),
);
for (const ecosystem of ["npm", "github-actions"]) {
  requireCondition(ecosystems.has(ecosystem), `Dependabot does not cover ${ecosystem}`);
}
requireCondition(!ecosystems.has("docker"), "Dependabot must not retain the retired Docker stack");

for (const retiredPath of [
  ".dockerignore",
  "Dockerfile",
  "docker-compose.production.yml",
  "nginx.conf",
  "deploy/caddy/portfolio.caddy.example",
  "scripts/validate-container.mjs",
]) {
  requireCondition(!(await exists(retiredPath)), `${retiredPath} belongs to the retired VPS stack`);
}

if (errors.length > 0) {
  console.error(errors.map((error) => `- ${error}`).join("\n"));
  process.exitCode = 1;
} else {
  console.log(
    `Validated Node ${nodeMajor}, Wrangler ${wranglerVersion}, static Workers routing, and gated GitHub deployments.`,
  );
}
