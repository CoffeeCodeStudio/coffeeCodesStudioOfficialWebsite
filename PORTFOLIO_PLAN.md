# Coffee Code Studio — Portfolio Rebuild Plan

> Created: 2026-09-17 | Status: Phase 1 complete, Phase 2 ready

## Goal

Rebuild coffeecodestudio.se from business site to portfolio.

Target: Tech employers in Gothenburg.

Identity: Rami — AI-Leveraged Product Engineer.

## Research Summary

### Recruiter behavior

- HR screener: 6–11 sec — checks location + stack + visual hierarchy
- Engineering manager: 30–55 sec — checks architecture + live demo
- Senior architect: 10–20 min — checks RLS, TypeScript, AI verification

### Gothenburg focus

- Industries: mobility, industry, enterprise SaaS, healthtech
- Key companies: Volvo, Polestar, Ericsson, Nexer, Together Tech, Lovable

### Positioning

- NEVER: "no-code developer", "vibe coder", "prompt engineer"
- ALWAYS: "AI-Leveraged Product Engineer"
- AI = force multiplier, not crutch

## Phase 1 — Complete ✅

- [x] CoffeeBeanCursor disabled
- [x] TestimonialsSection disabled
- [x] TjansterSection disabled
- [x] PricingSection disabled
- [x] FAQSection disabled
- [x] Portal button hidden from navbar
- [x] Footer tagline updated
- [x] README updated
- [x] Documentation created
- [x] Business content removed (routes, sitemap, structured data, contact form)

## Phase 2 — In Progress 🔄

- [x] New HeroSection (EN, Rami, stack pills, Gothenburg badge, 2 CTAs)
- [x] CaseStudySection / project detail modal (PSAM format per project)
- [x] AIMethodologySection
- [x] Navbar Resume link added (placeholder `href="#"`)
- [x] Supabase: English project texts + Klar added + mockup images uploaded
- [ ] TechStackMatrix (categorized, no % bars)
- [x] Updated AboutSection (EN, short, cultural fit)
- [x] Updated ContactSection (Copy Email CTA, no heavy form)
- [x] Copy refinements: outcome-first H1, AI qualifier, About collaboration signal
- [ ] Plausible analytics installed
- [ ] JSON-LD structured data added
- [ ] OG image created (1200×630px)
- [ ] sitemap.xml verified
- [ ] robots.txt verified
- [ ] a11y audit (axe + Lighthouse 100)
- [x] Responsive layout audit and fixes (mobile stacking, modal metrics, no overflow)

## Backlog — Phase 3

- [ ] Upload PDF CV to Supabase Storage and update Resume href
- [ ] OG image (1200×630px) created and uploaded
- [ ] Plausible analytics installed
- [ ] SEO meta-tags updated (title, description, OG tags)
- [ ] Echo2000: 1-click guest session built
- [ ] Modal: URL hash deep-linking (coffeecodestudio.se/#echo2000)
- [ ] Klar: run Lighthouse on coffeecodestudio.se itself
