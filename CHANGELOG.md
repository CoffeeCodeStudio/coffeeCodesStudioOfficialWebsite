# Changelog

> Coffee Code Studio — coffeecodestudio.se

## 2026-10-06 — Phase 3n: Echo2000 and Klar case copy updates

- Echo2000-kortets och modalens målgrupp: "people who grew up with early-2000s internet culture — forums, guestbooks, platforms like LunarStorm and MySpace." Kortets beskrivning uppdaterad i `portfolio_projects.description`; modalens PROBLEM-text uppdaterad i `ProjektSection.tsx`.
- Echo2000: "10+ Edge Functions" → "73+ Edge Functions" i modalens METRICS, enligt ägarens verifierade uppgift. Kortet saknade en metrics-rad i aktuell kod; en rad med 73+ Edge Functions har lagts till. 340+ Registered Users oförändrat.
- Echo2000-modalen, kortbeskrivningen och About: all användardata var intakt, utan dataförlust; kontoåtkomst påverkades tillfälligt och 129 konton återaktiverades manuellt för att återställa åtkomst. Återuppbyggnad inom 24 timmar kvarstår.
- Klar: första DLD-omnämnandet i modalens beskrivning (hämtad från `portfolio_projects`) utvecklat till "DLD (developmental language disorder)"; samma förklaring i PROBLEM-texten.
- Klar: "GDPR Article 9" kompletterat med "(special category data, e.g. health-related information)".
- Klar: "~700,000 Swedish adults have dyslexia" → "ca 400,000 Swedish adults have dyslexia", enligt ägarens uppgift från Dyslexiförbundet.

## 2026-10-06 — Phase 3m: Title change — "Product Engineer" → "AI-native Fullstack-utvecklare"

- Ny titel: "AI-native Fullstack-utvecklare — Gothenburg, Sweden" (i engelska meningar: "AI-native fullstack developer").
- Skäl: "Product Engineer" tolkas som mekanik/hårdvara i Sverige, och vibe coding-framingen hade dåligt rykte.
- 8 kodfiler ändrade: Footer.tsx, StructuredData.tsx (Person-schema jobTitle), index.html (titel + og:title + meta), Index.tsx (SEOHead), scripts/prerender-static.mjs, public/llms.txt, ContactSection.tsx, AboutSection.tsx.
- Dokumentation uppdaterad samma dag: README.md, RULES.md, DESIGN.md, PORTFOLIO_PLAN.md, ARCH.md, RESEARCH_SUMMARY.md.

## 2026-10-06 — Phase 3l: Copy — "active users" → "registered users"

- AboutSection: "taking them from initial schema design to active, real-world users" → "...to real-world registered users" (340+ och 129 oförändrade).
- Genomsökning av hela koden (StructuredData.tsx, prerender-static.mjs, llms.txt, HeroSection m.fl.): ingen annan förekomst av "active users" kopplad till Echo2000. Echo2000-modalen visade redan korrekt "340+ Registered Users" i METRICS-sektionen — orörd.
- Tillägg (samma dag): Echo2000-projektkortets beskrivningstext ("From idea to live production with 340+ active users") fanns INTE i koden — den ligger i databastabellen portfolio_projects och kom därför undan kodsökningen. Beskrivningen uppdaterad i databasen: "340+ active users" → "340+ registered users" (id cc6027f3-83ba-4b60-a197-b1e538e51e90). Sista breddsökning bekräftar: "active users" finns inte kvar i projektet (endast i denna logg).

## 2026-10-06 — Phase 3k: Contact form regression fix (CORS)

- Regression: kontaktformuläret misslyckades igen ("Could not send message. Please try again.") — inga mejl kom fram.
- Rotorsak: INTE samma fel som 2026-09-23 (projectType/budget-valideringen kom aldrig tillbaka och finns fortfarande inte). Denna gång satt felet i CORS-headern i `supabase/functions/send-contact-email/index.ts` — `Access-Control-Allow-Origin: https://coffeecodestudio.se` var hårdkodad. Anrop från preview-domänen (localhost:8080 / lovable.app / www) blockerades i webbläsaren innan funktionen ens kördes, därför fanns inga funktionsloggar.
- Fix: `Access-Control-Allow-Origin` ekar nu requestens origin från en allowlist (coffeecodestudio.se, www, coffeecodestudio.lovable.app, localhost:8080) via `corsHeadersFor(origin)`, med coffeecodestudio.se som fallback. Lade även till `Access-Control-Allow-Methods` och `Vary: Origin`.
- E-postmallen och valideringen granskade: inga referenser till projectType/budget; formuläret skickar bara name, email, message (plus honeypot `website`).
- Verifierat: OPTIONS-preflight 200 OK för localhost:8080 och https://www.coffeecodestudio.se (rätt ACAO-echo), test-POST → 200 OK `{"success":true,"sender":"primary"}` — mejlet gick ut via Resend.


## 2026-09-25 — Phase 3j: Business content removed

