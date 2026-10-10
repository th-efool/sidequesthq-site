# Phase 3 deployment and integration inventory

Updated 2026-10-10. This is a deployment inventory, not evidence that the configured environment is operational. Root's final validation report records the complete test/browser/build results.

## Database deployment

Apply reviewed additive SQL to the intended PostgreSQL schema, in this order, only where not already applied:

1. `prisma/creation-draft.sql`: authenticated durable draft storage.
2. `prisma/creation-durability.sql`: jobs, leases/fences, events, budgets and private object metadata.
3. `prisma/creation-retention.sql`: draft expiration tombstone. Base scripts 1–3 are not rerunnable migrations; inspect the installed schema before applying them.
4. `prisma/creation-connectors.sql`: isolated `creation_connectors` schema for optional user-scoped GitHub/Notion connections.
5. `prisma/creation-review.sql`: idempotent conversation entries, owner-derived through the draft, request/role deduplication and pagination index.
6. `prisma/creation-publication.sql`: idempotent cohort `creationSettings` JSONB column, one cohort identity reservation per draft, immutable publication operation and receipt records.

Run `npx prisma generate` after deploying the checked-in schema/client change. Do not use a broad `db push` to replace these scoped deployment steps. Existing legacy cohort tables/services remain in use; only `creationSettings` is additive to the cohort table. No public database migration was applied by this implementation/audit. SQL smoke uses a disposable schema and fixture artifact bodies, so it does not verify live Mongo/Google execution.

## Runtime configuration

Required for complete creation:

- `DATABASE_URL`: PostgreSQL access for the web application and independent creation worker. `DIRECT_URL` is used for connectors and direct SQL smoke where present; `CREATION_SMOKE_DATABASE_URL` can isolate smoke connectivity.
- `MONGODB_URI`: reachable MongoDB supporting private GridFS retained sources/artifacts, bucket `creation_private`. SQL metadata owns authorization, identity, pins and cleanup; Mongo is not a public blob endpoint.
- `GEMINI_API_KEY`: selected Google provider credentials for Vercel AI SDK new-flow operations. Optional `COHORT_AI_MODEL` overrides the registry default (`gemini-3.5-flash-lite`). Existing legacy Google services are not migrated. Installed new-flow dependencies are pinned in the package lock.
- Existing authentication configuration: `AUTH_SECRET` (or existing `NEXTAUTH_SECRET`) and enabled OAuth provider credentials such as `AUTH_GITHUB_ID` / `AUTH_GITHUB_SECRET`. Keep existing authentication return paths.
- `YOUTUBE_API_KEY`: YouTube metadata/playlist acquisition. Video learning content is explicitly labeled AI-authored observation with estimated anchors, not fabricated transcripts or exhaustive coverage.

Optional private GitHub/Notion connector runtime requires all of:

- `CREATION_CONNECTOR_ORIGIN`: validated application origin, HTTPS in production.
- `CREATION_CORSAIR_KEK`: nonzero 64-hex encryption key.
- `CREATION_CORSAIR_API_KEY`: managed self-hosted Hub project key with accepted `ck_dev_` / `ck_prod_` prefix.
- `CREATION_CORSAIR_SIGNING_SECRET`: signed delivery validation.

Configure the managed Hub return URL `/quest/connections/return` and delivery URL `/api/cohort-creation/connector-delivery` against that origin. Existing unrelated legacy Corsair credentials are not copied or silently reused. Public GitHub reads do not require a private connector.

## Worker and retention

Run the worker as a persistent independently supervised Node process using `npm run creation:worker`, with the same SQL/Mongo/provider configuration as the web process. Restart on crashes; durable leases/checkpoints permit recovery. A running browser tab or Next request is not the worker.

`npm run creation:worker:check` verifies server imports only and makes no database/model call. Worker maintenance runs every ten minutes; `npm run creation:worker -- --reconcile` explicitly performs retained-draft/storage reconciliation. Published source and delivery pins remain protected. Permanent publication retention increases storage use; storage lifecycle policies must not delete pinned GridFS data independently of application metadata.

Product limits remain explicit: 25 MiB/file, 100 MiB retained draft budget, 1 MiB extracted text/source, 100 selected learning units, 1,000 processing partitions, 200 chunks/unit, 2,500 chunks/draft and 100 lessons/unit. Large partitions/proposals can hit the explicit 48 KiB AI-context or 6,000 output-token bound; requests fail with scope guidance rather than truncating. Persistent budgets currently allow 20 queued operations and 40 model reservations per owner/hour, with global model concurrency protection. Large multi-partition builds may exhaust the hourly allowance and require later retry; no unlimited agent loop is introduced.

## Verification and current blockers

- Focused publication suite: 10 fixture/mock tests pass, including retained body/provenance, accepted user edits, partial restart, Mongo-write failure, SQL-insert failure, missing retained pins, owner/stale checks, lost-response receipts, idempotency conflict, stable-ID promotion and no public downgrade. These unit tests do not claim a real two-store distributed transaction was run.
- TypeScript and scoped publication ESLint pass at this audit checkpoint.
- Fresh `npm run creation:storage:smoke` failed at Mongo connection with `ENOTFOUND`; no production bucket was modified. Real private blob upload/read/deletion and full SQL+Mongo publication remain blocked by this configured Mongo endpoint's DNS reachability.
- Environment presence was checked without printing secrets: SQL, Mongo URI, YouTube key, authentication secret and GitHub authentication credentials are present; `GEMINI_API_KEY` and private creation connector variables are missing. The model override is absent, so the registry default would apply after credentials are configured.
- No paid Google structured-generation/grounded-discovery calls or live private GitHub/Notion connector sessions were made during this audit. Mock AI/schema coverage does not establish provider/model availability.
- The goal-only branch uses grounded discovery and explicit source confirmation/acquisition. It does not silently invent external sources; an AI-authored-guide fallback is not enabled.
- Root's SQL integration smoke, complete browser journey, access/feed regressions and build checks must be reported separately. Until deployment and the missing/unreachable integrations are resolved, this environment cannot be described as a live end-to-end operational Phase 3 deployment.

Phase 4 visual fidelity remains gated and was not performed.
