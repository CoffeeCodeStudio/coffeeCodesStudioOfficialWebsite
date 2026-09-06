/**
 * Static prerender for public routes.
 *
 * Runs as a postbuild step: reads dist/index.html and writes one static
 * dist/<route>/index.html per public route with route-specific <title>,
 * meta description, canonical, og:url and visible HTML inside #root, so
 * AI bots and social crawlers see real content instead of an empty shell.
 *
 * React replaces the #root content on hydration, so this only affects
 * clients that do not execute JavaScript.
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';

const SITE = 'https://coffeecodestudio.se';
const DIST = 'dist';

/** Safety cap so the build can never emit an unbounded number of files. */
const MAX_PRERENDER_PAGES = Number(process.env.MAX_PRERENDER_PAGES ?? 100);

const NAV_SV = [
  { href: '/', label: 'Start' },
  { href: '/om-mig', label: 'Om mig' },
  { href: '/vad-kostar-en-hemsida', label: 'Vad kostar en hemsida' },
  { href: '/webbyra-goteborg', label: 'Webbyrå Göteborg' },
  { href: '/smaforetag-goteborg', label: 'Småföretag Göteborg' },
  { href: '/hemsida-frisor-goteborg', label: 'Hemsida frisör' },
  { href: '/hemsida-hantverkare-goteborg', label: 'Hemsida hantverkare' },
  { href: '/integritetspolicy', label: 'Integritetspolicy' },
  { href: '/cookiepolicy', label: 'Cookiepolicy' },
  { href: '/anvandardvillkor', label: 'Användarvillkor' },
];

const NAV_EN = [
  { href: '/en', label: 'Home' },
  { href: '/en/om-mig', label: 'About' },
  { href: '/en/vad-kostar-en-hemsida', label: 'What does a website cost' },
  { href: '/en/webbyra-goteborg', label: 'Web agency Gothenburg' },
  { href: '/en/smaforetag-goteborg', label: 'Small business Gothenburg' },
  { href: '/en/hemsida-frisor-goteborg', label: 'Website for salons' },
  { href: '/en/hemsida-hantverkare-goteborg', label: 'Website for tradespeople' },
  { href: '/en/integritetspolicy', label: 'Privacy policy' },
  { href: '/en/cookiepolicy', label: 'Cookie policy' },
  { href: '/en/anvandardvillkor', label: 'Terms of service' },
];

