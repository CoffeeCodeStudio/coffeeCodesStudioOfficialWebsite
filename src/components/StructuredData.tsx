import { useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

const SITE_URL = 'https://coffeecodestudio.se';
const LOGO_URL = `${SITE_URL}/logo.png`;

const DESCRIPTION = {
  sv: 'Professionell hemsida från 4 900 kr — ofta live inom en vecka. Jag bygger snabba, mobilanpassade hemsidor för småföretag i Göteborg.',
  en: 'Professional website from 4,900 SEK — often live within a week. Fast, mobile-friendly websites for small businesses in Gothenburg.',
} as const;

const OFFER_CATALOG_NAME = {
  sv: 'Hemsidor för småföretag',
  en: 'Websites for small businesses',
} as const;

const OFFERS = {
  sv: [
    { name: 'Hemsida för småföretag i Göteborg', path: '/smaforetag-goteborg' },
    { name: 'Hemsida för frisörer i Göteborg', path: '/frisor-goteborg' },
  ],
  en: [
    { name: 'Website for small businesses in Gothenburg', path: '/en/smaforetag-goteborg' },
    { name: 'Website for hair salons in Gothenburg', path: '/en/frisor-goteborg' },
  ],
} as const;

const AREA_SERVED = {
  sv: [
    { '@type': 'City', name: 'Göteborg' },
    { '@type': 'Country', name: 'Sverige' },
  ],
  en: [
    { '@type': 'City', name: 'Gothenburg' },
    { '@type': 'Country', name: 'Sweden' },
  ],
} as const;

function buildGraph(lang: 'sv' | 'en') {
  const inLanguage = lang === 'en' ? 'en' : 'sv-SE';
  const homeUrl = lang === 'en' ? `${SITE_URL}/en` : `${SITE_URL}/`;

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        name: 'Coffee Code Studio',
        url: SITE_URL,
        logo: {
          '@type': 'ImageObject',
          url: LOGO_URL,
          width: 512,
          height: 512,
        },
        description: DESCRIPTION[lang],
        sameAs: [],
        contactPoint: [
          {
            '@type': 'ContactPoint',
            telephone: '+46 73 876 42 99',
            contactType: lang === 'en' ? 'customer service' : 'kundtjänst',
            areaServed: 'SE',
            availableLanguage: ['Swedish', 'English'],
          },
        ],
      },
      {
        '@type': 'LocalBusiness',
        '@id': `${SITE_URL}/#localbusiness`,
        name: 'Coffee Code Studio',
        description: DESCRIPTION[lang],
        url: homeUrl,
        image: LOGO_URL,
        logo: LOGO_URL,
        telephone: '+46 73 876 42 99',
        priceRange: '4900–9900 SEK',
        currenciesAccepted: 'SEK',
        paymentAccepted: 'Invoice, Swish, Bank Transfer',
        address: {
          '@type': 'PostalAddress',
          addressLocality: lang === 'en' ? 'Gothenburg' : 'Göteborg',
          addressRegion: lang === 'en' ? 'Västra Götaland County' : 'Västra Götaland',
          addressCountry: 'SE',
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: 57.7089,
          longitude: 11.9746,
        },
        areaServed: AREA_SERVED[lang],
        openingHoursSpecification: [
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            opens: '09:00',
            closes: '18:00',
          },
        ],
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: OFFER_CATALOG_NAME[lang],
          inLanguage,
          itemListElement: OFFERS[lang].map((o) => ({
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: o.name,
              url: `${SITE_URL}${o.path}`,
              inLanguage,
            },
            priceCurrency: 'SEK',
            price: '4900',
          })),
        },
        parentOrganization: { '@id': `${SITE_URL}/#organization` },
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: homeUrl,
        name: 'Coffee Code Studio',
        description: DESCRIPTION[lang],
        inLanguage,
        publisher: { '@id': `${SITE_URL}/#organization` },
      },
    ],
  };
}

export function StructuredData() {
  const { language } = useLanguage();

  useEffect(() => {
    const SCRIPT_ID = 'ld-json-site-graph';
    document.getElementById(SCRIPT_ID)?.remove();

    const script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(buildGraph(language));
    document.head.appendChild(script);

    return () => {
      script.remove();
    };
  }, [language]);

  return null;
}
