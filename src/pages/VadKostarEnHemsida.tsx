import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ContactSection } from '@/components/ContactSection';
import { SEOHead } from '@/components/SEOHead';
import { Button } from '@/components/ui/button';
import {
  CircleCheck,
  Clock,
  Banknote,
  ClipboardList,
  Layers,
  Palette,
  FileText,
  CalendarCheck,
  Search,
  Wrench,
} from 'lucide-react';
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
          {isEn ? 'What does a website cost in 2026?' : 'Vad kostar en hemsida 2026?'}
        </motion.h1>
        <motion.p
          className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          {isEn
            ? 'A website in Sweden costs between SEK 4,900 and SEK 25,000 depending on scope. At Coffee Code Studio you get a complete website from SEK 4,900, live within 7 days, with no monthly fees. Here is the full picture — what you pay for, what is included and what you can skip.'
            : 'En hemsida kostar mellan 4 900 kr och 25 000 kr i Sverige beroende på omfattning. Hos Coffee Code Studio får du en komplett hemsida från 4 900 kr, live inom 7 dagar, utan månadsavgifter. Här är hela prisbilden — vad du betalar för, vad som ingår och vad du kan hoppa över.'}
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

/* ─── Prisöversikt ─── */
function PriceSection({ isEn }: { isEn: boolean }) {
  const rows = isEn
    ? [
        {
          name: 'Simple website (one-page)',
          price: 'SEK 4,900',
          desc: 'Home page with services, about you, images and a contact form. Ready within 7 days.',
        },
        {
          name: 'Multi-page website',
          price: 'SEK 9,900',
          desc: 'Several pages, individual service pages, image gallery, Google setup and local SEO.',
        },
        {
          name: 'Custom',
          price: 'from SEK 14,900',
          desc: 'Booking, login, e-commerce or connections to other systems.',
        },
      ]
    : [
        {
          name: 'Enkel hemsida (one-page)',
          price: '4 900 kr',
          desc: 'Startsida med tjänster, om dig, bilder och kontaktformulär. Klar inom 7 dagar.',
        },
        {
          name: 'Flersidig hemsida',
          price: '9 900 kr',
          desc: 'Flera sidor, egna tjänstesidor, bildgalleri, Google-uppsättning och lokal SEO.',
        },
        {
          name: 'Skräddarsytt',
          price: 'från 14 900 kr',
          desc: 'Bokning, inloggning, e-handel eller kopplingar till andra system.',
        },
      ];

  return (
    <section className="py-14 sm:py-20 px-4">
      <div className="container mx-auto max-w-3xl">
        <h2 className="text-2xl sm:text-3xl font-serif gradient-text text-center mb-10">
          {isEn ? 'Price overview' : 'Prisöversikt'}
        </h2>
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

/* ─── Vad påverkar priset ─── */
function FactorsSection({ isEn }: { isEn: boolean }) {
  const factors = isEn
    ? [
        { icon: Layers, title: 'Number of pages', desc: 'One page or ten — the amount of content is the biggest single factor.' },
        { icon: Palette, title: 'Custom design or template', desc: 'A design built from scratch takes longer than adapting a proven layout.' },
        { icon: FileText, title: 'Text and images', desc: 'Do you write and photograph yourself, or should I produce it for you?' },
        { icon: CalendarCheck, title: 'Booking, payment or login', desc: 'Functions that handle customers or money always add development time.' },
        { icon: Search, title: 'SEO and Google setup', desc: 'Local searches, Google Business Profile and technical SEO from day one.' },
        { icon: Wrench, title: 'Maintenance afterwards', desc: 'Do you update the site yourself, or do you want ongoing help?' },
      ]
    : [
        { icon: Layers, title: 'Antal sidor', desc: 'En sida eller tio — mängden innehåll är den enskilt största faktorn.' },
        { icon: Palette, title: 'Egen design eller mall', desc: 'En design byggd från grunden tar längre tid än att anpassa en beprövad layout.' },
        { icon: FileText, title: 'Text och bilder', desc: 'Skriver och fotograferar du själv, eller ska jag ta fram det åt dig?' },
        { icon: CalendarCheck, title: 'Bokning, betalning eller inloggning', desc: 'Funktioner som hanterar kunder eller pengar tar alltid mer tid att bygga.' },
        { icon: Search, title: 'SEO och Google-uppsättning', desc: 'Lokala sökningar, Google-företagsprofil och teknisk SEO från dag ett.' },
        { icon: Wrench, title: 'Underhåll efteråt', desc: 'Uppdaterar du sidan själv, eller vill du ha löpande hjälp?' },
      ];

  return (
    <section className="py-14 sm:py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-2xl sm:text-3xl font-serif gradient-text text-center mb-10">
          {isEn ? 'What affects the price?' : 'Vad påverkar priset?'}
        </h2>
        <div className="grid sm:grid-cols-3 gap-6">
          {factors.map((f, i) => (
            <motion.div
              key={i}
              className="glass-card rounded-2xl p-6 border border-border/30 text-center flex flex-col items-center gap-3"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <f.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-serif text-foreground text-lg">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Löpande kostnader ─── */
function RunningCostSection({ isEn }: { isEn: boolean }) {
  const compare = isEn
    ? [
        { name: 'Web agency', price: 'SEK 25,000–80,000', desc: 'Larger teams, longer projects and higher overhead.' },
        { name: 'Freelancer', price: 'SEK 8,000–30,000', desc: 'Varies a lot with experience and scope.' },
        { name: 'Website builder', price: 'SEK 100–500 / month', desc: 'Cheap monthly fee — but you do all the work yourself.' },
      ]
    : [
        { name: 'Webbyrå', price: '25 000–80 000 kr', desc: 'Större team, längre projekt och högre omkostnader.' },
        { name: 'Frilansare', price: '8 000–30 000 kr', desc: 'Varierar mycket med erfarenhet och omfattning.' },
        { name: 'Hemsidebyggare', price: '100–500 kr/mån', desc: 'Billig månadsavgift — men du gör hela jobbet själv.' },
      ];

  return (
    <section className="py-14 sm:py-20 px-4">
      <div className="container mx-auto max-w-3xl">
        <h2 className="text-2xl sm:text-3xl font-serif gradient-text text-center mb-4">
          {isEn ? 'What does it cost per month?' : 'Vad kostar det per månad?'}
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground text-center max-w-2xl mx-auto mb-10">
          {isEn
            ? 'The website itself is a one-time cost. The only recurring costs are a domain (roughly SEK 150–300 per year) and hosting (SEK 0–500 per year). I charge no monthly fees.'
            : 'Själva hemsidan är en engångskostnad. Det enda som återkommer är domän (cirka 150–300 kr/år) och hosting (0–500 kr/år). Jag tar inga månadsavgifter.'}
        </p>
        <div className="grid sm:grid-cols-3 gap-6">
          {compare.map((c, i) => (
            <motion.div
              key={i}
              className="glass-card rounded-2xl p-6 border border-border/30 flex flex-col gap-2"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <h3 className="font-serif text-lg text-foreground">{c.name}</h3>
              <p className="text-base font-semibold text-primary">{c.price}</p>
              <p className="text-sm text-muted-foreground">{c.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Vad ingår alltid ─── */
function IncludedSection({ isEn }: { isEn: boolean }) {
  const features = isEn
    ? [
        'Responsive design for mobile',
        'Contact form straight to your email',
        'Basic SEO so you can be found on Google',
        'SSL and fast loading',
        'Cookie banner in line with GDPR',
        'A walkthrough so you can update texts yourself',
      ]
    : [
        'Responsiv design för mobil',
        'Kontaktformulär till din mejl',
        'Grundläggande SEO så att du hittas på Google',
        'SSL och snabb laddning',
        'Cookie-banner enligt GDPR',
        'Genomgång så du kan uppdatera texter själv',
      ];

  return (
    <section className="py-14 sm:py-20 px-4">
      <div className="container mx-auto max-w-2xl">
        <h2 className="text-2xl sm:text-3xl font-serif gradient-text text-center mb-10">
          {isEn ? 'What is always included' : 'Vad ingår alltid hos mig'}
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

/* ─── Tidslinje ─── */
function TimelineSection({ isEn }: { isEn: boolean }) {
  const steps = isEn
    ? [
        { icon: Clock, title: 'Day 1 — call and content', desc: 'A 30-minute call. I collect your texts, images and goals.' },
        { icon: Banknote, title: 'Day 2–4 — design and build', desc: 'You get a live link and can follow the work as it grows.' },
        { icon: ClipboardList, title: 'Day 5–6 — your changes', desc: 'You review everything and I adjust until it feels right.' },
        { icon: CircleCheck, title: 'Day 7 — live', desc: 'Domain, forms and Google setup. Your website is online.' },
      ]
    : [
        { icon: Clock, title: 'Dag 1 — samtal och innehåll', desc: 'Ett 30 minuters samtal. Jag samlar in dina texter, bilder och mål.' },
        { icon: Banknote, title: 'Dag 2–4 — design och bygge', desc: 'Du får en live-länk och kan följa arbetet medan det växer fram.' },
        { icon: ClipboardList, title: 'Dag 5–6 — dina ändringar', desc: 'Du går igenom allt och jag justerar tills det känns rätt.' },
        { icon: CircleCheck, title: 'Dag 7 — live', desc: 'Domän, formulär och Google-uppsättning. Din hemsida är online.' },
      ];

  return (
    <section className="py-14 sm:py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-2xl sm:text-3xl font-serif gradient-text text-center mb-10">
          {isEn ? 'How fast do you get your website?' : 'Hur snabbt får du din hemsida?'}
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, i) => (
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

/* ─── FAQ ─── */
const faqItems = (isEn: boolean) => [
  {
    q: isEn ? 'What does a simple website cost?' : 'Vad kostar en enkel hemsida?',
    a: isEn
      ? 'From SEK 4,900 as a one-time cost for a complete one-page website, live within one week.'
      : 'Från 4 900 kr som engångskostnad för en komplett one-page hemsida, live inom en vecka.',
  },
  {
    q: isEn ? 'Are there any monthly fees?' : 'Finns det månadsavgifter?',
    a: isEn
      ? 'No. You only pay for domain and hosting, roughly SEK 200 to 500 per year. I charge no monthly fees.'
      : 'Nej. Du betalar bara för domän och hosting, cirka 200 till 500 kr per år. Jag tar inga månadsavgifter.',
  },
  {
    q: isEn ? 'What does a website with booking cost?' : 'Vad kostar en hemsida med bokning?',
    a: isEn
      ? 'From SEK 14,900 depending on which booking system you want and how it should connect to your calendar.'
      : 'Från 14 900 kr beroende på vilket bokningssystem du vill ha och hur det ska kopplas till din kalender.',
  },
  {
    q: isEn ? 'Can I update the text myself afterwards?' : 'Kan jag uppdatera texten själv efteråt?',
    a: isEn
      ? 'Yes. You get a walkthrough and can change texts and images yourself — at no extra cost.'
      : 'Ja. Du får en genomgång och kan ändra texter och bilder själv — utan extra kostnad.',
  },
  {
    q: isEn ? 'What does it cost to redo an old website?' : 'Vad kostar det att göra om en gammal hemsida?',
    a: isEn
      ? 'Usually the same as a new one, from SEK 4,900, and I move your existing content across.'
      : 'Oftast samma som en ny, från 4 900 kr, och jag flyttar över befintligt innehåll.',
  },
  {
    q: isEn ? 'How do I pay?' : 'Hur betalar jag?',
    a: isEn
      ? 'By invoice. Contact me if you would like a different arrangement.'
      : 'Med faktura. Kontakta mig om du vill ha ett annat upplägg.',
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
            {isEn ? 'Your website live within a week' : 'Din hemsida live inom en vecka'}
          </h2>
          <Button
            size="lg"
            className="glow-button bg-primary text-primary-foreground hover:bg-primary/90 text-sm sm:text-lg px-6 sm:px-8 py-4 sm:py-6 rounded-full font-medium max-w-full"
            onClick={scrollToContact}
          >
            {isEn ? 'Get a price for your website' : 'Få pris på din hemsida'}
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Page ─── */
function VadKostarEnHemsidaContent() {
  const { pathname } = useLocation();
  const isEn = pathname.startsWith('/en');

  useEffect(() => {
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

    const scriptFAQ = document.createElement('script');
    scriptFAQ.id = 'vad-kostar-en-hemsida-faq-jsonld';
    scriptFAQ.type = 'application/ld+json';
    scriptFAQ.textContent = JSON.stringify(faqPage);
    document.head.appendChild(scriptFAQ);

    return () => {
      scriptFAQ.remove();
    };
  }, [isEn]);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <SEOHead
        title={
          isEn
            ? 'What Does a Website Cost in 2026? Prices from SEK 4,900 | Coffee Code Studio'
            : 'Vad kostar en hemsida 2026? Priser från 4 900 kr | Coffee Code Studio'
        }
        description={
          isEn
            ? 'What does a website cost? Prices from SEK 4,900 with no monthly fees. Full price overview, what affects the cost and what is always included. Live within 7 days.'
            : 'Vad kostar en hemsida? Priser från 4 900 kr utan månadsavgifter. Hela prisbilden, vad som påverkar kostnaden och vad som alltid ingår. Live inom 7 dagar.'
        }
      />
      <Navbar />
      <main>
        <Hero isEn={isEn} />
        <PriceSection isEn={isEn} />
        <FactorsSection isEn={isEn} />
        <RunningCostSection isEn={isEn} />
        <IncludedSection isEn={isEn} />
        <TimelineSection isEn={isEn} />
        <FAQSectionLocal isEn={isEn} />
        <FinalCTA isEn={isEn} />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}

export default function VadKostarEnHemsida() {
  return (
    <LanguageProvider>
      <VadKostarEnHemsidaContent />
    </LanguageProvider>
  );
}
