import React, { createContext, useContext, useState, type ReactNode } from 'react';

type Language = 'sv' | 'en';

interface FAQItem {
  q: string;
  a: string;
}

interface Translations {
  nav: {
    services: string;
    projects: string;
    process: string;
    pricing: string;
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
    step1: { title: string; subtitle: string; text: string };
    step2: { title: string; subtitle: string; text: string };
    step3: { title: string; subtitle: string; text: string };
  };
  portfolio: {
    headline: string;
    intro: string;
    viewDemo: string;
    explorePrototype: string;
    seeDesign: string;
    project1: { name: string; category: string; description: string };
    project2: { name: string; category: string; description: string };
    project3: { name: string; category: string; description: string };
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
    website: string;
    webshop: string;
    booking: string;
    webApp: string;
    other: string;
    budget: string;
    budgetPlaceholder: string;
    budgetOptions: string[];
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
  pricing: {
    headline: string;
    intro: string;
    maintenanceHeadline: string;
    popular: string;
    perMonth: string;
    cta: string;
    comingSoon: string;
    paymentTitle: string;
    tooltipText: string;
    disclaimerText: string;
    paymentNote: string;
    packages: {
      bas: { name: string; price: string; description: string; features: string[] };
      standard: { name: string; price: string; description: string; features: string[] };
      premium: { name: string; price: string; description: string; features: string[] };
    };
    oneTime: {
      title: string;
      price: string;
      note: string;
      description: string;
      features: string[];
      cta: string;
    };
    paymentMethods: {
      invoice: { name: string };
      card: { name: string };
      swish: { name: string };
      paypal: { name: string };
      crypto: { name: string };
    };
  };
  faq: {
    headline: string;
    items: FAQItem[];
  };
}

const translations: Record<Language, Translations> = {
  sv: {
    nav: {
      services: 'Tjänster',
      projects: 'Projekt',
      process: 'Process',
      pricing: 'Priser',
      about: 'Om oss',
      contact: 'Kontakt',
      portal: 'Kundportal',
    },
    hero: {
      headline: 'Professionell hemsida på 7 dagar — från 4,900 kr',
      subheadline: 'Snabbare leverans, högre kvalitet. Vi bygger skräddarsydda webbappar med AI-driven utveckling — från idé till lansering.',
      cta: 'Boka gratis konsultation',
      promo: 'Nu tar vi emot nya kunder — boka ett kostnadsfritt samtal idag',
      planning: 'Planering',
      solution: 'Lösning',
    },
    problem: {
      headline: 'Trött på generisk mjukvara? Släpp loss din potential.',
      body: 'Standardlösningar räcker ofta inte till. På Coffee Code Studio anser vi att ditt företag förtjänar en digital plattform som är lika unik och dynamisk som din vision. Vi bygger skräddarsydda webbapplikationer utformade för att lösa dina specifika utmaningar, skala med din tillväxt och integreras sömlöst i dina arbetsflöden.',
    },
    process: {
      headline: 'Så här jobbar vi — från idé till live på dagar.',
      intro: '',
      step1: {
        title: 'Digital Kaffe',
        subtitle: '',
        text: 'Vi börjar med ett kort samtal för att förstå din vision och dina mål.',
      },
      step2: {
        title: 'Vi bygger',
        subtitle: '',
        text: 'Med AI-driven utveckling levererar vi snabbt och kostnadseffektivt.',
      },
      step3: {
        title: 'Du godkänner',
        subtitle: '',
        text: 'Du granskar resultatet och vi finjusterar tills du är nöjd.',
      },
    },
    portfolio: {
      headline: 'Projekt',
      intro: 'Verkliga lösningar vi har levererat.',
      viewDemo: 'Besök sajten',
      explorePrototype: 'Utforska Prototypen',
      seeDesign: 'Se Designkoncept',
      project1: {
        name: 'djloboproducciones.com',
        category: 'Kundprojekt',
        description: 'En komplett plattform för DJ Lobo — bokningssystem, live radio och mixar på ett ställe. Från idé till live på under en vecka.',
      },
      project2: {
        name: 'Echo2000',
        category: 'Personligt projekt',
        description: 'En nostalgisk svensk community inspirerad av LunarStorm och MSN Messenger — med chatt, profiler, klotterplank och retro-spel.',
      },
      project3: {
        name: 'SnapCode CMS',
        category: 'Innehållshanteringssystem',
        description: 'Designade och utvecklade en intern webbapplikation för att optimera innehållshantering.',
      },
    },
    about: {
      headline: 'Vi bygger snabbare. Du lanserar tidigare.',
      body: 'Coffee Code Studio kombinerar modern webbutveckling med AI-verktyg för att leverera proffsiga sajter på dagar — inte månader. Dedikerat fokus, transparent process och en kundportal där du följer varje steg.',
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
      website: 'Hemsida / Landningssida',
      webshop: 'Webbshop',
      booking: 'Bokningssystem',
      webApp: 'Webbapplikation',
      other: 'Annat',
      budget: 'Budget',
      budgetPlaceholder: 'Välj ungefärlig budget',
      budgetOptions: ['Under 5 000 kr', '5 000 – 15 000 kr', '15 000 – 50 000 kr', 'Över 50 000 kr', 'Vet ej'],
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
      mvpTitle: 'Din sajt live på en vecka',
      mvpDescription: 'Vi bygger din webbplats snabbt och till fast pris — så att du kan fokusera på din verksamhet, inte tekniken.',
      rapidTitle: 'Testa din idé utan risk',
      rapidDescription: 'Se hur din lösning ser ut och fungerar innan du investerar fullt ut. Från skiss till klickbar prototyp på dagar.',
      aiTitle: 'Proffsig kvalitet till lägre kostnad',
      aiDescription: 'Med moderna verktyg levererar vi snabbare och billigare än traditionella byråer — utan att kompromissa med kvaliteten.',
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
    pricing: {
      headline: 'Välj ditt paket',
      intro: 'Allt du behöver för en professionell webbnärvaro.',
      maintenanceHeadline: 'Underhållspaket (för befintliga Coffee Code Studio-kunder)',
      popular: 'Populärast',
      perMonth: 'kr/mån',
      cta: 'Kom igång',
      comingSoon: 'Kommer snart',
      paymentTitle: 'Betalningsmetoder',
      tooltipText: 'Hosting, support och underhåll för sidor byggda av CCS.',
      disclaimerText: 'Underhållspaketen gäller i första hand projekt byggda av Coffee Code Studio. Har du en befintlig sajt? Hör av dig så ser vi vad vi kan göra.',
      paymentNote: 'Betalning via faktura. Fler betalningsalternativ kommer snart.',
      packages: {
        bas: {
          name: 'Bas',
          price: '499',
          description: 'Perfekt för mindre underhåll och löpande justeringar.',
          features: ['3 ärenden per månad', 'Svar inom 48 timmar', 'E-postsupport', 'Kundportal med projektöversikt'],
        },
        standard: {
          name: 'Standard',
          price: '999',
          description: 'För företag som behöver löpande utveckling och snabbare respons.',
          features: ['6 ärenden per månad', 'Svar inom 24 timmar', 'Prioriterad support', 'Kundportal med projektöversikt'],
        },
        premium: {
          name: 'Premium',
          price: '1 999',
          description: 'Full tillgång till utvecklingsresurser med högsta prioritet.',
          features: ['10 utvecklingstimmar/mån', 'Svar inom 4 timmar', 'Prioriterad support', 'Dedikerad kontaktperson', 'Månatlig statusrapport'],
        },
      },
      oneTime: {
        title: 'Engångsprojekt',
        price: '9 900',
        note: 'Leverans: 10–14 dagar. Pris från 9,900 kr — komplexa projekt offereras individuellt.',
        description: 'Skräddarsydda webbapplikationer från grunden, med fast pris och tydlig leverans.',
        features: ['Upp till 7 sidor', 'Mobilvänlig design', 'Kontaktformulär + email', 'Bokningssystem (Calendly)', 'GDPR-compliance', 'SEO-optimering', '30 dagars support'],
        cta: 'Boka konsultation',
      },
      paymentMethods: {
        invoice: { name: 'Kontant / Faktura' },
        card: { name: 'Kort' },
        swish: { name: 'Swish' },
        paypal: { name: 'PayPal' },
        crypto: { name: 'Krypto' },
      },
    },
    faq: {
      headline: 'Vanliga frågor',
      items: [
        {
          q: 'Vad ingår i priset?',
          a: 'Responsiv design (mobil + desktop), SEO-optimering, GDPR-godkänd cookiebanner, kontaktformulär med email-integration, och 30 dagars support efter lansering.',
        },
        {
          q: 'Kan jag redigera sajten själv efteråt?',
          a: 'Ja, alla sidor levereras med Lovable editor-access så du kan göra ändringar själv. Alternativt ingår uppdateringar i underhållspaketet.',
        },
        {
          q: 'Vad händer om jag inte gillar designen?',
          a: 'Vi gör obegränsade revideringar tills du är nöjd. Betalning sker först när du godkänt slutresultatet.',
        },
        {
          q: 'Ingår domän och hosting?',
          a: 'Hosting via Netlify/Vercel ingår i priset. Domän köper du själv (ca 100 kr/år), jag hjälper till med kopplingen.',
        },
        {
          q: 'Hur lång tid tar det egentligen?',
          a: '7-10 dagar från godkänd briefing till färdig sajt. Komplexa projekt med e-handel kan ta 2-3 veckor.',
        },
      ],
    },
  },
  en: {
    nav: {
      services: 'Services',
      projects: 'Projects',
      process: 'Process',
      pricing: 'Pricing',
      about: 'About Us',
      contact: 'Contact',
      portal: 'Client Portal',
    },
    hero: {
      headline: 'Professional website in 7 days — from 4,900 SEK',
      subheadline: 'Faster delivery, higher quality. We build custom web apps with AI-driven development — from idea to launch.',
      cta: 'Book free consultation',
      promo: 'We\'re now accepting new clients — book a free consultation today',
      planning: 'Planning',
      solution: 'Solution',
    },
    problem: {
      headline: 'Tired of generic software? Unleash your potential.',
      body: 'Off-the-shelf solutions often fall short. At Coffee Code Studio, we believe your business deserves a digital platform as unique and dynamic as your vision. We build custom web applications designed to solve your specific challenges, scale with your growth, and integrate seamlessly into your workflow.',
    },
    process: {
      headline: 'How we work — from idea to live in days.',
      intro: '',
      step1: {
        title: 'Digital Coffee',
        subtitle: '',
        text: 'We start with a short conversation to understand your vision and goals.',
      },
      step2: {
        title: 'We build',
        subtitle: '',
        text: 'With AI-powered development, we deliver fast and cost-effectively.',
      },
      step3: {
        title: 'You approve',
        subtitle: '',
        text: 'You review the result and we fine-tune until you\'re happy.',
      },
    },
    portfolio: {
      headline: 'Projects',
      intro: 'Real solutions we have delivered.',
      viewDemo: 'Visit Site',
      explorePrototype: 'Explore the Prototype',
      seeDesign: 'See Design Concepts',
      project1: {
        name: 'djloboproducciones.com',
        category: 'Client Project',
        description: 'A complete platform for DJ Lobo — booking system, live radio and mixes in one place. From idea to live in under a week.',
      },
      project2: {
        name: 'Echo2000',
        category: 'Personal Project',
        description: 'A nostalgic Swedish community inspired by LunarStorm and MSN Messenger — with chat, profiles, guestbooks, and retro games.',
      },
      project3: {
        name: 'SnapCode CMS',
        category: 'Content Management System',
        description: 'Designed and developed an internal web application to optimize content management.',
      },
    },
    about: {
      headline: 'We Build Faster. You Launch Sooner.',
      body: 'Coffee Code Studio combines modern web development with AI tools to deliver professional sites in days — not months. Dedicated focus, transparent process, and a client portal where you follow every step.',
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
      website: 'Website / Landing Page',
      webshop: 'Webshop',
      booking: 'Booking System',
      webApp: 'Web Application',
      other: 'Other',
      budget: 'Budget',
      budgetPlaceholder: 'Select approximate budget',
      budgetOptions: ['Under 5 000 SEK', '5 000 – 15 000 SEK', '15 000 – 50 000 SEK', 'Over 50 000 SEK', 'Not sure'],
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
      mvpTitle: 'Your site live in one week',
      mvpDescription: 'We build your website fast at a fixed price — so you can focus on your business, not the tech.',
      rapidTitle: 'Test your idea risk-free',
      rapidDescription: 'See how your solution looks and works before you fully commit. From sketch to clickable prototype in days.',
      aiTitle: 'Pro quality at lower cost',
      aiDescription: 'With modern tools we deliver faster and cheaper than traditional agencies — without compromising on quality.',
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
    pricing: {
      headline: 'Choose your plan',
      intro: 'Flexible monthly packages tailored to your needs. No lock-in.',
      popular: 'Most Popular',
      perMonth: 'SEK/mo',
      cta: 'Get started',
      comingSoon: 'Coming soon',
      paymentTitle: 'Payment Methods',
      tooltipText: 'This package applies to web projects built by Coffee Code Studio.',
      disclaimerText: 'Maintenance packages primarily apply to projects built by Coffee Code Studio. Have an existing site? Contact us and we\'ll see what we can do.',
      paymentNote: 'Payment via invoice. More payment options coming soon.',
      packages: {
        bas: {
          name: 'Basic',
          price: '499',
          description: 'Perfect for minor maintenance and ongoing adjustments.',
          features: ['3 requests per month', 'Response within 48 hours', 'Email support', 'Client portal with project overview'],
        },
        standard: {
          name: 'Standard',
          price: '999',
          description: 'For businesses needing ongoing development and faster response.',
          features: ['6 requests per month', 'Response within 24 hours', 'Priority support', 'Client portal with project overview'],
        },
        premium: {
          name: 'Premium',
          price: '1,999',
          description: 'Full access to development resources with highest priority.',
          features: ['10 dev hours/month', 'Response within 4 hours', 'Priority support', 'Dedicated contact person', 'Monthly status report'],
        },
      },
      oneTime: {
        title: 'One-time Project',
        price: '9,900',
        note: 'Starting from 9,900 SEK — complex projects are quoted individually after consultation.',
        description: 'Custom web applications built from scratch, with a fixed price and clear delivery.',
        features: ['Responsive design', 'SEO-optimized', 'Client portal included', 'Follow-up support available'],
        cta: 'Book consultation',
      },
      paymentMethods: {
        invoice: { name: 'Invoice / Cash' },
        card: { name: 'Card' },
        swish: { name: 'Swish' },
        paypal: { name: 'PayPal' },
        crypto: { name: 'Crypto' },
      },
    },
    faq: {
      headline: 'Frequently Asked Questions',
      items: [
        {
          q: 'What\'s included in the price?',
          a: 'Responsive design (mobile + desktop), SEO optimization, GDPR-compliant cookie banner, contact form with email integration, and 30 days of support after launch.',
        },
        {
          q: 'Can I edit the site myself afterwards?',
          a: 'Yes, all sites are delivered with Lovable editor access so you can make changes yourself. Alternatively, updates are included in the maintenance package.',
        },
        {
          q: 'What if I don\'t like the design?',
          a: 'We do unlimited revisions until you\'re satisfied. Payment is only due once you\'ve approved the final result.',
        },
        {
          q: 'Is domain and hosting included?',
          a: 'Hosting via Netlify/Vercel is included in the price. You purchase the domain yourself (about 100 SEK/year), and I help with the setup.',
        },
        {
          q: 'How long does it really take?',
          a: '7-10 days from approved briefing to finished site. Complex projects with e-commerce can take 2-3 weeks.',
        },
      ],
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
