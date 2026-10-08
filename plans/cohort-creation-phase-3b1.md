# Phase 3B.1 — Durable draft foundation

## Scope and phase boundaries

3B.1: authenticated server-owned drafts, PostgreSQL persistence, ownership, create/load/resume, compare-and-swap revisions, and authentication continuity.

3B.2: durable execution, budgets, jobs/checkpoints/events, workers, artifact storage, uploads, acquisition adapters, discovery, connectors, material infrastructure. NOT STARTED.

3B.3: processing, curriculum building, review/refinement, activation/publication/receipts, feed/access, consumption, complete functional validation. NOT STARTED.

Phase 4: separately gated visual fidelity. NOT STARTED.

## Implementation plan and baseline

Before editing, inspected Git status/diff, Phase 3A session storage and flow contracts, authentication, PostgreSQL/Prisma conventions, and accepted reports. Planned one additive draft table, an owner-scoped repository with revision predicates, command-based APIs, client persistence replacement, safe sign-in continuity, and focused checks. Preserved existing reference/report files and unrelated code. Phase 3A baseline is now commit a8b4a04; no dependencies were changed in this phase.

## What changed

- Added `CreationDraft` with owner foreign key, JSON snapshot, schema version, revision, timestamps, and owner/update index. Added a standalone additive SQL deployment script because this checkout has no migration history; regenerated the ignored Prisma client.
- Repository reads filter by ID and authenticated owner. Creation retries the same UUID idempotently without changing ownership. Updates atomically match ID, owner, and base revision; only one competing update can succeed.
- Added authenticated POST create and GET/PATCH draft endpoints. Client commands are schema validated; client owner fields or arbitrary snapshots are rejected. Missing/foreign drafts return 404; unauthenticated access returns 401; conflicts return 409 with canonical state.
- Reused Phase 3A contracts, guards, transitions, dependency invalidation, recommendation service and Vercel AI adapter. Recommendation generation is request-bound; the server commits running and completed states through CAS. Late completions cannot overwrite canceled/newer state. Added a shared cancellation command.
- Replaced session storage with the draft API. Recommendation → create-own → starting-point decisions persist on the server. New drafts receive a stable draft URL before generation. Reload/resume loads canonical state; conflicting edits show current state without silently retrying.
- Added cancel/retry controls for interrupted recommendation requests. No automatic recovery worker or event infrastructure was added.
- Added safe internal return destinations through existing authentication UI and OAuth callbacks. Default `/home` behavior is retained. Draft routes and APIs require a real database user; a mock session cannot own drafts. Authentication UI avoids automatically redirecting an authenticated session lacking a database owner back into the protected creation route.
- Removed the obsolete session store. Updated save-status wording; no visual fidelity work or CSS redesign.

## Validation

- `npx prisma generate`: passed (Prisma 7.9.1).
- `npx prisma validate`: passed.
- `npx tsc --noEmit --incremental false`: passed.
- Focused Vitest: 6 files, 30 tests passed, covering contracts, transitions, recommendation validation, draft creation, ownership, anonymous access, invalid/missing IDs, reload/resume, revision conflicts, atomic repository predicates, database-backed identity and late AI completion fencing.
- Scoped ESLint covering creation modules, new infrastructure and changed authentication components: passed.
- `git diff --check`: passed. Inspected the resulting schema, routes, authentication, contracts, service and client changes.
- Database repository tests mock Prisma; resume tests use a persistent test repository/API fixture. These are not live PostgreSQL, OAuth or model integration tests. No paid model requests were made.

## Deployment limitation and deliberate narrowing

The SQL script has NOT been applied to a live database. Apply `prisma/creation-draft.sql` once through the normal database deployment process before using these routes; this implementation has not been demonstrated against a live database. No schema reset, broad schema push or fabricated migration baseline was performed.

Creation routes now require sign-in before recommendation generation so every workspace has a server-owned draft. The existing public recommendation endpoint remains unchanged. Legacy AI and `/create-cohort` were not migrated. Existing authentication providers and guest-account semantics remain in place; ownership means the authenticated database user, not a new identity system.

Interrupted generation retains its saved state and supports explicit retry/cancel after resume; automatic background completion belongs to 3B.2. No draft-list UI or old tab-session import was introduced.