/** Public, indexable routes. Each entry carries both sv and en content. */
const ROUTES = [
  {
    path: '/',
    sv: {
      title: 'Hemsidor för småföretag i Göteborg | Coffee Code Studio',
      description:
        'Professionell hemsida från 4 900 kr — ofta live inom en vecka. Jag bygger snabba, mobilanpassade hemsidor för småföretag i Göteborg. Boka gratis konsultation.',
      h1: 'Hemsidor för småföretag i Göteborg',
      body: [
        'Coffee Code Studio drivs av Rami, frilansande webbutvecklare i Göteborg. Jag bygger snabba, mobilanpassade hemsidor för småföretag till fast pris 4 900 kr.',
        'Din hemsida live inom en vecka. Inga månadsavgifter — du betalar bara domän och hosting, cirka 200 till 500 kr per år.',
        'Ingår alltid: responsiv design, kontaktformulär, grundläggande SEO, SSL, cookie-banner enligt GDPR och en genomgång så du kan uppdatera texter själv.',
      ],
    },
    en: {
      title: 'Websites for small businesses in Gothenburg | Coffee Code Studio',
      description:
        'Professional website from SEK 4,900 — often live within a week. Fast, mobile-friendly websites for small businesses in Gothenburg. Book a free consultation.',
      h1: 'Websites for small businesses in Gothenburg',
      body: [
        'Coffee Code Studio is run by Rami, a freelance web developer in Gothenburg. I build fast, mobile-friendly websites for small businesses at a fixed price of SEK 4,900.',
        'Your website live within a week. No monthly fees — you only pay for your domain and hosting, roughly SEK 200 to 500 per year.',
        'Always included: responsive design, contact form, basic SEO, SSL, a GDPR cookie banner and a walkthrough so you can update your own texts.',
      ],
    },
  },
  {
    path: '/webbyra-goteborg',
    sv: {
      title: 'Webbyrå i Göteborg – hemsida från 4 900 kr | Coffee Code Studio',
      description:
        'Webbyrå i Göteborg för småföretag. Fast pris 4 900 kr, hemsidan live inom 7 dagar. Design, kod, SEO och Google-uppsättning av en och samma person.',
      h1: 'Webbyrå i Göteborg',
      body: [
        'Coffee Code Studio är en liten webbyrå i Göteborg som bygger hemsidor åt småföretag. Fast pris 4 900 kr och hemsidan är live inom 7 dagar.',
        'Du pratar direkt med den som bygger — ingen projektledare, ingen ärendekö. Design, kod, lokal SEO och Google-uppsättning ingår.',
        'Flersidig hemsida 9 900 kr. Skräddarsytt med bokning, inloggning eller e-handel från 14 900 kr.',
      ],
    },
    en: {
      title: 'Web agency in Gothenburg – website from SEK 4,900 | Coffee Code Studio',
      description:
        'Web agency in Gothenburg for small businesses. Fixed price SEK 4,900, website live within 7 days. Design, code, SEO and Google setup from one person.',
      h1: 'Web agency in Gothenburg',
      body: [
        'Coffee Code Studio is a small web agency in Gothenburg building websites for small businesses. Fixed price SEK 4,900 and the site is live within 7 days.',
        'You talk directly to the person who builds it — no account managers, no ticket queue. Design, code, local SEO and Google setup are included.',
        'Multi-page website SEK 9,900. Custom work with booking, logins or e-commerce from SEK 14,900.',
      ],
    },
  },
  {
    path: '/hemsida-frisor-goteborg',
    sv: {
      title: 'Hemsida för frisör i Göteborg – 4 900 kr | Coffee Code Studio',
      description:
        'Hemsida för frisörsalong i Göteborg. Fast pris 4 900 kr, live inom 7 dagar. Prislista, bokningslänk, bildgalleri och lokal SEO så fler kunder hittar dig.',
      h1: 'Hemsida för frisör i Göteborg',
      body: [
        'En hemsida för din frisörsalong i Göteborg kostar 4 900 kr och är live inom 7 dagar. Prislista, bokningslänk, bildgalleri och öppettider ingår.',
        'Optimerad för sökningar som "frisör Göteborg" och "frisör nära mig", med Google-uppsättning så salongen syns på kartan.',
        'Inga månadsavgifter. Du får en genomgång och kan uppdatera priser och bilder själv.',
      ],
    },
    en: {
      title: 'Website for hair salons in Gothenburg – SEK 4,900 | Coffee Code Studio',
      description:
        'Website for a hair salon in Gothenburg. Fixed price SEK 4,900, live within 7 days. Price list, booking link, gallery and local SEO so more customers find you.',
      h1: 'Website for hair salons in Gothenburg',
      body: [
        'A website for your hair salon in Gothenburg costs SEK 4,900 and is live within 7 days. Price list, booking link, gallery and opening hours are included.',
        'Optimised for searches like "hair salon Gothenburg" and "hairdresser near me", with Google setup so the salon shows up on the map.',
        'No monthly fees. You get a walkthrough and can update prices and photos yourself.',
      ],
    },
  },
  {
    path: '/hemsida-hantverkare-goteborg',
    sv: {
      title: 'Hemsida för hantverkare i Göteborg – 4 900 kr | Coffee Code Studio',
      description:
        'Hemsida för hantverkare, elektriker, rörmokare, snickare och målare i Göteborg. Fast pris 4 900 kr, live inom 7 dagar. Tjänster, offertformulär och lokal SEO.',
      h1: 'Hemsida för hantverkare i Göteborg',
      body: [
        'En hemsida för hantverkare i Göteborg kostar 4 900 kr och är live inom 7 dagar. Den visar dina tjänster, områden du jobbar i och ett offertformulär.',
        'Kunder beskriver jobbet och skickar en förfrågan direkt till din mejl. Optimerad för sökningar som "snickare Göteborg" och "elektriker Mölndal".',
        'Flersidigt 9 900 kr, offertkalkylator eller onlinebokning från 14 900 kr.',
      ],
    },
    en: {
      title: 'Website for tradespeople in Gothenburg – SEK 4,900 | Coffee Code Studio',
      description:
        'Website for tradespeople, electricians, plumbers, carpenters and painters in Gothenburg. Fixed price SEK 4,900, live within 7 days. Services, quote form and local SEO.',
      h1: 'Website for tradespeople in Gothenburg',
      body: [
        'A website for a tradesperson in Gothenburg costs SEK 4,900 and is live within 7 days. It shows your services, your service areas and a quote request form.',
        'Customers describe the job and send a request straight to your inbox. Optimised for searches like "carpenter Gothenburg" and "electrician Mölndal".',
        'Multi-page SEK 9,900, quote calculator or online booking from SEK 14,900.',
      ],
    },
  },
  {
    path: '/vad-kostar-en-hemsida',
    sv: {
      title: 'Vad kostar en hemsida 2026? Priser i Sverige | Coffee Code Studio',
      description:
        'En hemsida kostar mellan 4 900 kr och 25 000 kr i Sverige. Här är hela prisbilden: vad du betalar för, vad som ingår och vilka löpande kostnader som finns.',
      h1: 'Vad kostar en hemsida 2026?',
      body: [
        'En hemsida kostar mellan 4 900 kr och 25 000 kr i Sverige beroende på omfattning. Hos Coffee Code Studio får du en komplett hemsida från 4 900 kr, live inom 7 dagar.',
        'Enkel hemsida 4 900 kr. Flersidig hemsida 9 900 kr. Skräddarsytt med bokning, inloggning eller e-handel från 14 900 kr.',
        'Löpande kostnader: domän cirka 150–300 kr per år och hosting 0–500 kr per år. Inga månadsavgifter från mig.',
      ],
    },
    en: {
      title: 'What does a website cost in 2026? Prices in Sweden | Coffee Code Studio',
      description:
        'A website costs between SEK 4,900 and SEK 25,000 in Sweden. Here is the full picture: what you pay for, what is included and which running costs apply.',
      h1: 'What does a website cost in 2026?',
      body: [
        'A website costs between SEK 4,900 and SEK 25,000 in Sweden depending on scope. At Coffee Code Studio you get a complete website from SEK 4,900, live within 7 days.',
        'Simple one-page site SEK 4,900. Multi-page site SEK 9,900. Custom work with booking, logins or e-commerce from SEK 14,900.',
        'Running costs: a domain around SEK 150–300 per year and hosting SEK 0–500 per year. No monthly fees from me.',
      ],
    },
  },
  {
    path: '/om-mig',
    sv: {
      title: 'Om Coffee Code Studio – Rami, webbutvecklare i Göteborg',
      description:
        'Coffee Code Studio drivs av Rami, frilansande webbutvecklare i Göteborg. Hemsidor för småföretag från 4 900 kr inom en vecka.',
      h1: 'Om Coffee Code Studio',
      body: [
        'Jag heter Rami och är webbutvecklare baserad i Göteborg. Coffee Code Studio är en enmansverksamhet — jag sköter samtalet, designen, koden, lanseringen och uppföljningen själv.',
        'Fast pris 4 900 kr eftersom du ska veta hela kostnaden innan vi börjar. Leverans inom 7 dagar eftersom en hemsida för ett småföretag inte behöver ett tremånadersprojekt.',
        'Direkt kontakt: du pratar med den som bygger din hemsida, inte med en projektledare.',
      ],
    },
    en: {
      title: 'About Coffee Code Studio – Rami, web developer in Gothenburg',
      description:
        'Coffee Code Studio is run by Rami, a freelance web developer in Gothenburg. Websites for small businesses from SEK 4,900, live within a week.',
      h1: 'About Coffee Code Studio',
      body: [
        'My name is Rami and I am a web developer based in Gothenburg. Coffee Code Studio is a one-person operation — I handle the conversation, the design, the code, the launch and the follow-up myself.',
        'A fixed price of SEK 4,900 so you know the full cost before we start. Delivery within 7 days because a small business website does not need a three-month project.',
        'Direct contact: you talk to the person who builds your website, not to an account manager.',
      ],
    },
  },
  {
    path: '/smaforetag-goteborg',
    sv: {
      title: 'Hemsida för småföretag i Göteborg – 4 900 kr | Coffee Code Studio',
      description:
        'Hemsida för småföretag i Göteborg till fast pris 4 900 kr, live inom en vecka. Mobilanpassad, snabb, med kontaktformulär och lokal SEO.',
      h1: 'Hemsida för småföretag i Göteborg',
      body: [
        'Driver du ett småföretag i Göteborg får du en komplett hemsida för 4 900 kr, live inom en vecka. Mobilanpassad, snabb och byggd för att ge dig fler kunder.',
        'Kontaktformulär, tjänstepresentation, bilder, Google-uppsättning och lokal SEO ingår.',
        'Inga månadsavgifter och en genomgång så du kan uppdatera innehållet själv.',
      ],
    },
    en: {
      title: 'Website for small businesses in Gothenburg – SEK 4,900 | Coffee Code Studio',
      description:
        'Website for small businesses in Gothenburg at a fixed price of SEK 4,900, live within a week. Mobile-friendly, fast, with a contact form and local SEO.',
      h1: 'Website for small businesses in Gothenburg',
      body: [
        'If you run a small business in Gothenburg you get a complete website for SEK 4,900, live within a week. Mobile-friendly, fast and built to bring you more customers.',
        'Contact form, service presentation, photos, Google setup and local SEO are included.',
        'No monthly fees, plus a walkthrough so you can update the content yourself.',
      ],
    },
  },
  {
    path: '/frisor-goteborg',
    sv: {
      title: 'Frisör i Göteborg – hemsida från 4 900 kr | Coffee Code Studio',
      description:
        'Hemsida för frisörer i Göteborg. Fast pris 4 900 kr, live inom en vecka. Prislista, bokning, galleri och lokal SEO för fler kunder i salongen.',
      h1: 'Hemsida för frisörer i Göteborg',
      body: [
        'Jag bygger hemsidor för frisörer och salonger i Göteborg. Fast pris 4 900 kr och sidan är live inom en vecka.',
        'Prislista, bokningslänk, bildgalleri, öppettider och karta ingår, tillsammans med lokal SEO.',
        'Inga månadsavgifter — bara domän och hosting, cirka 200 till 500 kr per år.',
      ],
    },
    en: {
      title: 'Hairdresser in Gothenburg – website from SEK 4,900 | Coffee Code Studio',
      description:
        'Websites for hairdressers in Gothenburg. Fixed price SEK 4,900, live within a week. Price list, booking, gallery and local SEO for more salon customers.',
      h1: 'Websites for hairdressers in Gothenburg',
      body: [
        'I build websites for hairdressers and salons in Gothenburg. Fixed price SEK 4,900 and the site is live within a week.',
        'Price list, booking link, gallery, opening hours and a map are included, together with local SEO.',
        'No monthly fees — only your domain and hosting, roughly SEK 200 to 500 per year.',
      ],
    },
  },
  {
    path: '/integritetspolicy',
    sv: {
      title: 'Integritetspolicy | Coffee Code Studio',
      description:
        'Integritetspolicy för Coffee Code Studio: vilka personuppgifter som behandlas, varför, hur länge de sparas och vilka rättigheter du har enligt GDPR.',
      h1: 'Integritetspolicy',
      body: [
        'Här beskrivs vilka personuppgifter Coffee Code Studio behandlar, varför de behandlas, hur länge de sparas och vilka rättigheter du har enligt GDPR.',
        'Uppgifter från kontaktformuläret används enbart för att svara på din förfrågan.',
      ],
    },
    en: {
      title: 'Privacy policy | Coffee Code Studio',
      description:
        'Privacy policy for Coffee Code Studio: which personal data is processed, why, how long it is stored and what rights you have under GDPR.',
      h1: 'Privacy policy',
      body: [
        'This page describes which personal data Coffee Code Studio processes, why, how long it is stored and what rights you have under GDPR.',
        'Information from the contact form is used only to answer your enquiry.',
      ],
    },
  },
  {
    path: '/cookiepolicy',
    sv: {
      title: 'Cookiepolicy | Coffee Code Studio',
      description:
        'Cookiepolicy för Coffee Code Studio: vilka cookies som används, vad de gör och hur du ändrar ditt samtycke.',
      h1: 'Cookiepolicy',
      body: [
        'Coffee Code Studio använder nödvändiga cookies samt analyscookies (Google Analytics) först efter ditt samtycke.',
        'Du kan ändra eller återkalla ditt samtycke när som helst via cookie-bannern.',
      ],
    },
    en: {
      title: 'Cookie policy | Coffee Code Studio',
      description:
        'Cookie policy for Coffee Code Studio: which cookies are used, what they do and how to change your consent.',
      h1: 'Cookie policy',
      body: [
        'Coffee Code Studio uses necessary cookies plus analytics cookies (Google Analytics) only after your consent.',
        'You can change or withdraw your consent at any time through the cookie banner.',
      ],
    },
  },
  {
    path: '/anvandardvillkor',
    sv: {
      title: 'Användarvillkor | Coffee Code Studio',
      description:
        'Användarvillkor för Coffee Code Studio: villkor för uppdrag, betalning via faktura, leverans, ändringar och ansvarsbegränsning.',
      h1: 'Användarvillkor',
      body: [
        'Villkoren beskriver hur uppdrag beställs och levereras, betalning via faktura, ändringsrundor och ansvarsbegränsning.',
        'Har du frågor om villkoren går det bra att kontakta mig direkt.',
      ],
    },
    en: {
      title: 'Terms of service | Coffee Code Studio',
      description:
        'Terms of service for Coffee Code Studio: terms for assignments, payment by invoice, delivery, revisions and limitation of liability.',
      h1: 'Terms of service',
      body: [
        'These terms describe how assignments are ordered and delivered, payment by invoice, revision rounds and limitation of liability.',
        'If you have questions about the terms, contact me directly.',
      ],
    },
  },
];

