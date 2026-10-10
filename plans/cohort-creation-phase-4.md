# Phase 4 visual checkpoints

Baseline: clean `33660b2`. Reference-first implementation; no AI, persistence or publication redesign. Existing homepage CSS modules, Playfair Display, Manrope, Caveat, Undone logo and paper/collage assets are the implementation reference. The taste skill's defaults yield to these supplied references and existing conventions (including serif headings, blue accents and Lucide icons).

## 4.0 — Reference inspection complete

All nine PNGs inspected visually before changes. Pixel dimensions describe the captured image, not a proven CSS viewport: no browser chrome, device pixel ratio or export scaling is supplied. Use matching CSS-pixel desktop viewports for comparison, explicitly as an assumption. Responsive behavior comes from homepage CSS and actual overflow/interaction checks.

| PNG | Pixels | Aspect ratio | Observed state |
| --- | --- | --- | --- |
| 2 | 1585 × 992 | 1.5978 | Conversation rail, topic heading, one featured recommendation, four compact cards, create-own footer |
| 3 | 1585 × 992 | 1.5978 | Starting-point choice: three illustrated options, centered heading, peripheral collage |
| 4 | 1585 × 992 | 1.5978 | Material step: shared drop/link/upload surface plus added sources |
| 5 | 1585 × 992 | 1.5978 | Understanding: source inventory, accepted concepts, real processing state |
| 6 | 1586 × 992 | 1.5988 | Chunking: selected source and accepted chunk detail |
| 7 | 1586 × 992 | 1.5988 | Analysis: selected chunk and estimated pedagogical dimensions |
| 8 | 1584 × 993 | 1.5952 | Ready, completed build; contextual review continuation required by approved Phase 2 |
| 9 | 1536 × 1024 | 1.5000 | Review preview, editable sections and bounded refinement conversation |
| 10 | 1584 × 993 | 1.5952 | Committed publication success dialog over dimmed review, not a new route |

Observed common layout: approximately 26% conversation rail, warm near-white page, navy editorial type, blue hand-drawn accents, pale borders, paper surfaces and compact sans-serif controls. Screenshot 2 uses a featured card plus a two-column remainder; screenshot 3 uses three choices. Long dynamic content must wrap without changing the hierarchy. Do not fabricate completion rates, duration, avatars, illustrations specific to a user's cohort, or AI progress to fill visual slots. Recommendation contracts currently provide title/description/cover/difficulty/categories/members/lessons/estimated duration, but no completion rate or quest count.

## Execution order and completion gates

1. **4.1 Recommendations:** new scoped rail/shell and recommendation layout; actual covers with a neutral missing-cover surface; 0–5 cards, best-match/fallback, create-own and join affordances. Validate desktop reference composition, mobile overflow, long content, empty/loading/error states and existing flow behavior. Commit.
2. **4.2 Starting point:** inspect 3 again; implement three illustrated cards using existing homepage collage assets, explicit selected/disabled states, preserved branch commands/back navigation. Validate desktop/mobile and keyboard interaction. Commit.
3. **4.3 Materials:** inspect 4 again; style the existing acquisition controls, source list and drop states while retaining every adapter, cancellation and source limit. Validate all existing material UI tests and browser link/file/drop states. Commit.
4. **4.4 Understanding:** inspect 5; actual checkpoint inventory/concepts with indeterminate totals when unknown. Commit after browser comparison/checks.
5. **4.5 Chunking:** inspect 6; source/chunk split and selection, retained receipt data only. Commit after comparison/checks.
6. **4.6 Analyzing:** inspect 7; actual 12D estimates and truthful progress. Commit after comparison/checks.
7. **4.7 Building/Ready:** inspect 8; completed artifacts summary, approved private/feed and review continuation. Commit after comparison/checks.
8. **4.8 Review:** inspect 9; preview/editor/refinement surfaces, preserve local edits/provenance. Commit after comparison/checks.
9. **4.9 Finalization:** inspect 10; accessible receipt-backed success dialog, private/public wording and actual links. Commit after comparison/checks.
10. **4.10 Integration:** full journey, responsive/accessibility, screenshots, tests/typecheck/lint/build; exact inventory and remaining discrepancies. Commit/report, stop before further phases.

Before every screen: re-inspect its PNG and nearest code; write specific layout/assets/state plan here. After every screen: record validation, commit, discrepancies and next operation. User authorized sequential continuation in this pass; checkpoints are progress records rather than permission gates. Browser visual fixtures must remain isolated from production auth/routes and must be identified as fixtures. Temporary scripts/screenshots stay in `.tmp` or OS temp. No screenshot is used as a full-screen background or baked-in UI.

## Current checkpoint

4.0 complete. 4.1 plan: shared shell uses a 408px rail at the 1585px reference viewport (fluid within bounds), independently scrollable conversation, 40–48px content gutters, 64px topic heading, 320px featured card, two-column compact cards and a bottom create-own banner. Sidebar content derives from current query/result. Use real cover data only; unavailable metrics stay omitted. Existing session theme hook and logo are reused; new styles are scoped to the flow. Browser preview will render the actual client components with explicit fixture data, without bypassing production authentication.

