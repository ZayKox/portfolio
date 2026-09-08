# Reproducibility from tracked sources — August 2, 2026

## Scope

- Revision inspected: `87e1dab51cabc0f434df5a4b7bc5c2b5a6d616f0`.
- Source: archive created with `git archive HEAD` in a temporary folder separate from the workspace.
- Environment: Node.js 22.23.0, npm 10.9.8 and local Docker engine.

The initial archive did not contain `node_modules/`, `dist/`, `.astro/`, or untracked files. It therefore only represented the files saved in the inspected commit.

## Clean install

`npm ci` installed 532 packages from `package-lock.json`, without reusing the workspace dependencies folder. The command ended with zero vulnerabilities reported out of the 533 packages audited during installation.

## Validation of the repository

`npm run verify` was completely successful in the archive:

- Prettier compliant formatting;
- origin of the three compliant media and no embedded font;
- Astro and TypeScript control: 39 files, zero errors, warnings or hints;
- indexable build with test HTTPS origin;
- preview build entirely `noindex`;
- build without `SITE_URL` and without fake domain;
- for each variant: 13 HTML documents, 12 reachable routes and 15 validated internal references.

## Container validation

The public and preview images were then built from this same archive, without access to the original workspace files.

| Fashion | Constructed image                                                         | Result                                                                                                              |
| ------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| Public  | `sha256:b92b131c771db0415a437124fefdf3112e0b7ce3d62d3916fcefb4bfb1c88c2c` | 12 bilingual routes, real 404, icons, canonical, JSON-LD, sitemap, social card and absence of cookies validated     |
| Preview | `sha256:add18e0cad6e7de9b738d363b1050927c215e968d049f4cb650adf8acae66337` | 12 bilingual routes, real 404, icons, removal of indexing signals, ban on crawling and absence of cookies validated |

Temporary containers and images were automatically deleted by the validation script after the checks.

## Conclusion and limits

The build and container of the inspected commit do not depend on any file
followed by the local workspace. This historical proof remains valid for the
reproducibility of the commit checked, but it precedes the migration and does not validate
neither the Wrangler configuration nor the first Workers deployment.

It does not replace remote rehearsal: `npm ci`, build, headers,
the preview URL, the SHA sent and the absence of indexing must still be
confirmed by GitHub Actions and on a Workers version protected by Access. The
full release repeat will also be replayed on its final SHA.
