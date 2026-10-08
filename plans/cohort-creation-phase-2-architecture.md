# Cohort creation — Phase 2 architecture proposal

Date: 2026-10-08. Repository baseline: `master`, `8e5e9545aaf155ab81fd5c3d9023616b21e0352e`.

**Design only. Phase 3 is not authorized by this document.** No dependency installation, configuration, migration, application implementation, or legacy removal is included in Phase 2.

## Research plan and execution

1. Recheck Git status/diff and the Phase 1 integration boundaries.
2. Check official SDK documentation, tagged package source/manifests and registry versions against the actual runtime and dependencies.
3. Design typed state, commands, AI operations, provenance, conversation and workspace responsibilities.
4. Trace material acquisition, persistence, worker execution, recovery, feed consumption and publication against repository behavior.
5. Reconcile findings into this proposal, a dependency-ordered Phase 3 sequence and meaningful validation criteria.

The agent-army and scout-pro investigation used the primary agent and the three existing specialists: AI/contracts, flow/integration, and material/durability. No nested agents or extra concurrency were used. Their proposals were reconciled here rather than accepted independently: grounded resource discovery is required; worker configuration, retention and limits below are the consolidated policy; readiness and public publication are explicitly different.

Before research, tracked and staged diffs were empty. Pre-existing untracked items were `package-lock.json` and `plans/new cohort creation flow/`. They must remain intact. No branches, stashes, source normalization or refactors were performed. Relevant `directives/` and `execution/` were checked in the baseline investigation; there is no existing execution tool for this application flow.

Evidence labels throughout:

- **Observed:** repository source, installed declarations, PNG contents or official documentation inspected.
- **Proposed:** the architecture to implement only after approval.
- **Unverified:** behavior requiring credentials, deployment configuration or implementation tests. Research is not proof of a working integration.

All relative code locations in prose are under `C:\Users\Dell\WebstormProjects\sidequesthq-site`. The links below point to actual existing files. Proposed paths in section 11 do not yet exist.

## 1. SDK version and integration boundary

**Observed:** [package.json](<C:/Users/Dell/WebstormProjects/sidequesthq-site/package.json>) uses Next 16.2.11, React 19.2.4, TypeScript 5, Prisma 7.9.1, Mongoose 9.9.3 and direct `@google/generative-ai` 0.24.1. Vercel AI SDK is absent. Zod 4.4.3 resolves transitively. Local Node is 24.13.0. Neither package.json nor [render.yaml](<C:/Users/Dell/WebstormProjects/sidequesthq-site/render.yaml>) pins the deployment runtime.

**Requirement:** Vercel AI SDK is the selected architecture for the new experience. Its absence is a dependency-introduction task, not a reason to retain direct Google calls for the new flow.

**Proposed exact dependencies, checked on October 8:**

| Package | Version | Introduction |
|---|---:|---|
| `ai` | 7.0.133 | New server AI adapter |
| `@ai-sdk/google` | 4.0.92 | Google provider for that adapter |
| `zod` | 4.4.3 | Promote to direct dependency; shared/domain schemas |
| `@ai-sdk/react` | 4.0.136 if later needed | Omit initially; custom conversation/workspace and NDJSON do not require its hooks |
| `busboy` | 1.6.0 | Streaming multipart upload parser; add compatible type declarations |
| `pdfjs-dist` | 6.4.299 | Server PDF text/page extraction |
| `@mozilla/readability` | 0.6.0 | Article extraction |
| `jsdom` | Existing resolved 29.1.1 | Move runtime use from dev-only to production dependency |

Core/provider require Node >=22 and Zod `^3.25.76 || ^4.1.8`; local dependencies satisfy those declared constraints. Use **Node 24** for web and the new worker, retaining the current local major and satisfying PDF parser requirements. Exact build/runtime compatibility remains a Phase 3 check. Do not alter the pre-existing untracked lockfile during research; installation must review its existing content and produce a scoped, reviewable dependency diff.

