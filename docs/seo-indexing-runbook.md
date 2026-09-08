# SEO, indexing, and portfolio visibility runbook

This document describes how to publish the portfolio with correct technical SEO signals, register it with Google, and monitor indexing. The [`deployment runbook`](deployment-runbook.md) remains the source for previews, deployment credentials, production releases, and rollback.

Never store a token, DNS validation value, Cloudflare identifier, or other private account value in this document or repository.

## Status on September 8, 2026

The first indexable production release completed the following work:

- GitHub Actions built production with `SITE_URL=https://ethanbrosselard.com` and `SITE_NOINDEX=false`.
- The canonical origin is `https://ethanbrosselard.com/`.
- HTTP permanently redirects to HTTPS.
- `https://www.ethanbrosselard.com/` permanently redirects to the canonical origin.
- `https://ethanbrosselard.com/sitemap-index.xml` is published and referenced by `robots.txt`.
- The home page publishes a canonical URL, language alternates, an Open Graph URL, and absolute JSON-LD URLs.
- The Google Search Console Domain property for `ethanbrosselard.com` was verified.
- The sitemap was submitted and indexing was requested for the home page.

These signals help search engines discover and interpret the site. They do not guarantee a crawl date, indexing date, or ranking.

## 1. Build an indexable production release

Do not normally publish from a local workstation with `wrangler deploy`. A local build can omit `SITE_URL`, which intentionally removes canonical URLs, the sitemap, and other absolute metadata.

Use the normal flow:

```text
short-lived branch → pull request → CI → merge to main → Deploy production
```

The production workflow must use:

```text
SITE_URL=https://ethanbrosselard.com
SITE_NOINDEX=false
```

Before a production release, verify in GitHub:

1. `CLOUDFLARE_PRODUCTION_ENABLED` is intentionally set to `true`.
2. The `production` environment contains `CLOUDFLARE_ACCOUNT_ID` and `CLOUDFLARE_API_TOKEN`.
3. The `production` environment remains restricted to `main` and retains required human approval.
4. The CI run belongs to the exact SHA that will be deployed.

To redeploy a SHA already at the HEAD of `main`, rerun the successful CI workflow triggered by the corresponding `push`. The successful CI run then triggers **Deploy production**.

## 2. Protect the Cloudflare production token

Use a dedicated least-privilege token based on Cloudflare's **Edit Cloudflare Workers** template. Limit zone-related permissions to `ethanbrosselard.com` and avoid unrelated account permissions.

Do not apply an IP restriction because GitHub-hosted runners do not have one stable outbound address. Store the token only as `CLOUDFLARE_API_TOKEN` in the protected GitHub `production` environment. Never place it in a local file, report, log, issue, pull request, or message.

After a validated token rotation, revoke the previous token only after confirming that no environment still uses it.

## 3. Preserve canonical redirects

The apex without `www` is the only canonical origin. `www` must never serve a duplicate copy.

1. Keep a proxied Cloudflare DNS record for `www`, reserved for redirection.
2. Keep a permanent Redirect Rule targeting only `www.ethanbrosselard.com` and sending requests to `https://ethanbrosselard.com` while preserving the path and query string.
3. Keep **Always Use HTTPS** enabled under **SSL/TLS > Edge Certificates**, or use one equivalent permanent Redirect Rule.
4. Do not add overlapping redirect rules that can create loops.
5. Do not modify MX, SPF, DKIM, DMARC, or other TXT records when maintaining web redirects.

A Cloudflare dynamic redirect target can use:

```text
concat("https://ethanbrosselard.com", http.request.uri.path)
```

Use status `301` and preserve the query string.

## 4. Validate production before search submission

Run the read-only smoke test:

```sh
npm run test:deployment -- \
  --url https://ethanbrosselard.com \
  --mode production \
  --check-http-redirect \
  --redirect-from https://www.ethanbrosselard.com
```

Expected results:

| Address or signal                  | Expected result                                             |
| ---------------------------------- | ----------------------------------------------------------- |
| `http://ethanbrosselard.com/`      | Permanent redirect to `https://ethanbrosselard.com/`.       |
| `https://www.ethanbrosselard.com/` | Permanent redirect to the apex.                             |
| `/sitemap-index.xml`               | HTTP 200 with the generated sitemap index.                  |
| `/robots.txt`                      | References `https://ethanbrosselard.com/sitemap-index.xml`. |
| Home page                          | Canonical URL is `https://ethanbrosselard.com/`.            |
| French and English pairs           | Reciprocal `hreflang` alternates resolve correctly.         |
| 404                                | Returns the rendered bilingual page with HTTP 404.          |

