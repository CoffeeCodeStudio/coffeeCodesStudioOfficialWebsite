# Coffee Code Studio — Project Rules

> Updated: 2026-09-17 | Applies to all work in this repo

## Code Rules

- Never delete code — comment out instead using // or {/* */}
- No TypeScript `any` — strict mode always on
- Supabase only — never Firebase, MongoDB or external DBs
- RLS (Row-Level Security) required on all tables
- Comment WHY not HOW in code

## Documentation Rules

- Update RULES.md when new project rules are added
- Update DESIGN.md when design changes
- Update PORTFOLIO_PLAN.md checklists after every change
- Update CHANGELOG.md with date and what was done
- Update README.md if structure changes

## Architecture Rules

- /portal and /admin always hidden — no links in navbar or footer
- Direct URL still works
- CodeRainBackground stays in hero
- CoffeeBeanCursor is DISABLED (recruiter bounce-trigger)
- Language toggle (SV/EN) kept for now

## Brand Rules — Coffee as Identity

- ✅ Coffee as visual identity — logo, amber colors, dark palette
- ✅ Coffee as tone and name — Coffee Code Studio, coffee references in copy
- ✅ CodeRainBackground — kept in hero
- ✅ ☕ emoji in logo — kept
- ❌ Coffee as UX interaction that disrupts navigation — e.g. CoffeeBeanCursor (disabled)

Rule: Personality and professionalism coexist. Coffee is the brand.

## Portfolio Rules

- English as primary language
- 2–3 projects max displayed
- Each project: Problem → Architecture → AI Workflow → Metrics → Live + GitHub
- No skill percentage bars
- No gated demos
- Guest login on all live demos
- Load time under 1.5 seconds

## Positioning Rules

- Title: "Product Engineer" or "AI-Leveraged Product Engineer"
- Never: "no-code developer", "vibe coder", "prompt engineer"
- Always visible in hero: "Based in Gothenburg, Sweden"
- Lagom principle: no hype, no superlatives — only facts and numbers

## Contact Rules

- Primary CTA: large "Copy Email" button
- No heavy form as primary contact
- Calendly: secondary, discreet link only
- Show: GitHub + LinkedIn + PDF CV download

## SEO Rules

- Meta title: max 60 chars — "Rami | Product Engineer (React, TypeScript) — Gothenburg"
- Meta description: 145–155 chars
- OG image: 1200×630px PNG — name + role + Gothenburg + app screenshot
- sitemap.xml and robots.txt must exist
- JSON-LD structured data: Person + ProfilePage schema in <head>
- Site must be indexable — never noindex on homepage

## Accessibility Rules (a11y)

- WCAG 2.1 Level AA — required by Swedish law since EAA June 2025
- Never outline:none without visible focus ring
- One <h1> per page — never skip heading levels
- All icon buttons require aria-label
- Contrast minimum 4.5:1 for body text
- prefers-reduced-motion must be respected

## Analytics Rules

- Use Plausible — NOT Google Analytics 4
- Zero cookie banner required — GDPR compliant
- Track: cv_download, copy_email, project_demo_clicked, github_repo_clicked
- UTM tags on ALL job applications e.g. ?utm_source=cv&utm_campaign=volvo
- Vanity slugs for specific recruiters: /v/volvo, /v/nexer

## What Is Disabled (not deleted)

| Component | File | Reason |
|---|---|---|
| CoffeeBeanCursor | App.tsx | Recruiter bounce-trigger |
| AIAssistant | ClientPortal.tsx | Leaking Lovable credits |
| TestimonialsSection | Index.tsx | Business content |
| TjansterSection | Index.tsx | Business content |
| PricingSection | Index.tsx | Business content |
| FAQSection | Index.tsx | Business content |
| Portal button in nav | Navbar.tsx | Hidden from public |
