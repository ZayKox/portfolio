# Production dependency audit — August 2, 2026

## Command

```sh
npm audit --omit=dev --audit-level=high --json
```

The command queries the npm registry security advisory database starting from `package-lock.json` and excludes dependencies used only during development.

## Result

| Severity  | Known vulnerabilities |
| --------- | --------------------- |
| Info      | 0                     |
| Low       | 0                     |
| Moderate  | 0                     |
| High      | 0                     |
| Review    | 0                     |
| **Total** | **0**                 |

The command exited with code `0`. The npm metadata has 320 production dependency entries in the audited resolution.

## Limits

This result describes only the advisories known to npm at the time of the check. He
does not cover omitted development dependencies, Docker images then
plans, the host system, a misconfiguration or a vulnerability still
unknown. Since the target migration, the CI audits the complete installed tree,
Wrangler included, and Dependabot monitors npm and GitHub actions. The
Wrangler configuration, managed Cloudflare platform and permissions
deployment token are subject to separate checks; this historic report
does not validate future production Workers.

No automatic fixes or major updates were applied during this audit.
