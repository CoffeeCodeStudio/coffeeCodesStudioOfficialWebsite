import { useEffect } from 'react';

const SITE_URL = 'https://coffeecodestudio.se';
const LOGO_URL = `${SITE_URL}/logo.png`;
const DESCRIPTION_SV =
  'Professionell hemsida från 4 900 kr — ofta live inom en vecka. Jag bygger snabba, mobilanpassade hemsidor för småföretag i Göteborg.';

// Single JSON-LD graph covering Organization, LocalBusiness and WebSite so
// Google can pick the right entity per surface (knowledge panel, sitelinks
// search box, local pack).
const structuredData = {
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
      sameAs: [],
      contactPoint: [
        {
          '@type': 'ContactPoint',
          telephone: '+46 73 876 42 99',
          contactType: 'customer service',
          areaServed: 'SE',
          availableLanguage: ['Swedish', 'English'],
        },
      ],
    },
    {
      '@type': 'LocalBusiness',
      '@id': `${SITE_URL}/#localbusiness`,
      name: 'Coffee Code Studio',
      description: DESCRIPTION_SV,
      url: SITE_URL,
      image: LOGO_URL,
      logo: LOGO_URL,
      telephone: '+46 73 876 42 99',
      priceRange: '4900–9900 SEK',
      currenciesAccepted: 'SEK',
      paymentAccepted: 'Invoice, Swish, Bank Transfer',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Göteborg',
        addressRegion: 'Västra Götaland',
        addressCountry: 'SE',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 57.7089,
        longitude: 11.9746,
      },
      areaServed: [
        { '@type': 'City', name: 'Göteborg' },
        { '@type': 'Country', name: 'Sverige' },
      ],
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
        name: 'Hemsidor för småföretag',
        itemListElement: [
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Hemsida för småföretag i Göteborg',
              url: `${SITE_URL}/smaforetag-goteborg`,
            },
            priceCurrency: 'SEK',
            price: '4900',
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Hemsida för frisörer i Göteborg',
              url: `${SITE_URL}/frisor-goteborg`,
            },
            priceCurrency: 'SEK',
            price: '4900',
          },
        ],
      },
      parentOrganization: { '@id': `${SITE_URL}/#organization` },
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: 'Coffee Code Studio',
      description: DESCRIPTION_SV,
      inLanguage: ['sv-SE', 'en'],
      publisher: { '@id': `${SITE_URL}/#organization` },
    },
  ],
};

export function StructuredData() {
  useEffect(() => {
    const SCRIPT_ID = 'ld-json-site-graph';
    if (document.getElementById(SCRIPT_ID)) return;

    const script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);

    return () => {
      script.remove();
    };
  }, []);

  return null;
}