Also review representative French and English routes, keyboard navigation, themes, and the browser console according to the [`deployment runbook`](deployment-runbook.md#production-deployment).

## 5. Configure Google Search Console

Use a Domain property so that one property covers HTTP, HTTPS, apex, and `www` variants.

1. Open [Google Search Console](https://search.google.com/search-console/about).
2. Select **Add property**, then **Domain**.
3. Enter `ethanbrosselard.com` without a protocol or `www`.
4. Copy the TXT verification value supplied by Google.
5. Add it in Cloudflare DNS at the apex without deleting any existing TXT record.
6. Return to Search Console and select **Verify**.

Do not record the TXT verification value in this repository.

## 6. Submit the sitemap and request indexing

In the verified Domain property:

1. Open **Sitemaps**.
2. Submit the complete URL:

   ```text
   https://ethanbrosselard.com/sitemap-index.xml
   ```

3. Wait for a successful fetch result. Successful retrieval does not mean that every page is immediately indexed.
4. Open **URL inspection** for `https://ethanbrosselard.com/`.
5. Run **Test live URL**, then select **Request indexing**.

Do not repeatedly request indexing for the same unchanged URL. Use URL inspection selectively for high-priority pages; the sitemap provides discovery for the remaining routes.

## 7. Monitor indexing

New Search Console properties can initially show **Processing data**. After Google has had time to crawl the site, review:

- **Pages** for indexed pages and exclusion reasons;
- **URL inspection** for the declared and Google-selected canonical URLs;
- **Sitemaps** for retrieval or parsing failures;
- **Performance** for early impressions, clicks, and queries;
- **Core Web Vitals** only after enough field data exists.

The following searches are indicative discovery checks, not ranking measurements:

```text
site:ethanbrosselard.com
"Ethan Brosselard"
```

Add `https://ethanbrosselard.com/` to relevant public GitHub and LinkedIn profiles if desired. Do not buy links, create fake profiles, or add the site to low-quality artificial directories.

## Troubleshooting

| Symptom                                                        | Likely cause                                                      | Safe action                                                                                                                 |
| -------------------------------------------------------------- | ----------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| Canonical URLs, sitemap, or absolute social URLs are missing.  | Build ran without `SITE_URL`.                                     | Redeploy through GitHub Actions with the production variables.                                                              |
| `Authentication error [code: 10000]` during `wrangler deploy`. | Production token is invalid, insufficient, or scoped incorrectly. | Create a new dedicated least-privilege token, replace the protected environment secret, and rerun only the failed workflow. |
| HTTP returns 200 instead of redirecting to HTTPS.              | HTTPS enforcement is disabled or incomplete.                      | Enable **Always Use HTTPS**, wait for propagation, and rerun the smoke test.                                                |
| `www` does not redirect or loses the path/query string.        | The DNS proxy or Redirect Rule is incomplete.                     | Check the proxied `www` record, hostname condition, target expression, and query-string preservation.                       |
| Search Console rejects the sitemap address.                    | The submitted address is incomplete.                              | Submit the complete absolute HTTPS sitemap URL.                                                                             |
| Google selects an unexpected canonical.                        | Duplicate access path, stale crawl, or inconsistent metadata.     | Verify redirects and alternates, inspect the live URL, and allow time for recrawling after correction.                      |

## References

- [Google Search Console: Sitemaps report](https://support.google.com/webmasters/answer/7451001)
- [Google Search: Ask Google to recrawl a URL](https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl)
- [Cloudflare: Deploy Workers with GitHub Actions](https://developers.cloudflare.com/workers/ci-cd/external-cicd/github-actions/)
- [Cloudflare: Redirect one hostname to another](https://developers.cloudflare.com/rules/url-forwarding/examples/redirect-all-different-hostname/)
- [Cloudflare: Always Use HTTPS](https://developers.cloudflare.com/ssl/edge-certificates/additional-options/always-use-https/)
