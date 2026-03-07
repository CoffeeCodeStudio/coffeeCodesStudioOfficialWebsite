import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'sv' | 'en';

interface Translations {
  nav: {
    services: string;
    projects: string;
    process: string;
    about: string;
    contact: string;
    portal: string;
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
  contact: {
    headline: string;
    intro: string;
    name: string;
    namePlaceholder: string;
    company: string;
    companyPlaceholder: string;
    email: string;
    emailPlaceholder: string;
    projectType: string;
    projectTypePlaceholder: string;
    webApp: string;
    internalTool: string;
    saas: string;
    other: string;
    message: string;
    messagePlaceholder: string;
    submit: string;
    sending: string;
    success: string;
    successMessage: string;
    errorName: string;
    errorEmail: string;
    errorEmailInvalid: string;
    errorProjectType: string;
    errorMessage: string;
  };
  services: {
    headline: string;
    intro: string;
    mvpTitle: string;
    mvpDescription: string;
    rapidTitle: string;
    rapidDescription: string;
    aiTitle: string;
    aiDescription: string;
    iterationTitle: string;
    iterationDescription: string;
    cta: string;
  };
  value: {
    headline: string;
    intro: string;
    stat1: string;
    stat1Label: string;
    stat2: string;
    stat2Label: string;
    stat3: string;
    stat3Label: string;
    stat4: string;
    stat4Label: string;
    benefit1Title: string;
    benefit1Text: string;
    benefit2Title: string;
    benefit2Text: string;
    benefit3Title: string;
    benefit3Text: string;
    cta: string;
  };
  partnership: {
    headline: string;
    intro: string;
    phase1Title: string;
    phase1Text: string;
    phase2Title: string;
    phase2Text: string;
    phase3Title: string;
    phase3Text: string;
    cta: string;
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
      portal: 'Kundportal',
    },
    hero: {
      headline: 'Webbutveckling med AI-precision.',
      subheadline: 'Snabbare leverans, högre kvalitet. Vi bygger skräddarsydda webbappar med AI-driven utveckling — från idé till lansering.',
      cta: 'Boka en Digital Kaffe',
      promo: 'Founding Partner Program: 20% rabatt för våra tre första kunder!',
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
      headline: 'Fullstack AI-Assisted Developer',
      body: 'Jag kombinerar traditionell webbutveckling med moderna AI-verktyg för att leverera snabbare och smartare. Varje projekt får dedikerat fokus — från arkitektur till lansering. Resultatet? Högre kvalitet, färre buggar och kortare leveranstider.',
    },
    footer: {
      cta: 'Redo att brygga din nästa stora idé?',
      phone: 'Inget satt',
    },
    contact: {
      headline: 'Starta din bryggning',
      intro: 'Berätta om ditt projekt så hör vi av oss inom 24 timmar.',
      name: 'Namn',
      namePlaceholder: 'Ditt namn',
      company: 'Företag',
      companyPlaceholder: 'Ditt företagsnamn (valfritt)',
      email: 'E-post',
      emailPlaceholder: 'din@email.se',
      projectType: 'Projekttyp',
      projectTypePlaceholder: 'Välj projekttyp',
      webApp: 'Webbapplikation',
      internalTool: 'Internt verktyg',
      saas: 'SaaS-plattform',
      other: 'Annat',
      message: 'Meddelande',
      messagePlaceholder: 'Berätta kort om din vision och dina utmaningar...',
      submit: 'Skicka förfrågan',
      sending: 'Skickar...',
      success: 'Tack för din förfrågan!',
      successMessage: 'Vi har tagit emot ditt meddelande och återkommer inom 24 timmar.',
      errorName: 'Namn krävs',
      errorEmail: 'E-post krävs',
      errorEmailInvalid: 'Ogiltig e-postadress',
      errorProjectType: 'Välj en projekttyp',
      errorMessage: 'Meddelande krävs',
    },
    services: {
      headline: 'Våra Tjänster',
      intro: 'Fullstack-utveckling med AI-verktyg. Vi bygger snabbt, levererar kvalitet och håller det enkelt.',
      mvpTitle: 'MVP-utveckling',
      mvpDescription: 'Vi bygger din första version snabbt och kostnadseffektivt, så att du kan testa din affärsidé på marknaden.',
      rapidTitle: 'Snabb Prototypning',
      rapidDescription: 'Från skiss till klickbar prototyp på dagar, inte månader. Testa idéer innan du investerar stort.',
      aiTitle: 'AI-driven Utveckling',
      aiDescription: 'Vi använder Lovable AI och moderna verktyg för att accelerera utvecklingen och leverera högkvalitativa resultat.',
      iterationTitle: 'Iterativ Förfining',
      iterationDescription: 'Kontinuerlig förbättring baserad på användarfeedback och data för att optimera din produkt.',
      cta: 'Diskutera ditt projekt',
    },
    value: {
      headline: 'Affärsvärde & ROI',
      intro: 'Konkreta resultat som driver din verksamhet framåt.',
      stat1: '3x',
      stat1Label: 'Snabbare lansering',
      stat2: '60%',
      stat2Label: 'Lägre utvecklingskostnad',
      stat3: '95%',
      stat3Label: 'Kundnöjdhet',
      stat4: '2v',
      stat4Label: 'Till första prototyp',
      benefit1Title: 'Minskad Risk',
      benefit1Text: 'Testa din idé med en MVP innan du investerar stort. Validera marknaden med minimal insats.',
      benefit2Title: 'Snabbare Time-to-Market',
      benefit2Text: 'Gå från idé till lansering på veckor istället för månader med vår effektiva process.',
      benefit3Title: 'Mätbara Resultat',
      benefit3Text: 'Varje projekt levereras med tydliga KPI:er och mätbara affärsresultat.',
      cta: 'Se vad vi kan göra för dig',
    },
    partnership: {
      headline: 'Långsiktigt Partnerskap',
      intro: 'Vi är med dig hela vägen – från första idé till skalning och vidareutveckling.',
      phase1Title: 'Lansering',
      phase1Text: 'Vi bygger och lanserar din MVP snabbt och effektivt med fokus på kärnfunktionalitet.',
      phase2Title: 'Tillväxt',
      phase2Text: 'Efter lansering hjälper vi dig att optimera, skala och lägga till nya funktioner baserat på data.',
      phase3Title: 'Partnerskap',
      phase3Text: 'Vi blir din långsiktiga teknikpartner och hjälper dig att kontinuerligt utveckla din produkt.',
      cta: 'Bli vår partner',
    },
  },
  en: {
    nav: {
      services: 'Services',
      projects: 'Projects',
      process: 'Process',
      about: 'About Us',
      contact: 'Contact',
      portal: 'Client Portal',
    },
    hero: {
      headline: 'Web Development with AI Precision.',
      subheadline: 'Faster delivery, higher quality. We build custom web apps with AI-driven development — from idea to launch.',
      cta: 'Book a Digital Coffee',
      promo: 'Founding Partner Program: 20% off for our first three clients!',
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
      headline: 'Fullstack AI-Assisted Developer',
      body: 'I combine traditional web development with modern AI tools to deliver faster and smarter. Every project gets dedicated focus — from architecture to launch. The result? Higher quality, fewer bugs, and shorter delivery times.',
    },
    footer: {
      cta: 'Ready to Brew Your Next Big Idea?',
      phone: 'Not set',
    },
    contact: {
      headline: 'Start Your Brew',
      intro: 'Tell us about your project and we\'ll get back to you within 24 hours.',
      name: 'Name',
      namePlaceholder: 'Your name',
      company: 'Company',
      companyPlaceholder: 'Your company name (optional)',
      email: 'Email',
      emailPlaceholder: 'you@email.com',
      projectType: 'Project Type',
      projectTypePlaceholder: 'Select project type',
      webApp: 'Web Application',
      internalTool: 'Internal Tool',
      saas: 'SaaS Platform',
      other: 'Other',
      message: 'Message',
      messagePlaceholder: 'Tell us briefly about your vision and challenges...',
      submit: 'Send Request',
      sending: 'Sending...',
      success: 'Thank you for your request!',
      successMessage: 'We have received your message and will get back to you within 24 hours.',
      errorName: 'Name is required',
      errorEmail: 'Email is required',
      errorEmailInvalid: 'Invalid email address',
      errorProjectType: 'Please select a project type',
      errorMessage: 'Message is required',
    },
    services: {
      headline: 'Our Services',
      intro: 'We help businesses quickly go from idea to working product using modern technology and AI-driven development.',
      mvpTitle: 'MVP Development',
      mvpDescription: 'We build your first version quickly and cost-effectively so you can test your business idea on the market.',
      rapidTitle: 'Rapid Prototyping',
      rapidDescription: 'From sketch to clickable prototype in days, not months. Test ideas before making a big investment.',
      aiTitle: 'AI-Powered Development',
      aiDescription: 'We use Lovable AI and modern tools to accelerate development and deliver high-quality results.',
      iterationTitle: 'Iterative Refinement',
      iterationDescription: 'Continuous improvement based on user feedback and data to optimize your product.',
      cta: 'Discuss your project',
    },
    value: {
      headline: 'Business Value & ROI',
      intro: 'Concrete results that drive your business forward.',
      stat1: '3x',
      stat1Label: 'Faster launch',
      stat2: '60%',
      stat2Label: 'Lower development cost',
      stat3: '95%',
      stat3Label: 'Customer satisfaction',
      stat4: '2w',
      stat4Label: 'To first prototype',
      benefit1Title: 'Reduced Risk',
      benefit1Text: 'Test your idea with an MVP before investing heavily. Validate the market with minimal effort.',
      benefit2Title: 'Faster Time-to-Market',
      benefit2Text: 'Go from idea to launch in weeks instead of months with our efficient process.',
      benefit3Title: 'Measurable Results',
      benefit3Text: 'Every project is delivered with clear KPIs and measurable business outcomes.',
      cta: 'See what we can do for you',
    },
    partnership: {
      headline: 'Long-Term Partnership',
      intro: 'We are with you every step of the way – from first idea to scaling and further development.',
      phase1Title: 'Launch',
      phase1Text: 'We build and launch your MVP quickly and efficiently, focusing on core functionality.',
      phase2Title: 'Growth',
      phase2Text: 'After launch, we help you optimize, scale, and add new features based on data.',
      phase3Title: 'Partnership',
      phase3Text: 'We become your long-term technology partner, helping you continuously develop your product.',
      cta: 'Become our partner',
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
