import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import djLoboMockup from '@/assets/djlobo-mockup.webp';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ContactSection } from '@/components/ContactSection';
import { SEOHead } from '@/components/SEOHead';
import { Button } from '@/components/ui/button';
import { CircleCheck, Clock, Banknote, MapPin, Search, Smartphone } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const scrollToContact = () =>
  document.getElementById('kontakt')?.scrollIntoView({ behavior: 'smooth' });

/* ─── Hero ─── */
function Hero({ isEn }: { isEn: boolean }) {
  return (
    <section className="relative pt-28 sm:pt-36 pb-14 sm:pb-20 px-4">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-primary/8 rounded-full blur-[120px] pointer-events-none" />
      <div className="container mx-auto max-w-3xl text-center relative z-10">
        <motion.h1
          className="text-3xl sm:text-4xl md:text-5xl font-serif gradient-text leading-tight mb-5"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {isEn
            ? 'Web agency in Gothenburg for small businesses'
            : 'Webbyrå i Göteborg för småföretag'}
        </motion.h1>
        <motion.p
          className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          {isEn
            ? 'Coffee Code Studio is a freelance web developer in Gothenburg building fast, mobile-friendly websites for small businesses. Fixed price from SEK 4,900 and delivery within one week. No monthly fees, no long meetings — you talk directly to the developer who builds your site.'
            : 'Coffee Code Studio är en frilansande webbutvecklare i Göteborg som bygger snabba och mobilanpassade hemsidor för småföretag. Fast pris från 4 900 kr och leverans inom en vecka. Inga månadsavgifter, inga långa möten — du pratar direkt med utvecklaren som bygger din hemsida.'}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Button
            size="lg"
            className="glow-button bg-primary text-primary-foreground hover:bg-primary/90 text-base sm:text-lg px-8 py-6 rounded-full font-medium"
            onClick={scrollToContact}
          >
            {isEn ? 'Book a free consultation' : 'Boka gratis konsultation'}
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Vad kostar en hemsida ─── */
function PriceSection({ isEn }: { isEn: boolean }) {
  const rows = isEn
    ? [
        { name: 'Starter', price: 'SEK 4,900', desc: 'One-page website, mobile-friendly, contact form, SEO basics' },
        { name: 'Business', price: 'SEK 9,900', desc: 'Multiple pages, image gallery, booking or price list, Google setup' },
        { name: 'Custom', price: 'from SEK 14,900', desc: 'Web shop, booking system or integrations built to your needs' },
      ]
    : [
        { name: 'Starter', price: '4 900 kr', desc: 'One-page-hemsida, mobilanpassad, kontaktformulär, SEO-grund' },
        { name: 'Business', price: '9 900 kr', desc: 'Flera sidor, bildgalleri, bokning eller prislista, Google-uppsättning' },
        { name: 'Skräddarsytt', price: 'från 14 900 kr', desc: 'Webbshop, bokningssystem eller integrationer byggda efter dina behov' },
      ];

  return (
    <section className="py-14 sm:py-20 px-4">
      <div className="container mx-auto max-w-3xl">
        <h2 className="text-2xl sm:text-3xl font-serif gradient-text text-center mb-4">
          {isEn
            ? 'What does a website cost in Gothenburg?'
            : 'Vad kostar en hemsida i Göteborg?'}
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground text-center max-w-2xl mx-auto mb-10">
          {isEn
            ? 'A website from Coffee Code Studio costs from SEK 4,900 as a one-time fee. Most small businesses in Gothenburg land between SEK 4,900 and SEK 9,900. You get a fixed price in writing before we start — nothing is added afterwards.'
            : 'En hemsida från Coffee Code Studio kostar från 4 900 kr som en engångskostnad. De flesta småföretag i Göteborg landar mellan 4 900 kr och 9 900 kr. Du får ett fast pris skriftligt innan vi börjar — inget läggs på i efterhand.'}
        </p>
        <div className="grid sm:grid-cols-3 gap-6">
          {rows.map((r, i) => (
            <motion.div
              key={i}
              className="glass-card rounded-2xl p-6 border border-border/30 flex flex-col gap-3"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <h3 className="font-serif text-lg text-foreground">{r.name}</h3>
              <p className="text-2xl font-bold text-primary">{r.price}</p>
              <p className="text-sm text-muted-foreground">{r.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Hur lång tid tar det ─── */
const steps = (isEn: boolean) => [
  {
    icon: Clock,
    title: isEn ? 'Day 1 — briefing' : 'Dag 1 — genomgång',
    desc: isEn
      ? 'A 30-minute call. I collect text, images and your goals.'
      : 'Ett 30 minuters samtal. Jag samlar in text, bilder och dina mål.',
  },
  {
    icon: Smartphone,
    title: isEn ? 'Day 2–5 — build' : 'Dag 2–5 — bygge',
    desc: isEn
      ? 'You get a live link to follow the work and give feedback.'
      : 'Du får en live-länk för att följa arbetet och ge feedback.',
  },
  {
    icon: Search,
    title: isEn ? 'Day 6–7 — launch' : 'Dag 6–7 — publicering',
    desc: isEn
      ? 'Domain, SEO and Google setup. Your website is live within 7 days.'
      : 'Domän, SEO och Google-uppsättning. Din hemsida är live inom 7 dagar.',
  },
];

function TimelineSection({ isEn }: { isEn: boolean }) {
  return (
    <section className="py-14 sm:py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-2xl sm:text-3xl font-serif gradient-text text-center mb-4">
          {isEn
            ? 'How long does it take to build a website?'
            : 'Hur lång tid tar det att bygga en hemsida?'}
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground text-center max-w-2xl mx-auto mb-10">
          {isEn
            ? 'Seven days from briefing to live site. Because I work alone, there are no handovers between designers, project managers and developers.'
            : 'Sju dagar från genomgång till live hemsida. Eftersom jag jobbar själv finns inga överlämningar mellan designer, projektledare och utvecklare.'}
        </p>
        <div className="grid sm:grid-cols-3 gap-6">
          {steps(isEn).map((s, i) => (
            <motion.div
              key={i}
              className="glass-card rounded-2xl p-6 border border-border/30 text-center flex flex-col items-center gap-3"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <s.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-serif text-foreground text-lg">{s.title}</h3>
              <p className="text-sm text-muted-foreground">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Vad ingår ─── */
function IncludedSection({ isEn }: { isEn: boolean }) {
  const features = isEn
    ? [
        'Mobile-friendly, fast-loading design',
        'Your own domain connected',
        'Contact form straight to your inbox',
        'SEO basics: titles, descriptions, sitemap',
        'Google Analytics with cookie consent',
        'Google Business Profile setup',
        'A simple guide so you can update the content yourself',
        'Free support the first 30 days after launch',
      ]
    : [
        'Mobilanpassad design som laddar snabbt',
        'Din egen domän kopplad',
        'Kontaktformulär direkt till din inkorg',
        'SEO-grund: titlar, beskrivningar, sitemap',
        'Google Analytics med cookie-samtycke',
        'Uppsättning av Google-företagsprofil',
        'En enkel guide så att du kan uppdatera innehållet själv',
        'Fri support de första 30 dagarna efter publicering',
      ];

  return (
    <section className="py-14 sm:py-20 px-4">
      <div className="container mx-auto max-w-2xl">
        <h2 className="text-2xl sm:text-3xl font-serif gradient-text text-center mb-10">
          {isEn ? 'What is included in a website?' : 'Vad ingår i en hemsida?'}
        </h2>
        <motion.ul
          className="glass-card rounded-2xl p-8 border border-border/30 space-y-3"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {features.map((f, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm">
              <CircleCheck className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <span className="text-foreground/80">{f}</span>
            </li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}

/* ─── Varför välja en frilansare ─── */
function WhyFreelanceSection({ isEn }: { isEn: boolean }) {
  const points = isEn
    ? [
        { icon: Banknote, title: 'Fixed price from SEK 4,900', desc: 'A big agency in Gothenburg usually starts at SEK 25,000. You get the same result for less.' },
        { icon: Clock, title: 'Live within 7 days', desc: 'No queue and no project managers. You talk directly to the developer.' },
        { icon: MapPin, title: 'Local in Gothenburg', desc: 'We can meet over coffee, and I know the local market you sell to.' },
      ]
    : [
        { icon: Banknote, title: 'Fast pris från 4 900 kr', desc: 'En större webbyrå i Göteborg börjar oftast på 25 000 kr. Du får samma resultat för mindre.' },
        { icon: Clock, title: 'Live inom 7 dagar', desc: 'Ingen kö och inga projektledare. Du pratar direkt med utvecklaren.' },
        { icon: MapPin, title: 'Lokalt i Göteborg', desc: 'Vi kan ses över en kaffe, och jag känner den lokala marknaden du säljer till.' },
      ];

  return (
    <section className="py-14 sm:py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-2xl sm:text-3xl font-serif gradient-text text-center mb-10">
          {isEn
            ? 'Why choose a freelancer instead of a large web agency?'
            : 'Varför välja en frilansare istället för en stor webbyrå?'}
        </h2>
        <div className="grid sm:grid-cols-3 gap-6">
          {points.map((p, i) => (
            <motion.div
              key={i}
              className="glass-card rounded-2xl p-6 border border-border/30 text-center flex flex-col items-center gap-3"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <p.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-serif text-foreground text-lg">{p.title}</h3>
              <p className="text-sm text-muted-foreground">{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Kundcase ─── */
function CustomerCaseSection({ isEn }: { isEn: boolean }) {
  return (
    <section className="py-10 sm:py-14 px-4">
      <div className="container mx-auto max-w-2xl">
        <motion.div
          className="glass-card rounded-2xl border border-border/30 p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="shrink-0 w-56 sm:w-72">
            <div className="bg-muted rounded-lg overflow-hidden shadow-lg">
              <img
                src={djLoboMockup}
                alt={
                  isEn
                    ? 'Client case – DJ Lobo Producciones website built by Coffee Code Studio'
                    : 'DJ Lobo Producciones – kundcase hemsida byggd av Coffee Code Studio'
                }
                className="w-full h-auto block"
                loading="lazy"
                width="1080"
                height="675"
              />
            </div>
          </div>
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-3">
            <h3 className="text-sm font-mono text-primary tracking-widest uppercase">
              {isEn ? 'Happy client' : 'Nöjd kund'}
            </h3>
            <blockquote className="text-sm sm:text-base font-serif text-foreground italic leading-relaxed">
              {isEn
                ? '"Rami delivered quickly and professionally. The site is exactly what I needed."'
                : '"Rami levererade snabbt och professionellt. Sajten är exakt vad jag behövde."'}
            </blockquote>
            <p className="text-xs font-mono text-muted-foreground">— DJ Lobo Producciones</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── FAQ ─── */
const faqItems = (isEn: boolean) => [
  {
    q: isEn ? 'What does a website cost in Gothenburg?' : 'Vad kostar en hemsida i Göteborg?',
    a: isEn
      ? 'From SEK 4,900 as a one-time cost. Most small businesses land between SEK 4,900 and SEK 9,900 depending on the number of pages and features. You always get a fixed price before we start.'
      : 'Från 4 900 kr som engångskostnad. De flesta småföretag landar mellan 4 900 kr och 9 900 kr beroende på antal sidor och funktioner. Du får alltid ett fast pris innan vi börjar.',
  },
  {
    q: isEn ? 'How long does it take to get a website?' : 'Hur lång tid tar det att få en hemsida?',
    a: isEn
      ? 'Seven days from our first call to a live website, as long as you have text and images ready. Larger projects with a web shop take two to three weeks.'
      : 'Sju dagar från första samtalet till en live hemsida, förutsatt att du har text och bilder klara. Större projekt med webbshop tar två till tre veckor.',
  },
  {
    q: isEn ? 'Is there a monthly fee?' : 'Finns det någon månadsavgift?',
    a: isEn
      ? 'No. The price is a one-time cost. You only pay for your domain and hosting, roughly SEK 200 to 500 per year.'
      : 'Nej. Priset är en engångskostnad. Du betalar bara för din domän och hosting, cirka 200 till 500 kr per år.',
  },
  {
    q: isEn ? 'Can I update the website myself?' : 'Kan jag uppdatera hemsidan själv?',
    a: isEn
      ? 'Yes. You get a simple guide so you can change text, prices and images yourself, at no extra cost.'
      : 'Ja. Du får en enkel guide så att du kan ändra text, priser och bilder själv, utan extra kostnad.',
  },
  {
    q: isEn ? 'Do you work with businesses outside Gothenburg?' : 'Jobbar du med företag utanför Göteborg?',
    a: isEn
      ? 'Yes, everything can be handled remotely. But most of my clients are small businesses in Gothenburg and Västra Götaland.'
      : 'Ja, allt kan skötas på distans. Men de flesta av mina kunder är småföretag i Göteborg och Västra Götaland.',
  },
];

function FAQSectionLocal({ isEn }: { isEn: boolean }) {
  const items = faqItems(isEn);
  return (
    <section className="py-14 sm:py-20 px-4">
      <div className="container mx-auto max-w-3xl">
        <h2 className="text-2xl sm:text-3xl font-serif gradient-text text-center mb-10">
          {isEn ? 'Frequently asked questions' : 'Vanliga frågor'}
        </h2>
        <Accordion type="single" collapsible className="space-y-2">
          {items.map((item, i) => (
            <AccordionItem
              key={i}
              value={`faq-${i}`}
              className="glass-card rounded-xl border border-border/30 px-5 overflow-hidden"
            >
              <AccordionTrigger className="text-left text-sm font-medium text-foreground hover:no-underline py-4">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground pb-4">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

/* ─── Final CTA ─── */
function FinalCTA({ isEn }: { isEn: boolean }) {
  return (
    <section className="py-14 sm:py-20 px-4">
      <div className="container mx-auto max-w-2xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl sm:text-3xl font-serif gradient-text mb-6">
            {isEn
              ? 'Ready to get a website for your business?'
              : 'Redo att få en hemsida för ditt företag?'}
          </h2>
          <Button
            size="lg"
            className="glow-button bg-primary text-primary-foreground hover:bg-primary/90 text-sm sm:text-lg px-6 sm:px-8 py-4 sm:py-6 rounded-full font-medium max-w-full"
            onClick={scrollToContact}
          >
            {isEn ? 'Book a free consultation' : 'Boka gratis konsultation'}
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Page ─── */
function WebbyraContent() {
  const { pathname } = useLocation();
  const isEn = pathname.startsWith('/en');

  useEffect(() => {
    const localBusiness = {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: 'Coffee Code Studio',
      description: isEn
        ? 'Freelance web agency in Gothenburg building websites for small businesses. Fixed price from SEK 4,900, delivery within one week.'
        : 'Frilansande webbyrå i Göteborg som bygger hemsidor för småföretag. Fast pris från 4 900 kr, leverans inom en vecka.',
      url: `https://coffeecodestudio.se${isEn ? '/en' : ''}/webbyra-goteborg`,
      telephone: '+46738764299',
      email: 'hej@coffeecodestudio.se',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Gothenburg',
        addressCountry: 'SE',
      },
      areaServed: { '@type': 'City', name: 'Gothenburg' },
      priceRange: isEn ? 'from SEK 4,900' : 'från 4 900 kr',
      openingHoursSpecification: {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '17:00',
      },
    };

    const items = faqItems(isEn);
    const faqPage = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: items.map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: { '@type': 'Answer', text: item.a },
      })),
    };

    const scriptLB = document.createElement('script');
    scriptLB.id = 'webbyra-localbusiness-jsonld';
    scriptLB.type = 'application/ld+json';
    scriptLB.textContent = JSON.stringify(localBusiness);

    const scriptFAQ = document.createElement('script');
    scriptFAQ.id = 'webbyra-faq-jsonld';
    scriptFAQ.type = 'application/ld+json';
    scriptFAQ.textContent = JSON.stringify(faqPage);

    document.head.appendChild(scriptLB);
    document.head.appendChild(scriptFAQ);

    return () => {
      scriptLB.remove();
      scriptFAQ.remove();
    };
  }, [isEn]);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <SEOHead
        title={
          isEn
            ? 'Web Agency Gothenburg – Website from SEK 4,900 | Coffee Code Studio'
            : 'Webbyrå Göteborg – Hemsida från 4 900 kr | Coffee Code Studio'
        }
        description={
          isEn
            ? 'Freelance web agency in Gothenburg for small businesses. Fixed price from SEK 4,900, live within 7 days. Mobile-friendly, SEO and no monthly fees.'
            : 'Frilansande webbyrå i Göteborg för småföretag. Fast pris från 4 900 kr, live inom 7 dagar. Mobilanpassad, SEO och inga månadsavgifter.'
        }
      />
      <Navbar />
      <main>
        <Hero isEn={isEn} />
        <PriceSection isEn={isEn} />
        <TimelineSection isEn={isEn} />
        <IncludedSection isEn={isEn} />
        <WhyFreelanceSection isEn={isEn} />
        <CustomerCaseSection isEn={isEn} />
        <FAQSectionLocal isEn={isEn} />
        <FinalCTA isEn={isEn} />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}

export default function WebbyraGoteborg() {
  return (
    <LanguageProvider>
      <WebbyraContent />
    </LanguageProvider>
  );
}