Official release/tag evidence: [core 7.0.133](https://github.com/vercel/ai/releases/tag/ai@7.0.133), [Google 4.0.92](https://github.com/vercel/ai/releases/tag/@ai-sdk%2Fgoogle@4.0.92), [tagged core manifest](https://raw.githubusercontent.com/vercel/ai/ai@7.0.133/packages/ai/package.json), [tagged Google manifest](https://raw.githubusercontent.com/vercel/ai/@ai-sdk%2Fgoogle@4.0.92/packages/google/package.json). Parser references: [PDF.js](https://github.com/mozilla/pdf.js), [Readability](https://github.com/mozilla/readability), [Busboy](https://github.com/mscdex/busboy).

Version discipline: current official SDK docs identify **v7** and match the proposed stable major. There is no installed Vercel SDK behavior to compare. Installed direct Google behavior remains legacy behavior. New code should use v7 `generateText`/`streamText` with `Output.object`, `instructions`, `tool({ inputSchema })`, `isStepCount` and `createGoogle`; do not copy older `generateObject`, `parameters`, `maxSteps` or provider initialization tutorials into the design. Tagged source is the authority if later documentation changes. [Google exports at the proposed tag](https://raw.githubusercontent.com/vercel/ai/@ai-sdk%2Fgoogle@4.0.92/packages/google/src/index.ts), [v7 stop conditions](https://raw.githubusercontent.com/vercel/ai/ai@7.0.133/packages/ai/src/generate-text/stop-condition.ts).

**Migration boundary:** new creation/recommendation/refinement/material-observation services use Vercel SDK exclusively. Existing direct Google curriculum/vector/chunk services stay intact for `/create-cohort` and other callers. Shared pure scoring, duration, ordering and presentation helpers can be reused; importing a legacy service that makes direct Google calls is not an acceptable shortcut for the new path.

**Tradeoff:** two AI integrations temporarily coexist. This limits regression scope and avoids making new behavior depend on legacy mocked extraction/fallbacks. Consolidation can be considered after replacement is proven and explicitly approved.

## 2. Google model/provider integration

**Observed:** [vectorScoring.service.ts](<C:/Users/Dell/WebstormProjects/sidequesthq-site/src/server/domain/cohort/vectorScoring.service.ts>) names `gemini-1.5-flash`; existing services read `GEMINI_API_KEY`. Provider configuration and task contracts are not currently separated consistently.

**Proposed:** initialize `createGoogle({ apiKey: process.env.GEMINI_API_KEY })` in server-only infrastructure. The SDK's implicit Google key name differs, so pass the existing key explicitly. Keep `COHORT_AI_MODEL` in one server configuration; inject the resulting `LanguageModel` into task adapters. No secrets, provider types or model IDs reach shared schemas/React.

Select **`gemini-3.5-flash-lite`** as the new flow's initial small-model default. Google's current catalog recommends it for new applications; its model page documents structured output, search grounding and multimodal inputs. Do not silently change legacy model names. Availability, billing/quota and quality with the existing account are unverified until a narrowly scoped Phase 3 smoke test. [Google model catalog](https://ai.google.dev/gemini-api/docs/models), [model capabilities](https://ai.google.dev/gemini-api/docs/models/gemini-3.5-flash-lite).

The task registry specifies required capabilities: structured text for most tasks; grounded discovery for resource finding; video/PDF observations only for those adapters. Changing a model requires adapter capability checks and task evaluations, not rewriting flow state or components. Provider-specific grounding/video code sits behind `ResourceDiscovery` and `MaterialObservation` interfaces. Another provider may need a different adapter for those capabilities; provider independence does not mean every model supports identical modalities.

**Tradeoff:** one initial provider/model minimizes operations overhead; capability-specific adapters preserve changeability without pretending Google-only features are universal. No automatic quality downgrade or model hopping on failure.

## 3. AI-layer architecture and requirement mapping

```text
User query / material / correction
  → typed route command
  → creation application service
       → repository / source adapter / durable job
       → domain AI task interface
            → Vercel SDK adapter → Google provider/model
       → schema + semantic validation
       → accepted application revision + artifact references
  → typed snapshot / NDJSON events
  → deterministic flow selectors → conversation + workspace screens
```

Application state owns navigation, permissions, selections, counts, saves and publication. AI proposes educational content and explanations. It cannot return routes, components, arbitrary patches, database mutations, progress percentages or success flags.

| SDK capability | Actual use | Boundary / when not needed |
|---|---|---|
| Provider/model abstraction | Inject a model into creation AI tasks | React/domain contracts never import Google SDK types |
| Structured generation | Intent, candidate ranking, concepts, chunk proposals, analysis, curriculum, refinement | Final output must pass semantic validation before acceptance |
| Schema-constrained output | Small operation-specific Zod projections | Full persisted draft is not a model response schema |
| Streaming | Optional provisional explanations/preview; application progress always streamed via NDJSON | Up-to-five recommendations initially return atomically; partial model JSON never becomes accepted state |
| Tool calling | Grounded search for `find material` and goal-only discovery | No tools needed for DB candidate retrieval/ranking, joins, navigation or publication |
| Multi-step generation | Bounded discovery then selection; partitioned material analysis then synthesis | No autonomous agent loop governing the entire experience |
| Cancellation | SDK `abortSignal`, bounded timeouts, explicit persisted job cancellation | Browser disconnect stops observation, not durable work |
| Retries/errors | Explicit task budgets and sanitized application errors | Schema validity does not imply semantic correctness or automatic repair |
| Server/client boundaries | Provider/parser/credentials execute in server routes/worker | Browser only receives application DTOs |
| Long-running generation | SDK calls inside checkpointed application jobs | SDK is not the durable executor/queue |
| Typed contracts | Zod at ingress, AI output, artifact and persistence boundaries | TypeScript alone cannot validate external JSON |

Task plan:

1. **Interpret intent:** retain the query; propose topic/outcomes/search terms and explicitly unknown constraints. Run once and reuse the accepted result when entering custom creation. Do not ask a questionnaire or infer unstated skill/availability as fact.
2. **Recommend:** application retrieves at most 50 eligible database candidates using existing textual/category fields, not the mock Explore store. AI ranks supplied candidate keys and explains relevance; application hydrates real cards and caps at five. If retrieval is sufficient, interpretation and ranking may share one bounded call; a separate interpretation call is justified only when needed to retrieve candidates or preserve intent downstream.
3. **Discover:** a `ResourceDiscovery` adapter uses one grounded Google search pass, returns citation-backed candidate URLs, then application validates URLs and resolves actual metadata. A separate small constrained selection chooses candidate keys. At most three discovery calls per request; no unrestricted browsing/tool loop. No ungrounded model URL list. [Google search grounding adapter](https://ai-sdk.dev/providers/ai-sdk-providers/google#google-search).
4. **Understand:** per acquired source/unit, propose a summary and grounded concepts; merge by source references.
5. **Chunk:** deterministic candidate spans first; semantic proposals select existing segment spans. Video observation boundaries are explicitly estimates unless actual timed captions exist.
6. **Analyze:** score accepted chunks using the existing twelve pedagogical dimensions; propose dependencies and learning labels. These are pedagogical estimates, not semantic embeddings or objective guarantees.
7. **Build:** assemble validated chunks into ordered seasons/lessons, goals and editable metadata. Partition large inputs by unit, then build from bounded summaries/references rather than one enormous prompt.
8. **Refine:** explicit user nudges produce a typed supported change proposal bound to the current revision. Apply dependency-specific invalidation, protecting user edits.

Logical tasks are not one call per screenshot. Extraction is deterministic when possible. Per-unit physical calls are bounded/checkpointed. No AI runs when joining, saving, setting visibility or publishing already prepared artifacts.

Initial text window budget is 16k input tokens with bounded output by schema; video/PDF budgets are separate and source-specific. Preserve the complete source artifact, partition with stable anchors and a coverage ledger, and request smaller scope when limits are exceeded. Never silently truncate input and report full processing.

**Tradeoff:** multiple narrow tasks incur orchestration work but support recovery, provenance, user corrections and predictable costs. A giant prompt would make all of these brittle.

## 4. Complete flow and screenshot resolution

```text
Landing query
  → recommendations [2]
      ├─ Join → authenticate if needed → eligibility recheck → membership → cohort
      └─ Create my own → starting point [3]
          ├─ Have material → input [4]
          ├─ Find material → grounded discovery → select sources [4]
          └─ Have a goal → interpret goal → discovery → confirm sources [4]
                              └─ explicit AI-authored guide option if desired
          → acquire/validate sources
          → understanding [5] → chunking [6] → analyzing [7]
          → building → ready [8]
              ├─ Go to my feed → private activation → /play
              └─ Review cohort → review [9]
                    ├─ save/edit/nudge → review or dependent reprocessing
                    └─ Publish → finalizing → success [10 overlay on 9]
```

**Observed reference inventory:** all nine PNGs were inspected in Phase 1; 3, 8 and 9 were re-inspected during architecture reconciliation. Pixel dimensions are assets, not proven CSS viewports. Desktop composition is inferable; browser chrome, DPR, zoom, crop and exact intended viewport remain unknown. Responsive geometry must be derived with the actual landing implementation and later browser validation.

| Reference | Pixels / ratio | Observed structure | Proposed application state |
|---|---|---|---|
| [2.png](<C:/Users/Dell/WebstormProjects/sidequesthq-site/plans/new cohort creation flow/2.png>) | 1585×992 / 1.5978 | Conversation rail, emphasized best-match card plus four smaller cards, Join and create-own | `recommendations`; dynamic 0–5 eligible records, deterministic slots/hierarchy |
| [3.png](<C:/Users/Dell/WebstormProjects/sidequesthq-site/plans/new cohort creation flow/3.png>) | 1585×992 / 1.5978 | Three starting points | `starting_point`; one discriminated acquisition branch |
| [4.png](<C:/Users/Dell/WebstormProjects/sidequesthq-site/plans/new cohort creation flow/4.png>) | 1585×992 / 1.5978 | Paste/drop/file affordances, source icons, source list/add/remove | `materials`; URL/file/drop/discovery/connector variants of one step |
| [5.png](<C:/Users/Dell/WebstormProjects/sidequesthq-site/plans/new cohort creation flow/5.png>) | 1585×992 / 1.5978 | Source/lecture progress, concept visualization | `processing.understanding`; selections and grounded concepts |
| [6.png](<C:/Users/Dell/WebstormProjects/sidequesthq-site/plans/new cohort creation flow/6.png>) | 1586×992 / 1.5988 | Selected lecture, chunk detail and timeline | `processing.chunking`; real accepted boundaries and source anchors |
| [7.png](<C:/Users/Dell/WebstormProjects/sidequesthq-site/plans/new cohort creation flow/7.png>) | 1586×992 / 1.5988 | Chunk analysis dimensions | `processing.analyzing`; typed twelve-dimensional estimates, selected chunk |
| [8.png](<C:/Users/Dell/WebstormProjects/sidequesthq-site/plans/new cohort creation flow/8.png>) | 1584×993 / 1.5952 | All-set state, completed checks, Building highlight, Go to my feed | `ready`; building committed, not publicly published |
| [9.png](<C:/Users/Dell/WebstormProjects/sidequesthq-site/plans/new cohort creation flow/9.png>) | 1536×1024 / 1.5000 | Draft preview, review/refinement, save and publish | `review`; user-editable validated draft |
| [10.png](<C:/Users/Dell/WebstormProjects/sidequesthq-site/plans/new cohort creation flow/10.png>) | 1584×993 / 1.5952 | Success dialog above dimmed review, URL/visibility/actions | `published`; committed receipt, overlay rather than new standalone route |

**8 → 9 decision:** screenshot 8 supplies a feed action, but no explicit review continuation. Preserve its primary CTA and make it perform private activation. Add a minimal contextual/secondary **Review cohort** action to open 9. This is a documented addition necessary to connect the specified creator path; it is not visible reference evidence. Do not rename the feed CTA, auto-publish, or use a timer to jump to review. Phase 2 approval accepts this interpretation; Phase 4 will place the minimal control carefully.

Goal-only users need not supply their own material: discovery and preselection are AI-assisted, with meaningful source confirmation. If discovery cannot obtain suitable resources, preserve the goal and offer retry/material input or an explicit **AI-authored guide** choice. Such content is labeled generated, has no invented source citation, and is still processed into structured artifacts. It is never a silent substitute for failed extraction.

Model state as `WorkspaceStage = recommendations | starting_point | materials | processing | ready | review | finalizing | published`; processing has `understanding | chunking | analyzing | building`. Async status is independently `idle | queued | running | needs_input | succeeded | failed | canceled`. The pure transition table specifies commands, guards and effects; stage descriptors map IDs to views. Stage order can change without route or model-response changes.

Guards: processing requires current readable inputs; ready requires all required artifact versions/coverage; review requires ready curriculum; finalization requires valid current snapshot, owner and explicit mode. Completion events carry operation/input revision; stale events cannot advance state. Back revisits editable inputs without pretending to undo a committed publication. Leaving a page does not discard the server draft.

**Tradeoff:** an explicit readiness branch preserves both screenshots' meaning. A single numerical step would conflate acquisition variants, async work and public publication.

## 5. Typed domain/data contracts and field provenance

Provenance vocabulary: **U** user-provided; **AI** model-generated proposal; **A** application-derived; **DB** authoritative persisted database identity/data. Persisting AI text does not turn its origin into DB-authored content. Server state is authoritative, while each editable field retains its origin and accepted revision. Use `FieldValue<T> = { value: T; origin: 'user' | 'ai' | 'application' | 'database'; acceptedRevision: number; evidenceRefs?: SourceLocation[] }` where origin matters to review/merging; avoid wrapping every ID mechanically.

| Contract | Field classification and meaning |
|---|---|
| `LearningIntent` | `rawQuery: string` U; `topic: FieldValue<string>`, `outcomes: FieldValue<string[]>`, `level/language/pace` optional AI interpretation or U override; `constraints` U only when stated; `searchTerms` AI; `uncertainties` AI; `id`, `revision`, `normalizedQuery`, `createdAt` A (persisted identity DB). Unknown level/pace stays unknown. |
| `ExistingCohortReference` | `cohortId`, title/subtitle/description, cover, creator identity, categories, language, difficulty, visibility, `isPublished` DB; `memberCount`, lesson count, duration totals A from DB; `joinEligibility` A from DB policy. No fabricated rating/completion metadata. |
| `CohortRecommendation` | `cohort` DB reference/projection; `reason`, model relevance ordering AI; `rank`, `isBestMatch`, request ID/revision A after validation. Set `items` array length 0–5, distinct eligible IDs; scores are not displayed as objective match percentages. |
| `CustomCohortDraft` | `id`, `ownerId`, timestamps DB; `schemaVersion`, `revision`, stage, selections, artifact manifest A persisted in DB; starting point/source selections U; intent/metadata/curriculum mixed provenance; linked cohort/publication IDs DB. Raw source bodies are references, not draft JSON. |
| `MaterialSource` | Discriminated `kind: youtube_video | youtube_playlist | web | pdf | markdown | github | notion | generated_guide`; URL/file selection, chosen units/order U; ID, canonical URL, checksum, retrieval time, parser status A; upload/connection IDs DB; source title/author/version A from retrieved provider metadata; generated guide body AI. |
| `ExtractedContent` | `materialId`, version/checksum, ordered segments, artifact reference, byte/token counts, coverage A; segment ID/text/anchor A from parser or authorized source; `extractionKind: text | authorized_caption | user_transcript | video_observation | generated_guide`; user transcript U, video observations/generated guide AI. Source omission/uncertainty is retained. |
| `SourceLocation` | Material/unit/segment references A; video seconds, PDF page/text offset, GitHub commit/path/lines, Notion block ID, article heading/text range A from extraction. AI may propose an interval, but its estimated provenance survives validation. |
| `ProcessingState` | Job/operation ID, input revision, stage, status, completed/total units, cursor, errors and retry/cancel availability A; accepted checkpoints/lease and job records DB. Percent derives only from known completed/total work. |
| `Concept` | ID A; label/summary/prerequisite proposals AI or U edit; source segment refs selected AI then verified A; accepted graph A after acyclicity/reference checks. |
| `Chunk` | ID, source/extraction revision, position and artifact ref A; semantic span/title/summary AI or U edit; grounded source content A; timestamp bounds A validated against actual duration; reading estimate A with method/label, not video runtime. |
| `ChunkAnalysis` | Existing `PedagogicalVector12D`, `isStrictlyLinear`, confidence/reasoning and educational labels AI estimates; validated range and canonical array ordering A; evaluated/model/prompt/schema version A. U corrections override explicit supported properties. |
| `GeneratedCurriculum` (new normalized contract) | Season/lesson organization/title/objectives AI or U edit; IDs, order normalization, chunk/material refs, totals and coverage A; `lessonType` A derived from actual delivery artifact; durations seconds A, with estimate method for reading; warnings A plus grounded AI uncertainties. No arbitrary assets/URLs from the model. |
| `ReviewState` | Title/subtitle/description/audience/outcomes/category proposals AI and preserved U edits; chosen cover U from an application asset registry; visibility and supported community settings U; validity/warnings/quality calculations A; save acknowledgement/revision DB. |
| `PublicationState` | Requested mode `private_activation | public_publish`, explicit visibility U; operation/idempotency/snapshot hash A; cohort ID, publication phase, committed revision/time and receipt DB; canonical URL A from configured origin + DB cohort ID. |
| `ConversationEntry` | User text U; model explanations/proposals AI; deterministic stage notices/context actions A; IDs, revision references and persistence DB. Conversation is a projection, never the state store. |

All optional fields are explicitly optional/unknown. Generic `Record<string, unknown>` is allowed only before parsing an external boundary, not as accepted domain state. Field lengths, array sizes, enums and schema version are bounded.

Reuse [pedagogicalVector.types.ts](<C:/Users/Dell/WebstormProjects/sidequesthq-site/src/shared/curriculum/pedagogicalVector.types.ts>): cognitive_load, practicality_actionability, visual_dependence, scaffolding_guidance, linearity_dependency, novelty_divergence, abstraction_depth, pacing_density, rigor_formality, interactivity_agency, breadth_scope, emotional_energy. Each normalized value is finite in [0,1]. Screenshot 7's “technical depth” is a display projection of abstraction_depth and rigor_formality (initial equal weighted mean), not a thirteenth stored dimension. Label it as an estimate; calibrate with fixtures.

Reuse presentation/ordering conventions from [curriculum.types.ts](<C:/Users/Dell/WebstormProjects/sidequesthq-site/src/shared/curriculum/curriculum.types.ts>) through an explicit adapter. The new canonical contract uses numeric seconds and content references rather than legacy duration strings and video-only imported lesson assumptions. Do not globally change those shared types before checking every consumer.

**Tradeoff:** canonical normalized artifacts add an adapter boundary but avoid coupling AI content to legacy display assumptions or corrupting authoritative card statistics.

## 6. Schemas, validation and malformed output

Shared schemas define client commands, snapshots, event envelopes, artifacts and accepted contracts. Server AI response schemas are smaller projections: `IntentProposal`, `RecommendationRanking`, `ResourceSelection`, `UnderstandingProposal`, `ChunkBoundaryProposal`, `ChunkAnalysisProposal`, `CurriculumProposal`, `RefinementProposal`.

Example design shape, not implementation:

```ts
type RecommendationRanking = {
  matches: Array<{ candidateKey: string; reason: string }>;
}; // max 5; IDs must belong to application-supplied eligible candidates

type RefinementProposal = {
  baseRevision: number;
  explanation: string;
  changes: Array<
    | { kind: 'set_metadata'; field: 'title' | 'description'; value: string }
    | { kind: 'reorder_lessons'; seasonKey: string; lessonKeys: string[] }
    | { kind: 'set_objectives'; lessonKey: string; objectives: string[] }
    | { kind: 'request_rechunk'; materialKey: string; strategy: 'shorter' | 'semantic' }
  >;
};
```

Validation sequence:

1. Parse ingress; authenticate/authorize; validate command revision and referenced IDs.
2. Give the model a shallow task schema using v7 `Output.object({ schema })`. Keep native structured output enabled and schemas within provider complexity limits.
3. Validate the final result with SDK/schema checks. Partial objects are provisional only. [Structured-output behavior](https://ai-sdk.dev/docs/ai-sdk-core/generating-structured-data), [tagged final/partial validation implementation](https://raw.githubusercontent.com/vercel/ai/ai@7.0.133/packages/ai/src/generate-text/output.ts).
4. Domain validators check candidate membership/eligibility, unique keys, source-span existence, bounds/coverage, finite scores, acyclic prerequisite graph, valid ordering, totals, asset references and current input revision.
5. Map accepted proposals to application IDs/artifacts; write artifact, then atomically checkpoint its reference and state/event in PostgreSQL.

Malformed schema output receives at most one bounded repair attempt using safe validation feedback; invalid source references/cycles may be repaired once if supported. Both attempts share the task cost budget. Otherwise return `AI_INVALID_OUTPUT`, preserve the last accepted state and offer retry. Never accept a fabricated transcript, missing plan, generic fallback vector or invalid JSON as a successful AI result.

SDK object validity cannot prove educational correctness/source fidelity. Retain provenance, uncertainty and review; fixtures and live evaluation validate quality. Sources and user text are treated as task data, not instructions to change permissions or run tools. Provider payloads/prompts/private content are excluded from normal logs and telemetry.

**Tradeoff:** a stricter semantic validator may reject plausible output, but prevents invented join targets, unsupported source references and stale overwrites.

## 7. Conversation + workspace

The left conversation panel captures intent/corrections, explains actual progress and offers state-appropriate actions. The right workspace displays canonical source lists, concepts, chunks, metrics, curriculum and draft preview. Both receive the same typed server snapshot/selectors.

Commands include `choose_starting_point`, `add_material`, `remove_material`, `select_units`, `start_processing`, `retry_operation`, `cancel_operation`, `apply_refinement`, `open_review`, `save_draft`, `activate_private`, `publish` and `ask_explanation`. Natural-language interpretation may propose supported refinements; publish/join/delete/visibility changes require an explicit application action bound to the revision. The model cannot execute them as tools. This is product interaction behavior, not an extra approval gate for the engineering task.

Show one focused clarification only when intent cannot be acted on safely/meaningfully. Do not collect pace/level/audience as mandatory wizard screens. Defaults are marked application defaults and remain editable.

| Change | Invalidate | Preserve |
|---|---|---|
| Title/description/audience copy or cover | Preview/metadata validation | Material, chunks and analysis |
| Material addition/removal/replacement | Affected extraction/chunks/analysis and aggregate curriculum | Unchanged source artifacts |
| Materially changed goal/topic | Intent/discovery and goal-dependent analysis/build | Reusable source extraction/boundaries |
| Chunk boundaries/strategy | Affected chunks and downstream analysis/build | Original source |
| Difficulty/pacing nudge | Dependent analysis/curriculum projections | Extraction and unaffected boundaries |
| Season/lesson reorder | Structural/prerequisite validation and totals | Grounded content |
| Visibility/community setting | Publication/settings validation | Educational artifacts |

Each accepted mutation increments input revision; dependency fingerprints determine whether an artifact is reusable. A stale job can retain a reusable artifact but cannot attach it to a newer incompatible revision. Unsupported/ambiguous nudges ask for clarification; no arbitrary JSON Patch is applied.

**Tradeoff:** bounded commands cover meaningful learning edits while keeping state testable; an unrestricted chat history cannot safely provide that authority.

## 8. Material ingestion

**Observed:** [YouTube importer](<C:/Users/Dell/WebstormProjects/sidequesthq-site/src/server/imports/youtube/youtube-import.service.ts>) has real paginated metadata but no transcript extraction. [GitHub importer](<C:/Users/Dell/WebstormProjects/sidequesthq-site/src/server/imports/github/github-import.service.ts>) calls an unverified `extract`; [Notion importer](<C:/Users/Dell/WebstormProjects/sidequesthq-site/src/server/imports/notion/notion-import.service.ts>) uses the wrong namespace and manufactures extraction text. Existing import return types omit substantial source text. They are not ready-made real ingestion services.

All adapters return `MaterialManifest` + durable normalized content segments + explicit provenance/capabilities/errors. One source may expand into many selected units. Multiple sources remain separate identities; deduplication uses canonical input/version/checksum, never a single flattened default lesson.

| Material | Acquisition / reuse | Execution and recovery |
|---|---|---|
| YouTube | Reuse URL parsing and paginated metadata. Prefer legitimate authorized captions/user transcript when available. Otherwise observe a public video through the Vercel Google adapter, one video per call. | Background, per-video checkpoints, cancellable model calls, retry transient failures; timestamp estimates labeled. Unavailable/quota-limited videos need input/retry, not fake transcripts. |
| Web/article | Controlled server fetch, inert DOM + Readability, stable heading/text anchors. | Background, HTTP deadline/size bounds and redirect/DNS validation; authenticated/JS-only pages offer upload/paste alternative. No script execution. |
| PDF | Stream upload to GridFS, page-text extraction using PDF.js. | Background parser, page anchors; encrypted PDF asks for unlocked input. Image-only pages use a bounded model observation/OCR branch with uncertainty and page references, never claim verbatim parser extraction. |
| Markdown/text | UTF-8 decode, deterministic offsets/headings/code blocks, preserve source. | Background for consistent manifests; no HTML/code execution. File picker and drop share upload command. |
| GitHub | Installed typed `repositories.getContent`, repository/commit metadata; pin commit, traverse selected README/docs text paths. | Background, paginate/bound traversal, retain text/path/lines; record skipped binary/symlink/submodule. Public read or explicit user-scoped connector for private repositories. |
| Notion | Installed `databasePages.getDatabasePage`, recursive paginated `blocks.getManyChildBlocks`; preserve rich text/block IDs. | Background, explicit user-scoped connection; permission/reconnect failure retains same job/source. No synthetic body or searching unrelated pages. |
| AI-authored guide | Explicit goal-only user choice; structured generated text with topic/user intent provenance. | Background AI generation, labeled authored content without fake source URL; same chunk/analysis/build pipeline. |
| Upload/drop | Streaming multipart into private GridFS; file type/signature/bytes/hash checks. | Upload synchronous stream/ack; completed file parsed in jobs; interrupted upload is unsaved and can be replaced. |

The [YouTube caption API](https://developers.google.com/youtube/v3/docs/captions/download) requires appropriate authorization; API-key video metadata cannot establish arbitrary transcript access. Google's native [video understanding](https://ai.google.dev/gemini-api/docs/video-understanding) documents YouTube support as preview with access/quota restrictions. SDK docs mention public/unlisted and one video per request, whereas Google's guide is stricter about public videos. Baseline support is **public videos, one per request**; do not promise unlisted access. Video observations are AI-generated interpretations, not fetched captions. The reference's 25-video/14-hour example may exceed free-tier allowance; expose actual quota/capability failure and preserve progress.

Installed Corsair declarations were inspected: GitHub plugin 0.1.19 supports repository content endpoints; Notion 0.1.6 supports the namespaces above and sends `Notion-Version: 2022-06-28`. Follow that installed API behavior, not newer Notion data-source tutorials. [GitHub contents API](https://docs.github.com/en/rest/repos/contents), [Notion block children](https://developers.notion.com/reference/get-block-children).

[corsair.ts](<C:/Users/Dell/WebstormProjects/sidequesthq-site/src/server/corsair.ts>) is not configured for multi-tenancy although imports call `withTenant` through loose typing. Introduce a **new user-scoped connector client/configuration** behind the material adapter, with server-derived user binding and explicit connection. Preserve legacy singleton connections; do not repoint them automatically or treat a material ID as an authenticated tenant.

Network adapter policy validates HTTPS/public destinations, resolved addresses and every redirect, response type, compressed/uncompressed sizes and deadlines. Only provider-approved YouTube URLs pass directly as SDK file URLs; acquired article/files use controlled bytes/text, avoiding uncontrolled SDK URL downloads. Source text is inert even when it contains prompt-like instructions.

Initial configurable application limits: 20 top-level sources, 100 selected learning units, 25 MiB/file, 100 MiB/draft, 200 PDF pages, 100 GitHub text files, Notion depth 8/2,000 blocks, 1 MiB extracted text/source, 200 chunks/unit and 2,500 chunks/draft. These are product bounds, not SDK/provider guarantees. Crossing them requests scope selection; no silent success on truncation.

**Tradeoff:** real source acquisition takes more work than adapting metadata-only imports, but is required for an honest working flow. No unrelated importer rewrite.

## 9. Progress, streaming and durable execution

**Observed:** [GitHub import route](<C:/Users/Dell/WebstormProjects/sidequesthq-site/src/app/api/import/github/route.ts>) streams NDJSON and supports request cancellation; work lives inside the request. [cohortVectorizationWorkflow.ts](<C:/Users/Dell/WebstormProjects/sidequesthq-site/src/server/infrastructure/workflows/cohortVectorizationWorkflow.ts>) is an ordinary inline function, not a durable task. [worker.ts](<C:/Users/Dell/WebstormProjects/sidequesthq-site/src/server/worker.ts>) exposes an HTTP `/run` handler while render.yaml declares a background worker.

**Proposed:** retain NDJSON as the application transport and add persistent jobs/events. Introduce a distinct polling entry point `src/server/creation-worker.ts`; leave the legacy HTTP worker intact. Add a dedicated Render background service for this entry point with explicit Node/dependencies. Background workers cannot accept inbound HTTP, so dispatch by PostgreSQL job records. [Render worker constraints](https://render.com/docs/background-workers).

Claim queued jobs using short PostgreSQL transactions and parameterized `FOR UPDATE SKIP LOCKED`; do external work outside transactions. Lease/fencing token, heartbeat and input fingerprint guard every checkpoint/completion. [PostgreSQL queue-related locking](https://www.postgresql.org/docs/current/sql-select.html).

Consolidated initial policy: two concurrent jobs and at most two simultaneous worker model calls; lease 90 seconds, heartbeat 20 seconds; HTTP deadline 30 seconds, parser unit 60 seconds, text-generation unit 90 seconds, video-observation unit 180 seconds, run wall budget 30 minutes. Larger jobs pause with saved checkpoints/scope guidance rather than run unbounded. Recommendation budget is 30 seconds total. Deployment monitoring must tune these measured limits and provider quotas.

`GET /api/cohort-creation/drafts/:id/events?after=sequence` observes persisted events and snapshot. Event envelope: schemaVersion, draftId, jobId if applicable, inputRevision, monotonic per-draft sequence, event kind and bounded payload. Save checkpoint/state and persistent event together in one PostgreSQL transaction; an artifact must exist before referencing it. Heartbeats are ephemeral. Reconnection replays after cursor; expired history returns a full snapshot/cursor. Polling fallback uses existing React Query conventions.

Progress stages map to 5/6/7/8. Show real unit completions when total is known; otherwise show an indeterminate operation. Source-local failure does not fabricate whole-pipeline success; user retries, replaces or explicitly excludes it, then dependent artifacts recompute. Model token streaming is not percentage complete.

SDK streaming stays behind the adapter. Optional provisional preview can emit an application `preview_delta`; final validated output commits atomically. Handle stream callback errors, abort and final output rejection, not only initial invocation. [streamText timeouts/cancellation](https://ai-sdk.dev/docs/reference/ai-sdk-core/stream-text), [SDK error handling](https://ai-sdk.dev/docs/ai-sdk-core/error-handling).

**Tradeoff:** a small durable queue adds repositories/leases but reuses PostgreSQL and avoids Redis or a second progress protocol. Render Workflows is a valid later executor adapter, not currently configured durability. Permanent application receipts remain necessary regardless of managed task deduplication.

## 10. Persistence, draft recovery and publication

**Observed:** [cohortCleanupTask.ts](<C:/Users/Dell/WebstormProjects/sidequesthq-site/src/server/infrastructure/workflows/cohortCleanupTask.ts>) deletes unpublished cohorts older than one hour. [cohort.service.ts](<C:/Users/Dell/WebstormProjects/sidequesthq-site/src/server/domain/cohort/cohort.service.ts>) creates SQL rows before inline/mock processing and compensates only some SQL failures. Whole-cohort Mongo chunk deletion and `default-lesson` IDs in the vector workflow are unsafe for independently versioned sources.

Add separate PostgreSQL records, not unfinished `Cohort` rows:

| Record | Essential fields / constraints |
|---|---|
| `CreationDraft` | Owner, schema version, revision, current stage, small validated snapshot, artifact manifest, linked cohort ID unique when assigned, saved/expiry timestamps |
| `CreationMaterial` | Draft/source ID, kind, canonical input, selected units/order, content checksum/version, status, artifact pointer, provenance and sanitized error |
| `CreationMaterialAsset` | Owner/draft/material, GridFS ID, MIME/name/bytes/hash, uploading/ready/deleting state, expiry |
| `CreationJob` | Draft/task kind, input fingerprint/revision, status/attempt/next run, checkpoint, lease owner/token/until, heartbeat, cancel request; unique task fingerprint for deduplication |
| `CreationEvent` | Draft + monotonic sequence unique, typed small payload, timestamp; transactionally allocated |
| `CreationConversationEntry` | Draft/owner, ordered entry ID, role/origin, bounded text, referenced revision/command/proposal and applied status; accepted conversation history only, not partial model buffers |
| `CreationPublication` | Draft, mode, revision/snapshot hash, operation/idempotency key, reserved cohort/lesson ID mapping, phase/error/receipt; unique request scope and draft link to one cohort |

Create only typed, versioned JSON snapshots; store binaries/unbounded text in Mongo/GridFS behind `MaterialBlobStore` and `CreationArtifactRepository`. Use existing Mongo/native-driver connection infrastructure. GridFS is new use of existing storage, not an existing upload implementation. [Mongo GridFS](https://www.mongodb.com/docs/drivers/node/current/crud/gridfs/).

Revision writes use owner + `baseRevision` compare-and-swap in a transaction; conflicts return 409 and current state, preserving unsent client edits. Distinguish `revision` (every accepted snapshot mutation) from `inputRevision` (accepted input/configuration changes only). Processing checkpoints/events do not invalidate their own job by advancing inputRevision. Jobs commit against input fingerprints, cancellation and fencing tokens; snapshot revisions/cursors still advance so concurrent clients see consistent state. Artifact keys include source checksum, relevant input fingerprint and model/prompt/schema version. Crash recovery attaches only complete validated immutable artifacts. No PostgreSQL transaction spans an AI call.

Refresh/navigation load draft + active jobs + cursor. Authenticated saved drafts survive closure. Unsaved text and incomplete uploads are explicitly unsaved; tab sessionStorage may preserve pending query/choice through authentication, but is not durable draft storage. Never store files/private extracted bodies in URLs/localStorage. Expired auth can reauthenticate then resume the same owned draft.

Conversation entries persist separately in PostgreSQL with bounded text and revision references; processing notices are projected from checkpoints/events, not repeatedly appended on reconnect. Load history by page without sending all prior conversation to every model task. Anonymous request budgets use short-lived PostgreSQL counters keyed by a server-salted client identifier; owned job/model budgets use the authenticated user/draft. No new Redis service or client-supplied identity is required.

Initial retention policy: draft inactivity 60 days, replay events 7 days, incomplete uploads 24 hours, unreferenced artifacts at least 7 days before reconciliation. Active leased work and published references prevent deletion. GridFS cleanup deletes actual file/chunks through its API; metadata TTL alone is insufficient. Failed jobs do not prolong retention indefinitely. Existing one-hour cleanup remains unchanged because new drafts do not live in `Cohort`.

### Finalization saga

1. Explicit private activation/public Publish command validates owner, readiness, visibility and current revision. Freeze immutable snapshot, reserve one cohort ID and stable lesson/chunk IDs, create/reuse operation receipt. Different idempotency keys cannot produce two cohorts for the same draft; same key with different payload conflicts.
2. Durable finalization prepares versioned Mongo artifacts using reserved IDs. Validate content, all chunks/vectors and references. These artifacts are not globally readable and are not selected by feed merely because they exist.
3. Short PostgreSQL transaction creates the fully materialized cohort, sources, seasons, published lessons, creator membership and supported community settings; writes draft link and success receipt atomically. Reuse nested-create semantics from [cohort.repo.ts](<C:/Users/Dell/WebstormProjects/sidequesthq-site/src/server/infrastructure/db/postgres/repositories/cohort.repo.ts>), with scoped methods accepting reserved IDs/transaction client. No AI call here.
4. Private activation uses `visibility=PRIVATE`; public publication uses `visibility=PUBLIC`. Both are materialized records with `isPublished=true` for existing delivery queries, while the publication record distinguishes private activation from public publication. Draft readiness is independent of that legacy flag. Private activation never implies public availability. Later Publish promotes the **same** cohort ID in a guarded transaction.
5. Lost response returns the committed receipt on retry. Mongo failure creates no visible SQL cohort; SQL failure retains prepared artifacts for retry. Cancellation before commit aborts preparation; after commit returns already finalized. Never delete a live cohort as compensation.
6. Later edits to an activated/published cohort prepare a new artifact version, then atomically swap SQL references/settings. Existing learners retain the previous valid revision until commit. Stable IDs for unchanged chunks preserve progress; genuinely changed chunks get new IDs. Cleanup is scoped to unreferenced versions, not all cohort chunks.

This is recoverable cross-database orchestration, **not** an atomic PostgreSQL+Mongo transaction. A reconciliation task checks owned prepared artifacts/receipts before cleanup.

Map URLs for uploaded/generated sources to authenticated/application content URLs; do not invent external source URLs to satisfy required `CohortSource.url`. Preserve source kind and provenance in typed settings. Add `Cohort.creationSettings Json?` for schema-versioned review/delivery settings absent from current relational fields; keep native title/audience-equivalent fields/outcomes/categories where already supported. Community chat/events booleans must reflect actual requested settings, not the repository's unconditional defaults. Do not present unsupported community features as working.

**Tradeoff:** artifacts-first publication avoids exposing staged SQL cohorts and the cleanup collision, but requires saga/reconciliation tests. Draft/publication records provide durable recovery that browser state cannot.

## 11. Component and file boundaries

Fit existing `src/shared`, `src/server/domain`, infrastructure/repositories, imports and `src/client/screens` conventions. No new global state framework or giant flow component.

```text
src/shared/cohort-creation/
  contracts/                 # Zod schemas + inferred application types
  flow/                      # state, commands, guards, transitions, dependencies, selectors
  errors.ts
src/server/infrastructure/ai/
  modelRegistry.ts           # provider/capability configuration
  vercelCohortAi.ts           # SDK adapter; task-specific outputs
  prompts/                   # versioned task instructions
src/server/domain/cohort-creation/
  intent.service.ts          # intent and recommendations orchestration
  recommendation.service.ts
  discovery.service.ts
  processing.service.ts
  refinement.service.ts
  publication.service.ts
  cohortAccessPolicy.ts
src/server/imports/materials/
  contracts.ts               # acquisition adapter boundary
  youtube.ts / web.ts / pdf.ts / markdown.ts / github.ts / notion.ts
src/server/infrastructure/db/postgres/repositories/
  creationDraft.repo.ts / creationJob.repo.ts / creationPublication.repo.ts
src/server/infrastructure/db/mongodb/
  creationArtifact.repo.ts / materialBlobStore.ts
src/server/infrastructure/workflows/creation/
  runner.ts / stageHandlers.ts / reconciliation.ts
src/server/creation-worker.ts
src/client/screens/cohortCreation/
  CreationExperience.tsx     # composition and route projection only
  providers/CreationProvider.tsx
  hooks/                     # snapshot, commands, events/reconnect
  services/creationApi.ts
  components/                # shell, conversation, source list, timeline, progress
  screens/                   # recommendations, starting point, material input,
                             # understanding, chunking, analysis, ready,
                             # draft review, publish success
```

Screen components receive view models/actions; they cannot fetch provider output or perform domain transforms. Shared processing components render selections/results across 5–8. Existing React Query owns remote snapshots; small context/reducer owns transient selection, unsent text and composition. Commands run through a client service using [apiUrl.ts](<C:/Users/Dell/WebstormProjects/sidequesthq-site/src/shared/api/apiUrl.ts>), preserving web/mobile API-origin conventions.

Use CSS Modules, existing fonts/asset registry and landing primitives. [Hero.tsx](<C:/Users/Dell/WebstormProjects/sidequesthq-site/src/client/screens/landing/Hero/Hero.tsx>), [Hero.module.css](<C:/Users/Dell/WebstormProjects/sidequesthq-site/src/client/screens/landing/Hero/Hero.module.css>), [layout.tsx](<C:/Users/Dell/WebstormProjects/sidequesthq-site/src/app/layout.tsx>) establish paper/collage treatments, Manrope/Playfair/Lora/Caveat and theme behavior. Phase 3 makes all screens usable with those primitives; Phase 4 handles individual PNG geometry/fidelity. Shared component call sites must be inspected before any edits; screen-specific variants prevent unrelated visual changes.

**Tradeoff:** more focused modules than the current 1,961-line WizardProvider, while retaining its context/reducer and service conventions rather than introducing a framework migration.

## 12. Routing and authentication

**Observed:** [CentralInterface.tsx](<C:/Users/Dell/WebstormProjects/sidequesthq-site/src/client/screens/landing/Hero/components/CentralInterface.tsx>) sends the query to `/quest/new?q=...`, which currently lacks its destination. `/create-cohort` is a separate authenticated dashboard route. Auth uses JWT sessions despite the Prisma adapter; credentials can produce a mock user on database failure. Auth forms/providers currently redirect to `/home`.

**Proposed routes:** `/quest/new` and `/quest/draft/[draftId]` in an independent `(creation)` route group, not the dark dashboard layout. Query is an initial input, not a hardcoded topic; after owned draft creation replace it with the stable draft URL. PNG states share this route; no route per PNG. Back/forward maps only to valid navigation intents; server guards reject attempts to force an invalid processing/publication state.

Anonymous query/recommendation requests are permitted with bounded per-client request budgets. Authentication is required **before durable draft ownership, uploaded files, connector access or costly material processing**. Guest users can choose a starting point before sign-in; short pending query/choice is preserved in tab storage. Validate session principal against a real DB user before creation; mock fallback identity cannot own durable records.

Introduce one sanitized same-origin relative `returnTo` helper and propagate it through [Auth.tsx](<C:/Users/Dell/WebstormProjects/sidequesthq-site/src/client/screens/auth/Auth.tsx>), credentials and OAuth callbacks/middleware. Keep `/home` default for existing sign-in behavior. Reject external/protocol-relative/encoded unsafe destinations; verify owner when resuming a draft. Pending join returns to a contextual join action and rechecks eligibility rather than replaying an unchecked mutation.

Proposed API boundaries:

| Endpoint | Responsibility |
|---|---|
| `POST /api/cohort-creation/recommendations` | Bounded atomic intent/ranking result; anonymous budget/validation |
| `POST /api/cohort-creation/drafts` | Authenticated idempotent owned draft creation |
| `GET /api/cohort-creation/drafts/:id` | Owned validated snapshot/jobs/cursor |
| `POST /api/cohort-creation/drafts/:id/commands` | Typed command + baseRevision + requestId; enqueue work where needed |
| `POST /api/cohort-creation/materials/upload` | Streamed authorized upload, size/signature checks |
| `GET /api/cohort-creation/materials/:id/content` | Authorized original/content access; independent checks |
| `GET /api/cohort-creation/drafts/:id/events` | NDJSON observer with replay cursor |
| `POST /api/cohort-creation/jobs/:id/cancel` | Persistent cooperative cancellation |
| `POST /api/cohort-creation/drafts/:id/publish` | Explicit idempotent publication; 202 operation or existing receipt |

Use existing join route with scoped eligibility/idempotency changes. Canonical cohort link is actual `/cohort/{id}`; PNG 10's example plural URL does not justify inventing a separate route.

**Tradeoff:** the auth boundary limits anonymous costs/private state while keeping the landing intent experience immediate. Durable state starts only when ownership can be enforced.

## 13. Errors, retries and cancellation

Typed application errors: `AUTH_REQUIRED`, `FORBIDDEN`, `REVISION_CONFLICT`, `COHORT_UNAVAILABLE`, `MATERIAL_UNREADABLE`, `MATERIAL_TOO_LARGE`, `CONNECTOR_REQUIRED`, `PROVIDER_QUOTA_EXCEEDED`, `AI_UNAVAILABLE`, `AI_TIMEOUT`, `AI_INVALID_OUTPUT`, `PERSISTENCE_FAILED`, `STALE_OPERATION`, `CANCELLED`. Include safe message, affected source/operation, retryability and recovery action. Never expose provider payloads, tokens, raw private text or stack traces.

Short synchronous SDK calls explicitly use `maxRetries: 2` inside the total request budget. Durable worker calls use `maxRetries: 0`; the job runner owns up to three transient attempts with backoff/jitter/Retry-After, so retry layers do not multiply. Record usage/model/prompt/schema version and caps; uncertain provider requests can incur repeated cost, so checkpointing is not an exactly-once billing guarantee. [generateText options](https://ai-sdk.dev/docs/reference/ai-sdk-core/generate-text), [APICallError](https://ai-sdk.dev/docs/reference/ai-sdk-errors/ai-api-call-error), [RetryError](https://ai-sdk.dev/docs/reference/ai-sdk-errors/ai-retry-error).

Permission/unsupported input/schema exhaustion are not blindly retried. Retry failed units, preserve successful extraction/analysis and last accepted revision. Recommendations can fall back to genuine deterministic DB search ordering, clearly labeled, plus retry/create-own; never invent joinable results to fill five slots.

Explicit cancel persists a request, stops new work and aborts supported fetch/model/parser units. Every commit checks lease token/input fingerprint/cancellation. Cancel/finish race returns the actual committed state. Worker shutdown stops claims and releases/checkpoints; crash leases expire for recovery. Two tabs use revision conflicts, not last-write-wins. User corrections during a run fence obsolete results.

**Tradeoff:** retry ownership and checkpoint units make costs/recovery predictable; unrestricted retries or cancelling on every browser disconnect would undermine durability.

## 14. Existing `/create-cohort` reuse and required integration

| Existing area / evidence | Treatment | Why / tradeoff |
|---|---|---|
| WizardProvider and old screens | Preserve; adapt useful pure editing operations/presentation after call-site inspection | Replacement remains reversible; do not transfer its monolithic state wholesale |
| YouTube parsing/metadata and NDJSON conventions | Reuse/extend behind adapters | Real existing capabilities; distinguish metadata from content |
| Direct Google AI services | Isolate legacy; no global migration | New flow uses Vercel; avoids unrelated regressions |
| Shared curriculum/vector/feed pure logic | Reuse with explicit DTO adapters | Preserve ordering/scoring; correct numeric duration/content boundaries |
| PostgreSQL/Mongo connections and repository conventions | Extend with draft/job/artifact interfaces | Existing infrastructure remains primary |
| Old publish service/vector workflow | New flow bypasses orchestration; reuse safe lower-level mapping only | Mock transcripts, broad deletion and partial rollback are incompatible with new guarantees |
| GitHub/Notion importer placeholders | New real acquisition adapters; old route remains | Avoid claiming fake extraction works; no unrelated refactor |
| Authentication redirects | Scoped safe return destination extension | Needed for intent/draft continuity; regress existing defaults |
| Join route | Eligibility recheck + idempotent existing membership/upsert | Real recommendations require real join targets |
| Feed/cohort/community/resource reads | Shared visibility/readiness/access policy and nonvideo delivery extension | Required for private activation and all specified material types |
| Legacy removal/consolidation | Deferred until functional replacement plus explicit decision | Phase 2 authorizes no deletion |

Critical observed integration gaps:

- [feed route](<C:/Users/Dell/WebstormProjects/sidequesthq-site/src/app/api/feed/route.ts>) selects all chunk-bearing lessons when membership scope is empty and falls back to all lessons; no consistent publication/visibility filter, skips nonvideo, and does not provide the existing validated vectors to scoring.
- Cohort layout/subpages/metadata read by ID without consistent visibility checks. Community channel API independently reads community by cohort ID.
- Home queries expose staged creator/member cohorts; the new design avoids creating staged cohort rows.

Required Phase 3 policy: public discovery/fallback only fully materialized `isPublished && visibility=PUBLIC`; owner/member delivery may include materialized PRIVATE cohorts. Drafts/prepared artifacts are never public. Check each independently executed metadata/page/API read, not only a layout. Invite-only requires verified invitation infrastructure; no such behavior is assumed. Private originals remain owner-only even when processed excerpts are published unless explicitly shared.

Add a discriminated reading/content reference to feed projection and renderer for PDF/article/Markdown/GitHub/Notion/generated lessons. Keep existing VIDEO behavior/scoring; use ARTICLE for reading where the schema supports it. Publication's PostgreSQL chunks projection includes validated vector/content references; Mongo remains the substantial content store, so the PG feed path need not rediscover vectors via legacy analysis. Exact authorized chunk IDs/active artifact versions govern content fetches. Do not redesign ranking as part of creation work.

**Tradeoff:** access/read and nonvideo adaptations touch shared functionality, but they are concrete functional dependencies, not opportunistic cleanup. Their regression tests are a release gate.

## 15. Phase 3 implementation sequence and completion criteria

Begin only after explicit approval, with a fresh Phase 3 plan and Git/diff baseline. Implement functional behavior first; pixel tuning remains Phase 4.

1. **Foundation:** add pinned SDK/parser dependencies and Node 24 deployment policy; validate real model/provider capability with a minimal approved scope. Shared contracts, pure transitions/guards/dependency invalidation and server-only SDK interface. Complete when boundaries typecheck and schema/AI adapter fixtures pass.
2. **Durable draft/jobs:** additive migrations/repositories/GridFS/artifact store, polling worker, checkpoint/replay/cancel/reconciliation. Preserve old cleanup. Complete when refresh, worker restart, revision conflicts and cancelled/stale commits are tested.
3. **Entry/recommendations/join/auth:** wire actual homepage query destination, real eligible candidates, bounded dynamic cards, idempotent join, safe auth continuity and owned draft routing. Complete for zero/one/five results and failed AI/auth/availability paths.
4. **Starting points/materials:** have/find/goal branches; grounded discovery; actual uploads/drop/YouTube/web/PDF/Markdown/GitHub/Notion adapters and user-scoped connectors. Complete when real content/provenance is retained, all bounded failure/recovery paths work, and multiple sources survive refresh.
5. **Processing/build:** understanding/concepts, source-grounded chunking, twelve-dimensional analysis, curriculum build and NDJSON screen projections 5–8. Complete when all artifact dependencies/coverage/stale revision guards work without mock success.
6. **Review/conversation:** screen 9 projection, saved user edits, typed nudges, scoped invalidation, current preview and minimal 8→9 continuation. Complete when corrections preserve user edits and recompute only affected dependencies.
7. **Finalization/consumption:** artifacts-first private activation/public publish, same-cohort promotion, supported settings, receipt/modal 10, access policy everywhere and nonvideo feed renderer. Complete when duplicate/partial failure races recover, private content stays private and generated artifacts are actually consumable.
8. **End-to-end validation:** relevant unit/integration/browser checks, lint/typecheck/build and targeted regressions; final integration cleanup only inside authorized new code. Account for the build script's directory-structure and Prisma-generation mutations explicitly; preserve unrelated pre-existing files. Complete when the entire requested flow works and limitations are documented; then stop at Phase 3 boundary.

Sequence dependencies are intentional: contracts → ownership/durability → adapters → processing → review → finalization/consumption. Access policy must be ready before enabling private activation. No unsupported material path or feed behavior is deferred merely because visual polish is pending.

## 16. Testing strategy

Use current Vitest/testing-library conventions; schema/domain tests are meaningful behavior tests. SDK tests use [MockLanguageModelV4](https://ai-sdk.dev/docs/ai-sdk-core/testing) through the real adapter, not production paid requests for routine tests.

| Boundary | Required cases |
|---|---|
| Flow/commands | Starting branches, stage guards, 8 private/review fork, invalid transitions, back changes, unsupported nudges, dependency invalidation |
| Recommendations | 0–5, duplicate/invented/restricted/unpublished/deleted IDs, sparse DB, AI failure fallback, idempotent join |
| AI/schema | Malformed JSON/schema, refusal/no output, unknown anchors, score bounds, cycles, repair exhaustion, timeout/abort/stream failure and stale revisions |
| Extraction | Paginated playlist/repository/Notion fixtures, retained content, wrong MIME/signature, limits, redirect/address bounds, encrypted/scanned PDF, metadata-only video and quota failure |
| Jobs/storage | Lease expiration/fencing, cancellation race, crash after artifact write, two-tab conflicts, partial source failure, replay gap/polling, upload interruption and orphan cleanup |
| Publication | Duplicate keys/clicks, different payload conflicts, lost response, Mongo failure, SQL rollback, private→public same cohort ID, settings/totals, no fake source URL |
| Access/delivery | No private/draft leak through feed fallback/search/detail/metadata/community/content, owner consumption, nonvideo renderer, original upload policy, chunk progress continuity |
| Auth/integration | Credentials/OAuth/return redirect, unsafe destinations, real DB principal, refresh/navigation/closure recovery, existing homepage/legacy wizard/video feed regressions |
| Browser journeys | Query→join; all three creation branches→materials→5/6/7/8→9→10; private feed path; correction/retry/cancel/reload/duplicate publish |

Phase 3 live smoke tests must verify selected Google structured schemas, grounded discovery and one video/PDF observation with actual credentials; no blanket live testing of unrelated legacy services. Deployment check verifies worker job claiming, Node version, persistent Mongo/Postgres connectivity and web stream reconnection.

Phase 4 separately validates each PNG with browser screenshots at a justified viewport, typography/assets/layout and interaction states, followed by responsive/accessibility behavior from existing CSS conventions. Phase 2 pixel dimensions are not hardcoded responsive rules.

## 17. Tradeoffs, rejected alternatives and remaining checks

Consolidated evidence → requirement → decision → tradeoff register:

| Phase 1/research evidence | Requirement | Proposed decision | Tradeoff |
|---|---|---|---|
| No Vercel SDK; direct Google callers already exist | Introduce the selected SDK without unrelated rewrites | Pin v7 core/provider for new services; retain legacy callers | Temporary dual integrations |
| Google key exists; model IDs occur inside services | Change model without changing UI/domain | Server task/model registry and injected SDK model | Modality adapters still require capability checks |
| Existing AI fallbacks/mock transcripts and loosely typed chunks | Validated educational artifacts | Narrow AI task schemas plus semantic domain validators | More explicit rejection/recovery |
| Homepage destination missing; wizard states are hardcoded | Complete new intent-first flow | Explicit transition/guard/dependency modules and stable draft route | New bounded orchestration modules |
| Cards/join rely on DB IDs while Explore uses mock data | Dynamic recommendations that can actually be joined | Retrieve eligible DB candidates, rank/explain, hydrate | Sparse results may be empty |
| Source metadata types omit extracted bodies/provenance | Grounded multi-source learning state | Separate normalized source/content/chunk/analysis contracts | Adapters to legacy display types |
| Screens show conversation plus distinct workspace artifacts | Natural-language corrections with deterministic state | Typed proposals/commands, shared snapshot, protected user edits | Unsupported nudges need clarification |
| YouTube metadata is real; GitHub/Notion extraction is incomplete | Actual material acquisition | Reuse metadata; implement real bounded source adapters | Provider permissions/quotas are visible constraints |
| NDJSON request streams exist; vector workflow is inline | Progress plus refresh/closure recovery | Persistent jobs/checkpoints with NDJSON observers | Lease/replay/reconciliation complexity |
| Existing background service runs an HTTP handler | Reliable long-running execution | Separate PostgreSQL polling creation worker | New scoped deployment entry point |
| One-hour unpublished-cohort cleanup | Saved drafts survive interruption | Separate owned draft tables and private GridFS artifacts | Retention/cleanup policy is required |
| SQL-first publish has partial compensation | Idempotent complete finalization | Prepared versioned artifacts then final SQL transaction/receipt | Cross-database saga, not atomicity |
| 8 says Go to feed; 9 is review; 10 is public success | Preserve both personal and creator paths | Private activation or explicit review, then publish | Minimal review action added to 8 |
| Feed fallback/metadata lack access guards; nonvideo is skipped | Private and mixed-material learning actually works | Central access policy and scoped content/feed projection | Shared-path regression checks are mandatory |
| Auth redirects always home; JWT can hold mock guest ID | Resume intent/draft with a real owner | Safe returnTo plus DB principal verification | Scoped shared auth changes |
| CSS Modules/fonts/paper assets already implement brand | Preserve implementation/design language | Extend landing primitives, one screen at a time in Phase 4 | Pixel geometry cannot be decided from PNG pixels alone |
| Vitest and shared domain fixtures exist | Demonstrate functional guarantees before visual polish | Mock-model, fault-injection, integration and browser journeys | Live account checks remain separate |

Rejected for this flow:

- Direct Google calls as the new architecture: conflicts with the selected SDK boundary.
- Migrating every legacy AI caller now: unnecessary regression scope.
- One giant prompt/component or chat history as authoritative state: navigation, recovery and validation become uncontrolled.
- Fake cohorts/transcripts/vector success: violates dynamic authoritative recommendations and honest content processing.
- A new route per PNG: confuses processing states/variants and makes recovery brittle.
- Model-controlled mutations/publication: violates application authority and explicit user decisions.
- Timer-based stage advancement or auto public publication: not actual processing evidence and conflicts with 8/9 meaning.
- Request-bound long generation, local filesystem upload persistence or localStorage-only drafts: cannot survive closure/restarts safely.
- Redis/new external storage just for this flow: existing PostgreSQL/Mongo suffice; interfaces permit future replacement.
- Assuming old HTTP worker is a durable Render workflow: deployment/source does not support that claim.
- SQL-first incomplete cohort staging: current readers/cleanup make that unsafe; artifacts-first is more contained.
- Re-running old vectorization during publish: discards prepared artifacts and reintroduces mocked/fallthrough behavior.
- Treating PRIVATE value alone as authorization: existing readers must enforce policy independently.
- Silently repointing Corsair tenants/connections: cannot establish user ownership from a source ID.

Remaining **implementation verification**, not undecided architecture:

1. Actual deployment Node/worker service and database privileges/quotas; no deployed environment was accessed.
2. Existing Google account access, billing/quotas and quality for the selected model, video observations and grounding. The catalog/API design is verified; account behavior is not.
3. Actual connector credentials/authorization continuity for the new user-scoped client; do not silently reuse a global connection as a user's connection.
4. Parser worker bundling, package/type compatibility and scanned-PDF observation quality.
5. Source catalogs may be sparse; up to five means zero is valid. Seeded examples must not become production recommendation truth.
6. Screen 8's minimal review control is a proposed UX completion because the PNG omits it. Viewport/DPR remain unknown; detailed visual placement awaits Phase 4.
7. Duration/confidence/technical-depth metrics are estimates where specified and need fixture calibration, not invented precision.

## Phase 2 validation and change record

Performed: read-only Git/diff baseline; targeted repository and installed declaration checks; four-agent bounded reconciliation; official SDK/model/material/deployment documentation and tagged source/version checks; all PNG dimensions and state mapping carried from accepted Phase 1, with key boundary screenshots re-inspected. No secret values were read into reports. No live paid model calls, connector calls, database mutation, dependency install, migration, build or deployment was performed.

Phase 1's passing typecheck/tests remain baseline evidence, not validation of proposed code. No application behavior has changed in Phase 2, so new implementation checks remain Phase 3 work.

Document checks: all 31 local evidence links resolve, all 17 requested report sections are present, and tracked/staged Git diffs remain empty. The pre-existing lockfile's SHA-256 matches the Phase 1 baseline. Reference files were read/hash-inventoried, never edited.

Only new file: `plans/cohort-creation-phase-2-architecture.md`. Pre-existing lockfile/references and application files remain unchanged. **Stop here and wait for explicit Phase 3 approval.**
