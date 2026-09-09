# Deployment and rollback runbook

This runbook describes how the static portfolio is previewed and deployed through GitHub Actions to Cloudflare Workers with Static Assets. GitHub Actions is the normal deployment path. Local deployment is reserved for an explicitly authorized incident response.

## Current production contract

- Astro generates only `dist/`.
- Workers Static Assets serves that directory without SSR, Functions, bindings, a database, or application secrets.
- `wrangler.jsonc` preserves trailing-slash URLs and serves `404.html` with a real HTTP 404 status.
- Production uses `SITE_URL=https://ethanbrosselard.com` and `SITE_NOINDEX=false`.
- A preview uses `SITE_NOINDEX=true`, an explicit alias, an unpromoted Workers version, and Cloudflare Access.
- `main` represents production.
- The canonical origin is `https://ethanbrosselard.com`.
- HTTP redirects permanently to HTTPS.
- `www.ethanbrosselard.com` redirects permanently to the apex while preserving the path and query string.
- The public artifact enables no browser-side analytics, tracking cookies, form, account, or embedded third-party content.
- Workers Logs, log exports, Wrangler telemetry, and dependency instrumentation remain disabled in the versioned configuration.

The first public production deployment was completed on September 8, 2026. The current roadmap and remaining release-record work are tracked in [`docs/production-plan.md`](production-plan.md).

## Secrets and variables

The repository, pull-request jobs, build output, and reports must never contain secrets.

| Name                      | GitHub environment      | Purpose                                                                             |
| ------------------------- | ----------------------- | ----------------------------------------------------------------------------------- |
| `CLOUDFLARE_ACCOUNT_ID`   | `preview`, `production` | Select the Workers account.                                                         |
| `CLOUDFLARE_API_TOKEN`    | `preview`, `production` | Upload a preview version or deploy production. Use distinct least-privilege tokens. |
| `CF_ACCESS_CLIENT_ID`     | `preview`               | Authenticate the automated preview smoke test.                                      |
| `CF_ACCESS_CLIENT_SECRET` | `preview`               | Secret paired with the Access client ID.                                            |

Repository variables:

| Name                            | Expected value                                                                        |
| ------------------------------- | ------------------------------------------------------------------------------------- |
| `CLOUDFLARE_WORKERS_SUBDOMAIN`  | Account Workers subdomain without `.workers.dev`.                                     |
| `CLOUDFLARE_PREVIEWS_ENABLED`   | `true` only while the preview environment and Access policy are correctly configured. |
| `CLOUDFLARE_PRODUCTION_ENABLED` | `true` only when production deployment is intentionally enabled.                      |

Keep environment protection and required human approval enabled for production. Rotate Cloudflare and Access tokens before expiration, with a controlled overlap. Never copy their values into issues, pull requests, `.env`, `.dev.vars`, terminal transcripts, or committed reports.

## Account and domain safeguards

- Protect GitHub, Cloudflare, and the registrar with 2FA.
- Keep API tokens limited to the required account, zone, and Workers operations.
- Preserve registrar lock and automatic domain renewal.
- Before any DNS change, inventory A, AAAA, CNAME, MX, SPF, DKIM, DMARC, other TXT records, and third-party validation records.
- Never change mail-related records as part of a portfolio deployment.
- Keep the production `workers.dev` route disabled.
- Protect Workers preview URLs with the Cloudflare Access **Previews only** scope.
- Keep the production custom domain public; Access applies only to previews.
- Leave browser analytics and persistent Workers logging disabled unless a separately approved change updates both the configuration and privacy documentation.

## Pull-request validation

The pull-request workflow must:

1. run without a Cloudflare or Access environment;
2. install dependencies with `npm ci`;
3. execute the repository's complete validation suite;
4. build no publishable deployment;
5. expose no deployment credential;
6. retain diagnostic artifacts only according to repository policy.

Pull-request code must never execute with deployment secrets.

## Private preview

