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

### Waiting for (Phase 2)

- New CaseStudySection
- AIMethodologySection
- TechStackMatrix
- Plausible analytics
- JSON-LD structured data
- OG image 1200×630px
