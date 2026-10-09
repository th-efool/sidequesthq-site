# Cohort creation — resume checkpoint

Updated: 2026-10-09 (Asia/Calcutta).

## Authorization and baseline

All remaining functional phases are authorized, in order: 3B.2 durable execution → 3B.3 material acquisition/discovery → 3C.1 processing/build → 3C.2 review/refinement → 3C.3 finalization/delivery → 3C.4 validation. Phase 4 is not authorized. Do not redo 3A/3B.1. Accepted baseline commit: a8fabac. Preserve all current working changes.

## Current milestone: 3B.3 — TEXT UPLOAD/PASTE/DROP WIRED AND VALIDATED

Durable recommendation execution/storage/retention (3B.2), text acquisition jobs, and end-user text/Markdown upload/paste/drop are implemented and validated with fixtures. Live Mongo connection remains blocked. Latest user steering requests small, thorough, token-efficient milestones and sequential meaningful commits; work solo rather than restarting three parallel agents.

### Latest completed milestone: upload/paste/drop

Added authenticated POST /api/cohort-creation/drafts/[draftId]/uploads. Owner load, UUID, base revision, starting branch, active-work and source-count checks precede body consumption. Raw Blob streaming reuses MaterialBlobStore ownership, aggregate quota, checksum, completion and cleanup. Only UTF-8 text/Markdown MIME types are accepted, with a 1 MiB ceiling, no truncation, a 30-second deadline, sanitized failures and explicit abort handling. Readers cancel/release even if reservation rejects before iteration. SQL reservation reauthorizes ownership; upload completion alone never changes source selection or navigation. Interrupted/unaccepted bytes remain reclaimable through existing retention.

One functional material step handles paste, file picker and drag/drop. The client first receives an opaque retained reference, then sends acquire_text against the captured draft revision. Another-tab intent changes cannot attach old uploads to newer state. Existing durable event observation, cancellation, retry and resume are reused; reload never reuploads selected sources. Failed uploads retain local input for retry. Controls disable while upload/queue/acquisition is active; a rejected drop clears the previous selection. Find-material/goal discovery and curriculum continuation remain explicitly unavailable.

Validation: 17 Vitest files / 145 tests PASS, including 25 new tests for HTTP authorization, invalid IDs, stale revisions, scope/byte limits, cancellation during pending reads, reader cleanup, sanitized outages, paste/file/drop, acknowledgment failure, stale attachment and reload without duplicate work. TypeScript PASS; scoped ESLint PASS; diff checks PASS. No live Mongo/AI/SQL calls, migrations, new dependencies, build or complete browser journey in this milestone. The prior Mongo ENOTFOUND and unapplied deployment SQL remain blockers to claiming a deployed end-to-end flow.

Sequential implementation commits: 27d4266 (owned upload boundary/tests/plan), 4eb566c (material UI/client plumbing/tests). Changed-file inventory: plans/cohort-creation-phase-3b3-materials.md; src/app/api/cohort-creation/drafts/[draftId]/uploads/route.ts; src/server/domain/cohort-creation/upload.http.ts and __tests__/upload.test.ts; src/client/screens/cohortCreation/CreationExperience.tsx, CreationExperience.module.css, components/StartingPoint.tsx, components/TextMaterial.tsx, hooks/useCreation.ts, services/materialApi.ts, __tests__/CreationExperience.test.tsx, __tests__/TextMaterial.test.tsx; this checkpoint. No legacy creation/AI changes or pushes. A separate documentation commit records this milestone.

**Exact next operation:** inspect source replacement/invalidation/pin-release contracts and repository CAS, then implement a bounded source removal/replacement milestone with owner/revision tests and UI recovery for rejected/oversized sources. Follow with external material adapters and grounded discovery in small ordered milestones. Do not recreate jobs/storage or start processing/review/publication/Phase 4. Mongo live verification must wait for the environment DNS fix; public migrations remain a deployment step.

### Latest completed milestone: durable text jobs

