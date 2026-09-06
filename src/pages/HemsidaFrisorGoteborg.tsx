import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import salonPreview from '@/assets/salon-preview.jpg';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ContactSection } from '@/components/ContactSection';
import { SEOHead } from '@/components/SEOHead';
import { Button } from '@/components/ui/button';
import { CircleCheck, Clock, Banknote, CalendarCheck, Images, Search } from 'lucide-react';
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
            ? 'Website for hairdressers in Gothenburg'
            : 'Hemsida för frisör i Göteborg'}
        </motion.h1>
        <motion.p
          className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          {isEn
            ? 'A website for a hairdresser in Gothenburg costs SEK 4,900 at Coffee Code Studio and is live within 7 days. It includes a price list, opening hours, an image gallery and a booking button linked to BokaDirekt or your own system — so more customers find you and book directly.'
            : 'En hemsida för frisör i Göteborg kostar 4 900 kr hos Coffee Code Studio och är live inom 7 dagar. Den innehåller prislista, öppettider, bildgalleri och en bokningsknapp kopplad till BokaDirekt eller ditt eget system — så att fler kunder hittar dig och bokar direkt.'}
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

/* ─── Pris ─── */
function PriceSection({ isEn }: { isEn: boolean }) {
  const rows = isEn
    ? [
        { name: 'Salon Starter', price: 'SEK 4,900', desc: 'One-page site with price list, opening hours, gallery and booking button' },
        { name: 'Salon Plus', price: 'SEK 9,900', desc: 'Several pages, staff presentations, treatment pages and Google setup' },
        { name: 'Custom', price: 'from SEK 14,900', desc: 'Online booking system, gift cards or product sales' },
      ]
    : [
        { name: 'Salong Starter', price: '4 900 kr', desc: 'One-page med prislista, öppettider, galleri och bokningsknapp' },
        { name: 'Salong Plus', price: '9 900 kr', desc: 'Flera sidor, personalpresentation, behandlingssidor och Google-uppsättning' },
        { name: 'Skräddarsytt', price: 'från 14 900 kr', desc: 'Onlinebokning, presentkort eller produktförsäljning' },
      ];

  return (
    <section className="py-14 sm:py-20 px-4">
      <div className="container mx-auto max-w-3xl">
        <h2 className="text-2xl sm:text-3xl font-serif gradient-text text-center mb-4">
          {isEn
            ? 'What does a website for a hairdresser in Gothenburg cost?'
            : 'Vad kostar en hemsida för frisör i Göteborg?'}
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground text-center max-w-2xl mx-auto mb-10">
          {isEn
            ? 'SEK 4,900 as a one-time cost for a complete salon website. No monthly fees — you only pay for your domain and hosting, roughly SEK 200 to 500 per year.'
            : '4 900 kr som engångskostnad för en komplett salongshemsida. Inga månadsavgifter — du betalar bara för domän och hosting, cirka 200 till 500 kr per år.'}
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

/* ─── Bokning ─── */
function BookingSection({ isEn }: { isEn: boolean }) {
  const points = isEn
    ? [
        { icon: CalendarCheck, title: 'Booking button', desc: 'Linked to BokaDirekt, Bokadirekt-alternatives, Calendly or your own system.' },
        { icon: Images, title: 'Image gallery', desc: 'Show your best work — cuts, colours and the salon itself.' },
        { icon: Search, title: 'Found on Google', desc: 'Optimised for searches like "frisör Göteborg" plus Google Business Profile setup.' },
      ]
    : [
        { icon: CalendarCheck, title: 'Bokningsknapp', desc: 'Kopplad till BokaDirekt, Calendly eller ditt eget bokningssystem.' },
        { icon: Images, title: 'Bildgalleri', desc: 'Visa ditt bästa arbete — klippningar, färgningar och salongen.' },
        { icon: Search, title: 'Syns på Google', desc: 'Optimerad för sökningar som "frisör Göteborg" plus uppsättning av Google-företagsprofil.' },
      ];

  return (
    <section className="py-14 sm:py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-2xl sm:text-3xl font-serif gradient-text text-center mb-10">
          {isEn
            ? 'Can customers book directly on the website?'
            : 'Kan kunder boka tid direkt på hemsidan?'}
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

/* ─── Preview ─── */
function PreviewSection({ isEn }: { isEn: boolean }) {
  return (
    <section className="py-10 sm:py-14 px-4">
      <div className="container mx-auto max-w-2xl">
        <motion.div
          className="glass-card rounded-2xl border border-border/30 p-6 sm:p-8 flex flex-col items-center gap-5"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-sm font-mono text-primary tracking-widest uppercase">
            {isEn ? 'Preview – not a real client' : 'Preview – inte en riktig kund'}
          </h3>
          <div className="bg-muted rounded-lg overflow-hidden shadow-lg w-full">
            <img
              src={salonPreview}
              alt={
                isEn
                  ? 'Example of a hairdresser website in Gothenburg with price list and booking button'
                  : 'Exempel på hemsida för frisör i Göteborg med prislista och bokningsknapp'
              }
              className="w-full h-auto block"
              loading="lazy"
              width="1024"
              height="768"
            />
          </div>
          <p className="text-sm text-muted-foreground italic text-center">
            {isEn
              ? "An example of what your salon's website could look like. I build it to your wishes — delivery within 7 days."
              : 'Ett exempel på hur din salongs hemsida skulle kunna se ut. Jag bygger den efter dina önskemål — leverans inom 7 dagar.'}
          </p>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Vad ingår ─── */
function IncludedSection({ isEn }: { isEn: boolean }) {
  const features = isEn
    ? [
        'Price list for cuts, colours and treatments',
        'Opening hours and address with a map',
        'Image gallery of your work',
        'Booking button to your booking system',
        'Contact form straight to your inbox',
        'Mobile-friendly — most customers search on their phone',
        'SEO for local searches in Gothenburg',
        'A simple guide so you can change prices and images yourself',
      ]
    : [
        'Prislista för klippning, färgning och behandlingar',
        'Öppettider och adress med karta',
        'Bildgalleri på ditt arbete',
        'Bokningsknapp till ditt bokningssystem',
        'Kontaktformulär direkt till din inkorg',
        'Mobilanpassad — de flesta kunder söker i mobilen',
        'SEO för lokala sökningar i Göteborg',
        'En enkel guide så att du kan ändra priser och bilder själv',
      ];

  return (
    <section className="py-14 sm:py-20 px-4">
      <div className="container mx-auto max-w-2xl">
        <h2 className="text-2xl sm:text-3xl font-serif gradient-text text-center mb-10">
          {isEn
            ? 'What is included in a salon website?'
            : 'Vad ingår i en hemsida för salong?'}
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
        { icon: Clock, title: 'Day 1 — briefing', desc: 'A 30-minute call. I collect prices, images and opening hours.' },
        { icon: Banknote, title: 'Day 2–5 — build', desc: 'You get a live link to follow the work and give feedback.' },
        { icon: CalendarCheck, title: 'Day 6–7 — launch', desc: 'Domain, booking link and Google setup. The salon is online.' },
      ]
    : [
        { icon: Clock, title: 'Dag 1 — genomgång', desc: 'Ett 30 minuters samtal. Jag samlar in priser, bilder och öppettider.' },
        { icon: Banknote, title: 'Dag 2–5 — bygge', desc: 'Du får en live-länk för att följa arbetet och ge feedback.' },
        { icon: CalendarCheck, title: 'Dag 6–7 — publicering', desc: 'Domän, bokningslänk och Google-uppsättning. Salongen är online.' },
      ];

  return (
    <section className="py-14 sm:py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-2xl sm:text-3xl font-serif gradient-text text-center mb-10">
          {isEn
            ? 'How fast can my salon get a website?'
            : 'Hur snabbt kan min salong få en hemsida?'}
        </h2>
        <div className="grid sm:grid-cols-3 gap-6">
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
    q: isEn
      ? 'What does a website for a hairdresser in Gothenburg cost?'
      : 'Vad kostar en hemsida för frisör i Göteborg?',
    a: isEn
      ? 'SEK 4,900 as a one-time cost for a complete salon website with price list, gallery and booking button. Larger sites with several pages cost SEK 9,900.'
      : '4 900 kr som engångskostnad för en komplett salongshemsida med prislista, galleri och bokningsknapp. Större sidor med flera undersidor kostar 9 900 kr.',
  },
  {
    q: isEn ? 'How long does it take?' : 'Hur lång tid tar det?',
    a: isEn
      ? '7 days from our first call to a live website, as long as you have prices and images ready.'
      : '7 dagar från första samtalet till en live hemsida, förutsatt att du har priser och bilder klara.',
  },
  {
    q: isEn
      ? 'Can customers book directly through the website?'
      : 'Kan kunder boka tid direkt via hemsidan?',
    a: isEn
      ? 'Yes. I connect a booking button to BokaDirekt, Calendly or whichever system you already use, at no extra cost.'
      : 'Ja. Jag kopplar en bokningsknapp till BokaDirekt, Calendly eller det system du redan använder, utan extra kostnad.',
  },
  {
    q: isEn
      ? 'Can I update prices and images myself?'
      : 'Kan jag ändra priser och bilder själv?',
    a: isEn
      ? 'Yes. You get a simple guide so you can update the price list, opening hours and gallery yourself — no extra costs.'
      : 'Ja. Du får en enkel guide så att du kan uppdatera prislista, öppettider och galleri själv — inga extra kostnader.',
  },
  {
    q: isEn
      ? 'Will my salon show up on Google?'
      : 'Kommer min salong att synas på Google?',
    a: isEn
      ? 'The website is built for local searches such as "frisör Göteborg", and I also set up your Google Business Profile so you appear on Google Maps.'
      : 'Hemsidan byggs för lokala sökningar som "frisör Göteborg", och jag sätter även upp din Google-företagsprofil så att du syns på Google Maps.',
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
            {isEn ? 'Ready to take your salon online?' : 'Redo att ta din salong online?'}
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
function HemsidaFrisorContent() {
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
    scriptFAQ.id = 'hemsida-frisor-faq-jsonld';
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
            ? 'Website for Hairdressers in Gothenburg – SEK 4,900 | Coffee Code Studio'
            : 'Hemsida för frisör i Göteborg – 4 900 kr | Coffee Code Studio'
        }
        description={
          isEn
            ? 'Website for hairdressers and salons in Gothenburg. Fixed price SEK 4,900, live within 7 days. Price list, gallery, booking button and local SEO.'
            : 'Hemsida för frisör och salong i Göteborg. Fast pris 4 900 kr, live inom 7 dagar. Prislista, bildgalleri, bokningsknapp och lokal SEO.'
        }
      />
      <Navbar />
      <main>
        <Hero isEn={isEn} />
        <PriceSection isEn={isEn} />
        <BookingSection isEn={isEn} />
        <PreviewSection isEn={isEn} />
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

export default function HemsidaFrisorGoteborg() {
  return (
    <LanguageProvider>
      <HemsidaFrisorContent />
    </LanguageProvider>
  );
}