- Borttagna sidor: WebbyraGoteborg, HemsidaFrisorGoteborg, HemsidaHantverkareGoteborg, VadKostarEnHemsida, SmaforetagGoteborg, FrisorGoteborg, OmMig, Anvandardvillkor.
- Borttaget kundsystem: ClientLogin, ClientPortal, Projektfragor, AdminDashboard, AdminLogin, SetPassword, components/admin, components/portal, components/chat, hooks/useAdmin, lib/paymentMethods, lib/projectStatuses.
- Borttagna edge functions (kod + deployade): create-client, delete-client, sign-agreement, sign-pub-agreement, submit-client-request, notify-admin-request, notify-checklist-complete, questionnaire-reminder, send-notification, project-ai-chat. send-contact-email behålls med avsändare "Rami Portfolio".
- Borttagna komponenter: TjansterSection, PricingSection, FAQSection, TestimonialsSection, CoffeeBeanCursor.
- Borttagna bilder: smaforetag-preview, salon-preview, hantverkare-preview, frisor-mockup, logo.svg, logo-pdf.png.
- Omskrivet: index.html- och startsidans titel/beskrivning, sitemap (6 URL:er), robots.txt, llms.txt, prerender-static.mjs, StructuredData (alternateName borttagen), integritets- och cookiepolicy, LanguageContext (all gammal copy borttagen).

## 2026-09-23 — Phase 3i: Prerender fix + white-flash fix

- Fix: `scripts/prerender-static.mjs` matchade inte längre `<div id="root">` sedan inline-stilar lades till i index.html, vilket gjorde att fel pre-renderat innehåll (startsidans h1) visades på undersidor som `/hemsida-hantverkare-goteborg`. Regex matchar nu root oavsett attribut och bevarar dem — varje route renderar sin egen pre-renderade text igen.
- Fix: den korta vita blinkningen vid sidladdning är löst genom att `html`, `body` och `#root` har samma mörka bakgrundsfärg (`#0B0D1E`, `min-height: 100vh`) redan inline i index.html, plus `color-scheme: dark` och `<meta name="theme-color">`. INTE löst genom att dölja text med samma färg som bakgrunden — det hade varit cloaking och SEO-farligt. Fallback-texten ligger kvar i DOM:en och är fullt läsbar för sökmotorer.

## 2026-09-23 — Phase 3h: Bug fixes


### Phase 3h: Kontaktformulär, redirects och menylänkar

- Fix: kontaktformulär — `projectType` (och `budget`) borttaget från edge function `send-contact-email`; kräver nu bara name, email, message. Tidigare 400 Bad Request på alla submits. Verifierat med testanrop: 200 OK, "E-post skickad!"
- Fix: 301-redirects för `/frisor-goteborg` → `/hemsida-frisor-goteborg` och `/smaforetag-goteborg` → `/hemsida-hantverkare-goteborg` (permanenta omdirigeringar i App.tsx, gamla route-kommentarer ersatta)
- Fix: menylänkar på undersidor — Navbar-ankarlänkar (`#projekt`, `#about`, `#kontakt`) navigerar nu till `/#ankare` från undersidor och skrollar till rätt sektion på startsidan via useLocation + useEffect. Verifierat med Playwright från /om-mig

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

- Rewrote HeroSection.tsx with hardcoded English content
- Added Gothenburg location badge, Product Engineer H1, stack pills
- Added Copy Email CTA and Download CV secondary button
- Added scroll indicator
- Removed language context, djlobo mockup, imageError state

### Phase 2b: New portfolio AboutSection

- Rewrote AboutSection.tsx with hardcoded English content
- Added 2x2 stats grid: 3 Apps, 18 538 Commits, 340+ Users, < 1 year
- Added three English paragraphs about Rami
- Added Gothenburg location line
- Removed language context

### Phase 2b-fix: AboutSection copy and stats corrected per research

- Updated AboutSection copy to emphasize product-engineering bridge, schema-to-users delivery, and AI + structural discipline
- Updated 2×2 stats grid: Production Apps Shipped, Real-World Users, Strict TypeScript & RLS, Realtime Data Latency

### Phase 2c: New portfolio ContactSection

- Rewrote ContactSection.tsx with hardcoded English content
- Left column: Copy Email, Download Resume, LinkedIn buttons + availability badge
- Right column: minimal form with Work Email and Message only
- Removed phone, WhatsApp, company, budget, projectType fields
- Removed language context

### Phase 2d: Footer updated — removed phone/WhatsApp, added GitHub/LinkedIn/CV links

- Removed phone number and WhatsApp buttons from Footer.tsx
- Kept email button (`hej@coffeecodestudio.se`)
- Updated tagline to "Rami — Product Engineer. Built with React, TypeScript, Vite, Tailwind & Supabase."
- Added GitHub, LinkedIn, and Download CV links
- Changed section label from "KONTAKT" to "CONNECT"

### Phase 2e: ProjektSection heading updated to English

- Updated section heading to "Shipped Work"
- Updated intro paragraph to "Production applications built and deployed — real users, real systems."

### Phase 2f: ProjektSection — added project detail modal with PSAM placeholders

