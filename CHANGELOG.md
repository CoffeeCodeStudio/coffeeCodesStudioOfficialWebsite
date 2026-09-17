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

- Rewrote `src/components/ContactSection.tsx`
- Hardcoded English copy for portfolio contact section
- Added left column with Copy Email, Download Resume, LinkedIn CTAs + availability badge
- Simplified right-column form to Work Email + Message + honeypot

### Waiting for (Phase 2)

- New CaseStudySection
- AIMethodologySection
- TechStackMatrix
- Plausible analytics
- JSON-LD structured data
- OG image 1200×630px
