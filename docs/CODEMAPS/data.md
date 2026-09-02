<!-- Generated: 2026-09-02 | Files scanned: 317 | Token estimate: ~355 -->

# Data

## Persistence

No database schema, ORM configuration, migrations, SQL, seeds, row policies, or local data repository was detected. Durable application data is owned by external REST and DatoCMS services.

```text
REST API -> JsonResponse<T> / DataAndPagination<T> -> domain types
DatoCMS GraphQL -> Article contracts
S3-backed API -> uploaded image path -> NEXT_PUBLIC_S3_ENDPOINT URL
browser localStorage -> bookmark_ids
cookies -> accessToken, refreshToken
```

## Domain contracts

`src/lib/types` is the canonical client data surface:

- `properties.ts`: property enums, specifications, facilities, configurations, images, navigation, currency, and rent-time contracts.
- `agent.ts`, `developers.ts`, `leads.ts`, `article.ts`, `bank.ts`, `s3.ts`: domain records.
- `join.ts`: `PropertyJoinAgent` tuple; index 0 is property, index 1 is assigned agent.
- `json-response.ts`: REST response and pagination envelopes.
- `supertokens.ts`: access/refresh token and session payloads.
- `facilities.tsx`: facility presentation mapping.

Barrels are `src/lib/types/index.ts`, `src/lib/api/index.ts`, and `src/lib/hooks/index.ts`.

## Validation and conversion

- `src/lib/env.ts`: Zod runtime environment validation.
- Admin property `_lib/property-form-domain.ts`: form defaults, field validation, price/map/image invariants, and API payload conversion.
- Agent/developer `_lib/build-*-update-data.ts`: edit payload conversion while preserving existing images unless replaced.
- Property filter helpers normalize query strings and SEO path segments into `FindPropertyQuery`.
- Lead contact UI validates user input before creating a lead and opening WhatsApp/phone actions.

## Data access rules

REST access is centralized in `src/lib/api`; query/cache behavior is centralized in `src/lib/hooks`. Protected calls use the server-read access token. Admin/agent visibility is derived from the verified viewer or decoded access token and translated into API filters. Do not infer local tables from TypeScript contracts: they describe external payloads only.
