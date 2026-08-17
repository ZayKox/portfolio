import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

import { validateDeployment } from "./deployment-checks.mjs";

function usage() {
  return `Usage:
  npm run test:deployment -- --url https://preview.example --mode preview [--report deployment-reports/preview.json]
  npm run test:deployment -- --url https://example.com --mode production [--check-http-redirect] [--redirect-from https://www.example.com] [--report deployment-reports/production.json]
  npm run test:deployment -- --url https://technical.example --canonical-url https://example.com --mode production [--report deployment-reports/pre-dns.json]

--canonical-url validates metadata built for a different final origin while requesting --url.
--redirect-from may be repeated for every HTTPS origin that must permanently redirect to the canonical origin.

Optional environment variable:
  DEPLOYMENT_AUTHORIZATION  Complete Authorization header value for a protected preview.`;
}

function parseArguments(argumentsList) {
  const options = { checkHttpRedirect: false, help: false, redirectFrom: [] };
  for (let index = 0; index < argumentsList.length; index += 1) {
    const argument = argumentsList[index];
    if (argument === "--help") {
      options.help = true;
      continue;
    }
    if (argument === "--check-http-redirect") {
      options.checkHttpRedirect = true;
      continue;
    }
    if (argument === "--redirect-from") {
      const value = argumentsList[index + 1];
      if (!value || value.startsWith("--")) throw new Error(`${argument} requires a value.`);
      options.redirectFrom.push(value);
      index += 1;
      continue;
    }
    if (["--url", "--canonical-url", "--mode", "--report"].includes(argument)) {
      const value = argumentsList[index + 1];
      if (!value || value.startsWith("--")) throw new Error(`${argument} requires a value.`);
      options[argument === "--canonical-url" ? "canonicalUrl" : argument.slice(2)] = value;
      index += 1;
      continue;
    }
    throw new Error(`Unknown argument: ${argument}`);
  }
  return options;
}

async function main() {
  const options = parseArguments(process.argv.slice(2));
  if (options.help) {
    console.log(usage());
    return;
  }
  if (!options.url || !options.mode) throw new Error("--url and --mode are required.");
  if (!["production", "preview"].includes(options.mode)) {
    throw new Error("--mode must be production or preview.");
  }
  if (options.checkHttpRedirect && options.mode !== "production") {
    throw new Error("--check-http-redirect is only valid with --mode production.");
  }
  if (options.redirectFrom.length > 0 && options.mode !== "production") {
    throw new Error("--redirect-from is only valid with --mode production.");
  }
  if (options.canonicalUrl && options.mode !== "production") {
    throw new Error("--canonical-url is only valid with --mode production.");
  }

  const parseHttpsOrigin = (value, option) => {
    let parsed;
    try {
      parsed = new URL(value);
    } catch {
      throw new Error(`${option} must be a valid HTTPS origin.`);
    }
    if (
      parsed.protocol !== "https:" ||
      parsed.pathname !== "/" ||
      parsed.search ||
      parsed.hash ||
      parsed.username ||
      parsed.password
    ) {
      throw new Error(
        `${option} must be an HTTPS origin without a path, query, fragment, or credentials.`,
      );
    }
    return parsed;
  };

  const deploymentUrl = parseHttpsOrigin(options.url, "--url");
  const canonicalUrl = options.canonicalUrl
    ? parseHttpsOrigin(options.canonicalUrl, "--canonical-url")
    : deploymentUrl;
  if (options.canonicalUrl && canonicalUrl.origin === deploymentUrl.origin) {
    throw new Error("--canonical-url must be omitted when it matches --url.");
  }
  const redirectOrigins = options.redirectFrom.map((value) => {
    return parseHttpsOrigin(value, "--redirect-from").origin;
  });
  if (new Set(redirectOrigins).size !== redirectOrigins.length) {
    throw new Error("--redirect-from must not contain duplicate origins.");
  }
  if (redirectOrigins.includes(deploymentUrl.origin)) {
    throw new Error("--redirect-from must differ from the requested --url origin.");
  }
  if (redirectOrigins.includes(canonicalUrl.origin)) {
    throw new Error("--redirect-from must differ from the canonical origin.");
  }

  const report = await validateDeployment({
    requestOrigin: options.url,
    expectedSiteOrigin: canonicalUrl.origin,
    mode: options.mode,
    authorization: process.env.DEPLOYMENT_AUTHORIZATION,
    checkHttpRedirect: options.checkHttpRedirect,
    redirectOrigins,
  });

  if (options.report) {
    const reportPath = path.resolve(options.report);
    await mkdir(path.dirname(reportPath), { recursive: true });
    await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`);
    console.log(`Saved deployment report to ${reportPath}.`);
  }

  console.log(
    `Validated ${report.mode} deployment at ${report.requestOrigin}` +
      (report.expectedSiteOrigin === report.requestOrigin
        ? ""
        : ` for canonical ${report.expectedSiteOrigin}`) +
      `: ${report.checks.join(", ")}.`,
  );
}

try {
  await main();
} catch (error) {
  console.error(`Deployment validation failed: ${error.message}`);
  console.error(usage());
  process.exitCode = 1;
}
