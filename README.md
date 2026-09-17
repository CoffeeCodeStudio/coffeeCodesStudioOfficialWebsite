# Rami — AI-Leveraged Product Engineer

Personal portfolio of Rami, an AI-Leveraged Product Engineer based in Gothenburg, Sweden.

> **Project Status:** Live at [coffeecodestudio.se](https://coffeecodestudio.se) — currently transitioning from a small-business agency site to a developer portfolio.

## About

This site showcases selected projects, skills, and ways to get in touch. It is built as a fast, modern React single-page application with smooth interactions and SEO-friendly prerendering.

## Tech Stack

- **Framework**: React 18 + Vite 5 + TypeScript
- **Styling**: Tailwind CSS, shadcn/ui, framer-motion
- **Routing**: react-router-dom
- **Backend**: Lovable Cloud (database, auth, storage, edge functions)
- **Platform**: Developed and hosted via Lovable

## Public Pages

| Route | Purpose |
| --- | --- |
| `/` | Portfolio landing — hero, projects, about, contact |
| `/om-mig` / `/en/om-mig` | About page |
| `/integritetspolicy` | Privacy policy |
| `/cookiepolicy` | Cookie policy |
| `/anvandardvillkor` | Terms of use |

Internal/auth routes: `/portal`, `/admin`, `/set-password`.

## SEO & Performance

- Per-page titles, descriptions, canonical and Open Graph tags via `src/components/SEOHead.tsx`.
- Static prerendering via `scripts/prerender-static.mjs` so crawlers receive real HTML.
- Sitemap at `public/sitemap.xml` and `public/robots.txt` with AI-crawler allowances.

## Live Site

👉 [coffeecodestudio.se](https://coffeecodestudio.se)

## Docs

- [CHANGELOG.md](./CHANGELOG.md) — change history
- [ARCH.md](./ARCH.md) — architecture, routes, SEO and i18n details
