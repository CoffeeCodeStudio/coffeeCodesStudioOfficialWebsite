// DISABLED — Business SEO page. Not part of portfolio. Route removed from App.tsx.
import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import djLoboMockup from '@/assets/djlobo-mockup.webp';
import salonPreview from '@/assets/salon-preview.jpg';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ContactSection } from '@/components/ContactSection';
import { SEOHead } from '@/components/SEOHead';
import { Button } from '@/components/ui/button';
import { CircleCheck, Clock, Banknote, Pencil, MessageSquareQuote } from 'lucide-react';
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
            ? 'A website that brings new customers to your salon'
            : 'En hemsida som lockar nya kunder till din salong'}
        </motion.h1>
        <motion.p
          className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          {isEn
            ? 'I build a modern, mobile-friendly website for hairdressers in Gothenburg. Including price list, image gallery and booking button – live within 7 days.'
            : 'Jag bygger en modern, mobilvänlig hemsida för frisörer i Göteborg. Inklusive prislista, bildgalleri och bokningsknapp – live inom 7 dagar.'}
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

/* ─── Salon Preview Mockup ─── */
function SalonPreviewSection({ isEn }: { isEn: boolean }) {
  return (
    <section className="pb-14 sm:pb-20 px-4">
      <div className="container mx-auto max-w-2xl">
        <h2 className="text-2xl sm:text-3xl font-serif gradient-text text-center mb-8">
          {isEn ? 'What I can build for you' : 'Vad jag kan bygga åt dig'}
        </h2>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Laptop bezel */}
          <div className="relative w-11/12 sm:w-10/12 mx-auto">
            <div className="bg-muted rounded-t-xl pt-3 px-3 pb-0 shadow-2xl">
              <div className="flex items-center gap-1.5 mb-2 px-1">
                <div className="w-2 h-2 rounded-full bg-red-500/60" />
                <div className="w-2 h-2 rounded-full bg-yellow-500/60" />
                <div className="w-2 h-2 rounded-full bg-green-500/60" />
                <span className="ml-3 text-[10px] text-muted-foreground/50 font-mono truncate">
                  din-salong.se
                </span>
              </div>
              <div className="rounded-t-sm overflow-hidden relative">
                <span className="absolute top-2 right-2 z-10 text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                  {isEn ? 'Preview – not a real client' : 'Preview – inte en riktig kund'}
                </span>
                <img
                  src={salonPreview}
                  alt={
                    isEn
                      ? 'Example of a hairdresser website in Gothenburg – preview of a modern salon page'
                      : 'Exempel på hemsida frisör göteborg – preview av en modern salongsida'
                  }
                  className="w-full h-auto block"
                  loading="lazy"
                  width="960"
                  height="600"
                />
              </div>
            </div>
            <div
              className="bg-muted h-3 rounded-b-lg mx-auto overflow-hidden"
              style={{ width: 'calc(100% + 20px)', marginLeft: '-10px', maxWidth: '110%' }}
            />
            <div className="bg-muted/80 h-1.5 rounded-b-xl mx-auto" style={{ width: '40%' }} />
          </div>

          <p className="text-sm text-muted-foreground text-center mt-6 max-w-lg mx-auto leading-relaxed italic">
            {isEn
              ? 'An example of what your salon\'s website could look like. I build it to your wishes – delivery within 7 days.'
              : 'Ett exempel på hur din salongs hemsida skulle kunna se ut. Jag bygger den efter dina önskemål – leverans inom 7 dagar.'}
          </p>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── DJ Lobo – Nöjd kund ─── */
function CustomerCaseSection({ isEn }: { isEn: boolean }) {
  const [imageError, setImageError] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <section className="py-10 sm:py-14 px-4" ref={ref}>
      <div className="container mx-auto max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="glass-card rounded-2xl border border-border/30 p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6"
        >
          {/* Small mockup */}
          <div className="shrink-0 w-56 sm:w-72">
            <div className="bg-muted rounded-lg overflow-hidden shadow-lg">
              {!imageError ? (
                <img
                  src={djLoboMockup}
                  alt={isEn ? 'Client case – DJ Lobo Producciones website' : 'DJ Lobo Producciones – kundcase hemsida'}
                  className="w-full h-auto block"
                  loading="lazy"
                  width="1080"
                  height="675"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-full aspect-[16/10] bg-gradient-to-br from-primary/15 via-primary/5 to-background flex items-center justify-center">
                  <span className="text-muted-foreground text-xs">djlobo-producciones.com</span>
                </div>
              )}
            </div>
          </div>

          {/* Quote */}
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-3">
            <h3 className="text-sm font-mono text-primary tracking-widest uppercase">
              {isEn ? 'Happy client' : 'Nöjd kund'}
            </h3>
            <MessageSquareQuote className="w-4 h-4 text-primary/50" />
            <blockquote className="text-sm sm:text-base font-serif text-foreground italic leading-relaxed">
              {isEn
                ? '"Rami delivered quickly and professionally. The site is exactly what I needed."'
                : '"Rami levererade snabbt och professionellt. Sajten är exakt vad jag behövde."'}
            </blockquote>
            <p className="text-xs font-mono text-muted-foreground">
              — DJ Lobo Producciones
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Benefits ─── */
const benefits = (isEn: boolean) => [
  { icon: Clock, title: isEn ? 'Fast delivery' : 'Snabb leverans', desc: isEn ? 'Online within a week' : 'Online på en vecka' },
  { icon: Banknote, title: isEn ? 'Fixed price SEK 4,900' : 'Fast pris 4 900 kr', desc: isEn ? 'No hidden fees' : 'Inga dolda avgifter' },
  { icon: Pencil, title: isEn ? 'Update it yourself' : 'Uppdatera själv', desc: isEn ? 'You can easily update prices and images yourself' : 'Du kan enkelt uppdatera priser och bilder själv' },
];

function BenefitsSection({ isEn }: { isEn: boolean }) {
  return (
    <section className="py-14 sm:py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-2xl sm:text-3xl font-serif gradient-text text-center mb-10">
          {isEn
            ? 'Why hairdressers in Gothenburg choose Coffee Code Studio'
            : 'Därför väljer frisörer i Göteborg Coffee Code Studio'}
        </h2>
        <div className="grid sm:grid-cols-3 gap-6">
          {benefits(isEn).map((b, i) => (
            <motion.div
              key={i}
              className="glass-card rounded-2xl p-6 border border-border/30 text-center flex flex-col items-center gap-3"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <b.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-serif text-foreground text-lg">{b.title}</h3>
              <p className="text-sm text-muted-foreground">{b.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Pricing (Starter focus) ─── */
function StarterPricing({ isEn }: { isEn: boolean }) {
  const features = isEn
    ? [
        'Responsive one-page design',
        'Price list & opening hours',
        'Image gallery',
        'Booking button (BokaDirekt, Calendly etc.)',
        'Contact form',
        'SEO-optimized',
      ]
    : [
        'Responsiv one-page-design',
        'Prislista & öppettider',
        'Bildgalleri',
        'Bokningsknapp (BokaDirekt, Calendly m.fl.)',
        'Kontaktformulär',
        'SEO-optimerad',
      ];

  return (
    <section className="py-14 sm:py-20 px-4 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="container mx-auto max-w-md relative z-10">
        <h2 className="text-2xl sm:text-3xl font-serif gradient-text text-center mb-10">
          {isEn ? 'The Starter package' : 'Starter-paketet'}
        </h2>
        <motion.div
          className="glass-card rounded-2xl p-8 border border-primary/30 shadow-lg shadow-primary/10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-6">
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-4xl font-bold text-primary">4 900</span>
              <span className="text-muted-foreground text-sm">kr</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {isEn ? 'One-time cost · no monthly fees' : 'Engångskostnad · inga månadskostnader'}
            </p>
          </div>
          <ul className="space-y-3 mb-6">
            {features.map((f, i) => (
              <li key={i} className="flex items-center gap-2.5 text-sm">
                <CircleCheck className="w-4 h-4 text-primary shrink-0" />
                <span className="text-foreground/80">{f}</span>
              </li>
            ))}
          </ul>
          <Button
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl py-3"
            onClick={scrollToContact}
          >
            {isEn ? 'Book a free consultation' : 'Boka gratis konsultation'}
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── FAQ ─── */
const faqItems = (isEn: boolean) => [
  {
    q: isEn ? 'Can I show my prices and opening hours?' : 'Kan jag visa mina priser och öppettider?',
    a: isEn
      ? 'Yes, all of this is included. Your website gets a clear price list and opening hours that you can easily update.'
      : 'Ja, allt detta ingår. Din hemsida får en tydlig prislista och öppettider som du enkelt kan uppdatera.',
  },
  {
    q: isEn ? 'Can customers book directly through the website?' : 'Kan kunder boka tid direkt via hemsidan?',
    a: isEn
      ? 'Yes, we integrate your booking system, e.g. BokaDirekt or Calendly, so customers can book directly.'
      : 'Ja, vi integrerar ditt bokningssystem, t.ex. BokaDirekt eller Calendly, så att kunder kan boka direkt.',
  },
  {
    q: isEn ? 'What if I want to change images later?' : 'Vad händer om jag vill byta bilder senare?',
    a: isEn
      ? 'You get a simple guide so you can update everything yourself — no extra costs.'
      : 'Du får en enkel guide så att du kan uppdatera allt själv — inga extra kostnader.',
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
function FrisorContent() {
  const { pathname } = useLocation();
  const isEn = pathname.startsWith('/en');

  useEffect(() => {
    const localBusiness = {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: 'Coffee Code Studio',
      description: isEn
        ? 'Professional website for hairdressers and salons in Gothenburg. Fixed price SEK 4,900, delivery within one week.'
        : 'Professionell hemsida för frisörer och salonger i Göteborg. Fast pris 4 900 kr, leverans inom en vecka.',
      url: `https://coffeecodestudio.se${isEn ? '/en' : ''}/frisor-goteborg`,
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
    scriptLB.id = 'frisor-localbusiness-jsonld';
    scriptLB.type = 'application/ld+json';
    scriptLB.textContent = JSON.stringify(localBusiness);

    const scriptFAQ = document.createElement('script');
    scriptFAQ.id = 'frisor-faq-jsonld';
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
            ? 'Website for hairdressers in Gothenburg | Ready in 7 days | Coffee Code Studio'
            : 'Hemsida för frisörer i Göteborg | Klar på 7 dagar | Coffee Code Studio'
        }
        description={
          isEn
            ? 'Professional website for hairdressers and salons in Gothenburg. Fixed price SEK 4,900, delivery within a week. Mobile-friendly, booking system and SEO. Book a free consultation.'
            : 'Professionell hemsida för frisörer och salonger i Göteborg. Fast pris 4 900 kr, leverans inom en vecka. Mobilvänlig, bokningssystem och SEO. Boka gratis konsultation.'
        }
      />
      <Navbar />
      <main>
        <Hero isEn={isEn} />
        <SalonPreviewSection isEn={isEn} />
        <CustomerCaseSection isEn={isEn} />
        <BenefitsSection isEn={isEn} />
        <StarterPricing isEn={isEn} />
        <FAQSectionLocal isEn={isEn} />
        <FinalCTA isEn={isEn} />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}

export default function FrisorGoteborg() {
  return (
    <LanguageProvider>
      <FrisorContent />
    </LanguageProvider>
  );
}
