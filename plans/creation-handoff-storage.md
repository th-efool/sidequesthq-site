# Creation private storage handoff

Updated 2026-10-09. Milestone: **3B.2 in progress**, no ingestion adapters/routes yet.

Owned files: `src/server/infrastructure/storage/creation.*`, focused storage tests, this handoff. SQL schema/migration belongs to ai_data; do not recreate it.

Current implementation: private streaming GridFS driver via existing Mongoose connection; SQL reservation/ready/deleting metadata lifecycle with quota reservation, checksum, owner/draft binding, immutable typed JSON artifacts, explicit pins and fenced reclamation. Runtime exports materialBlobStore, creationArtifactRepository, reconcilePrivateCreationStorage.

Remaining before milestone completion: fix read/delete race by pinning before opening content; add failure/recovery and GridFS partial-cleanup tests; typecheck/scoped lint; coordinate reconciliation entry point. No live database or paid calls performed.

Retention: incomplete uploads 24h, unreferenced ready artifacts 7d, deletion retries after 5m; queued/running jobs and publication pins protect objects. Inactive draft candidates at 60d are **reported only**: detaching draft/publication references and deleting drafts requires the later owning transaction, not a blind storage sweep. Failed upload reservations remain for the 24h reconciler when acknowledgement/cleanup is uncertain.

Privacy: refs returned externally contain only object id/kind/length/checksum. Raw storage metadata/blob IDs are server-internal. JSON artifacts are buffered within the byte cap and verified before returning; binary streams verify checksum at end and consumers must not commit derived output until complete.

Resume update: storage tests are included in the passing 93-test/12-file focused suite; typecheck and scoped lint pass. Read/delete race now uses a temporary readLeaseUntil (90 seconds), bounded stream read (60 seconds), and guarded deletion. Ordinary reads no longer create permanent pins. Actual MongoDB/SQL behavior remains unverified. Existing --reconcile command sweeps incomplete/unreferenced blobs; retention scheduling and inactive-draft detachment remain the next 3B.2 step. See cohort-creation-checkpoint.md for the current authoritative handoff.
# Retention follow-up (supersedes earlier remaining-work notes)

Draft tombstones now authorize cleanup while denying new reads/pins/uploads. Activity and deletion share the draft lock. Retention detaches only unpublished pins; active jobs, published pins, read leases and recent incomplete uploads prevent expiry. Worker maintenance runs on startup/every ten minutes and via --reconcile. PostgreSQL retention smoke passes; 97 focused tests and typecheck/lint pass. Live Mongo smoke fails at connection with ENOTFOUND, no bucket modified. Rerun npm run creation:storage:smoke after environment DNS/URI works. No material adapters have been implemented.