- Added clickable project cards that open a slide-over modal
- Modal includes Problem, Architecture & AI Workflow, and Metrics placeholder sections
- Added live app launch and GitHub action buttons
- Added Escape key and backdrop click to close
- Hardcoded English strings and removed language context

### Phase 2g: Hidden Golden Fruit Oasis prototype from portfolio

- Set `is_visible = false` on the `Golden Fruit Oasis` row in `portfolio_projects`
- Row preserved in database; removed from public project grid

### Phase 2h: Removed SV/EN language toggle from navbar

- Commented out `<LanguageToggle />` usage in `Navbar.tsx`
- Component definition preserved; toggle no longer rendered

### Phase 2j: AboutSection — added production crisis metric, languages and AI stack

- Added Echo2000 production crisis recovery sentence to paragraph 2
- Added languages line: Swedish, English, Arabic
- Added AI stack line: Claude Code, Lovable, Groq, Gemini

### Phase 2k: HeroSection — reordered stack pills, added AI tooling row

- Reordered stack pills to: TypeScript, React, Supabase, PostgreSQL, Tailwind CSS, Vite
- Added "AI Tooling" label and second pill row: Cursor, Claude, Lovable, Gemini

### Phase 2l: Added MethodologySection — 4-step AI workflow cards

- Created `src/components/MethodologySection.tsx` with four workflow cards
- Inserted between `ProjektSection` and `AboutSection` on the landing page

### Phase 2m: Footer localized to English

- Changed rights line to "All rights reserved"
- Changed legal links to "Privacy Policy", "Cookie Policy", and "Terms of Service"
- Changed credit line to "Designed & engineered by Rami"

### Phase 2n: AboutSection stats updated — removed unverified metrics

- Replaced "100% / Strict TypeScript & RLS" with "100 / Lighthouse Accessibility"
- Replaced "< 50ms / Realtime Data Latency" with "Jan 2026 / First Live Deploy"

### Phase 2o-fix: Removed unverified metrics from DJ Lobo modal

- Filled Echo2000 and Klar PSAM sections with real content and verified metrics
- Kept DJ Lobo PROBLEM and ARCHITECTURE & AI WORKFLOW sections; removed the METRICS grid
- Updated action button labels and URLs per project

### Phase 2p: Added Resume link to navbar (placeholder href)

- Added "Resume" link to desktop and mobile navbar after Contact; uses `href="#"` until the PDF is uploaded

### Phase 2q: Responsive layout audit and fixes

- Audited HeroSection, AboutSection, ProjektSection modal, MethodologySection, ContactSection and Footer for mobile layouts
- ProjektSection modal METRICS grids: 3 columns on desktop, 1 column on mobile (grid-cols-1 sm:grid-cols-3)
- ContactSection copy-email button: long email text now truncates safely on narrow screens
- Verified: hero pills wrap, CTAs stack on mobile, H1 scales down, About/Methodology/Contact/Footer stack to single column, modal is full-width bottom sheet on mobile

### Phase 3b: H1 outcome-first, AI qualifier added, About collaboration signal added

- HeroSection H1 updated to: "I build production web applications from schema design to real users."
- Added AI qualifier paragraph below AI Tooling pills: architecture, schema design, and security policies are human-designed; component code is AI-generated and human-reviewed
- AboutSection closing paragraph updated to signal solo ownership and readiness to join a team

### Phase 3c: Echo2000 GitHub button updated to reflect private repo

- Changed Echo2000 modal GitHub button label from "View on GitHub" to "Private repo — I walk through the code in interviews"
- Kept href pointing to https://github.com/CoffeeCodeStudio and icon unchanged

### Phase 3d: CV button changed to mailto Request CV

- ContactSection "Download Resume (PDF)" button changed to mailto "Request CV" with pre-filled subject and body
- Footer "Download CV" link updated to the same mailto "Request CV" link
- Icon changed from Download to Mail in ContactSection

### Phase 3e: Klar GitHub button updated to reflect private repo

- Changed Klar modal GitHub button label from "View on GitHub" to "Private repo — I walk through the code in interviews"
- Kept href pointing to https://github.com/CoffeeCodeStudio and icon unchanged

### Phase 3f: Removed CV download button — CV shared manually on request

- Commented out the "Request CV" mailto button in ContactSection
- Commented out the "Request CV" link in Footer

### Phase 3g: Removed Resume button from navbar — CV shared on request

- Commented out the Resume link in both desktop and mobile navbar
- Consistent with Phase 3f: CV is now shared manually on request only

### Waiting for (Phase 2)

- New CaseStudySection
- TechStackMatrix
- Plausible analytics
- JSON-LD structured data
- OG image 1200×630px

## 2026-10-06 — Phase 3o: Portfolio polish
- About stats: "Jan 2026 — First Live Deploy" replaced with "100% TypeScript".
- Hero H1: now white text with amber only on "production" and "real users".
- About: neutral avatar placeholder added (TODO: replace with real headshot).
- Project cards: tech-stack tags shown directly on cards.
- Items 5–10 (73+ Edge Functions, data-vs-access wording, culture reference, DLD, GDPR Art. 9, 400,000 dyslexia) were already applied in Phase 3n — verified unchanged.