const esc = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/** Flatten routes into sv + en page descriptors. */
function allPages() {
  const pages = [];
  for (const route of ROUTES) {
    pages.push({
      lang: 'sv',
      urlPath: route.path,
      outPath: route.path,
      nav: NAV_SV,
      cta: { href: '/#kontakt', label: 'Boka gratis konsultation' },
      ...route.sv,
    });
    const enPath = route.path === '/' ? '/en' : `/en${route.path}`;
    pages.push({
      lang: 'en',
      urlPath: enPath,
      outPath: enPath,
      nav: NAV_EN,
      cta: { href: '/en#kontakt', label: 'Book a free consultation' },
      ...route.en,
    });
  }
  if (pages.length > MAX_PRERENDER_PAGES) {
    throw new Error(
      `Prerender would emit ${pages.length} pages, above MAX_PRERENDER_PAGES=${MAX_PRERENDER_PAGES}`,
    );
  }
  return pages;
}

function renderRootHtml(page) {
  const nav = page.nav
    .map((n) => `<a href="${n.href}">${esc(n.label)}</a>`)
    .join(' <span aria-hidden="true">·</span> ');
  const paragraphs = page.body.map((p) => `<p>${esc(p)}</p>`).join('');
  return (
    `<div id="root">` +
    `<div data-prerendered="true">` +
    `<header><a href="${page.lang === 'en' ? '/en' : '/'}">Coffee Code Studio</a></header>` +
    `<main><h1>${esc(page.h1)}</h1>${paragraphs}` +
    `<p><a href="${page.cta.href}">${esc(page.cta.label)}</a></p></main>` +
    `<nav>${nav}</nav>` +
    `<footer><p>Coffee Code Studio${page.lang === 'en' ? ' — Gothenburg, Sweden' : ' — Göteborg, Sverige'}</p></footer>` +
    `</div></div>`
  );
}

