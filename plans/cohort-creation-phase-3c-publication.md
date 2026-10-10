# Phase 3C.3 publication core

1. Freeze a reviewed owned draft and reserve one stable cohort identity per draft in a short SQL transaction. Bind operation request IDs to immutable snapshot hashes and explicit private/public modes.
2. Reconstruct the owned reviewed curriculum and retained chunks. Prepare versioned delivery artifacts per lesson with original retained segment text, source anchors and validated pedagogical vectors before exposing relational cohort rows.
3. Retain an ordered checkpoint manifest and reuse accepted artifacts after restart. Validate every prepared artifact and dependency before finalization; stale/fenced jobs cannot commit.
4. Atomically materialize fully published cohort/source/season/lesson/community/member rows, pin artifacts and commit a publication receipt in the existing job completion transaction.
5. Repeated requests return the same cohort; private-to-public promotion uses that identity. Public cohorts cannot be downgraded through creation finalization.
6. Validate preparation, malformed artifacts, recovery and SQL boundaries with focused tests; deployment DDL is additive and never applied silently to the public schema.

Root owns UI and access/feed integration. Durable agent owns job/flow/worker integration. This slice does not alter legacy publication services.

## Access boundary checkpoint

Before publishing private creations, add one query-compatible cohort read policy: published PUBLIC is readable; published PRIVATE requires creator/membership; unpublished legacy preview requires creator. Apply it independently to cohort page data and metadata, join, community channels/messages and progress writes. Public join must never grant access to an unknown private cohort. Verify actual lesson/cohort/chunk ownership before progress writes. Test denied paths before repository/content calls and fail closed on authentication errors. Feed and content delivery use this same policy in the root integration.
