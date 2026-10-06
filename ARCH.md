# Arkitektur

Teknisk översikt av portfolion (coffeecodestudio.se): routes, SEO, språkhantering, schema och sitemap.

## Stack

- React 18 + Vite 5 + TypeScript
- Tailwind CSS + shadcn/ui + framer-motion
- react-router-dom (client-side routing, SPA utan SSR)
- Lovable Cloud som backend (databas, auth, storage, edge functions)
- Hostas på Lovable hosting, domän `coffeecodestudio.se`

## Routes

Alla routes definieras i `src/App.tsx`. Sajten är en ren portfolio — inget kundsystem, ingen inloggning.

| Route | Komponent | Innehåll |
| --- | --- | --- |
| `/` och `/en` | `pages/Index.tsx` | Hero, projekt (Echo2000, Klar, DJ Lobo), metodik, om mig, kontakt |
| `/integritetspolicy` (+ `/en/...`) | `Integritetspolicy.tsx` | Integritetspolicy (kontaktformulär, analys) |
| `/cookiepolicy` (+ `/en/...`) | `Cookiepolicy.tsx` | Cookiepolicy |
| `*` | `NotFound.tsx` | 404 |

Edge function i bruk: `send-contact-email` (kontaktformuläret).

## SEO-uppsättning

### `src/components/SEOHead.tsx`

Anropas per sida med `title`, `description` och valfria `canonical`, `ogImage`, `noindex`. Den:

1. Sätter `document.title` och `<html lang>` baserat på språket i sökvägen.
2. Skriver `meta description`, `og:title`, `og:description`, `og:type`, `og:locale`, `og:url` och — om `ogImage` finns — `og:image` och Twitter-taggar.
3. Sätter `robots: noindex, nofollow` när `noindex` är satt, annars tas taggen bort.
4. Sätter `<link rel="canonical">` självrefererande till den aktuella språkversionen.
5. Genererar hreflang-länkar (`sv`, `en`, `x-default`) för sidor som finns på båda språken och inte är `noindex`.
6. Renderar `<StructuredData />`.

Alla element som komponenten skapar spåras i en ref och städas bort vid navigering, så inga taggar dubbleras.

Begränsning: eftersom appen är en klientrenderad SPA läser sociala förhandsvisningsbottar bara den statiska `<head>` i `index.html`, inte de här per-sida-taggarna. Korrekta per-sida-previews kräver SSR.

### `index.html`

Innehåller basrubrik, basbeskrivning, Open Graph-fallback och delningsbilden `og-image-v2.png`. `html`, `body` och `#root` har inline-stilar med bakgrundsfärg `#0B0D1E` och `min-height: 100vh` så att ingen vit blinkning syns innan React/CSS laddat; `color-scheme: dark` och `<meta name="theme-color">` är också satta.

### `scripts/prerender-static.mjs` (byggsteg)

Körs som postbuild efter `vite build`. För varje publik route läser skriptet `dist/index.html` och skriver en statisk `dist/<route>/index.html` med sidans rubrik, brödtext, meny och footer injicerade som riktig HTML inuti `#root`. Syfte: sökmotorer och AI-bottar ska se komplett innehåll utan att köra JavaScript (appens övriga SEO-taggar sätts klient-side av SEOHead och är osynliga för crawlers utan JS). När React laddat hydrerar/ersätter det `#root`-innehållet. Viktigt: regexen som letar upp `<div id="root">` måste matcha oavsett attribut/inline-stilar — en strikt matchning gjorde att alla undersidor tidigare fick startsidans pre-renderade innehåll.

## Språkhantering (sv/en)

Hjälpfunktioner i `src/lib/i18nRoutes.ts`:

- `SITE_URL` — `https://coffeecodestudio.se`
- `LOCALIZED_PUBLIC_PATHS` — listan över sökvägar som har både sv och en
- `detectLang(pathname)` — `/en` eller `/en/*` → `en`, annars `sv`
- `stripLangPrefix(pathname)` — tar bort `/en`-prefixet
- `pathForLang(pathname, lang)` — bygger motsvarande sökväg i valt språk
- `isLocalizedPath(pathname)` — avgör om hreflang ska skrivas ut

`src/contexts/LanguageContext.tsx` exponerar bara aktuellt språk (från URL-prefixet). All sidcopy är hårdkodad engelska i komponenterna.

Strategi: svenska är standard utan prefix, engelska ligger under `/en/`. Varje par pekar på varandra med reciproka hreflang, och `x-default` pekar alltid på den svenska versionen.

## Schema.org

`src/components/StructuredData.tsx` injicerar `ProfilePage` med `Person` (Rami, AI-native Fullstack-utvecklare, Göteborg, knowsAbout-stack). Inga LocalBusiness-, Offer- eller FAQ-scheman finns kvar.

## Sitemap och robots

`public/sitemap.xml` underhålls för hand och innehåller 6 URL:er: `/`, `/en`, integritets- och cookiepolicy på båda språken.

Vid ny route: lägg till sökvägen i `LOCALIZED_PUBLIC_PATHS`, registrera både svensk och engelsk route i `App.tsx` och lägg in båda URL:erna i sitemapen.

`public/robots.txt`:

- Explicita `Allow`-block för AI-crawlers (GPTBot, ClaudeBot, PerplexityBot, GoogleOther) och sociala crawlers (Facebook, Twitter, LinkedIn, Slack, WhatsApp, Discord, Telegram)
- `User-agent: *` tillåter allt
- `Sitemap:` pekar på `sitemap.xml`, `LLM-sitemap:` pekar på `llms.txt`

## Deployment

Publicering sker från Lovable-editorn. Frontend-ändringar går live vid publicering; backend-ändringar (databas, edge functions) deployas direkt.