function renderPage(baseHtml, page) {
  const url = SITE + (page.urlPath === '/' ? '/' : page.urlPath);
  let out = baseHtml
    .replace(/<html([^>]*)lang="[^"]*"/, `<html$1lang="${page.lang}"`)
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(page.title)}</title>`)
    .replace(
      /<meta\s+name="description"[\s\S]*?\/?>/,
      `<meta name="description" content="${esc(page.description)}" />`,
    )
    .replace(
      /<link\s+rel="canonical"[^>]*>/,
      `<link rel="canonical" href="${url}" />`,
    )
    .replace(
      /<meta\s+property="og:title"[\s\S]*?\/?>/,
      `<meta property="og:title" content="${esc(page.title)}" />`,
    )
    .replace(
      /<meta\s+property="og:description"[\s\S]*?\/>/,
      `<meta property="og:description" content="${esc(page.description)}" />`,
    )
    .replace(
      /<meta\s+property="og:url"[^>]*>/,
      `<meta property="og:url" content="${url}" />`,
    );

  // Replace the empty shell (or any "Laddar..." placeholder) with real content.
  const rootRe = /<div id="root">[\s\S]*?<\/div>/;
  if (rootRe.test(out)) {
    out = out.replace(rootRe, renderRootHtml(page));
  } else {
    out = out.replace('<body>', `<body>${renderRootHtml(page)}`);
  }
  return out;
}

async function main() {
  const baseHtml = await readFile(join(DIST, 'index.html'), 'utf8');
  const pages = allPages();
  for (const page of pages) {
    const file =
      page.outPath === '/'
        ? join(DIST, 'index.html')
        : join(DIST, page.outPath.replace(/^\//, ''), 'index.html');
    await mkdir(dirname(file), { recursive: true });
    await writeFile(file, renderPage(baseHtml, page), 'utf8');
    console.log(`prerendered ${page.urlPath} -> ${file}`);
  }
  console.log(`Prerendered ${pages.length} pages.`);
}

main().catch((err) => {
  console.error('Prerender failed:', err);
  process.exit(1);
});
