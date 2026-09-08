# Automated WebKit review — August 2, 2026

## Scope

This evidence complements the local Chromium and Firefox review. It covers the Playwright projects `webkit` (Desktop Safari profile) and `mobile-webkit` (iPhone 13 profile) on the twelve French and English public routes.

It is not a test on Safari macOS, a real iPhone, or a WebKit engine provided by Apple. This material evidence remains explicitly absent.

## Environment

- Playwright: `1.62.1`;
- official image: `mcr.microsoft.com/playwright:v1.62.1-noble`;
- observed digest: `sha256:dcc5531e97840b9b5e794f2814476b21571c5124a3fca2267d73041f56e7580e`;
- workspace mounted read/write with local user `1000:1000`;
- host system unchanged: native installation of WebKit libraries was aborted when `sudo` requested an interactive password.

Command executed:

```sh
docker run --rm --init --ipc=host \
  --user 1000:1000 \
  --env HOME=/tmp \
  --volume /home/ethan/Development/portfolio:/work \
  --workdir /work \
  mcr.microsoft.com/playwright:v1.62.1-noble@sha256:dcc5531e97840b9b5e794f2814476b21571c5124a3fca2267d73041f56e7580e \
  npx playwright test --project=webkit --project=mobile-webkit
```

## Result

- 36 tests passed;
- 12 tests ignored by their project conditions;
- 0 failures;
- Playwright duration: 18.9 s.

The checks carried out cover in particular:

- rendered without runtime errors, CSP violations or serious/critical axe violations on all twelve routes in both profiles;
- theme preference and persistence;
- main link destinations;
- true bilingual 404 page;
- keyboard avoidance link;
- reduction of animations;
- absence of horizontal overflow in mobile emulation;
- primary touch targets of at least 44 px in mobile emulation.

Ignored scenarios are intentionally limited to other profiles by the Playwright Suite, for example Chromium budgets, keyboard-only desktop controls, or mobile controls run only on the corresponding mobile project.

## Conclusion

The automated WebKit desktop and mobile matrix is green for the tested state. This dated report did not claim testing on a physical Android phone or on Safari running on an actual iPhone.