Reused creation_jobs, draft CAS, leases/fencing, budgets, checkpoints, replay and storage. Added typed acquire_text job input/checkpoint alongside recommendations; no new SQL schema or parallel queue. acquire_text draft commands accept only IDs, validate an owned completed text upload in the enqueue transaction, pin the selected raw reference, and persist application-owned source selection. Source replacement/new queries detach no-longer-selected unpublished pins. Shared snapshot defaults decode old schema-1 drafts/events; material edits advance inputRevision while preserving older accepted intent, and a new query clears materials/extractions.

Worker dispatch executes the deterministic TextAcquisitionService without AI, with a 60-second acquisition deadline (recommendations retain 30 seconds). Typed checkpoint validation binds parser version, extraction version, source checksum, revision, asset/material/unit identity and artifact fingerprint. Source/artifact pins, checkpoint and snapshot events commit under the existing owner/draft/job locks. Wrong-owner/unavailable artifact references roll back. Complete manifests persist in job checkpoints; snapshots retain material/extraction references, not source bodies. Restart finalizes a valid checkpoint without re-reading bytes. Cancellation/failure retains raw selection, stale lease/revision results cannot apply, and request replay avoids duplicate jobs. The client cancellation hook chooses the operation matching the canonical stage; no input UI added.

Validation: 15 Vitest files / 120 tests PASS; TypeScript PASS; scoped ESLint PASS; worker import check PASS; diff checks PASS. Expanded real PostgreSQL isolated-schema smoke PASS: text enqueue, unavailable upload rejection, raw pinning, mismatched fingerprint rejection, foreign-owner artifact rejection/rollback, checkpoint pins, stale material checkpoint denial, restart through the actual runner without acquisition/AI, result reload and new-intent pin release. Temporary schema removed. Source bytes/artifact writes in this SQL smoke are fixtures; Mongo and paid AI were not called. Public migrations remain unapplied.

Sequential commits this pass: 65b6327 shares request/fingerprint contracts; eafbab9 implements durable acquisition; 8890264 adds recovery/ownership tests. Changed files: plans/cohort-creation-phase-3b3-materials.md; scripts/creation-durability-smoke.ts; src/server/creation-worker.ts; src/server/domain/cohort-creation/draft.http.ts, draft.service.ts, durable-job.ts, durable-job.runner.ts, job-completion.ts, materials/text.ts, materials/text-acquisition.service.ts, __tests__/material-jobs.test.ts; src/server/infrastructure/db/postgres/repositories/creationJob.repo.ts; src/shared/cohort-creation/contracts.ts, flow.ts, jobs.ts; src/client/screens/cohortCreation/hooks/useCreation.ts; this checkpoint. No dependencies, migrations, legacy AI/import changes or pushes.

### Previous completed milestone: retained text foundation

Plan: cohort-creation-phase-3b3-materials.md. Reused existing MaterialSource/SourceLocation/ExtractedContent contracts and private storage interfaces. Added shared material selection limits (20 sources/100 units), opaque retained object references, manifest/extraction contracts and semantic checks for complete contiguous segment coverage, source/unit identities and artifact consistency.

Text extraction retains exact UTF-8 source text, including BOM and CRLF, and explicit UTF-16 offsets. Deterministic segment/version identities, Markdown headings/fenced code and surrogate-safe segment boundaries preserve provenance without executing markup. Reject invalid UTF-8, empty/binary control content, bad checksums and the approved 1 MiB extracted-text limit; no truncation. A technical 20,000-segment artifact bound also produces an explicit scope error. Segments are extraction anchors, not pedagogical chunks or an AI token window.

TextAcquisitionService reads an already owned retained text/Markdown upload, validates complete content, writes an immutable text-extraction artifact with input revision/parser/checksum fingerprint, and returns a ready manifest proposal. It does not mutate draft state/navigation or pin an unaccepted artifact. The future fenced checkpoint must accept/pin proposals. No uploads, endpoints, source persistence, material jobs, external adapters, discovery, processing, review or publication were added in this bounded milestone.

Validation: 14 Vitest files / 111 tests PASS; TypeScript PASS; scoped ESLint PASS; staged diff checks PASS. All new storage service tests use mocks; no live Mongo/SQL/AI calls in this milestone. No migration or dependency changes.

