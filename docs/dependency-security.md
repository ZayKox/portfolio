# Dependency security gate

The CI audit remains `npm audit --audit-level=high`. No finding is allowlisted and the threshold is unchanged. Do not use `npm audit fix --force` to downgrade Astro to an incompatible major version.

On October 3, 2026, compatible updates to Astro 7.3.5, MDX 8.0.2 and Wrangler 4.147.0, with refreshed transitive dependencies, removed the devalue, fast-uri and Miniflare/Undici findings.

[GHSA-ch52-4w7c-c8xp](https://github.com/advisories/GHSA-ch52-4w7c-c8xp) still lists no patched upstream release for `http-cache-semantics` through 4.2.0. npm previously reported three high-severity package entries for this one advisory: the library and its Astro/MDX dependents.

The portfolio now installs a reviewed local security fork through an explicit npm override. `vendor/http-cache-semantics/` preserves the 4.2.0 code and BSD license, with a guard that prevents security-restricted entries from being reused through `max-stale`, `stale-while-revalidate` or `stale-if-error`. The package has an explicit private fork identity, source fingerprint and removal instructions; it does not pretend to be an official patched version. See its [provenance and patch description](../vendor/http-cache-semantics/README.md).

`npm run test:cache-security`, included in `verify` and run before the CI audit, resolves the exact dependency used by Astro. It checks shared cookies, proxy revalidation, no-cache/no-store/private responses, authorization, wildcard Vary, must-revalidate, serialization and stale fallback. Compatibility cases check public freshness, existing cookie opt-ins, private caches and ETag revalidation. The original 4.2.0 reproduces the reported cookie/proxy max-stale bypass; the local fork rejects it.

The installed dependency graph passes the unchanged high-severity audit. This resolves the local dependency blocker; the upstream advisory remains open. Production still requires all release gates and explicit deployment authorization. The portfolio remains static and uses local images; the corrected library is build tooling, not a production application cache.

When an official fix is published, remove the override and vendor directory, refresh the lockfile, adjust the installed-package identity test, regenerate both PDFs and rerun audit, verification and browser checks. Do not remove the behavioral security regressions.
