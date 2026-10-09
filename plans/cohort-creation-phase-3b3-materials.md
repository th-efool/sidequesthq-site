# Phase 3B.3 — material acquisition, bounded implementation plan

Baseline: durable creation jobs/storage/retention implemented; Mongo live connection remains blocked by ENOTFOUND. Existing MaterialSource, SourceLocation and ExtractedContent contracts and private artifact storage are reused. Legacy GitHub/Notion importers do not retain trustworthy complete content; they will not be used as extraction substitutes.

## First milestone: retained UTF-8 text and Markdown

1. Extend the foundation contracts with validated manifests, extraction artifacts, segments and full coverage/provenance. Reuse opaque storage references; source bodies stay out of draft snapshots.
2. Implement deterministic UTF-8 decoding and offset-preserving segmentation. Retain raw source bytes, preserve headings/code, never execute HTML/code, reject invalid encoding/empty or binary input and the approved 1 MiB extracted-text limit without truncation.
3. Add an acquisition service that reads an already owned retained upload and writes an immutable extraction artifact through existing storage. Return a proposal for the future fenced job checkpoint; do not mutate navigation or pin unaccepted results.
4. Test exact content/coverage, multibyte offsets, deterministic identities, malformed contracts, byte limits, abort and persistence failures using storage mocks. Run typecheck/scoped tests/lint, inspect diff, commit separately, update the checkpoint.

This milestone does not claim an end-user material flow. Subsequent bounded milestones connect source manifests to durable draft commands/jobs, then upload/paste/drop endpoints/screens, then external acquisition and grounded discovery with user-scoped connectors. Worker operation generalization must precede background acquisition wiring; recommendation jobs remain unchanged here. No processing/review/publication or Phase 4 visual implementation.

## Next milestone: durable text acquisition boundary

Add an authenticated draft command selecting an already retained owned text upload. Persist source selection and queue an acquire_text operation in the existing creation_jobs transaction. Extend claimed job inputs/checkpoints with a discriminated operation contract; preserve recommendations and their deadline. Execute text acquisition through the existing runner/worker, checkpoint the manifest and pin immutable references under owner/input/lease fencing, then accept the extraction projection into the snapshot. Cancellation/failures retain selected raw material; retry uses a new request and revision. Default material fields decode old snapshots without a database migration. Recommendation intent revisions remain valid across material-only input changes; new queries clear materials. Validate transitions, ownership, stale results, restart/checkpoint recovery and repository operations. No upload HTTP/UI or external adapters in this milestone.

## Upload/paste/drop milestone

Add a Node streaming upload route authorized by the existing draft owner and captured baseRevision. Accept raw text/Markdown bytes, not buffered multipart JSON; file selection/drop and pasted text send the same Blob request. Enforce the 1 MiB text scope within the existing 25 MiB/file and 100 MiB/draft storage boundaries, actual streaming limits, a request deadline and cancellation. Completed upload acknowledgements contain only opaque references. Queue acquisition separately against the captured draft revision; interrupted/lost/stale acknowledgements remain reclaimable and never silently select material for a newer intent.

Add one functional have-material panel under the existing starting-point screen. Show file/paste modes, upload cancellation, actual pending/ready/failed sources and acquisition retry/cancel through existing commands/events. Keep unsupported find/goal branches explicit. Reuse current layout primitives; no reference geometry tuning. Validate auth/ownership/revision/size/media/stream interruption and UI selection/drop/paste/reload/failure paths. Commit API, client wiring and tests in meaningful batches.

## Source recovery milestone

Add a bounded remove_material command guarded by owner, revision and idle starting-point state. Remove only the chosen source/extraction, advance inputRevision, preserve other sources and intent, and release detached unpublished storage pins atomically with the snapshot event. Share the existing enqueue pin-detachment rule with ordinary draft CAS; never delete bytes synchronously or release published/shared references.

Expose remove and replacement controls in the same material step. Replacement reuses acquire_text with the existing material ID, retaining the old selection until the owned new upload is acknowledged and CAS enqueue succeeds. Permit replacement at the twenty-source limit only for an existing source ID. Failed upload/stale attachment preserves the original selection; successful replacement invalidates only that source extraction. Validate guards, authorization, conflicts, shared/published pin protection, full-selection replacement and client recovery. No new schema, external adapters, AI calls or later phases.