### 4.1 completed

Added scoped conversation rail, actual theme control, keyboard-accessible collapse/composer and query refinements. Recommendation layout uses one featured card plus up to four compact cards, actual covers/metadata, missing-cover and zero-result states; pending/error/cancel/retry retain the existing durable commands. Join links continue to the actual cohort page/join flow. Explanatory recommendation reasons remain accessible. No invented completion/quest statistics or user photos were added.

Validation: 14 existing creation UI tests pass; TypeScript and scoped zero-warning ESLint pass; diff check passes. Visible Playwright fixture browser at 1585×992 and 390×844, five results, zero results and collapse/expand passed with no page errors/horizontal overflow. Compared rendered desktop/mobile screenshots in `.tmp/creation-visual/`; corrected header/card heights so the footer begins at y≈912 and fits the reference-height viewport. Preview imports the production components with Next image/link rendering substitutes, local production font files and explicit data fixtures; it is not a live authenticated database journey. Dynamic cover content intentionally differs from the reference; absent completion rates/quest counts use available lesson/member/duration fields. Account avatar currently uses a neutral initial rather than an invented photograph.

### 4.2 screen plan

Re-inspect 3.png. Keep the rail and tools; center the two-line 60px serif heading above three 350px-wide choice cards at the reference viewport. Cards use ~270px collage art, circular icon overlap, uppercase serif titles, 18px descriptions and a bottom-right blue circular arrow. Existing mountain/galaxy/cathedral photos, paper texture and blue doodles supply decorative assets. No screenshot artwork is baked into the UI. Preserve exact accessible option names, selected/disabled state and back command; selected choices remain changeable when material work is not running. Check the three commands, keyboard activation, desktop/mobile wrapping and missing/long content before commit.

### 4.2 completed

Three illustrated choices, shared inline ink underline, selected/disabled states, back navigation and starting workspace now reuse the scoped conversation shell. Suggestions dispatch existing branch commands; ambiguous/negated conversation requests show clarification rather than guessing. Existing material/discovery handlers remain in StartingWorkspace. Homepage photo/paper collages approximate the supplied artwork; the exact reference illustrations are unavailable and visual identity is not claimed.

Validation: 14 creation UI tests, TypeScript, scoped ESLint and diff checks pass. Visible browser fixtures cover desktop 1585×992, mobile 390×844, keyboard activation, all three choices, dark theme and zero horizontal overflow/page errors. Desktop choice cards begin around y337, matching the reference composition. These are fixture checks, not live authenticated journeys.

### 4.3 screen plan

Re-inspected 4.png. Selected starting-point choices become compact, changeable controls above the material workspace. Center the two-line serif material heading and paper drop surface, reuse homepage edge photos/books and notes, and place actual retained sources below. Keep acquisition modes, adapter forms, replacements, upload cancellation, retries, source removal, video selection and all source limits intact. Move detailed technical limits into an accessible disclosure. Use only actual source URLs/retained metadata, never screenshot example material. Test existing material flows and visible browser file/link/drop/invalid-file states at desktop/mobile sizes. Discovery remains the existing grounded branch with scoped styling; no backend or acquisition behavior changes.

### 4.3 completed

Material workspace now has the reference heading/drop/link composition, six input shortcuts, homepage edge collage and added-source surfaces. Starting choices remain available as compact controls. Technical limits and connected accounts use accessible disclosures; existing adapters, saved source state, replacement, retry, removal, video observations and cancellation are preserved. Replaced obsolete “processing added later” copy with the existing continuation. Grounded discovery uses the same scoped surfaces.

Validation: all 74 creation UI tests pass; TypeScript and scoped ESLint pass; diff check passes. Visible Playwright rendered production StartingWorkspace with explicit fixture commands and checked file/link/drop, invalid extension, source additions and GitHub/Notion mode changes, at 1585, 820 and 390px without page errors/overflow. Inspected desktop/mobile captures. File input remains labelled and keyboard accessible behind the plus picker. Fixture callbacks do not exercise live ingestion. Differences: available homepage photos substitute for reference artwork; explicit save/limits/branch controls remain for reliable existing behavior; source metadata is shown only when actually retained.

### 4.4 screen plan

Re-inspect 5.png and current UnderstandingProgress/contracts before changes. Extend the conversation shell to processing-understanding only. Use a centered heading and status pill above two panels: actual source inventory and accepted concepts/evidence. Derive counts from durable checkpoint/receipt data; use indeterminate progress when totals are unknown. Keep start/restart, cancel, back and chunk continuation guards. Do not load private artifacts through new unprotected paths or invent analysis content. Verify running, completed, canceled and empty checkpoint states with existing tests and production-component browser fixtures before commit.

### 4.4 completed

