# Portfolio — Ethan Brosselard

Bilingual static portfolio for Ethan Brosselard, built with Astro, strict TypeScript, Tailwind CSS, and typed MDX content collections.

The public site is available at <https://ethanbrosselard.com>. French is served at the root and English under `/en/`.

## Local development

```sh
nvm use
npm install
npm run dev
```

## Validation

```sh
npm run verify
npm run test:e2e
npm run test:lighthouse
npm run check:links
```

Install the supported browser engines when required:

```sh
npx playwright install --with-deps chromium firefox webkit
```

`npm run verify` checks formatting, the Node/npm toolchain, bilingual project parity, media provenance, resume PDF freshness, redirect logic, Astro and TypeScript diagnostics, and three build modes:

- an indexable build with a reserved HTTPS origin;
- a fully `noindex` preview build;
- a build without `SITE_URL`, which must not emit misleading absolute metadata.

For a production-style local build, provide an HTTPS origin without a path:

```sh
SITE_URL=https://example.com SITE_NOINDEX=false npm run build
```

Brand assets are deterministic PNG files generated from the Violet Field visual system:

```sh
npm run generate:brand-assets
```

The generated favicon, Apple touch icon, general social card, and project social cards remain versioned in `public/`. Their source, dimensions, byte budgets, and SHA-256 hashes are recorded in [`docs/media-provenance.json`](docs/media-provenance.json).

The HTML and PDF resumes share one structured source. Regenerate both PDFs after a relevant source change:

```sh
npm run generate:resume-pdfs
```

## Deployment verification

The same read-only smoke-test engine validates preview and production Workers deployments.

Preview:

```sh
npm run test:deployment -- \
  --url https://staging-portfolio.account-subdomain.workers.dev \
  --mode preview \
  --report deployment-reports/preview.json
```

Production:

```sh
npm run test:deployment -- \
  --url https://ethanbrosselard.com \
  --mode production \
  --check-http-redirect \
  --redirect-from https://www.ethanbrosselard.com \
  --report deployment-reports/production.json
```

Preview smoke tests can authenticate through Cloudflare Access with `CF_ACCESS_CLIENT_ID` and `CF_ACCESS_CLIENT_SECRET`. These values belong only in protected GitHub environment secrets and must never be stored in the repository or reports.

Production uses `SITE_URL=https://ethanbrosselard.com` and `SITE_NOINDEX=false`. Previews use `SITE_NOINDEX=true` and remain protected by Cloudflare Access. The site enables no browser-side analytics, tracking cookies, form, account, or embedded third-party content.

## Repository structure

- `src/pages/`: French and English routes.
- `src/components/pages/`: page implementations shared across languages.
- `src/content/projects/`: one MDX entry per project and language.
- `src/data/profile.ts`: shared public identity and links.
- `src/data/resume.json`: structured bilingual resume content.
- `src/i18n/copy.ts`: localized interface copy.
- `src/styles/global.css`: Violet Field tokens and global behavior.
- `docs/content-backlog.md`: missing or optional editorial inputs.
- `docs/production-plan.md`: current post-launch roadmap.
- `docs/deployment-runbook.md`: preview, production, and rollback procedure.
- `skills/maintain-portfolio/`: repository-specific maintenance instructions.

The portfolio build never depends on the local Palimia or Ludosaic repositories. Approved text and media must be curated into this repository.
