<!-- Generated: 2026-09-02 | Files scanned: 317 | Token estimate: ~359 -->

# Architecture

## Shape and boundaries

Single-package Next.js 15.5 App Router application (`package.json`); `@/*` maps to `src/*`.

```text
src/app                    routes, layouts, metadata, sitemaps, route-local UI
src/components/ui          shared shadcn primitives
src/components/custom-ui   product-wide UI and Query provider
src/lib/api                REST, DatoCMS, session, cookie, and upload clients
src/lib/hooks              TanStack Query keys/options and mutations
src/lib/types              shared domain/response contracts
src/lib/{metadata,schema}  SEO metadata and JSON-LD builders
public                     static assets
```

Entry points are `src/app/layout.tsx`, the `(client)`, `(auth)`, and `(admin)` layouts, `src/middleware.ts`, `src/instrumentation.ts`, and `instrumentation-client.ts`.

## Runtime flow

```text
Browser -> App Router page/layout
        -> server component -> src/lib/api -> REST API / DatoCMS
        -> client component -> src/lib/hooks -> TanStack Query -> src/lib/api
        -> image upload -------------------------------> REST S3 endpoint

/admin* -> middleware -> verify/refresh session -> route layout/guard -> admin UI
```

`src/components/providers.tsx` supplies theme, TanStack Query, and toast state. `src/app/(client)/layout.tsx` adds the public header/footer and Google Analytics. The admin layout owns its fixed navigation and content scroll boundary.

## Domain entry points

- Properties: `src/app/**/properties`, `src/lib/{api,hooks,types}/properties.ts`.
- Agents/auth: `src/app/**/agents`, `src/app/(auth)/auth`, `src/lib/api/{agents,token,verified-viewer,viewer-session}.ts`.
- Developers: admin routes plus `src/lib/{api,hooks,types}/developers.ts`.
- Leads: admin table and public contact dialog plus `src/lib/{api,hooks,types}/leads.ts`.
- Articles: `src/app/(client)/blog`, `src/lib/api/{articles,gql}.ts`, `src/lib/types/article.ts`.

## Build, test, deploy

`yarn dev`/`start` use port 4137; `yarn build` creates Next standalone output. `next.config.mjs` wraps the build with Sentry. `Dockerfile` builds on Node 22 Alpine and runs `server.js`; Compose maps host `4137` to container `3000`.

Focused `node:test` files are colocated as `*.test.cjs`; TypeScript verification is `yarn tsc --noEmit --pretty false`. Production builds require configured environment variables and reachable REST/DatoCMS data used by prerendered sitemap routes.
