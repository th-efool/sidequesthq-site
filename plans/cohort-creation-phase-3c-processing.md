# Phase 3C.1 processing checkpoints

## First implementation checkpoint: grounded processing inputs

Inspect the existing extraction schemas and accepted snapshot projections before introducing generation. Normalize actual retained text, PDF, web, GitHub, Notion and video-observation artifacts into ordered segment references. Preserve exact text, original anchors, extraction versions and explicit coverage limitations. Do not promote video observations to transcripts or exhaustive coverage.

Partition by source unit and existing segment boundaries using a conservative UTF-8 byte budget. Every selected segment must occur exactly once; fail explicitly if a segment or total scope exceeds limits. Stable partition identities include the accepted extraction version, artifact ID and segment text/location. This pure boundary does not read storage, pin artifacts, call models, queue work or advance the workspace. Its eventual caller must load artifacts through the existing owner-scoped repository and fenced job request.

Validate with real existing extraction helpers and fixture observations: exact text, all source families, stale identity/version/checksum, selection/count mismatches, byte limits, cancellation and deterministic complete partition coverage. Commit this bounded checkpoint before integrating the understanding adapter.

## Subsequent checkpoints

1. Owned artifact reads and version-bound processing request/checkpoint contracts.
2. Bounded structured understanding proposals, then durable per-partition acceptance and progress.
3. Source-span chunk proposals with full coverage, typed pedagogical analysis and curriculum build.
4. Real processing/ready workspace projections and restart/cancel/stale-result tests.

Review, publication and Phase 4 remain outside this checkpoint. No success or processing progress should be displayed before actual accepted work exists.