Sequential commits: 9e92826 defines material contracts/plan; f77a3d0 implements text parser/acquisition and 14 focused tests. Changed files: plans/cohort-creation-phase-3b3-materials.md; src/shared/cohort-creation/materials.ts; src/server/domain/cohort-creation/materials/text.ts; src/server/domain/cohort-creation/materials/text-acquisition.service.ts; src/server/domain/cohort-creation/__tests__/text-acquisition.test.ts; this checkpoint. A separate documentation commit records this resume point. No pushes.

Deployment and live verification remaining:

1. Apply creation-draft.sql, then creation-durability.sql, then creation-retention.sql in the intended deployment environment. Public SQL was not migrated by the smoke tests.
2. Mongo/storage live verification is blocked by ENOTFOUND during connection to the configured MONGODB_URI. No temporary or production bucket was modified. Correct the environment DNS/connection, then run npm run creation:storage:smoke. Fixture coverage passes; do not claim live GridFS is operational.
3. New provider credentials/model smoke and deployed worker execution remain unverified. Full functional validation belongs to 3C.4; no full-flow operational claim yet.

Retention is implemented and validated. The worker sweeps on startup and every ten minutes, without overlapping its own sweeps, and drains maintenance on shutdown. The --reconcile command runs the complete lifecycle. Inactive drafts are tombstoned under the draft row lock before unpublished pins detach. Active jobs, published objects, unexpired read leases and recent incomplete uploads prevent expiry. User storage operations share that lock, touch activity, and reject tombstones; draft reads/commands/events and worker claims exclude tombstones. Actual GridFS cleanup precedes fenced metadata deletion; draft deletion waits for zero storage rows. Seven-day replay events and expired budgets are pruned in bounded batches while both model-slot counters survive.

Latest validation: 13 Vitest files / 97 tests PASS; TypeScript PASS; scoped ESLint PASS; Prisma generate/validate PASS; worker import check PASS; diff check PASS. Expanded real PostgreSQL smoke PASS, including protected expiry, unpublished pin detachment, expired enqueue/read/pin/read-lease/completion denial, wrong deletion token rejection, pending-blob protection, final deletion and event/budget pruning. Isolated schema removed. SQL-only fixture acknowledges simulated successful byte deletion; this is not a two-store live smoke.

Implementation commits made sequentially at the user's request: 0a327e0 (durable persistence), e3fa48f (worker), 7dae055 (event replay), 261e644 (private storage), 4a87090 (retention lifecycle). A separate documentation commit records the checkpoint and prior interrupted-work plans/handoffs. No pushes or production migrations in this pass. All prior tracked and untracked implementation/report files were preserved.

Then inspect the resulting implementation and write the 3B.3 implementation plan before implementing materials.

## Latest completed checkpoint

Fixed the early-abort AI regression while preserving durable reservation failures. Added two durable model-call slots using dedicated leased keys in creation_budgets: canceled jobs cannot immediately free an SDK call that is still running; each schema-repair attempt reserves/releases independently. Slots expire after 30 seconds, SDK calls have a 15-second timeout, and generation counters plus timestamp predicates fence stale releases. Uncertain provider-side execution is not an exactly-once billing guarantee.

Replaced permanent pins on reads with a 90-second SQL read lease and a 60-second read deadline. Explicit accepted artifact/publication pins remain separate. Failed/abandoned reads no longer permanently prevent orphan cleanup. Added tests for lease expiry and per-attempt release.

Checks on this checkpoint: focused Vitest **12 files / 93 tests passed**; TypeScript passed; scoped ESLint passed after removing one unused import; Prisma generate/validate passed; `npm run creation:worker:check` passed without DB/model calls; `git diff --check` passed. The first attempted script name `creation:check` did not exist; reran the actual script `creation:worker:check` successfully. No dependency upgrades, paid calls, migration deployment, commits or pushes.

Changed in this bounded follow-up: prisma/schema.prisma; prisma/creation-durability.sql; src/server/domain/cohort-creation/durable-job.ts; src/server/infrastructure/db/postgres/repositories/creationJob.repo.ts; src/server/infrastructure/ai/vercelCohortAi.ts and its tests; src/server/infrastructure/storage/creation.contracts.ts, creation.metadata.ts, creation.store.ts and both storage test files; this checkpoint and execution/storage handoffs. All earlier working changes were preserved.

