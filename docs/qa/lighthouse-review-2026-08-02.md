# Synthetic Lighthouse audit — August 2, 2026

## Scope

Local mobile audit of the four representative pages of milestone A:

- home `/`;
- list `/projets/`;
- preview `/projets/myverse/`;
- preview `/projets/filtre-appels/`.

The build uses `SITE_URL=https://portfolio.example` and `SITE_NOINDEX=false` to reproduce indexable metadata. The pages are then served on a temporary local origin for measurement.

## Environment and thresholds

- Lighthouse: `13.4.1`;
- browser: Headless Chrome `151.0.0.0` via Playwright;
- profile: mobile;
- slowdown: Lighthouse simulation of network and processor;
- minimum scores: 95 for performance, accessibility, best practices and SEO;
- Maximum LCP: 2500 ms;
- Maximum CLS: 0.1;
- Maximum TBT: 200 ms.

Command executed:

```sh
npm run test:lighthouse
```

## Results

| route                     | Performance | Accessibility | Best practices | SEO | LCP   | CLS   | TBT |
| ------------------------- | ----------- | ------------- | -------------- | --- | ----- | ----- | --- |
| `/`                       | 100         | 100           | 100            | 100 | 903ms | 0.000 | 0ms |
| `/projets/`               | 100         | 100           | 100            | 100 | 903ms | 0.000 | 0ms |
| `/projets/myverse/`       | 100         | 100           | 100            | 100 | 902ms | 0.000 | 0ms |
| `/projets/filtre-appels/` | 100         | 100           | 100            | 100 | 903ms | 0.000 | 0ms |

The four pages respect all the blocking thresholds configured in `scripts/run-lighthouse.mjs`.

## Limits

This evidence is a local, one-off laboratory measurement. It does not prove
neither Cloudflare Workers network performance nor INP and Core Web
Field vitals. The audit must be repeated on a Preview Workers protected by
Access then `https://zaykohub.com`, and the real data cannot be
interpreted only after a sufficient volume of visits.

Detailed HTML and JSON reports remain in `lighthouse-reports/`, ignored by Git, so as not to version large, machine-dependent artifacts.
