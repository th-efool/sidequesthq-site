# Implementation Plan: Undone Project Renaming and README Overhaul

## 1. Overview
The project has evolved from its initial working title "SideQuestHQ" to "Undone", centered on structured curiosity and transforming fragmented content (videos, playlists, articles) into sustained, bite-sized learning journeys without organizational overhead.

This plan details:
1. Complete overhaul of `README.md` to be high-signal, architectural, accurate, and completely free of emojis.
2. System-wide renaming of project metadata, documentation, display text, and public interfaces to "Undone".

## 2. Core Requirements
- Zero emojis across the README and any updated documentation or metadata.
- Crisp, authoritative, and technically rigorous documentation for developers, contributors, and reviewers.
- Update project name in `package.json`, public documentation (`docs/`), landing metadata, and application copy.
- Preserve Android store package identifier compatibility (`com.sidequesthq.in`) while ensuring display app name is "Undone".

## 3. Inventory of Changes

### Phase A: Top-Level Project Configuration and Metadata
- `package.json`: Update name field from `sidequesthq-site` to `undone`.
- `android/app/src/main/res/values/strings.xml`: Update `app_name` and `title_activity_main` to `Undone`.
- `build-aab.bat`: Update display strings to reference Undone.

### Phase B: Documentation Modernization
- `README.md`: Complete replacement.
  - Problem statement: The gap between saving content and finishing it; cognitive coordination overhead.
  - Solution & Philosophy: How Undone structures curiosity into manageable, uninterrupted progress.
  - Core Features: Adaptive microlearning feed, multi-source ingestion wizard (YouTube, GitHub, Notion), questlines and cohorts, study rooms, note-taking canvas.
  - System Architecture: 3-tier architecture, Next.js 15 App Router, React Server Components vs client boundaries, dual-database model (PostgreSQL relational integrity via Prisma + MongoDB vector and transcript persistence).
  - Pedagogical Vector Space: 12-dimensional cognitive mapping, frontier-chunk gating, anti-fatigue interleaving.
  - Quickstart & Developer Guide: Prerequisites, repository cloning (`undone-site`), environment configuration, database setup, worker build and execution, development server.
  - Mobile Application: Capacitor workflow, Android debug and release commands.
  - Architectural Document Index: Linking to `docs/PRODUCT_DESCRIPTION.md`, `docs/ARCHITECTURE.md`, `docs/feed-architecture.md`, `docs/prisma-schema-cohort.md`, `docs/study-rooms-schema.md`, `docs/ANDROID.md`.
  - Zero emojis throughout.
- `docs/ARCHITECTURE.md`: Rename header and references from SideQuestHQ to Undone.
- `docs/ANDROID.md`: Rename header and text references to Undone.
- `docs/prisma-schema-cohort.md`: Update introductory text referencing the platform name.
- `docs/study-rooms-schema.md`: Update introductory platform references.

### Phase C: Application Copy & Public Metadata
- `src/app/policy/page.tsx`: Update legal entity name to Undone and update support contact / links.
- `src/app/terms/page.tsx`: Update legal entity name to Undone and update terms descriptions.
- `src/app/(landing)/layout.tsx`: Update repository link to `th-efool/undone-site`.
- `src/app/(landing)/page.tsx`: Update repository link and meta keywords.
- `src/client/components/global/Footer/Footer.tsx`: Update GitHub link and cleanup old references.
- `src/client/screens/dashboard/createCohort/components/LaunchSuccess/LaunchSuccess.tsx`: Update network naming to Undone.
- `src/client/screens/dashboard/message/components/CommunityChat/components/MessageTimeline/MessageTimeline.tsx`: Update default placeholder.
- `src/client/screens/dashboard/message/components/LeftSidebar/ConversationList/ConversationList.tsx`: Update default search message.
- `src/client/screens/dashboard/message/hooks/useMessage.ts`: Update fallback sender role.
- `src/client/screens/dashboard/studyroom/StudyRoomScreen.tsx`: Update welcome banner text.
- `src/server/domain/cohort/chunking.service.ts`: Update AI system prompt persona to Undone.
- `src/server/domain/cohort/vectorScoring.service.ts`: Update AI system prompt persona to Undone.
- `src/shared/curriculum/pedagogicalVector.engine.ts`: Update header documentation.
- `src/shared/curriculum/pedagogicalVector.types.ts`: Update header documentation.
- `src/client/repositories/cohortStore.ts`: Update fallback copy.
- `src/client/repositories/feedRepository.ts`: Update fallback creator name.
- `src/server/infrastructure/db/postgres/mappers/cohortMapper.ts`: Update fallback guide name.

### Phase D: Verification
- Verify build passes or lint checks pass.
- Verify zero emoji characters remain in README.md.
- Ensure no broken imports or build regressions.
