# Control of external links — August 2, 2026

## Scope

`npm run check:links` builds the site then extracts the HTTPS destinations published in the generated documents. The check fails when a target is confirmed absent with a status `404` or `410`; network denials, rate limitations and anti-automation protections remain inconclusive in order to avoid false positives.

Command executed:

```sh
npm run check:links
```

## Results

| Destination                                               | Result | Conclusion                                |
| --------------------------------------------------------- | ------ | ----------------------------------------- |
| `https://github.com/ZayKox`                               | `200`  | accessible target                         |
| `https://www.linkedin.com/in/ethan-brosselard-507334237/` | `999`  | anti-automation refusal, uncertain result |

No permanently broken targets were detected among the two published HTTPS links.

## Limits

The LinkedIn status `999` does not prove that the profile is missing or that it is accessible to all visitors. The link must be opened manually in a browser during the private rehearsal and then the production acceptance test.

Links `mailto:` are structurally validated by the build and tested by Playwright, but do not intentionally trigger any email sending during this review.
