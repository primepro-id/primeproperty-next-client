<!-- Generated: 2026-09-02 | Files scanned: 317 | Token estimate: ~360 -->

# Dependencies

## Package graph

One private package (`inception-next`) with no workspace configuration or internal package dependencies. Yarn lockfile is committed.

```text
Next 15.5 + React 19
|-- app/rendering: next, react, react-dom, sharp
|-- server state: @tanstack/react-query
|-- tables/forms: @tanstack/react-table, react-hook-form, zod, @hookform/resolvers
|-- UI: shadcn primitives over Radix/Base UI, Tailwind, CVA, clsx, tailwind-merge
|-- content: @apollo/client, graphql
|-- auth/transport: jsonwebtoken, qs
`-- platform: @sentry/nextjs, @next/third-parties, next-themes
```

`src/components/ui` currently mixes Radix packages with `@base-ui/react`; component files, not dependency presence, determine the active primitive for a given control.

## External systems

| System | Evidence/boundary |
| --- | --- |
| PrimeProperty REST API | `NEXT_PUBLIC_API_URL`, `src/lib/api/fetch-api.ts` |
| DatoCMS GraphQL | Apollo client in `src/lib/api/articles.ts` |
| S3-backed image service | `/s3/images`, `NEXT_PUBLIC_S3_ENDPOINT` |
| Sentry | client/server/edge instrumentation and `next.config.mjs` wrapper |
| Google Analytics | `@next/third-parties` in public layout |

Dependencies alone do not establish use of a database, queue, mail delivery, or deployment vendor.

## Tooling

- TypeScript 5.9; path alias `@/* -> src/*`.
- Tailwind CSS 3, PostCSS, Prettier, ESLint, Husky.
- Tests use Node's built-in test runner through colocated `*.test.cjs`; there is no package-level `test` script.
- `components.json` configures shadcn generation; reusable primitives live in `src/components/ui`.

## Build and deployment

`yarn build` invokes `next build`; `next.config.mjs` enables standalone output and Sentry source-map processing. Docker uses Node 22 Alpine in builder/runtime stages. Runtime starts `server.js` on container port 3000; Compose exposes host port 4137. Build arguments mirror environment variables because validation and external-data sitemap generation execute during the build.
