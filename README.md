# Rami — AI-native Fullstack-utvecklare

Personal portfolio of Rami, an AI-native fullstack developer based in Gothenburg, Sweden.

> **Project Status:** Live at [coffeecodestudio.se](https://coffeecodestudio.se) — a pure developer portfolio (no client system).

## About

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
- Sitemap at `public/sitemap.xml` and `public/robots.txt` with AI-crawler allowances.

## Live Site

👉 [coffeecodestudio.se](https://coffeecodestudio.se)

## Docs

- [CHANGELOG.md](./CHANGELOG.md) — change history
- [ARCH.md](./ARCH.md) — architecture, routes, SEO and i18n details
