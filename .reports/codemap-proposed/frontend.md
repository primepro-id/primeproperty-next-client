<!-- Generated: 2026-10-16 | Files scanned: 358 | Token estimate: ~556 -->

# Frontend

## App Router tree

Route groups do not affect URLs.

```text
src/app
|-- layout.tsx                      root fonts, global CSS, Providers
|-- (client)/layout.tsx             public header/main/footer + analytics
|   |-- page.tsx                    /
|   |-- about/page.tsx              /about
|   |-- agents/{page,[name]/page}   /agents, /agents/[name]
|   |-- blog/{page,[slug]/page}     /blog, /blog/[slug]
|   |-- franchise/page.tsx          /franchise
|   |-- jobs/page.tsx               /jobs
|   `-- properties/
|       |-- page.tsx                /properties
|       |-- [id]/page.tsx           /properties/[id]
|       |-- filter/[...params]      SEO path filters
|       |-- bookmark/page.tsx       local bookmarks
|       `-- comparison/page.tsx     two-property comparison
|-- (auth)/auth/
|   |-- page.tsx                    /auth
|   |-- forgot-password/page.tsx    /auth/forgot-password
|   `-- reset-password/page.tsx     /auth/reset-password?token=...
`-- (admin)/admin/
    |-- page.tsx                    redirects to /admin/properties
    |-- agents/{page,new,[agentId]} list/create/edit
    |-- blog/images/page.tsx       image uploads
    |-- leads/page.tsx              role-filtered read-only table
    `-- properties/{page,new,[propertyId]} list/create/edit
```

Sitemaps live at `src/app/sitemap.ts` and beside agents, blog, and properties. Property filter sitemap route handlers use a cached manifest and bounded XML chunks.

## Component hierarchy

- `src/components/ui`: shared shadcn primitives; reuse before adding a base component.
- `src/components/custom-ui`: cross-route product components and TanStack provider.
- Route `_components`: feature-local composition; route `_lib`: pure metadata, parsing, authorization, URL-state, form-domain, and sitemap helpers.
- Property listing components under `(client)/properties/_components` are reused by home, agent, blog, bookmark, comparison, and property pages. Bookmark and comparison actions are separate components.
- Property cards, galleries, dialogs, and comparisons share `src/lib/property-image.ts` and `public/images/property-placeholder.svg`; missing covers are handled without changing image indices.
- FAQ content/schema is shared; `video-thumbnail.tsx` sets browser-supported iframe permissions before assigning the YouTube URL. Maps and translation remain third-party embeds.
- Home sections live in `(client)/_components`; developer logos use the static catalog. Root PT Sans keeps its font assignments with preloading disabled.
- Admin property forms split reusable fields/sections from pure conversion/validation logic in `_lib/property-form-domain.ts`.

## State and data fetching

`src/components/providers.tsx` wraps `ThemeProvider`, `QueryClientProvider`, and `ToastContainer`. The QueryClient is per-request on the server and singleton in the browser. TanStack Query is the server-state layer; React state is local UI state. Bookmark IDs use browser `localStorage` key `bookmark_ids` and are exposed through query options. React Hook Form plus Zod drives admin forms.

## Rendering and tests

Public pages wrap async route-local content components in Suspense, with property detail/comparison ID validation before fetching. Pages mix server fetching/metadata with client tables, dialogs, filters, and forms. SEO helpers live in `src/lib/metadata`, `src/lib/schema`, and route `_lib` folders. Loading, not-found, and global-error boundaries live under `src/app`.

Focused `*.test.cjs` coverage includes admin access and forms, blog uploads/excerpts, public layout/navigation/Suspense, route validation and metadata, SEO schemas, property media/iframe behavior, and API/query contracts. No browser E2E suite was detected.