**Current bounded follow-up:** SQL queue/model-slot validation first, retention lifecycle next. No material acquisition or later phases. Added an injectable repository factory and opt-in `npm run creation:sql:smoke`, which applies both additive SQL scripts only inside a newly created isolated schema and removes that schema in cleanup. Connection preference is CREATION_SMOKE_DATABASE_URL, then DIRECT_URL, then DATABASE_URL; direct/session connections are required for scoped search_path startup options. Public tables are not migrated.

Live checks exposed and fixed a Prisma compatibility issue: SELECT pg_advisory_xact_lock returns unsupported PostgreSQL void; the claim now selects a boolean from the locking function. Model slots now keep a monotonically incremented generation counter and release by generation plus expiry, fixing a same-millisecond reacquisition race. Future budget retention MUST exclude the two active-model-slot keys, preserving their fencing counters.

Initial smoke attempts: pooled DATABASE_URL failed with 08P01 startup options; DIRECT_URL worked but default 5-second test transaction timeout caused P2028. The test uses a 30-second transaction timeout for remote latency. The next attempt found the void result P2010. A subsequent attempt reached model contention but its assertion incorrectly looked for error.code rather than CreationFailure.detail.code; fixed. Final `npm run creation:sql:smoke` PASSED on real PostgreSQL using DIRECT_URL: concurrent duplicate enqueue, owner mismatch, stale revisions, two distinct concurrent queue claims, global two-model-slot capacity, repeated stale releases with identical expiry timestamps, expired lease recovery, stale heartbeat/checkpoint/completion rejection, persisted checkpoint/result/reload and duplicate completion. The isolated schema was removed. Test-only deadline/clock adjustments isolate contention assertions from remote connection latency; no model timing or billing behavior was verified. All failed attempts also ran cleanup without migrating public tables. No paid models or Mongo calls.

This pass: focused Vitest 12 files / 93 tests PASS; TypeScript PASS; scoped ESLint PASS; worker import check PASS; git diff --check PASS. Files changed in this pass only: package.json (opt-in smoke script), scripts/creation-durability-smoke.ts (new), creationJob.repo.ts (factory, advisory lock scalar and slot generations), this checkpoint and creation-handoff-execution.md. Existing dirty/untracked work was preserved. No commits or pushes.

Previous next operation (now completed): owner-checked streaming text/Markdown upload and functional have-material screen wired to acquire_text commands/replay/retry/cancel. See the current milestone above for the next uncompleted operation. External adapters/discovery, processing/review/publication/Phase 4 have not started.

## Coordinated ownership

- root: milestone ledger, client hook integration, cross-boundary validation and final reporting.
- ai_data: current 3B.2 schema/SQL/job repositories/worker/events/deployment and job tests. Handoff: plans/creation-handoff-execution.md.
- design_system: current 3B.2 storage files and storage tests. Handoff: plans/creation-handoff-storage.md.
- cohort_flow: current 3B.2 NDJSON utility and transport tests. Handoff: plans/creation-handoff-observer.md.

At most four active agents including root. No nested agents. Subsequent tasks require explicit handoff from root after the dependency checks pass.

## Environment/deployment findings

Previous read-only check: DATABASE_URL/DIRECT_URL/MONGODB_URI/YOUTUBE_API_KEY present; GEMINI_API_KEY absent; public PostgreSQL lacks creation_drafts. Recheck presence only when needed, never print secrets. No production migrations or model calls have been performed. Real SQL smoke applied scripts only inside an isolated schema, which was removed. SQL deployment and live provider tests must be distinguished from fixture validation. Standalone worker imports pass under the dedicated Node launch command; legacy build:worker is not proven packaging.

## Resume protocol

Read this file and the three handoffs, inspect Git status/diff, then resume the current milestone. Update this ledger at every completed milestone and before expensive validation. Record exact commands/results, blockers, and the next uncompleted operation. Keep code edits separate from completion claims. Do not automatically commit/push unless requested for the new work.
