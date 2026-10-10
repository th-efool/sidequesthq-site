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

## Durable understanding vertical slice

Add an explicit understand_material command/job and processing snapshot projection using the existing owned CAS, queue, leases, event stream and cancellation paths. Freeze the accepted source snapshot in the job input; bind checkpoint fingerprints to that immutable input. Starting understanding does not change retained source revisions. Completion means understanding only, never ready curriculum. A material-return action allows further source edits; those edits invalidate dependent understanding receipts and release pins. Retries within the existing durable job retain accepted partitions. An explicit fresh understanding request starts a new generation and is labeled accordingly.

Budget calls against the persisted immutable partition inventory, at most two per partition, using existing owner/global slots. Complete checkpoints finalize after restart without another model call, including after the work deadline. Add a functional processing panel with real partition counts, cancellation, retry/start-over and return-to-materials. Verify contracts, runner, ownership/CAS and PostgreSQL fencing/budgets before committing the slice. Later stages remain separate follow-up work.

## Next bounded checkpoint: grounded chunk contracts

Use each validated processing partition's existing ordered segments as deterministic boundary candidates. A small structured proposal may select contiguous start/end segment keys, title/summary and indices of concepts from that partition's accepted understanding. Validate complete ordered coverage without gaps, overlap, invented keys or foreign concepts. Do not let the model rewrite source text or supply persisted IDs, durations, timestamps or navigation.

Derive stable chunk IDs and full source anchors in the application, bound to extraction/partition identity. Keep source origin and scope limitations, especially estimated video observations. Enforce the Phase 2 limits of 200 chunks per learning unit and 2,500 per draft during aggregate assembly, rejecting scope instead of truncating. This checkpoint is a pure domain boundary; durable chunk jobs, provider integration, review and delivery remain subsequent work. Test full coverage, invalid boundaries/concepts, source revision changes, stable identity, provenance, limits and cancellation before committing.