## Files changed in 3B.1
- [prisma/schema.prisma](C:/Users/Dell/WebstormProjects/sidequesthq-site/prisma/schema.prisma)
- [src/app/(auth)/auth/page.tsx](C:/Users/Dell/WebstormProjects/sidequesthq-site/src/app/(auth)/auth/page.tsx)
- [src/app/(creation)/quest/draft/[draftId]/page.tsx](C:/Users/Dell/WebstormProjects/sidequesthq-site/src/app/(creation)/quest/draft/[draftId]/page.tsx)
- [src/app/(creation)/quest/new/page.tsx](C:/Users/Dell/WebstormProjects/sidequesthq-site/src/app/(creation)/quest/new/page.tsx)
- [src/client/screens/auth/Auth.tsx](C:/Users/Dell/WebstormProjects/sidequesthq-site/src/client/screens/auth/Auth.tsx)
- [src/client/screens/auth/authForm/authForm.tsx](C:/Users/Dell/WebstormProjects/sidequesthq-site/src/client/screens/auth/authForm/authForm.tsx)
- [src/client/screens/auth/authForm/authProviders.tsx](C:/Users/Dell/WebstormProjects/sidequesthq-site/src/client/screens/auth/authForm/authProviders.tsx)
- [src/client/screens/cohortCreation/CreationExperience.tsx](C:/Users/Dell/WebstormProjects/sidequesthq-site/src/client/screens/cohortCreation/CreationExperience.tsx)
- [src/client/screens/cohortCreation/__tests__/CreationExperience.test.tsx](C:/Users/Dell/WebstormProjects/sidequesthq-site/src/client/screens/cohortCreation/__tests__/CreationExperience.test.tsx)
- [src/client/screens/cohortCreation/__tests__/transport-session.test.ts](C:/Users/Dell/WebstormProjects/sidequesthq-site/src/client/screens/cohortCreation/__tests__/transport-session.test.ts)
- [src/client/screens/cohortCreation/components/StartingPoint.tsx](C:/Users/Dell/WebstormProjects/sidequesthq-site/src/client/screens/cohortCreation/components/StartingPoint.tsx)
- [src/client/screens/cohortCreation/hooks/useCreation.ts](C:/Users/Dell/WebstormProjects/sidequesthq-site/src/client/screens/cohortCreation/hooks/useCreation.ts)
- [src/client/screens/cohortCreation/services/sessionDraftStore.ts](C:/Users/Dell/WebstormProjects/sidequesthq-site/src/client/screens/cohortCreation/services/sessionDraftStore.ts)
- [src/shared/cohort-creation/contracts.ts](C:/Users/Dell/WebstormProjects/sidequesthq-site/src/shared/cohort-creation/contracts.ts)
- [src/shared/cohort-creation/flow.ts](C:/Users/Dell/WebstormProjects/sidequesthq-site/src/shared/cohort-creation/flow.ts)
- [prisma/creation-draft.sql](C:/Users/Dell/WebstormProjects/sidequesthq-site/prisma/creation-draft.sql)
- [src/app/api/cohort-creation/drafts/[draftId]/route.ts](C:/Users/Dell/WebstormProjects/sidequesthq-site/src/app/api/cohort-creation/drafts/[draftId]/route.ts)
- [src/app/api/cohort-creation/drafts/route.ts](C:/Users/Dell/WebstormProjects/sidequesthq-site/src/app/api/cohort-creation/drafts/route.ts)
- [src/client/screens/cohortCreation/services/draftApi.ts](C:/Users/Dell/WebstormProjects/sidequesthq-site/src/client/screens/cohortCreation/services/draftApi.ts)
- [src/server/domain/cohort-creation/__tests__/draft-repository.test.ts](C:/Users/Dell/WebstormProjects/sidequesthq-site/src/server/domain/cohort-creation/__tests__/draft-repository.test.ts)
- [src/server/domain/cohort-creation/__tests__/draft.test.ts](C:/Users/Dell/WebstormProjects/sidequesthq-site/src/server/domain/cohort-creation/__tests__/draft.test.ts)
- [src/server/domain/cohort-creation/draft.http.ts](C:/Users/Dell/WebstormProjects/sidequesthq-site/src/server/domain/cohort-creation/draft.http.ts)
- [src/server/domain/cohort-creation/draft.runtime.ts](C:/Users/Dell/WebstormProjects/sidequesthq-site/src/server/domain/cohort-creation/draft.runtime.ts)
- [src/server/domain/cohort-creation/draft.service.ts](C:/Users/Dell/WebstormProjects/sidequesthq-site/src/server/domain/cohort-creation/draft.service.ts)
- [src/server/infrastructure/auth/getCreationOwner.ts](C:/Users/Dell/WebstormProjects/sidequesthq-site/src/server/infrastructure/auth/getCreationOwner.ts)
- [src/server/infrastructure/db/postgres/repositories/creationDraft.repo.ts](C:/Users/Dell/WebstormProjects/sidequesthq-site/src/server/infrastructure/db/postgres/repositories/creationDraft.repo.ts)
- [src/shared/auth/returnTo.ts](C:/Users/Dell/WebstormProjects/sidequesthq-site/src/shared/auth/returnTo.ts)
- [plans/cohort-creation-phase-3b1.md](C:/Users/Dell/WebstormProjects/sidequesthq-site/plans/cohort-creation-phase-3b1.md)

Stopped at the 3B.1 boundary. 3B.2 and 3B.3 require explicit approval.

