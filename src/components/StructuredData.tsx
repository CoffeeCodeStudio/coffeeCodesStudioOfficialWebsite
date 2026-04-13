import { useEffect, useRef } from 'react';

const structuredData = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": "Coffee Code Studio",
  "description": "Professionell hemsida på 7 dagar från 4 900 kr. Jag bygger snabba, mobilanpassade hemsidor för småföretag i Göteborg. Boka gratis konsultation.",
  "url": "https://coffeecodestudio.se",
  "logo": "https://coffeecodestudio.se/logo.png",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Göteborg",
    "addressCountry": "SE"
  },
  "priceRange": "4900-9900 SEK",
  "telephone": "+46 XX XXX XX XX",
  "sameAs": []
};

export function StructuredData() {
  const scriptRef = useRef<HTMLScriptElement | null>(null);

  useEffect(() => {
    if (scriptRef.current) return;

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);
    scriptRef.current = script;

    return () => {
      script.remove();
      scriptRef.current = null;
    };
  }, []);

  return null;
}