An authorized maintainer triggers `workflow_dispatch` from the workflow definition on `main`, with an exact Git reference and an explicit preview alias.

The workflow must:

1. resolve and display the requested Git SHA;
2. install, validate, and build the requested reference with `SITE_NOINDEX=true` in a secret-free job;
3. transfer only `dist/` as an immutable artifact;
4. load trusted deployment tooling from `main` in a separate `preview` environment job;
5. revalidate the artifact before exposing the Cloudflare token;
6. upload an unpromoted version with `wrangler versions upload`;
7. verify that an anonymous request is rejected or redirected by Cloudflare Access;
8. run the authenticated preview smoke test;
9. retain the report, version URL, Workers version identifier, timestamp, and Git SHA as release evidence.

Run the smoke test locally only when the credentials are already available through an approved secure environment:

```sh
CF_ACCESS_CLIENT_ID=<secret> \
CF_ACCESS_CLIENT_SECRET=<secret> \
npm run test:deployment -- \
  --url https://<version>-<worker>.<subdomain>.workers.dev \
  --mode preview \
  --report deployment-reports/preview.json
```

Human preview review covers the affected French and English routes, language switching, themes, keyboard navigation, reduced motion, mobile layout, security headers, cache behavior, and the absence of external resources or unexpected cookies. Confirm both Access protection and `noindex`; neither replaces the other.

## Production deployment

A successful CI run for the current HEAD of `main` triggers the gated production workflow. The production job must:

1. build with `SITE_URL=https://ethanbrosselard.com` and `SITE_NOINDEX=false`;
2. verify immediately before deployment that the validated SHA is still the HEAD of `main`;
3. deploy through `wrangler deploy`;
4. associate the Git SHA with the deployment message;
5. retain the Workers deployment identifier and timestamp;
6. retry the read-only smoke test while the custom domain starts serving the new version;
7. fail if routes, metadata, headers, redirects, cookies, or cache policies violate the production contract.

Manual production command for verification:

```sh
npm run test:deployment -- \
  --url https://ethanbrosselard.com \
  --mode production \
  --check-http-redirect \
  --redirect-from https://www.ethanbrosselard.com \
  --report deployment-reports/production.json
```

Also confirm in a browser and from an external network:

- valid TLS certificate;
- permanent HTTP-to-HTTPS redirect;
- permanent `www`-to-apex redirect without a loop;
- preserved deep paths and query strings;
- one canonical origin;
- correct sitemap and `robots.txt`;
- real 404 response;
- expected security and cache headers;
- working French and English navigation;
- working light, dark, and system themes;
- no browser-console error;
- no Cloudflare Web Analytics beacon or unexpected response cookie.

## Release record

Archive the following after each production deployment:

```text
Version:
Date and time in Europe/Paris:
Git SHA:
Pull request:
Validated preview URL, when applicable:
Production URL:
Workers deployment identifier and timestamp:
CI run:
E2E, accessibility, link, and Lighthouse evidence:
Editorial approval:
Approved by:
Rollback target:
Notes:
```

## Rollback

Rollback is appropriate for a blank page, broken primary navigation, leaked information, a blocking CSP violation, an incorrect domain or canonical URL, a major accessibility regression, or widespread HTTP failures.

1. Pause new merges to `main`.
2. Identify the last validated production Workers version and its Git SHA from the release record.
3. In Cloudflare Workers & Pages, select that version and use **Rollback**. Use `npx wrangler rollback <version-id>` only with explicit authorization.
4. Confirm that the restored version receives all traffic without changing DNS, the custom domain, or TLS.
5. Immediately rerun the production smoke test and essential manual checks.
6. Create a dedicated branch and apply `git revert` to the faulty Git change.
7. Return through pull request, CI, preview when appropriate, and the normal production workflow so that `main` again matches production.
8. Record the cause, impact, duration, faulty SHA, restored version, and prevention work.

Do not delete the Worker, custom domain, or DNS records to resolve an application-level incident. The Workers rollback restores service; the Git revert restores the repository's declarative truth.

