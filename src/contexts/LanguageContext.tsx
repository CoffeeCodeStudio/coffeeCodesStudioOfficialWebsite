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
    mockupTagline: string;
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
    comingSoon: string;
    project1: { name: string; category: string; description: string };
    project2: { name: string; category: string; description: string };
    project3: { name: string; category: string; description: string };
    projectOverrides: Record<string, { title: string; category: string; description: string }>;
  };
  about: {
    headline: string;
    body: string;
    pullQuote: string;
  };
  footer: {
    cta: string;
    phone: string;
    rights: string;
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
    scopeNote: string;
    maintenanceHeadline: string;
    showMaintenance: string;
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
    starter: {
      title: string;
      price: string;
      note: string;
      description: string;
      features: string[];
      cta: string;
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
      about: 'Om mig',
      contact: 'Kontakt',
      portal: 'Kundportal',
    },
    hero: {
      headline: 'Din hemsida live inom en vecka',
      subheadline: 'Jag bygger en professionell första version av din sajt på sju dagar. Snabbt, enkelt och utan krångel.',
      cta: 'Boka gratis konsultation',
      promo: 'Jag tar emot nya kunder — boka ett kostnadsfritt samtal idag',
      planning: 'Planering',
      solution: 'Lösning',
      mockupTagline: 'Byggt åt riktiga kunder i Göteborg',
    },
    problem: {
      headline: 'Trött på generiska mallar? Du förtjänar bättre.',
      body: 'Standardlösningar räcker sällan till. Ditt företag förtjänar en hemsida som är lika unik som din verksamhet. Jag bygger skräddarsydda hemsidor som löser dina utmaningar, växer med dig och speglar ditt varumärke.',
    },
    process: {
      headline: 'Så funkar det — från idé till live på dagar.',
      intro: '',
      step1: {
        title: 'Digital Kaffe',
        subtitle: '',
        text: 'Jag börjar med ett kort samtal för att förstå din vision och dina mål.',
      },
      step2: {
        title: 'Jag bygger',
        subtitle: '',
        text: 'Med snabb leverans får du en proffsig hemsida på dagar — inte månader.',
      },
      step3: {
        title: 'Du godkänner',
        subtitle: '',
        text: 'Du granskar resultatet och jag finjusterar tills du är nöjd.',
      },
    },
    portfolio: {
      headline: 'Senaste projektet',
      intro: 'Verkliga hemsidor jag har levererat.',
      viewDemo: 'Besök sajten',
      explorePrototype: 'Utforska Prototypen',
      seeDesign: 'Se Designkoncept',
      comingSoon: 'Projekt kommer snart — vi jobbar med spännande kunder just nu.',
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
      projectOverrides: {
        'cc6027f3-83ba-4b60-a197-b1e538e51e90': {
          title: 'Echo2000',
          category: 'Personligt projekt',
          description: 'En social plattform för 25+ inspirerad av det tidiga 2000-talets internet. Profiler, realtidschatt, klotterplank och gästbok — från idé till live beta med aktiva användare.',
        },
        'f3b5fea3-41fd-465b-ae92-141d9e9d42f3': {
          title: 'DJ Lobo Producciones',
          category: 'Kundprojekt',
          description: 'Professionell webbplats med bokningssystem och live radio för DJ Lobo Producciones.',
        },
      },
    },
    about: {
      headline: 'Jag bygger snabbare. Du lanserar tidigare.',
      body: 'Coffee Code Studio drivs av Rami — med bakgrund inom försäljning och kundrelationer, baserad i Göteborg. Varje projekt får personlig kontakt från start till slut. Jag kombinerar modern webbutveckling med smarta verktyg för att leverera proffsiga hemsidor på dagar — inte månader. Transparent process och en kundportal där du följer varje steg.',
      pullQuote: 'Kundprojekt levererat. 100% nöjd kund. Göteborg-baserad.',
    },
    footer: {
      cta: 'Redo att brygga din nästa stora idé?',
      phone: 'Inget satt',
      rights: 'Alla rättigheter förbehållna',
    },
    contact: {
      headline: 'Starta din bryggning',
      intro: 'Berätta om ditt projekt så hör jag av mig inom 24 timmar.',
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
      budgetOptions: ['Under 5 000 kr', '5 000 – 15 000 kr', '15 000 – 30 000 kr', 'Större projekt / Offert'],
      message: 'Meddelande',
      messagePlaceholder: 'Berätta kort om din vision och dina utmaningar...',
      submit: 'Skicka förfrågan',
      sending: 'Skickar...',
      success: 'Tack för din förfrågan!',
      successMessage: 'Jag har tagit emot ditt meddelande och återkommer inom 24 timmar.',
      errorName: 'Namn krävs',
      errorEmail: 'E-post krävs',
      errorEmailInvalid: 'Ogiltig e-postadress',
      errorProjectType: 'Välj en projekttyp',
      errorMessage: 'Meddelande krävs',
    },
    services: {
      headline: 'Mina Tjänster',
      intro: 'Hemsidor för småföretag i Göteborg. Jag bygger snabbt, levererar kvalitet och håller det enkelt.',
      mvpTitle: 'Din hemsida — klar på en vecka',
      mvpDescription: 'Jag bygger din hemsida snabbt och till fast pris — så att du kan fokusera på din verksamhet, inte tekniken.',
      rapidTitle: 'Snabbt från start till live',
      rapidDescription: 'Se hur din hemsida ser ut och fungerar innan du bestämmer dig fullt. Från skiss till en fungerande första version på dagar.',
      aiTitle: 'Proffsig sajt, lägre pris',
      aiDescription: 'Jag levererar snabbare och billigare än traditionella byråer — utan att kompromissa med kvaliteten.',
      iterationTitle: 'Kontinuerlig utveckling',
      iterationDescription: 'Din sajt växer med dig. Jag hjälper dig att lägga till funktioner och förbättra över tid.',
      cta: 'Diskutera ditt projekt',
    },
    value: {
      headline: 'Affärsvärde & Resultat',
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
      benefit2Text: 'Gå från idé till lansering på veckor istället för månader med en effektiv process.',
      benefit3Title: 'Mätbara Resultat',
      benefit3Text: 'Varje projekt levereras med tydliga KPI:er och mätbara affärsresultat.',
      cta: 'Se vad jag kan göra för dig',
    },
    partnership: {
      headline: 'Långsiktigt Partnerskap',
      intro: 'Jag är med dig hela vägen — från första idé till vidareutveckling.',
      phase1Title: 'Lansering',
      phase1Text: 'Jag bygger och lanserar din hemsida snabbt och effektivt med fokus på det som är viktigast.',
      phase2Title: 'Tillväxt',
      phase2Text: 'Efter lansering hjälper jag dig att optimera och lägga till nya funktioner baserat på dina behov.',
      phase3Title: 'Partnerskap',
      phase3Text: 'Jag blir din långsiktiga webbpartner och hjälper dig att kontinuerligt förbättra din sajt.',
      cta: 'Bli min kund',
    },
    pricing: {
      headline: 'Välj ditt paket',
      intro: 'Allt du behöver för en professionell hemsida.',
      scopeNote: 'Pris och tid anpassas efter hur stor sajt du behöver. Jag börjar med det viktigaste så att du kommer live inom en vecka.',
      maintenanceHeadline: 'Underhållspaket (för befintliga Coffee Code Studio-kunder)',
      showMaintenance: 'Visa underhållspaket',
      popular: 'Populärast',
      perMonth: 'kr/mån',
      cta: 'Kom igång',
      comingSoon: 'Kommer snart',
      paymentTitle: 'Betalningsmetoder',
      tooltipText: 'Hosting, support och underhåll för sidor byggda av CCS.',
      disclaimerText: 'Underhållspaketen gäller i första hand projekt byggda av Coffee Code Studio. Har du en befintlig sajt? Hör av dig så ser jag vad jag kan göra.',
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
      starter: {
        title: 'Starter',
        price: '4 900',
        note: 'Leverans: 5–7 dagar. Perfekt för dig som behöver en enkel, proffsig närvaro snabbt.',
        description: 'En stilren one-page-sajt med allt du behöver för att komma igång.',
        features: ['One-page design (scroll-baserad)', 'Mobilvänlig & snabb', 'Kontaktformulär + email', 'GDPR-compliance', 'SEO-grundpaket', '14 dagars support'],
        cta: 'Boka konsultation',
      },
      oneTime: {
        title: 'Engångsprojekt',
        price: '9 900',
        note: 'Leverans: 10–14 dagar. Pris från 9 900 kr — komplexa projekt offereras individuellt.',
        description: 'Skräddarsydda hemsidor från grunden, med fast pris och tydlig leverans.',
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
          a: 'Mindre ändringar som text och bilder fixar jag snabbt och smidigt. Vill du kunna redigera själv kan jag sätta upp en enkel lösning, eller så ingår uppdateringar i underhållspaketet.',
        },
        {
          q: 'Vad händer om jag inte gillar designen?',
          a: 'Du får se designförslag innan vi går vidare. Två revideringsrundor ingår i priset. Behövs fler justeringar tar vi det därifrån.',
        },
        {
          q: 'Ingår domän och hosting?',
          a: 'Hosting ingår i priset. Du köper domänen själv (ca 100 kr/år) och jag hjälper dig koppla den.',
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
      about: 'About',
      contact: 'Contact',
      portal: 'Client Portal',
    },
    hero: {
      headline: 'Your website live within a week',
      subheadline: 'I build a professional first version of your site in seven days. Fast, simple and without hassle.',
      cta: 'Book free consultation',
      promo: 'I\'m now accepting new clients — book a free consultation today',
      planning: 'Planning',
      solution: 'Solution',
      mockupTagline: 'Built for real clients in Gothenburg',
    },
    problem: {
      headline: 'Tired of generic templates? You deserve better.',
      body: 'Off-the-shelf solutions rarely cut it. Your business deserves a website as unique as your brand. I build custom websites that solve your challenges, grow with you, and reflect your identity.',
    },
    process: {
      headline: 'How it works — from idea to live in days.',
      intro: '',
      step1: {
        title: 'Digital Coffee',
        subtitle: '',
        text: 'I start with a short conversation to understand your vision and goals.',
      },
      step2: {
        title: 'I build',
        subtitle: '',
        text: 'With fast delivery, you get a professional website in days — not months.',
      },
      step3: {
        title: 'You approve',
        subtitle: '',
        text: 'You review the result and I fine-tune until you\'re happy.',
      },
    },
    portfolio: {
      headline: 'Latest project',
      intro: 'Real websites I have delivered.',
      viewDemo: 'Visit Site',
      explorePrototype: 'Explore the Prototype',
      seeDesign: 'See Design Concepts',
      comingSoon: 'Projects coming soon — I\'m working with exciting clients right now.',
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
      projectOverrides: {
        'cc6027f3-83ba-4b60-a197-b1e538e51e90': {
          title: 'Echo2000',
          category: 'Personal project',
          description: 'A social platform for 25+ inspired by the early 2000s internet. Profiles, real-time chat, guestbook and message wall — from idea to live beta with active users.',
        },
        'f3b5fea3-41fd-465b-ae92-141d9e9d42f3': {
          title: 'DJ Lobo Producciones',
          category: 'Client project',
          description: 'Professional website with booking system and live radio for DJ Lobo Producciones.',
        },
      },
    },
    about: {
      headline: 'I Build Faster. You Launch Sooner.',
      body: 'Coffee Code Studio is run by Rami — with a background in sales and client relations, based in Gothenburg. Every project gets personal attention from start to finish. I combine modern web development with smart tools to deliver professional websites in days — not months. Transparent process and a client portal where you follow every step.',
      pullQuote: 'Client project delivered. 100% satisfied. Gothenburg-based.',
    },
    footer: {
      cta: 'Ready to Brew Your Next Big Idea?',
      phone: 'Not set',
      rights: 'All rights reserved',
    },
    contact: {
      headline: 'Start Your Brew',
      intro: 'Tell me about your project and I\'ll get back to you within 24 hours.',
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
      budgetOptions: ['Under 5 000 SEK', '5 000 – 15 000 SEK', '15 000 – 30 000 SEK', 'Larger project / Quote'],
      message: 'Message',
      messagePlaceholder: 'Tell me briefly about your vision and challenges...',
      submit: 'Send Request',
      sending: 'Sending...',
      success: 'Thank you for your request!',
      successMessage: 'I have received your message and will get back to you within 24 hours.',
      errorName: 'Name is required',
      errorEmail: 'Email is required',
      errorEmailInvalid: 'Invalid email address',
      errorProjectType: 'Please select a project type',
      errorMessage: 'Message is required',
    },
    services: {
      headline: 'My Services',
      intro: 'Websites for small businesses in Gothenburg. I build fast, deliver quality, and keep it simple.',
      mvpTitle: 'Your website — done in a week',
      mvpDescription: 'I build your website fast at a fixed price — so you can focus on your business, not the tech.',
      rapidTitle: 'Fast from start to live',
      rapidDescription: 'See how your website looks and works before you fully commit. From sketch to a working first version in days.',
      aiTitle: 'Professional site, lower price',
      aiDescription: 'I deliver faster and cheaper than traditional agencies — without compromising on quality.',
      iterationTitle: 'Continuous development',
      iterationDescription: 'Your site grows with you. I help you add features and improve over time.',
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
      benefit2Text: 'Go from idea to launch in weeks instead of months with an efficient process.',
      benefit3Title: 'Measurable Results',
      benefit3Text: 'Every project is delivered with clear KPIs and measurable business outcomes.',
      cta: 'See what I can do for you',
    },
    partnership: {
      headline: 'Long-Term Partnership',
      intro: 'I\'m with you every step of the way — from first idea to further development.',
      phase1Title: 'Launch',
      phase1Text: 'I build and launch your website quickly and efficiently, focusing on what matters most.',
      phase2Title: 'Growth',
      phase2Text: 'After launch, I help you optimize and add new features based on your needs.',
      phase3Title: 'Partnership',
      phase3Text: 'I become your long-term web partner, helping you continuously improve your site.',
      cta: 'Become my client',
    },
    pricing: {
      headline: 'Choose your plan',
      intro: 'Everything you need for a professional website.',
      maintenanceHeadline: 'Maintenance packages (for existing Coffee Code Studio clients)',
      showMaintenance: 'Show maintenance plans',
      popular: 'Most Popular',
      perMonth: 'SEK/mo',
      cta: 'Get started',
      comingSoon: 'Coming soon',
      paymentTitle: 'Payment Methods',
      tooltipText: 'Hosting, support and maintenance for sites built by CCS.',
      disclaimerText: 'Maintenance packages primarily apply to projects built by Coffee Code Studio. Have an existing site? Contact me and I\'ll see what I can do.',
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
      starter: {
        title: 'Starter',
        price: '4,900',
        note: 'Delivery: 5–7 days. Perfect if you need a simple, professional presence fast.',
        description: 'A clean one-page site with everything you need to get started.',
        features: ['One-page design (scroll-based)', 'Mobile-friendly & fast', 'Contact form + email', 'GDPR compliance', 'Basic SEO package', '14 days support'],
        cta: 'Book consultation',
      },
      oneTime: {
        title: 'One-time Project',
        price: '9,900',
        note: 'Delivery: 10–14 days. Starting from 9,900 SEK — complex projects quoted individually.',
        description: 'Custom websites built from scratch, with a fixed price and clear delivery.',
        features: ['Up to 7 pages', 'Mobile-friendly design', 'Contact form + email', 'Booking system (Calendly)', 'GDPR compliance', 'SEO optimization', '30 days support'],
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
          a: 'Small changes like text and images I handle quickly. If you want to edit yourself, I can set up a simple solution, or updates are included in the maintenance plan.',
        },
        {
          q: 'What if I don\'t like the design?',
          a: 'You\'ll see design drafts before we proceed. Two revision rounds are included. If more adjustments are needed, we\'ll take it from there.',
        },
        {
          q: 'Is domain and hosting included?',
          a: 'Hosting is included. You purchase the domain yourself (about 100 SEK/year) and I help you connect it.',
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
