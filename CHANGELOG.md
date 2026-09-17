# Changelog

> Coffee Code Studio — coffeecodestudio.se

## 2026-09-17 — Phase 1: Business → Portfolio

### Phase 1b: Removed all business content

- Removed `/smaforetag-goteborg` and `/frisor-goteborg` from `App.tsx` routes and `sitemap.xml`
- Replaced business structured data with `ProfilePage` / `Person` schema
- Simplified `ContactSection.tsx` to name, email, message only
- Added disable comments to `FrisorGoteborg.tsx` and `SmaforetagGoteborg.tsx`

### Disabled (commented out)

- CoffeeBeanCursor in App.tsx — recruiter bounce-trigger
- AIAssistant in ClientPortal.tsx — leaking Lovable credits
- TestimonialsSection in Index.tsx
- TjansterSection in Index.tsx
- PricingSection in Index.tsx
- FAQSection in Index.tsx
- Portal button in Navbar.tsx

### Updated

- Navbar.tsx — now shows: Projects, About, Contact
- Footer.tsx — tagline: "AI-Leveraged Product Engineer — Gothenburg, Sweden"
- README.md — rewritten as portfolio description

### Documentation added

- RULES.md — project rules
- DESIGN.md — design system
- PORTFOLIO_PLAN.md — plan and checklist
- CHANGELOG.md — this file

### Phase 2a: New portfolio HeroSection

- Rewrote HeroSection.tsx with hardcoded English content
- Added Gothenburg location badge, Product Engineer H1, stack pills
- Added Copy Email CTA and Download CV secondary button
- Added scroll indicator
- Removed language context, djlobo mockup, imageError state

### Phase 2b: New portfolio AboutSection

- Rewrote AboutSection.tsx with hardcoded English content
- Added 2x2 stats grid: 3 Apps, 18 538 Commits, 340+ Users, < 1 year
- Added three English paragraphs about Rami
- Added Gothenburg location line
- Removed language context

### Phase 2b-fix: AboutSection copy and stats corrected per research

- Updated AboutSection copy to emphasize product-engineering bridge, schema-to-users delivery, and AI + structural discipline
- Updated 2×2 stats grid: Production Apps Shipped, Real-World Users, Strict TypeScript & RLS, Realtime Data Latency

### Phase 2c: New portfolio ContactSection

- Rewrote ContactSection.tsx with hardcoded English content
- Left column: Copy Email, Download Resume, LinkedIn buttons + availability badge
- Right column: minimal form with Work Email and Message only
- Removed phone, WhatsApp, company, budget, projectType fields
- Removed language context

### Phase 2d: Footer updated — removed phone/WhatsApp, added GitHub/LinkedIn/CV links

- Removed phone number and WhatsApp buttons from Footer.tsx
- Kept email button (`hej@coffeecodestudio.se`)
- Updated tagline to "Rami — Product Engineer. Built with React, TypeScript, Vite, Tailwind & Supabase."
- Added GitHub, LinkedIn, and Download CV links
- Changed section label from "KONTAKT" to "CONNECT"

### Phase 2e: ProjektSection heading updated to English

- Updated section heading to "Shipped Work"
- Updated intro paragraph to "Production applications built and deployed — real users, real systems."

### Phase 2f: ProjektSection — added project detail modal with PSAM placeholders

- Added clickable project cards that open a slide-over modal
- Modal includes Problem, Architecture & AI Workflow, and Metrics placeholder sections
- Added live app launch and GitHub action buttons
- Added Escape key and backdrop click to close
- Hardcoded English strings and removed language context

### Phase 2g: Hidden Golden Fruit Oasis prototype from portfolio

- Set `is_visible = false` on the `Golden Fruit Oasis` row in `portfolio_projects`
- Row preserved in database; removed from public project grid

### Phase 2h: Removed SV/EN language toggle from navbar