## Ongoing operations

- Review failed GitHub Actions runs and Workers deployments.
- Deploy only a validated SHA.
- Monitor the domain, managed certificate, redirects, and Cloudflare security alerts without adding user tracking.
- Track Cloudflare and Access token expiration.
- Repeat a controlled rollback exercise after a material deployment-pipeline change.
- Review the legal and privacy pages whenever hosting, logging, retention, security processing, third-party content, forms, or analytics change.
- Periodically review Cloudflare's Data Processing Addendum and subprocessors.

## Official references

- [Workers Static Assets](https://developers.cloudflare.com/workers/static-assets/)
- [Static-site routing and 404 pages](https://developers.cloudflare.com/workers/static-assets/routing/static-site-generation/)
- [Static Assets headers](https://developers.cloudflare.com/workers/static-assets/headers/)
- [GitHub Actions for Workers](https://developers.cloudflare.com/workers/ci-cd/external-cicd/github-actions/)
- [Workers preview URLs](https://developers.cloudflare.com/workers/versions-and-deployments/preview-urls/)
- [Cloudflare Access for Workers](https://developers.cloudflare.com/workers/configuration/cloudflare-access/)
- [Access service tokens](https://developers.cloudflare.com/cloudflare-one/access-controls/service-credentials/service-tokens/)
- [Workers custom domains](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/)
- [Redirect between `www` and the apex](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/#redirect-between-www-and-root-domain)
- [Always Use HTTPS](https://developers.cloudflare.com/ssl/edge-certificates/additional-options/always-use-https/)
- [Workers rollbacks](https://developers.cloudflare.com/workers/versions-and-deployments/rollbacks/)
- [Cloudflare Privacy Policy](https://www.cloudflare.com/policies/privacy/)
- [Cloudflare Data Processing Addendum](https://www.cloudflare.com/cloudflare-customer-dpa/)

## Proving the delivered artifact

After an authorized deployment, run the smoke test against the exact retained build:

```sh
npm run test:deployment -- --url https://ethanbrosselard.com --mode production --artifact-directory dist --revision <full-deployed-sha> --check-http-redirect --redirect-from https://www.ethanbrosselard.com --report deployment-reports/production.json
```

Both CI deployment workflows supply these artifact options. The report records SHA, aggregate artifact hash, number of matching files and the actual hashes of both PDFs. A missing PDF, HTML fallback, truncated PDF or older artifact fails. Without the artifact options, a manual smoke test proves availability and metadata only. Keep the successful CI run URL, deployment/version identifier and previous known-good deployment alongside this report for rollback; do not infer a Cloudflare version ID from a Git commit.

## Reproducing WebKit checks locally

Playwright's test server uses Astro's programmatic preview API to stay in the test process group even in agent environments. If the host is missing WebKit's system libraries, the already available matching browser image can run the suite without changing the host:

```sh
docker run --rm --init --ipc=host --user 1000:1000 --volume "$PWD:/work" --workdir /work mcr.microsoft.com/playwright:v1.62.1-noble@sha256:dcc5531e97840b9b5e794f2814476b21571c5124a3fca2267d73041f56e7580e node node_modules/@playwright/test/cli.js test --project=webkit --project=mobile-webkit --workers=4
```

Use the image matching the pinned Playwright version and the local user's UID. This is a test environment, not a deployment container. Run after native browser tests, since both suites own the same preview port and reports.

Review every `inconclusive` entry in the CI external-link report in a normal browser. Record the URL, observation date and outcome; HTTP 999 from LinkedIn is an anti-bot response, not a successful verification. Recheck real broken links before replacing an approved public URL.

The preview deploy job reads the requested revision's MDX, route JSON, CSS tokens and design documentation from a separate sparse checkout (`PORTFOLIO_CONTENT_ROOT`). Trusted validation scripts and schemas still execute from `main`. This lets a preview add a bilingual project without comparing its route catalog against an older `main`; no preview JavaScript is executed with deployment credentials.
