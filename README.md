# Rami — AI-Assisted Developer

Personal portfolio of Rami, an AI-Assisted Developer based in Gothenburg, Sweden.

> **Project Status:** Live at [coffeecodestudio.se](https://coffeecodestudio.se) — a pure developer portfolio (no client system).

## About

Rami defines app features, user flows and rules. AI tools write the code; Rami directs the AI, tests and reviews the result (copy clarified 2026-11-11).

Project status (2026-11-11): Echo2000 has 340+ registered users. DJ Lobo is live. Klar is live, with no users yet. “3 Production Apps Shipped” counts shipped applications, not applications with users.

This site showcases selected projects, skills, and ways to get in touch. It is built as a fast, modern React single-page application with smooth interactions and SEO-friendly prerendering.

## Tech Stack

- **Framework**: React 18 + Vite 5 + TypeScript
- **Styling**: Tailwind CSS, shadcn/ui, framer-motion
- **Routing**: react-router-dom
- **Backend**: Lovable Cloud (storage for project images, contact-form edge function)
- **Platform**: Developed and hosted via Lovable

## Public Pages

| Route | Purpose |
| --- | --- |
| `/` | Portfolio landing — hero, projects, about, contact |
| `/integritetspolicy` | Privacy policy |
| `/cookiepolicy` | Cookie policy |

No internal, login or admin routes. The only backend function is `send-contact-email` for the contact form.

## SEO & Performance

- Per-page titles, descriptions, canonical and Open Graph tags via `src/components/SEOHead.tsx`.
- Static prerendering via `scripts/prerender-static.mjs` so crawlers receive real HTML.
- Social preview: `public/og-image.png` (1200×630), with matching OG and Twitter metadata in the static head, React and prerendered routes. Publish to update the live preview.
- Sitemap at `public/sitemap.xml` and `public/robots.txt` with AI-crawler allowances.

## Live Site

👉 [coffeecodestudio.se](https://coffeecodestudio.se)

## Docs

- [CHANGELOG.md](./CHANGELOG.md) — change history
- [ARCH.md](./ARCH.md) — architecture, routes, SEO and i18n details
