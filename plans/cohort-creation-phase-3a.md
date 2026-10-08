# Phase 3A — foundation and minimal vertical slice

Approved scope: SDK boundary, shared contracts/flow primitives, initial structured AI operations, new routes, API/client plumbing and focused validation. No workers, ingestion, processing/review/publication/feed implementation or visual fidelity work.

Baseline: `05ffb94 planning cohort creation flow`; clean tracked/staged/untracked status before changes. Existing lockfile and reference images are now committed and must be preserved except the explicitly authorized dependency additions to the lockfile.

## Implementation sequence

1. Pin `ai@7.0.133`, `@ai-sdk/google@4.0.92`, `zod@4.4.3`; add `server-only@0.0.1` to enforce the provider boundary. Preserve all legacy Google services. Require Node 24 for this application baseline; no parser packages or worker deployment changes yet.
2. Add bounded Zod domain contracts, provenance, commands/snapshots and early-stage transitions. Declare future stage/artifact types without implementing future-stage orchestration. Add dependency invalidation primitives.
3. Add server model registry and Vercel structured intent/ranking adapter. Validate all candidate references and preserve raw user query separately from AI interpretation.
4. Retrieve published public candidates from PostgreSQL; hydrate metadata from DB, cap distinct recommendations at five. Never manufacture cohorts to fill slots. When ranking fails, allow clearly labeled deterministic DB results; interpretation failure remains a typed error.
5. Add bounded request/error/cancellation plumbing and a conservative process-local request budget. This temporary budget is not the planned distributed PostgreSQL budget and must be replaced before production scaling in 3B.
6. Wire `/quest/new` and a typed session-only `/quest/draft/[id]` workspace. Session seeds contain only query/intent/public recommendation data and starting-point choice. This is an interim client foundation, not an owned/durable server draft. Clearly identify this limitation. No material intake, joins, auth changes or later-stage actions.
7. Test schemas, semantic validation, transitions/stale results/invalidation, API/client/session boundaries and rendered minimal slice using mock models. Run typecheck, relevant/full tests and scoped lint; inspect tracked/untracked diffs. No paid live model calls or mutation-generating build script is required for this phase.

## Stop boundary

3B: authenticated owned drafts/recovery, persistent budgets/jobs/artifacts, real source adapters/discovery and join/auth integration.

3C: processing/build/refinement/review, private activation/publication, access/feed consumption integration and full functional validation. Phase 4 remains separately gated visual work.

The final report will list exact files, validation results and deviations. Stop after 3A; do not automatically continue.

## Implemented and validated

Pinned SDK/provider/Zod dependencies, server-only provider marker and Node 24 engine policy. Shared provenance/domain schemas, early-stage command/event transitions, stale-result guards and pure dependency invalidation. Server model registry, task prompts, structured intent/ranking with bounded schema repair and semantic candidate validation. PostgreSQL public/published candidate retrieval, real metadata/count hydration, eligibility recheck and honest empty/database-fallback results.

New recommendations API and client transport, cancellation/retry/error handling, query route and session-only draft route, functional intent/recommendation/starting-point components. The existing homepage already targeted the new query route, so no homepage component change was needed. Future artifact contracts are declarations only; there is no job/material/processing/review/publication implementation.

Validation:

- `npx tsc --noEmit --incremental false`: passed, including after Next generated the new route types.
- `npx vitest run`: 15 files, 64 tests passed (33 new tests across 6 files). The first typecheck found a test-fixture generic inference issue; it was corrected and final typechecks passed.
- Scoped ESLint across all new TypeScript/TSX: passed.
- Local Next.js 16.2.11 runtime: query route 200, valid draft route 200, invalid draft ID 404, invalid API input 400; explicitly disabled model key produced sanitized 503 AI_UNAVAILABLE. The temporary server was stopped.
- Dependency/lock diff reviewed; removed npm-added unrelated optional Tailwind bundle metadata. Existing legacy sources, PNGs, architecture report, Prisma schema, worker, auth and feed remain unchanged. `git diff --check` passed.
- No paid model call, live database/connector mutation, migration or production build/deployment. SDK generation was exercised through its actual adapter with official mock models; database behavior used fixtures. Live account/model availability and DB integration remain unverified.

