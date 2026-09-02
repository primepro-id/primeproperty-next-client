<!-- Generated: 2026-09-02 | Files scanned: 317 | Token estimate: ~378 -->

# Backend Surface

This repository is a frontend/BFF client. It contains no business API controllers, services, repositories, or database. `src/lib/api` calls external services from server and client module graphs.

## In-repo server boundaries

- `src/middleware.ts`: protects `/admin*`; verifies `accessToken`, refreshes with `refreshToken`, rotates cookies, and redirects missing access tokens to `/auth`.
- `src/lib/api/token.ts`: server cookie read/write/delete helpers (`use server`).
- `src/lib/api/verified-viewer.ts`: server-side session verification before trusting viewer roles (`use server`).
- `src/lib/api/articles.ts`: server-only Apollo/DatoCMS fetches (`use server`).
- Route handlers only generate property sitemap XML: `properties/filter/sitemap.xml/route.ts` (index) and `properties/filter/sitemaps/[chunk]/route.ts` (URL set).

## External REST client

`src/lib/api/fetch-api.ts` prefixes requests with `NEXT_PUBLIC_API_URL`, sends JSON by default, parses JSON, and throws on non-2xx responses.

| Module | Durable endpoint surface |
| --- | --- |
| `agents.ts` | `/agents`, `/agents/{id}`, `/agents/fullname/{name}`, signin, password reset, session verify/refresh/remove |
| `properties.ts` | `/properties`, `/properties/{id}`, join-agents, site-paths, navigations |
| `developers.ts` | `/developers`, `/developers/{id}` |
| `leads.ts` | create/list `/leads`; optional agent filtering |
| `s3.ts` | multipart image upload at `/s3/images` |

Protected create/update/delete/list operations read the cookie with `getAccessToken()` and send `x-access-token`. `src/lib/api/viewer-session.ts` normalizes verified viewer/session responses for route guards.

## Query and mutation boundary

`src/lib/hooks/{agents,developers,leads,properties,s3,token,verified-viewer}.ts` owns TanStack Query key families, query options, mutation options, and invalidation contracts. Domain UI should consume these rather than constructing cache keys ad hoc.

## Environment and external services

`src/lib/env.ts` validates all runtime variables with `@t3-oss/env-nextjs` and Zod.

- REST/session API: `NEXT_PUBLIC_API_URL`.
- Public asset URLs: `NEXT_PUBLIC_S3_ENDPOINT`.
- DatoCMS GraphQL: `DATOCMS_API_URL`, `DATOCMS_API_TOKEN`.
- Sentry: `NEXT_PUBLIC_SENTRY_DSN`, `SENTRY_AUTH_TOKEN`.
- Canonical URLs/analytics: `NEXT_PUBLIC_HOST_URL`, `NEXT_PUBLIC_GA_ID`.

No local queue, cron worker, webhook receiver, mail route, or persistence service was detected.
