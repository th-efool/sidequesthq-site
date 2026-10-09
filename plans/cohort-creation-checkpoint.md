# Cohort creation — resume checkpoint

Updated: 2026-10-09 (Asia/Calcutta).

## Authorization and baseline

All remaining functional phases are authorized, in order: 3B.2 durable execution → 3B.3 material acquisition/discovery → 3C.1 processing/build → 3C.2 review/refinement → 3C.3 finalization/delivery → 3C.4 validation. Phase 4 is not authorized. Do not redo 3A/3B.1. Accepted baseline commit: a8fabac. Preserve all current working changes.

## Current milestone: 3B.2 — IMPLEMENTATION VALIDATED; LIVE MONGO BLOCKED

The interrupted implementation has been recovered and jointly checked. Durable recommendation enqueue/worker/checkpoints, revision/lease fencing, persistent budgets, event replay, client observation and private storage foundations are on disk. No later sub-phase has started. Latest user steering requests small, thorough, token-efficient milestones; work solo for bounded follow-ups rather than restarting three parallel agents.

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

**Exact next operation:** inspect the accepted Phase 2 material contracts and existing source/import infrastructure; write a bounded 3B.3 plan, then implement material contracts and Markdown/text acquisition first. Do not redo 3B.2. Keep Mongo ENOTFOUND as an explicit live-verification blocker; rerun the storage smoke when the environment is available. Grounded discovery, external adapters, processing and publication have not started. Phase 4 remains excluded.

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
