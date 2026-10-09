# Remaining Phase 3 implementation

User approval covers 3B.2 → 3B.3 → 3C.1 → 3C.2 → 3C.3 → 3C.4. This supersedes the earlier names for 3B.3/3C; 3B.1 is complete. Phase 4 remains gated.

## 3B.2 implementation plan

Baseline: a8fabac, clean working tree. Inspect existing contracts, draft repository/service, PostgreSQL/Mongo connections and deployment scripts. Preserve legacy creation/AI services.

1. Extend separate creation tables with persistent budgets, jobs, leases/fencing/checkpoints, monotonically sequenced events and artifact/upload metadata. Keep snapshot revision separate from input revision.
2. Add atomic enqueue/checkpoint/cancel/recovery operations and owner-scoped NDJSON event replay. Move recommendations to durable worker jobs without replacing their domain/AI adapter.
3. Add a separate polling creation worker with bounded concurrency, deadlines, heartbeat, cooperative cancellation and resumable checkpoints; configure its own deployment entry point.
4. Add private GridFS blob storage and immutable validated artifact references. Incomplete writes and unreferenced artifacts require explicit reconciliation; published references prevent deletion.
5. Test duplicate work, CAS/lease expiry/fencing, cancellation races, replay/resume and storage failure boundaries. Run typecheck/scoped lint and inspect diff before 3B.3.

Coordination uses the adjacent workflow YAML and existing three agents, with root integration/validation. User approval already authorizes this workflow; no additional skill approval gate is needed. Tasks have disjoint file ownership, reviewed handoffs, and at most four active agents. Implementation plans for later sub-phases are added after inspecting the resulting preceding code.