## Deliberate interim boundaries

- Draft workspace is a versioned **tab-session seed**, not the Phase 2 authenticated/durable draft. Storage failures are visible and do not discard current in-memory state; interrupted requests restore as canceled and need retry. Durable ownership, closure recovery and authentication resume remain 3B.
- A conservative shared process request budget protects this preview endpoint. It is not the planned distributed per-user/client budget; replace it during 3B before production scaling.
- Cards provide View cohort through existing navigation. New join/auth integration remains 3B; no legacy join semantics were silently changed.
- Starting-point selection is the final enabled state. No sources, processing, review, publishing or feed activation can run. Foundation styles are functional only.
- No remaining local type/test/lint blocker. No claim is made that the chosen model is available to the configured account without a live capability check.

## Exact file inventory

32 files: 30 added, 2 modified. No pre-existing untracked files existed at the 3A baseline.

| Change | File |
|---|---|
| Modified | [package-lock.json](<C:/Users/Dell/WebstormProjects/sidequesthq-site/package-lock.json>) |
| Modified | [package.json](<C:/Users/Dell/WebstormProjects/sidequesthq-site/package.json>) |
| Added | [plans/cohort-creation-phase-3a.md](<C:/Users/Dell/WebstormProjects/sidequesthq-site/plans/cohort-creation-phase-3a.md>) |
| Added | [src/app/(creation)/quest/draft/[draftId]/page.tsx](<C:/Users/Dell/WebstormProjects/sidequesthq-site/src/app/(creation)/quest/draft/[draftId]/page.tsx>) |
| Added | [src/app/(creation)/quest/new/page.tsx](<C:/Users/Dell/WebstormProjects/sidequesthq-site/src/app/(creation)/quest/new/page.tsx>) |
| Added | [src/app/api/cohort-creation/recommendations/route.ts](<C:/Users/Dell/WebstormProjects/sidequesthq-site/src/app/api/cohort-creation/recommendations/route.ts>) |
| Added | [src/client/screens/cohortCreation/CreationExperience.module.css](<C:/Users/Dell/WebstormProjects/sidequesthq-site/src/client/screens/cohortCreation/CreationExperience.module.css>) |
| Added | [src/client/screens/cohortCreation/CreationExperience.tsx](<C:/Users/Dell/WebstormProjects/sidequesthq-site/src/client/screens/cohortCreation/CreationExperience.tsx>) |
| Added | [src/client/screens/cohortCreation/__tests__/CreationExperience.test.tsx](<C:/Users/Dell/WebstormProjects/sidequesthq-site/src/client/screens/cohortCreation/__tests__/CreationExperience.test.tsx>) |
| Added | [src/client/screens/cohortCreation/__tests__/transport-session.test.ts](<C:/Users/Dell/WebstormProjects/sidequesthq-site/src/client/screens/cohortCreation/__tests__/transport-session.test.ts>) |
| Added | [src/client/screens/cohortCreation/components/RecommendationResults.tsx](<C:/Users/Dell/WebstormProjects/sidequesthq-site/src/client/screens/cohortCreation/components/RecommendationResults.tsx>) |
| Added | [src/client/screens/cohortCreation/components/StartingPoint.tsx](<C:/Users/Dell/WebstormProjects/sidequesthq-site/src/client/screens/cohortCreation/components/StartingPoint.tsx>) |
| Added | [src/client/screens/cohortCreation/hooks/useCreation.ts](<C:/Users/Dell/WebstormProjects/sidequesthq-site/src/client/screens/cohortCreation/hooks/useCreation.ts>) |
| Added | [src/client/screens/cohortCreation/services/creationApi.ts](<C:/Users/Dell/WebstormProjects/sidequesthq-site/src/client/screens/cohortCreation/services/creationApi.ts>) |
| Added | [src/client/screens/cohortCreation/services/sessionDraftStore.ts](<C:/Users/Dell/WebstormProjects/sidequesthq-site/src/client/screens/cohortCreation/services/sessionDraftStore.ts>) |
| Added | [src/server/domain/cohort-creation/__tests__/recommendation.test.ts](<C:/Users/Dell/WebstormProjects/sidequesthq-site/src/server/domain/cohort-creation/__tests__/recommendation.test.ts>) |
| Added | [src/server/domain/cohort-creation/ai.contracts.ts](<C:/Users/Dell/WebstormProjects/sidequesthq-site/src/server/domain/cohort-creation/ai.contracts.ts>) |
| Added | [src/server/domain/cohort-creation/errors.ts](<C:/Users/Dell/WebstormProjects/sidequesthq-site/src/server/domain/cohort-creation/errors.ts>) |
| Added | [src/server/domain/cohort-creation/recommendation.http.ts](<C:/Users/Dell/WebstormProjects/sidequesthq-site/src/server/domain/cohort-creation/recommendation.http.ts>) |
| Added | [src/server/domain/cohort-creation/recommendation.service.ts](<C:/Users/Dell/WebstormProjects/sidequesthq-site/src/server/domain/cohort-creation/recommendation.service.ts>) |
| Added | [src/server/infrastructure/ai/__tests__/vercelCohortAi.test.ts](<C:/Users/Dell/WebstormProjects/sidequesthq-site/src/server/infrastructure/ai/__tests__/vercelCohortAi.test.ts>) |
| Added | [src/server/infrastructure/ai/modelRegistry.ts](<C:/Users/Dell/WebstormProjects/sidequesthq-site/src/server/infrastructure/ai/modelRegistry.ts>) |
| Added | [src/server/infrastructure/ai/prompts/creation.ts](<C:/Users/Dell/WebstormProjects/sidequesthq-site/src/server/infrastructure/ai/prompts/creation.ts>) |
| Added | [src/server/infrastructure/ai/vercelCohortAi.ts](<C:/Users/Dell/WebstormProjects/sidequesthq-site/src/server/infrastructure/ai/vercelCohortAi.ts>) |
| Added | [src/server/infrastructure/db/postgres/repositories/__tests__/creationRecommendation.repo.test.ts](<C:/Users/Dell/WebstormProjects/sidequesthq-site/src/server/infrastructure/db/postgres/repositories/__tests__/creationRecommendation.repo.test.ts>) |
| Added | [src/server/infrastructure/db/postgres/repositories/creationRecommendation.repo.ts](<C:/Users/Dell/WebstormProjects/sidequesthq-site/src/server/infrastructure/db/postgres/repositories/creationRecommendation.repo.ts>) |
| Added | [src/shared/cohort-creation/__tests__/fixtures.ts](<C:/Users/Dell/WebstormProjects/sidequesthq-site/src/shared/cohort-creation/__tests__/fixtures.ts>) |
| Added | [src/shared/cohort-creation/__tests__/foundation.test.ts](<C:/Users/Dell/WebstormProjects/sidequesthq-site/src/shared/cohort-creation/__tests__/foundation.test.ts>) |
| Added | [src/shared/cohort-creation/artifacts.ts](<C:/Users/Dell/WebstormProjects/sidequesthq-site/src/shared/cohort-creation/artifacts.ts>) |
| Added | [src/shared/cohort-creation/contracts.ts](<C:/Users/Dell/WebstormProjects/sidequesthq-site/src/shared/cohort-creation/contracts.ts>) |
| Added | [src/shared/cohort-creation/dependencies.ts](<C:/Users/Dell/WebstormProjects/sidequesthq-site/src/shared/cohort-creation/dependencies.ts>) |
| Added | [src/shared/cohort-creation/flow.ts](<C:/Users/Dell/WebstormProjects/sidequesthq-site/src/shared/cohort-creation/flow.ts>) |

**Phase 3A complete. Stop and wait for explicit approval; no 3B/3C implementation begins automatically.**
