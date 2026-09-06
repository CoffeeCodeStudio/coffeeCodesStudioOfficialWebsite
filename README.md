# Coffee Code Studio ☕️💻

Coffee Code Studio is a modern digital agency specializing in building high-quality, custom web applications with a focus on speed, aesthetics, and user experience.

> ⚠️ **Project Status: Live / Under Development** — the site is live at [coffeecodestudio.se](https://coffeecodestudio.se) and is actively being extended with new landing pages and SEO work.

## 🚀 Project Overview

This application serves as the digital storefront for Coffee Code Studio. It is designed to showcase expertise in rapid web development and modern design patterns, and to rank locally in Gothenburg for small-business website searches.

## ✨ Key Features

- **Modern UI/UX**: A clean, minimalist aesthetic designed for clarity and engagement.
- **Fully Responsive**: Optimized performance across all devices.
- **Bilingual (sv/en)**: Swedish by default, English mirrors under `/en/*` with reciprocal hreflang.
- **Service Catalog**: Clear breakdown of custom web development offerings.
- **Client Portal & Admin**: Authenticated areas for projects, files, messages and agreements (Lovable Cloud backend).
- **Rapid Iteration**: Built using AI-assisted development for lightning-fast delivery.

## 🛠 Tech Stack

- **Framework**: React 18 + Vite 5 + TypeScript
- **Styling**: Tailwind CSS, shadcn/ui, framer-motion
- **Routing**: react-router-dom
- **Backend**: Lovable Cloud (database, auth, storage, edge functions)
- **Platform**: Developed and hosted via Lovable

## 🗺 Pages

Public Swedish routes (each has an `/en/...` English mirror unless noted):

| Route | Purpose |
| --- | --- |
| `/` | Startsida — hero, tjänster, portfölj, priser, FAQ, kontakt |
| `/smaforetag-goteborg` | Landningssida: hemsida för småföretag i Göteborg |
| `/frisor-goteborg` | Landningssida: hemsida för frisörer |
| `/webbyra-goteborg` | Landningssida: webbyrå i Göteborg |
| `/hemsida-frisor-goteborg` | Landningssida: hemsida för frisörsalonger |
| `/hemsida-hantverkare-goteborg` | Landningssida: hemsida för hantverkare |
| `/vad-kostar-en-hemsida` | Prisguide: vad en hemsida kostar |
| `/integritetspolicy`, `/cookiepolicy`, `/anvandardvillkor` | Legal |

Internal routes (no English mirror, excluded from indexing): `/portal`, `/portal/login`, `/admin`, `/admin/login`, `/set-password`, `/projektfragor`.

## 🔍 SEO setup

- **Per-page head**: `src/components/SEOHead.tsx` sets title, description, canonical, Open Graph and hreflang per route.
- **Structured data**: `src/components/StructuredData.tsx` emits a sitewide `@graph` with `Organization`, `LocalBusiness` (with `OfferCatalog`) and `WebSite`. Landing pages add their own `LocalBusiness` and `FAQPage` schema.
- **Languages**: `/en` URL prefix strategy, helpers in `src/lib/i18nRoutes.ts`, reciprocal `sv` / `en` / `x-default` hreflang.
- **Sitemap**: `public/sitemap.xml`, hand-maintained, with hreflang alternates per URL.
- **Robots**: `public/robots.txt` explicitly allows AI crawlers (GPTBot, ClaudeBot, PerplexityBot, GoogleOther) and social crawlers, blocks admin/portal routes, and points to both `sitemap.xml` and `llms.txt`.

Note: this is a client-rendered SPA — social preview crawlers read the static `index.html` head, not the per-route tags.

## 🚢 Deployment

Hosted on **Lovable hosting** (no Vercel/Netlify config). Frontend changes go live when you publish from the Lovable editor; backend changes (database, edge functions) deploy immediately. Custom domains: `coffeecodestudio.se` and `www.coffeecodestudio.se`.

## ⚡️ Live site

👉 [coffeecodestudio.se](https://coffeecodestudio.se)

## 📄 Docs

- [CHANGELOG.md](./CHANGELOG.md) — change history
- [ARCH.md](./ARCH.md) — architecture, routes, SEO and i18n details