- Commented out `<LanguageToggle />` usage in `Navbar.tsx`
- Component definition preserved; toggle no longer rendered

### Phase 2j: AboutSection — added production crisis metric, languages and AI stack

- Added Echo2000 production crisis recovery sentence to paragraph 2
- Added languages line: Swedish, English, Arabic
- Added AI stack line: Claude Code, Lovable, Groq, Gemini

### Phase 2k: HeroSection — reordered stack pills, added AI tooling row

- Reordered stack pills to: TypeScript, React, Supabase, PostgreSQL, Tailwind CSS, Vite
- Added "AI Tooling" label and second pill row: Cursor, Claude, Lovable, Gemini

### Phase 2l: Added MethodologySection — 4-step AI workflow cards

- Created `src/components/MethodologySection.tsx` with four workflow cards
- Inserted between `ProjektSection` and `AboutSection` on the landing page

### Phase 2m: Footer localized to English

- Changed rights line to "All rights reserved"
- Changed legal links to "Privacy Policy", "Cookie Policy", and "Terms of Service"
- Changed credit line to "Designed & engineered by Rami"

### Phase 2n: AboutSection stats updated — removed unverified metrics

- Replaced "100% / Strict TypeScript & RLS" with "100 / Lighthouse Accessibility"
- Replaced "< 50ms / Realtime Data Latency" with "Jan 2026 / First Live Deploy"

### Phase 2o-fix: Removed unverified metrics from DJ Lobo modal

- Filled Echo2000 and Klar PSAM sections with real content and verified metrics
- Kept DJ Lobo PROBLEM and ARCHITECTURE & AI WORKFLOW sections; removed the METRICS grid
- Updated action button labels and URLs per project

### Phase 2p: Added Resume link to navbar (placeholder href)

- Added "Resume" link to desktop and mobile navbar after Contact; uses `href="#"` until the PDF is uploaded

### Phase 2q: Responsive layout audit and fixes

- Audited HeroSection, AboutSection, ProjektSection modal, MethodologySection, ContactSection and Footer for mobile layouts
- ProjektSection modal METRICS grids: 3 columns on desktop, 1 column on mobile (grid-cols-1 sm:grid-cols-3)
- ContactSection copy-email button: long email text now truncates safely on narrow screens
- Verified: hero pills wrap, CTAs stack on mobile, H1 scales down, About/Methodology/Contact/Footer stack to single column, modal is full-width bottom sheet on mobile

### Phase 3b: H1 outcome-first, AI qualifier added, About collaboration signal added

- HeroSection H1 updated to: "I build production web applications from schema design to real users."
- Added AI qualifier paragraph below AI Tooling pills: architecture, schema design, and security policies are human-designed; component code is AI-generated and human-reviewed
- AboutSection closing paragraph updated to signal solo ownership and readiness to join a team

### Phase 3c: Echo2000 GitHub button updated to reflect private repo

- Changed Echo2000 modal GitHub button label from "View on GitHub" to "Private repo — I walk through the code in interviews"
- Kept href pointing to https://github.com/CoffeeCodeStudio and icon unchanged

### Phase 3d: CV button changed to mailto Request CV

- ContactSection "Download Resume (PDF)" button changed to mailto "Request CV" with pre-filled subject and body
- Footer "Download CV" link updated to the same mailto "Request CV" link
- Icon changed from Download to Mail in ContactSection

### Phase 3e: Klar GitHub button updated to reflect private repo

- Changed Klar modal GitHub button label from "View on GitHub" to "Private repo — I walk through the code in interviews"
- Kept href pointing to https://github.com/CoffeeCodeStudio and icon unchanged

### Phase 3f: Removed CV download button — CV shared manually on request

- Commented out the "Request CV" mailto button in ContactSection
- Commented out the "Request CV" link in Footer

### Waiting for (Phase 2)

- New CaseStudySection
- TechStackMatrix
- Plausible analytics
- JSON-LD structured data
- OG image 1200×630px
