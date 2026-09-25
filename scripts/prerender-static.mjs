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
  { href: '/integritetspolicy', label: 'Integritetspolicy' },
  { href: '/cookiepolicy', label: 'Cookiepolicy' },
];

const NAV_EN = [
  { href: '/en', label: 'Home' },
  { href: '/en/integritetspolicy', label: 'Privacy policy' },
  { href: '/en/cookiepolicy', label: 'Cookie policy' },
];

/** Public, indexable routes. Each entry carries both sv and en content. */
const ROUTES = [
  {
    path: '/',
    sv: {
      title: 'Rami — Product Engineer | Portfolio',
      description:
        'Portfolio för Rami, product engineer i Göteborg. Case studies: Echo2000, Klar och DJ Lobo Producciones — byggda med React, TypeScript och Supabase.',
      h1: 'Rami — Product Engineer',
      body: [
        'Jag bygger fullstack-webbprodukter med React, TypeScript, Vite, Tailwind CSS och Supabase.',
        'Utvalda projekt: Echo2000, Klar och DJ Lobo Producciones.',
      ],
    },
    en: {
      title: 'Rami — Product Engineer | Portfolio',
      description:
        'Portfolio of Rami, product engineer in Gothenburg. Case studies: Echo2000, Klar and DJ Lobo Producciones — built with React, TypeScript and Supabase.',
      h1: 'Rami — Product Engineer',
      body: [
        'I build full-stack web products with React, TypeScript, Vite, Tailwind CSS and Supabase.',
        'Selected work: Echo2000, Klar and DJ Lobo Producciones.',
      ],
    },
  },
  {
    path: '/integritetspolicy',
    sv: {
      title: 'Integritetspolicy | Rami Portfolio',
      description:
        'Integritetspolicy för coffeecodestudio.se: vilka personuppgifter som behandlas, varför, hur länge de sparas och vilka rättigheter du har enligt GDPR.',
      h1: 'Integritetspolicy',
      body: [
        'Här beskrivs vilka personuppgifter behandlas, varför de behandlas, hur länge de sparas och vilka rättigheter du har enligt GDPR.',
        'Uppgifter från kontaktformuläret används enbart för att svara på din förfrågan.',
      ],
    },
    en: {
      title: 'Privacy policy | Rami Portfolio',
      description:
        'Privacy policy for coffeecodestudio.se: which personal data is processed, why, how long it is stored and what rights you have under GDPR.',
      h1: 'Privacy policy',
      body: [
        'This page describes which personal data is processed, why, how long it is stored and what rights you have under GDPR.',
        'Information from the contact form is used only to answer your enquiry.',
      ],
    },
  },
  {
    path: '/cookiepolicy',
    sv: {
      title: 'Cookiepolicy | Rami Portfolio',
      description:
        'Cookiepolicy för coffeecodestudio.se: vilka cookies som används, vad de gör och hur du ändrar ditt samtycke.',
      h1: 'Cookiepolicy',
      body: [
        'Coffee Code Studio använder nödvändiga cookies samt analyscookies (Google Analytics) först efter ditt samtycke.',
        'Du kan ändra eller återkalla ditt samtycke när som helst via cookie-bannern.',
      ],
    },
    en: {
      title: 'Cookie policy | Rami Portfolio',
      description:
        'Cookie policy for coffeecodestudio.se: which cookies are used, what they do and how to change your consent.',
      h1: 'Cookie policy',
      body: [
        'Coffee Code Studio uses necessary cookies plus analytics cookies (Google Analytics) only after your consent.',
        'You can change or withdraw your consent at any time through the cookie banner.',
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
      cta: { href: '/#kontakt', label: 'Kontakta mig' },
      ...route.sv,
    });
    const enPath = route.path === '/' ? '/en' : `/en${route.path}`;
    pages.push({
      lang: 'en',
      urlPath: enPath,
      outPath: enPath,
      nav: NAV_EN,
      cta: { href: '/en#kontakt', label: 'Get in touch' },
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

function renderRootHtml(page, rootAttrs = ' id="root"') {
  const nav = page.nav
    .map((n) => `<a href="${n.href}">${esc(n.label)}</a>`)
    .join(' <span aria-hidden="true">·</span> ');
  const paragraphs = page.body.map((p) => `<p>${esc(p)}</p>`).join('');
  return (
    `<div${rootAttrs}>` +
    // Same colour as the page background: readable for crawlers and screen
    // readers, but no white flash of text before React hydrates.
    `<div data-prerendered="true" style="color:#0B0D1E">` +
    `<header><a href="${page.lang === 'en' ? '/en' : '/'}">Rami — Product Engineer</a></header>` +
    `<main><h1>${esc(page.h1)}</h1>${paragraphs}` +
    `<p><a href="${page.cta.href}">${esc(page.cta.label)}</a></p></main>` +
    `<nav>${nav}</nav>` +
    `<footer><p>Rami${page.lang === 'en' ? ' — Gothenburg, Sweden' : ' — Göteborg, Sverige'}</p></footer>` +
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
  // Replace the empty shell (or any placeholder) with real content, keeping
  // whatever attributes the built #root element carries (inline styles etc).
  const rootRe = /<div([^>]*\bid="root"[^>]*)>[\s\S]*?<\/div>/;
  const match = out.match(rootRe);
  if (match) {
    out = out.replace(rootRe, renderRootHtml(page, match[1]));
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
