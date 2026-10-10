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
