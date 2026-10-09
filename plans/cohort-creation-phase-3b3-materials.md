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
