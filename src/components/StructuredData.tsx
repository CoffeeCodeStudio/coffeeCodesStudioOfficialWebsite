import { useEffect } from 'react';

const structuredData = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  "mainEntity": {
    "@type": "Person",
    "name": "Rami",
    "alternateName": "CoffeeCodeStudio",
    "jobTitle": "Product Engineer",
    "url": "https://coffeecodestudio.se",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Gothenburg",
      "addressRegion": "Västra Götaland",
      "addressCountry": "SE"
    },
    "sameAs": [],
    "knowsAbout": [
      "React",
      "TypeScript",
      "Vite",
      "Tailwind CSS",
      "Supabase",
      "PostgreSQL",
      "Software Engineering"
    ]
  }
};

export function StructuredData() {
  useEffect(() => {
    const SCRIPT_ID = 'ld-json-site-graph';
    document.getElementById(SCRIPT_ID)?.remove();

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
