# 3B.2 observer handoff

Status: complete for the 3B.2 boundary. Root owns final integration/gate; no 3B.3 work started.

Owned files:
- `src/client/screens/cohortCreation/services/draftEvents.ts`
- `src/client/screens/cohortCreation/__tests__/transport-events.test.ts`
- `src/client/screens/cohortCreation/__tests__/CreationExperience.test.tsx` (additional assignment: mocked observer and durable UI regressions).
- This handoff document.

Exports: `readDraftEventStream(response, { draftId, after, signal, onEvent }): Promise<number>` and `observeDraftEvents({ draftId, after?, signal, onEvent, reload, onConnectionChange? }): Promise<void>`.

The observer only reads. It validates typed NDJSON, draft identity and input revision; enforces a 1 MiB frame limit; supports UTF-8 splits, CRLF and final lines; suppresses old/duplicate normal events; accepts explicit snapshot cursor resets; reloads canonical state after gaps/network/protocol failure; reconnects with bounded backoff. A 35-second connection deadline ensures a stalled response reaches canonical reload fallback. Aborting observation cancels its reader/timer, never the server job.

Server reset snapshots can also repair an invalid future cursor by lowering it. Only explicit `snapshot` frames may do so; ordinary event sequences stay monotonic. The hook independently guards UI snapshot revision, so cursor reset cannot roll UI state backward. Stream/reload failures never issue domain mutation or cancel requests.

Root owns hook integration and UI monotonic snapshot handling. The server agent confirmed `/events` emits `application/x-ndjson`, explicit snapshot resets for initial/history-gap requests, contiguous normal events, heartbeat cursors at highest delivered sequence, and finite connections up to 25 seconds.

UI tests mock observation (no real network), exercise deferred recommendation completion through canonical reload after resume, retain a newer observed completion when an older command returns 409, and refuse to cancel another tab's newer request.

Validation: focused observer and UI tests passed (21 tests total after final reset regression); scoped ESLint passed for the three source/test files; `git diff --check` passed for owned files. No commits, deployments or paid calls. Other agents' files were not modified.
