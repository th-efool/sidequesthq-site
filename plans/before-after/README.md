# Cohort creation comparison gallery

Open `index.html` locally. Before = actual Phase 3 components at `33660b2`; after = current components. Design targets are separately labelled. All nine screenshots use explicit browser fixtures, matching reference-size viewports and the same data for before/current. Pending states are captured but not claimed restyled. Click desktop images for full-page versions; disclosures contain targets and mobile captures.

No production authentication bypass or paid AI calls. The isolated preview replaces only the creation hook, data reads and Next rendering wrappers. Baseline source is extracted from Git into ignored `.tmp/phase4-comparison`, without changing the checkout. Screenshots and manifest remain here as requested.

## Update after a checkpoint

1. Start `node scripts/creation-visual/server.mjs` from the repository root. This requires installed dependencies and the locally cached production Playfair font (build the app if absent).
2. Run `scripts/creation-visual/capture.cjs` through the installed `playwright-skill/run.js` executor. Set `SCREENS` to comma-separated screenshot numbers and `COMPLETED_CHECKPOINT` to the last implemented checkpoint. Default: all screens, checkpoint 4.4. Baseline captures are preserved once written.
3. Run `node scripts/creation-visual/gallery.mjs`.
4. Open the gallery, verify images/labels, inspect desktop/mobile captures, then commit the updated captures and manifest with the corresponding checkpoint.

The scripts serve only loopback port 4175. Font/image rendering uses local production assets; viewport/DPR equivalence with the supplied exports is an explicit comparison assumption. Fixture content does not establish live integration readiness.
