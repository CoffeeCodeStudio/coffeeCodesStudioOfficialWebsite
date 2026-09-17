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

- Rewrote `src/components/HeroSection.tsx`
- Hardcoded English copy for Rami — Product Engineer
- Added Gothenburg location badge, stack pills, dual CTAs, scroll indicator
- Removed language context, laptop mockup, and djlobo image

### Phase 2b: New portfolio AboutSection

- Rewrote `src/components/AboutSection.tsx`
- Hardcoded English copy for Rami
- Added 2×2 stats grid (Production Apps, Commits, Real Users, timeline)
- Replaced language context with fixed About Me narrative and location line

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
