# Next.js 16 migration verification

## Versions and behavior

- Next.js, third-party integrations, and Next ESLint config: 16.4.2.
- Sentry: 10.76.2; ESLint: 9.39.5; Yarn: 1.22.22.
- Webpack remains explicit for development and production. Docker remains Node 22 Alpine.
- Proxy uses Node.js and retains the existing admin matcher, cookie rotation, and failure behavior. Downstream admin guards remain responsible for authorization.
- Public API contracts, data caching, sitemap caching, and React Compiler settings are unchanged. Image minimum cache TTL remains 60 seconds.
- The published Next.js package still exports `unstable_doesMiddlewareMatch`, so matcher tests use that export rather than the unavailable `unstable_doesProxyMatch` documented online.

## Baseline and known blockers

The clean Next.js 15.5.28 baseline passed TypeScript checking but failed six of 123 Node tests. These same failures must not be counted as migration regressions:

| Test | Existing cause |
| --- | --- |
| Property schema core values | Fixture lacks required nullable `developer_id`. |
| Property schema rent/cover | Same incomplete fixture. |
| Related-property regency query | Expected query omits the existing `limit: 3`. |
| Homepage Suspense shell | Import stubs reference the previous homepage component structure. |
| Static AI catalog refresh | Expected generator script and package scripts do not exist. |
| Homepage identity JSON-LD | Assertion expects an old variable instead of the current inline schema call. |

These failures are left for a separate correction; release acceptance still needs them resolved or explicitly accepted.

The new lint preset also reports nine compiler diagnostics in existing components and three internal-navigation warnings. Compiler diagnostics are warnings only in the affected files; the rules remain errors elsewhere. No components were rewritten to silence these findings.

## Verification

Checks used: `yarn lint`, `yarn next typegen`, `yarn tsc --noEmit --incremental false`, `yarn build`, and `node --test` with every `src/**/*.test.cjs` file supplied explicitly.

- Next route type generation and TypeScript checking pass.
- Proxy tests: 7/7 pass, including token rotation, missing-token redirect, failed refresh, and API errors.
- Full Node suite: 122/128 pass; the six failures match the baseline above.
- ESLint: zero errors, 12 warnings.
- Local Webpack production build passes, including standalone output and the Proxy route.
- Browser checks pass for the login UI and empty bookmark/comparison states. HTTP checks pass for unauthenticated admin redirection, root/blog sitemap XML, robots.txt, and local banner image optimization.
- The configured REST API at localhost:8000 is unavailable. Homepage rendering therefore errors, and the property-filter sitemap returns 503. Live listings, details, filters, roles, editing, and uploads remain unverified.
- Docker production build passes with frozen-lockfile installation and the lint gate. The `primeproperty-next16:local` image starts its standalone server successfully; seven HTTP smoke checks pass for login, admin redirection, bookmark/comparison shells, sitemap, robots.txt, and optimized images. The temporary container was stopped afterward.
- Independent static review found no actionable migration regressions.

Validation disables Sentry uploads/events; Docker validation also disables analytics. No public source-map files remain after the local build. The local environment has no Sentry DSN or upload token, so live Sentry delivery and source-map symbolication require a staging check with authorized credentials.

Docker retains existing warnings about credentials passed as build arguments and the unset local Server Actions encryption-key argument. Production build-secret handling was not redesigned in this migration.

## Release checklist

- Run all Node tests, lint, type generation, and TypeScript checking.
- Build the Docker image with configured REST/DatoCMS build arguments and smoke-test the standalone runtime.
- Verify public listing/filter/detail pages, blog, XML sitemaps, images, metadata, bookmarks, and comparison.
- In staging, verify login/logout, expired sessions, admin/agent roles, editing, uploads, and Sentry browser/server events with readable stack traces.
- Keep the previous deployed image digest available for rollback. Do not deploy until the known blockers and unverified staging flows are accepted.

No commit or deployment is part of this migration execution.
