import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'sv' | 'en';

interface Translations {
  nav: {
    services: string;
    projects: string;
    process: string;
    about: string;
    contact: string;
  };
  hero: {
    headline: string;
    subheadline: string;
    cta: string;
    promo: string;
    planning: string;
    solution: string;
  };
  problem: {
    headline: string;
    body: string;
  };
  process: {
    headline: string;
    intro: string;
    step1: {
      title: string;
      subtitle: string;
      text: string;
    };
    step2: {
      title: string;
      subtitle: string;
      text: string;
    };
    step3: {
      title: string;
      subtitle: string;
      text: string;
    };
  };
  portfolio: {
    headline: string;
    intro: string;
    viewDemo: string;
    explorePrototype: string;
    seeDesign: string;
    project1: {
      name: string;
      category: string;
      description: string;
    };
    project2: {
      name: string;
      category: string;
      description: string;
    };
    project3: {
      name: string;
      category: string;
      description: string;
    };
  };
  about: {
    headline: string;
    body: string;
  };
  footer: {
    cta: string;
    phone: string;
  };
}

const translations: Record<Language, Translations> = {
  sv: {
    nav: {
      services: 'Tjänster',
      projects: 'Projekt',
      process: 'Process',
      about: 'Om oss',
      contact: 'Kontakt',
    },
    hero: {
      headline: 'Din vision, kodad till perfektion.',
      subheadline: 'Från kundportaler till interna verktyg. Vi skapar skräddarsydda webbapplikationer som effektiviserar och lyfter din digitala närvaro.',
      cta: 'Boka en Digital Kaffe',
      promo: 'Founding Partner Program: Just nu 20% rabatt för våra tre första kunder. Säkra din plats i kön!',
      planning: 'Planering',
      solution: 'Lösning',
    },
    problem: {
      headline: 'Trött på generisk mjukvara? Släpp loss din potential.',
      body: 'Standardlösningar räcker ofta inte till. På Coffee Code Studio anser vi att ditt företag förtjänar en digital plattform som är lika unik och dynamisk som din vision. Vi bygger skräddarsydda webbapplikationer utformade för att lösa dina specifika utmaningar, skala med din tillväxt och integreras sömlöst i dina arbetsflöden.',
    },
    process: {
      headline: 'Från Idé till Lansering: Vår Fokuserade Utvecklingsprocess.',
      intro: 'Vår unika \'Deep Brew\'-metod garanterar klarhet, effektivitet och exceptionella resultat, och förvandlar dina idéer till fullt fungerande webbapplikationer.',
      step1: {
        title: 'Strategisessionen',
        subtitle: 'The Roast',
        text: 'Vi börjar med ett grundligt samtal för att förstå din vision, dina utmaningar och mål. Detta är där vi definierar ritningen för framgång.',
      },
      step2: {
        title: 'Deep Flow',
        subtitle: 'The Brew',
        text: 'Från detaljerad wireframing till pixelperfekt kodning, vi fördjupar oss i att bygga din anpassade webbapplikation med precision och passion.',
      },
      step3: {
        title: 'Lansering & Förfining',
        subtitle: 'The Perfect Pour',
        text: 'Din applikation går live! Vi säkerställer en smidig driftsättning och erbjuder löpande support samt iterativa förfiningar för att garantera långsiktig framgång.',
      },
    },
    portfolio: {
      headline: 'Projekt vi har bryggt: Verkliga lösningar, verklig inverkan.',
      intro: 'Utforska ett urval av våra senaste webbapplikationsprojekt, som visar vår mångsidighet och vårt engagemang för att leverera påtagliga resultat.',
      viewDemo: 'Visa Live Demo',
      explorePrototype: 'Utforska Prototypen',
      seeDesign: 'Se Designkoncept',
      project1: {
        name: 'SnapRecipe',
        category: 'AI-driven Måltidsplanering',
        description: 'Utvecklade en komplett webbapplikation för att effektivisera kundinteraktioner, projekthantering och automatiserad rapportering, vilket avsevärt förbättrade drifts effektiviteten.',
      },
      project2: {
        name: 'FlowState FM',
        category: 'Fokusmusik Dashboard',
        description: 'Arkitekterade och byggde en skalbar prototyp för en nästa generations SaaS-plattform, med fokus på intuitiv UX och högpresterande datavisualisering.',
      },
      project3: {
        name: 'SnapCode CMS',
        category: 'Innehållshanteringssystem',
        description: 'Designade och utvecklade en intern webbapplikation för att optimera innehållshantering, vilket minskade manuellt arbete och förbättrade datanoggrannheten.',
      },
    },
    about: {
      headline: 'Djupt fokus, levererat.',
      body: 'Grundat på filosofin att djupt, oavbrutet arbete ger överlägsna resultat. På Coffee Code Studio samarbetar du direkt med hantverkaren. Min \'morgonrock och kod\'-filosofi handlar inte om att vara avslappnad; det handlar om att skapa den optimala miljön för intensivt fokus, vilket säkerställer att ditt projekt får dedikerad uppmärksamhet och oöverträffad kvalitet.',
    },
    footer: {
      cta: 'Redo att brygga din nästa stora idé?',
      phone: 'Inget satt',
    },
  },
  en: {
    nav: {
      services: 'Services',
      projects: 'Projects',
      process: 'Process',
      about: 'About Us',
      contact: 'Contact',
    },
    hero: {
      headline: 'Your Vision, Brewed to Perfection.',
      subheadline: 'From client portals to internal tools. We craft bespoke web applications that streamline operations and elevate your digital presence.',
      cta: 'Book a Digital Coffee',
      promo: 'Founding Partner Program: Get 20% off for our first three clients. Secure your spot!',
      planning: 'Planning',
      solution: 'Solution',
    },
    problem: {
      headline: 'Tired of generic software? Unleash your potential.',
      body: 'Off-the-shelf solutions often fall short. At Coffee Code Studio, we believe your business deserves a digital platform as unique and dynamic as your vision. We build custom web applications designed to solve your specific challenges, scale with your growth, and integrate seamlessly into your workflow.',
    },
    process: {
      headline: 'From Concept to Click: Our Focused Development Process.',
      intro: 'Our unique \'Deep Brew\' methodology ensures clarity, efficiency, and exceptional results, turning your ideas into fully functional web applications.',
      step1: {
        title: 'The Strategy Session',
        subtitle: 'The Roast',
        text: 'We start with a thorough conversation to understand your vision, challenges, and goals. This is where we define the blueprint for success.',
      },
      step2: {
        title: 'The Deep Flow',
        subtitle: 'The Brew',
        text: 'From detailed wireframing to pixel-perfect coding, we immerse ourselves in building your custom web application with precision and passion.',
      },
      step3: {
        title: 'Launch & Refine',
        subtitle: 'The Perfect Pour',
        text: 'Your application goes live! We ensure a smooth deployment and provide ongoing support and iterative refinements to guarantee long-term success.',
      },
    },
    portfolio: {
      headline: 'Projects We\'ve Brewed: Real Solutions, Real Impact.',
      intro: 'Explore a selection of our recent web application projects, showcasing our versatility and commitment to delivering tangible results.',
      viewDemo: 'View Live Demo',
      explorePrototype: 'Explore the Prototype',
      seeDesign: 'See Design Concepts',
      project1: {
        name: 'SnapRecipe',
        category: 'AI Powered Meal Planning',
        description: 'Developed a fully-featured web application to streamline client interactions, project tracking, and automated reporting, significantly enhancing operational efficiency.',
      },
      project2: {
        name: 'FlowState FM',
        category: 'Focus Music Dashboard',
        description: 'Architected and built a scalable prototype for a next-generation SaaS platform, focusing on intuitive UX and high-performance data visualization.',
      },
      project3: {
        name: 'SnapCode CMS',
        category: 'Content Management System',
        description: 'Designed and developed an internal web application to optimize content management, reducing manual effort and improving data accuracy.',
      },
    },
    about: {
      headline: 'Deep Focus, Delivered.',
      body: 'Founded on the philosophy that deep, uninterrupted work yields superior results. At Coffee Code Studio, you partner directly with the craftsmen. My \'bathrobe and code\' philosophy isn\'t about being casual; it\'s about creating the optimal environment for intense focus, ensuring your project receives dedicated attention and unparalleled quality.',
    },
    footer: {
      cta: 'Ready to Brew Your Next Big Idea?',
      phone: 'Not set',
    },
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('sv');

  const value = {
    language,
    setLanguage,
    t: translations[language],
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
