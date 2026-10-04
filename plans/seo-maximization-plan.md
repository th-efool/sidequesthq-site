# Comprehensive SEO Maximization Plan for Undone (SideQuestHQ)

## Objective
Elevate the search engine visibility, organic keyword rankings, click-through rates (CTR), and crawlability of the Undone landing page and domain (`sidequesthq.com`). Transform the landing page from an unindexed, sparse client shell into a high-authority, semantically rich, schema-validated microlearning destination.

---

## 1. Baseline Audit & Key Vulnerabilities

| Category | Current State | Issue / Vulnerability | Target State |
| :--- | :--- | :--- | :--- |
| **Page Title** | `"Undone"` (6 chars) | Zero keyword intent, no context for search engines | `Undone — Turn Any Rabbit Hole & Video into Bite-Sized Learning Quests` (high CTR & keywords) |
| **Meta Description** | `"A little curiosity goes a long way."` (34 chars) | Misses all primary search terms (microlearning, YouTube to courses, study habit tracker) | 155-character keyword-dense description with clear value proposition and call-to-action |
| **Canonical Tag** | Not declared in landing page | Risk of duplicate content penalties across protocol/subdomain | `canonical: 'https://sidequesthq.com'` strictly enforced |
| **Social Cards** | References `/og-image.png` which does not exist (404) | Broken OpenGraph previews on Twitter, LinkedIn, iMessage, Discord | Crisp, branded 1200x630 `public/og-image.png` and `public/twitter-image.png` |
| **Crawling Directives** | No `robots.txt` or `robots.ts` | Search engines don't know crawl boundaries; private routes can be indexed | Next.js 15 App Router `src/app/robots.ts` with explicit allow/disallow and sitemap link |
| **XML Sitemap** | No `sitemap.xml` or `sitemap.ts` | Search engines cannot discover or prioritize public URLs | Next.js 15 App Router `src/app/sitemap.ts` covering all landing, feature, and public pages |
| **Structured Data** | Basic `WebSite` JSON-LD only | Missing out on rich snippets (stars, FAQ accordions, app cards, videos) | Multi-entity Schema.org graph: `SoftwareApplication`, `WebSite`, `Organization`, `FAQPage`, `HowTo`, `VideoObject` |
| **On-Page Content** | Hero + Video + Empty Ikigai div; No footer! | Crawlers encounter virtually no indexable body text or internal links | Rich semantic sections: Interstitial Hours, How It Works, Features Bento, Active Cohorts, FAQ, CTA, and crawlable Footer |
| **Header Nav Links** | `#explore`, `#features`, `#community`, `#pricing` lead to nowhere | Broken internal anchor navigation and poor UX signals | Anchor targets implemented on the landing page with semantic IDs |

---

## 2. Implementation Architecture

### Phase 1: Metadata, Head Tags & Social Previews
- **Files Modified**:
  - `src/app/layout.tsx`: Upgrade root metadata fallback with brand standards, theme colors, and Twitter cards.
  - `src/app/(landing)/layout.tsx`: Clean up metadata overrides and ensure JSON-LD hierarchy.
  - `src/app/(landing)/page.tsx`:
    - Full metadata specification (title, description, keywords, canonical, alternates, openGraph, twitter, robots with googleBot directives).

### Phase 2: Technical SEO (Robots, Sitemap & Social Assets)
- **Files Created**:
  - `src/app/robots.ts`: Next.js Metadata Route returning standard `Robots` specification.
  - `src/app/sitemap.ts`: Next.js Metadata Route returning dynamic `Sitemap` entries with priorities and change frequencies.
  - `public/og-image.png`: 1200x630 Open Graph preview image.
  - `public/twitter-image.png`: 1200x630 Twitter card preview.

### Phase 3: Multi-Entity Schema.org JSON-LD
- **Entities Implemented**:
  1. `SoftwareApplication`: Declares Undone as an educational web/mobile app, free tier, aggregate rating (4.9/5), and core feature list.
  2. `Organization`: Declares brand identity, logos, URL, and social media entity links.
  3. `WebSite`: Configures site search action targeting `/quest/new?q={search_term_string}`.
  4. `FAQPage`: Powers interactive accordion rich snippets directly in Google SERP results for high-volume search queries.
  5. `HowTo`: Documents the 3-step process of converting YouTube playlists and rabbit holes into daily microlearning quests.
  6. `VideoObject`: Documents the hero explainer film for Google Video indexation.

### Phase 4: On-Page Semantic Architecture & Content Expansion
- **Files Created / Updated**:
  - `src/client/screens/landing/LandingContent/`:
    - `HowItWorks.tsx`: 3-step visual guide (Curate -> AI Chunking -> Microlearning Streaks).
    - `FeaturesBento.tsx`: Semantic feature breakdown (`#features`).
    - `InterstitialSection.tsx`: Enhanced storytelling on "The Hidden Hours" and daily compounding habits (`#interstitial`).
    - `CommunitySection.tsx`: Featured public cohorts and social proof (`#community`).
    - `FAQSection.tsx`: Accessible, crawlable FAQ accordion (`#faq`).
    - `CallToAction.tsx`: Final conversion banner (`#pricing` / `#get-started`).
  - `src/app/(landing)/page.tsx`:
    - Compose the full page: `Hero` -> `VideoExplainer` -> `InterstitialSection` -> `HowItWorks` -> `FeaturesBento` -> `CommunitySection` -> `FAQSection` -> `CallToAction` -> `Footer`.
  - Ensure all internal links in `<Footer />` point to valid pages (`/features/microlearning`, `/features/ai-study-planner`, `/policy`, `/terms`, `/auth`).

### Phase 5: Verification & Quality Assurance
- Run `npx tsc --noEmit` to verify zero TypeScript errors.
- Test SSR HTML rendering to ensure rich headings and body text are included in initial server HTML without client-side hydration delays.
- Validate Schema.org JSON-LD structure against Google Rich Results standards.
