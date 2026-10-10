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

## Completed foundation and next integration boundary

The first checkpoint and bounded understanding adapter are implemented and committed. ProcessingContentService loads only accepted owned artifact IDs and checks type/body/version/selection; video units also match the saved metadata and observation references. UnderstandingService proposes immutable receipts per partition, validates retained receipts before reuse, and stops when checkpoint acknowledgement fails. The body-free checkpoint includes the complete immutable partition inventory and completed prefix. Shared contracts and SQL acceptance/pinning helpers exist, but no durable understanding job or processing UI is enabled yet.

Next, extend the existing job and snapshot unions together with command/service/repository/worker integration. Preserve an immutable processing request, keep processing progress separate from material acquisition, fence every accepted receipt and validate partition-scoped model budgets against persisted inventory. Do not expose a start control until that whole vertical slice is tested. Then add later processing stages using the same retained-content and dependency boundaries.

Verification at this boundary: 53 creation files / 479 tests pass, with TypeScript, scoped lint, worker imports and diff checks passing. No paid model calls. Real discovery SQL smoke passed separately; understanding SQL integration remains pending.