Understanding now uses the scoped conversation shell, four-stage indicator, source inventory, known partition progress and expandable concept cloud. Counts use accepted checkpoints; no known total means no percentage. Start/restart, cancel, back and chunk continuation retain existing guards. Removed obsolete “building unavailable” copy without presenting understanding as a completed curriculum. Sources without a retained title use a neutral source label; no fabricated thumbnails, concept scores or timelines.

Integration necessity: snapshot checkpoints contain artifact references rather than concept bodies. Added a read-only owner-scoped `/understanding` endpoint, typed preview contract and partial preview method on the existing UnderstandingContentService. It reuses owned source reads and receipt checksum/fingerprint/evidence validation, rejects revision races and disables caching. It cannot generate, pin artifacts or mutate navigation. Client aborts superseded reads and hides previews that do not match the current revision.

Validation: 94 tests pass across 17 focused UI/HTTP/retention files, including partial accepted reads, owner/anonymous/invalid IDs, stale revisions, aborts, preview reload, old-concept hiding and existing creation flows. TypeScript, scoped zero-warning ESLint and diff checks pass. Visible browser fixtures at 1585×992 and 390×844 cover accepted concepts, expandable summaries, actual 1/3 progress, unknown total and completed continuation; no page errors/overflow. Desktop/mobile screenshots inspected. No paid/live AI, database or blob smoke test was performed for this visual checkpoint. Differences remain in available art, thumbnail availability and dynamic content density; final cross-screen fidelity review is still pending.

## Resume point

### Comparison gallery plan

User requested persistent before/after pictures and an HTML gallery in `plans/before-after`, updated at every subsequent checkpoint. Capture the actual baseline CreationExperience from commit 33660b2 and the current CreationExperience with identical explicit fixture snapshots and viewports. Resolve only the creation hook and Next browser wrappers in an isolated local preview; never alter production authentication. Save desktop before/current and mobile current images for all nine reference states. Keep target PNGs separately labelled as design references. Pending screens remain labelled pending even when a current capture exists. Store reproducible preview/capture tooling under `scripts/creation-visual`; extracted baseline files and intermediate captures stay ignored under `.tmp`. Validate gallery links and image dimensions in a browser before committing.

### 4.5 screen plan

Re-inspected 6.png: step 2 indicator, editorial heading, source inventory at left, selected source/chunk details at right, actual duration/range/source labels and known work counts. Extend the existing chunk receipt reader with a partial, owner-scoped preview using its existing validation; do not generate or expose arbitrary artifact IDs. Show accepted chunks with source/evidence and duration-method labels, permit selection locally, and retain restart/cancel/back/analyze guards. No invented video player, completion scores or per-chunk progress. Reuse the scoped processing shell/styles where their geometry matches; validate partial/unknown/completed/error states, selection, ownership/revision races, mobile overflow and existing tests. Update the gallery immediately after this checkpoint.

### Comparison gallery completed

`plans/before-after/index.html` contains all nine actual Phase 3/current screen pairs, separately labelled design targets and current full-page mobile captures. Baseline source is rendered directly from 33660b2 using the same fixtures as current code; pending screens remain explicitly pending. Images are clickable for full-page desktop versions. Reproducible preview/capture/gallery scripts are saved in `scripts/creation-visual`. Browser verification loaded all 36 gallery images and checked all nine sections. Baseline images remain immutable when updating the current captures. No production authentication, credentials or paid calls are involved.

### 4.5 completed

Chunking now uses the conversation shell, shared four-stage indicator and two-panel source/chunk workspace. Source selection is keyboard accessible; accepted chunks expand to show actual source boundaries, coverage limitations, content origin and labelled duration estimates. Progress remains checkpoint-driven and indeterminate until inventory is known. Existing cancel/restart/back/analyze commands and guards are retained.

Read integration: added a typed owner-scoped chunk preview endpoint and a partial preview method on ChunkingContentService. It reuses accepted understanding and the existing chunk receipt/checksum/source/fingerprint validation. Reads are uncached and checked for revision races. Superseded client requests are aborted and obsolete previews hidden. This does not generate, write artifacts or advance application state.

Validation: 98 tests pass across 18 focused UI/HTTP/retention files (temporary baseline test copies excluded). TypeScript, scoped zero-warning ESLint and diff checks pass. Browser fixture checks cover actual 1/3 progress, unknown totals, completed continuation, cancellation recovery, keyboard source selection, expanded source boundaries and mobile overflow. Desktop/mobile captures inspected; gallery screen 6 updated. Exact reference thumbnail art, fabricated per-chunk progress bars and unsupported pedagogical tags are not substituted; available source data remains authoritative. No live AI/blob/database smoke test was performed.

Completed visual checkpoints 4.0–4.5; next is **4.6 Analyzing / 7.png**. Before edits, inspect 7.png, AnalysisProgress and its accepted analysis reader/contracts. Plan and validate independently, then update the comparison gallery. Later: 4.7 Ready, 4.8 Review, 4.9 success dialog, then 4.10 integration/fidelity checks. Phase 4 is not complete.
