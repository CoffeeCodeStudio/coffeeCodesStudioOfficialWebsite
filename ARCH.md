# Arkitektur

Teknisk översikt av Coffee Code Studio: routes, SEO, språkhantering, schema och sitemap.

## Stack

- React 18 + Vite 5 + TypeScript
- Tailwind CSS + shadcn/ui + framer-motion
- react-router-dom (client-side routing, SPA utan SSR)
- Lovable Cloud som backend (databas, auth, storage, edge functions)
- Hostas på Lovable hosting, domän `coffeecodestudio.se`

## Routes

Alla routes definieras i `src/App.tsx` inuti `<BrowserRouter>` och `<LanguageProvider>`.

### Publika, indexerbara sidor (svensk standard)

| Route | Komponent | Innehåll |
| --- | --- | --- |
| `/` | `pages/Index.tsx` | Startsida: hero, tjänster, portfölj, priser, testimonials, FAQ, kontakt |
| `/smaforetag-goteborg` | `SmaforetagGoteborg.tsx` | Landningssida för småföretag, LocalBusiness + FAQPage |
| `/frisor-goteborg` | `FrisorGoteborg.tsx` | Landningssida frisörer, LocalBusiness + FAQPage |
| `/webbyra-goteborg` | `WebbyraGoteborg.tsx` | Landningssida webbyrå, LocalBusiness + FAQPage |
| `/hemsida-frisor-goteborg` | `HemsidaFrisorGoteborg.tsx` | Landningssida frisörsalonger, FAQPage |
| `/hemsida-hantverkare-goteborg` | `HemsidaHantverkareGoteborg.tsx` | Landningssida hantverkare, FAQPage |
| `/vad-kostar-en-hemsida` | `VadKostarEnHemsida.tsx` | Prisguide, FAQPage |
| `/integritetspolicy` | `Integritetspolicy.tsx` | Integritetspolicy |
| `/cookiepolicy` | `Cookiepolicy.tsx` | Cookiepolicy |
| `/anvandardvillkor` | `Anvandardvillkor.tsx` | Användarvillkor |

Varje route ovan har en engelsk spegling på `/en/...` (startsidan på `/en`) som renderar samma komponent med engelsk text.

### Interna routes (ej indexerade, ingen engelsk spegling)

| Route | Komponent | Innehåll |
| --- | --- | --- |
| `/portal/login` | `ClientLogin.tsx` | Kundinloggning |
| `/portal` | `ClientPortal.tsx` | Kundportal: projekt, filer, meddelanden, avtal |
| `/set-password` | `SetPassword.tsx` | Sätt lösenord efter inbjudan |
| `/admin/login` | `AdminLogin.tsx` | Admininloggning |
| `/admin` | `AdminDashboard.tsx` | Adminpanel |
| `/projektfragor` | `Projektfragor.tsx` | Projektformulär (`noindex`) |
| `*` | `NotFound.tsx` | 404 |

`AuthRedirectHandler` i `App.tsx` fångar inbjudnings-, recovery- och signup-tokens i URL-hashen och skickar användaren till `/set-password`.

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

Innehåller basrubrik, basbeskrivning, Open Graph-fallback och delningsbilden `og-image-v2.png`.

## Språkhantering (sv/en)

Hjälpfunktioner i `src/lib/i18nRoutes.ts`:

- `SITE_URL` — `https://coffeecodestudio.se`
- `LOCALIZED_PUBLIC_PATHS` — listan över sökvägar som har både sv och en
- `detectLang(pathname)` — `/en` eller `/en/*` → `en`, annars `sv`
- `stripLangPrefix(pathname)` — tar bort `/en`-prefixet
- `pathForLang(pathname, lang)` — bygger motsvarande sökväg i valt språk
- `isLocalizedPath(pathname)` — avgör om hreflang ska skrivas ut

`src/contexts/LanguageContext.tsx` håller allt gränssnittsspråk och all copy. Landningssidorna väljer svensk eller engelsk text utifrån URL-prefixet.

Strategi: svenska är standard utan prefix, engelska ligger under `/en/`. Varje par pekar på varandra med reciproka hreflang, och `x-default` pekar alltid på den svenska versionen.

## Schema.org

### Sitewide — `src/components/StructuredData.tsx`

Injicerar ett `@graph` (script-id `ld-json-site-graph`) med:

- `Organization` (`#organization`) — namn, logotyp, beskrivning, `ContactPoint`
- `LocalBusiness` (`#localbusiness`) — adress, `GeoCoordinates`, `areaServed`, öppettider, `priceRange`, betalsätt och `hasOfferCatalog` med `Offer` → `Service`
- `WebSite` (`#website`) — url, namn, språk, publisher

Grafen byggs om per språk (`sv-SE` / `en`).

### Per sida

- `LocalBusiness` + `FAQPage` på `/frisor-goteborg`, `/smaforetag-goteborg`, `/webbyra-goteborg`
- `FAQPage` på `/hemsida-frisor-goteborg`, `/hemsida-hantverkare-goteborg` och `/vad-kostar-en-hemsida`
- `FAQPage` via `src/components/FAQSection.tsx` på startsidan

## Sitemap och robots

`public/sitemap.xml` underhålls för hand och innehåller 20 URL:er — tio svenska sidor och deras engelska motsvarigheter. Varje `<url>` har `xhtml:link`-alternat för `sv`, `en` och `x-default`, plus `changefreq` och `priority` (startsidan 1.0, landningssidor 0.8/0.7, legal 0.3/0.2). Interna routes ingår inte.

Vid ny route: lägg till sökvägen i `LOCALIZED_PUBLIC_PATHS`, registrera både svensk och engelsk route i `App.tsx` och lägg in båda URL:erna i sitemapen.

`public/robots.txt`:

- Explicita `Allow`-block för AI-crawlers (GPTBot, ClaudeBot, PerplexityBot, GoogleOther) och sociala crawlers (Facebook, Twitter, LinkedIn, Slack, WhatsApp, Discord, Telegram)
- `User-agent: *` tillåter allt utom `/admin`, `/admin/login`, `/portal`, `/portal/login`, `/set-password`
- `Sitemap:` pekar på `sitemap.xml`, `LLM-sitemap:` pekar på `llms.txt`

## Deployment

Publicering sker från Lovable-editorn. Frontend-ändringar går live vid publicering; backend-ändringar (databas, edge functions) deployas direkt.
