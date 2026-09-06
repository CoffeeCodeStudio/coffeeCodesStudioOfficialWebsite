# Changelog

Alla ändringar dokumenteras här.
Format baserat på [Keep a Changelog](https://keepachangelog.com/).

## [2026-09-06] - SEO och GEO-förbättringar

### Lagt till

- `/webbyra-goteborg` med LocalBusiness- och FAQPage-schema
- `/hemsida-frisor-goteborg` med FAQ och hreflang
- `/hemsida-hantverkare-goteborg` med FAQ och hreflang
- `/en`-varianter för alla nya sidor
- GPTBot, ClaudeBot, PerplexityBot och GoogleOther i `robots.txt`
- LLM-sitemap-länk (`llms.txt`) i `robots.txt`
- WebSite-schema i det sitewide `@graph` (`StructuredData.tsx`)
- Sitemap utökad till 18 URL:er med reciproka hreflang-alternat

### Ändrat

- `/en/frisor-goteborg` översatt till engelska
- `/en/smaforetag-goteborg` översatt till engelska

### Att göra

- `/vad-kostar-en-hemsida` med prisjämförelse (planerad, ej byggd)

## [2026-09-05] - Metadata, sitemap och prestanda

### Lagt till

- `SEOHead`-komponent med per-sida titel, beskrivning, canonical, Open Graph och hreflang
- `react-helmet-async` som beroende
- `public/sitemap.xml` med hreflang-alternat och uppdaterad `robots.txt`
- Programmatisk og-bild (`public/og-image-v2.png`, 1200×630) för stabila delningsförhandsvisningar

### Ändrat

- `noindex` på `/projektfragor`
- Optimerade bilder (`testimonial-djlobo.webp`, `favicon.png`) efter Lighthouse-granskning
- GA4-mät-ID uppdaterat i `CookieConsent`

## [2026-09-04] - Innehåll, betalning och säkerhet

### Lagt till

- Validering som blockerar och loggar inaktiva betalningsmetoder i checkout (`src/lib/paymentMethods.ts`)
- Notering per portföljprojekt (kundprojekt / prototyp / personligt projekt)
- Mjuk övergång mellan hero och Testimonials

### Ändrat

- Endast Kontant/Faktura visas som betalningsmetod (Kort, Swish och PayPal borttagna)
- Standardiserade scroll-animationer via `motionPresets.ts`
- Minskat avstånd mellan hero och nästa sektion
- Echo2000: uppdaterad länk och skärmbild

### Säkerhet

- Åtgärdade databaspolicyer för lagring, notifieringar, roller och avtal enligt säkerhetsgranskningen
