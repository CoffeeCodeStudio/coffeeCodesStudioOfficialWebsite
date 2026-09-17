// DISABLED — Business SEO page. Not part of portfolio. Route removed from App.tsx.
import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import djLoboMockup from '@/assets/djlobo-mockup.webp';
import smaforetagPreview from '@/assets/smaforetag-preview.jpg';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ContactSection } from '@/components/ContactSection';
import { SEOHead } from '@/components/SEOHead';
import { Button } from '@/components/ui/button';
import { CircleCheck, Coffee, Palette, BarChart3, Hammer, ThumbsUp, MessageSquareQuote } from 'lucide-react';
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
            ? 'A website that fills your calendar — delivered in 7 days'
            : 'En hemsida som fyller din kalender – levererad på 7 dagar'}
        </motion.h1>
        <motion.p
          className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          {isEn
            ? 'I build a modern, mobile-friendly website for small businesses in Gothenburg. Includes contact form, booking and SEO — fixed price SEK 4,900.'
            : 'Jag bygger en modern och mobilvänlig hemsida för småföretag i Göteborg. Inkluderar kontaktformulär, bokning och SEO – fast pris 4 900 kr.'}
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

/* ─── Business Preview Mockup ─── */
function BusinessPreviewSection({ isEn }: { isEn: boolean }) {
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
          <div className="relative w-11/12 sm:w-10/12 mx-auto">
            <div className="bg-muted rounded-t-xl pt-3 px-3 pb-0 shadow-2xl">
              <div className="flex items-center gap-1.5 mb-2 px-1">
                <div className="w-2 h-2 rounded-full bg-red-500/60" />
                <div className="w-2 h-2 rounded-full bg-yellow-500/60" />
                <div className="w-2 h-2 rounded-full bg-green-500/60" />
                <span className="ml-3 text-[10px] text-muted-foreground/50 font-mono truncate">
                  ditt-foretag.se
                </span>
              </div>
              <div className="rounded-t-sm overflow-hidden relative">
                <span className="absolute top-2 right-2 z-10 text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                  {isEn ? 'Preview — not a real client' : 'Preview – inte en riktig kund'}
                </span>
                <img
                  src={smaforetagPreview}
                  alt={
                    isEn
                      ? 'Example website for small business Gothenburg – preview of a modern business page'
                      : 'Exempel på hemsida småföretag göteborg – preview av en modern företagssida'
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
              ? 'An example of what your company website could look like. I build it according to your wishes — delivery within 7 days.'
              : 'Ett exempel på hur ditt företags hemsida skulle kunna se ut. Jag bygger den efter dina önskemål – leverans inom 7 dagar.'}
          </p>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── DJ Lobo Case ─── */
function CaseSection({ isEn }: { isEn: boolean }) {
  const [imageError, setImageError] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <section className="pb-14 sm:pb-20 px-4" ref={ref}>
      <div className="container mx-auto max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="relative w-11/12 sm:w-10/12 mx-auto">
            <div className="bg-muted rounded-t-xl pt-3 px-3 pb-0 shadow-2xl">
              <div className="flex items-center gap-1.5 mb-2 px-1">
                <div className="w-2 h-2 rounded-full bg-red-500/60" />
                <div className="w-2 h-2 rounded-full bg-yellow-500/60" />
                <div className="w-2 h-2 rounded-full bg-green-500/60" />
                <span className="ml-3 text-[10px] text-muted-foreground/50 font-mono truncate">
                  djlobo-producciones.com
                </span>
              </div>
              <div className="rounded-t-sm overflow-hidden">
                {!imageError ? (
                  <img
                    src={djLoboMockup}
                    alt={isEn ? 'Client case – DJ Lobo Producciones website' : 'Kundcase – DJ Lobo Producciones hemsida'}
                    className="w-full h-auto block"
                    loading="lazy"
                    width="1080"
                    height="675"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className="w-full aspect-[16/10] bg-gradient-to-br from-primary/15 via-primary/5 to-background flex items-center justify-center">
                    <span className="text-muted-foreground text-sm">djlobo-producciones.com</span>
                  </div>
                )}
              </div>
            </div>
            <div
              className="bg-muted h-3 rounded-b-lg mx-auto overflow-hidden"
              style={{ width: 'calc(100% + 20px)', marginLeft: '-10px', maxWidth: '110%' }}
            />
            <div className="bg-muted/80 h-1.5 rounded-b-xl mx-auto" style={{ width: '40%' }} />
          </div>

          <p className="text-sm text-muted-foreground font-mono text-center mt-4">
            {isEn
              ? 'Example of a client case with booking system — delivered in 5 days.'
              : 'Exempel på kundcase med bokningssystem – levererat på 5 dagar.'}
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 text-center">
            <MessageSquareQuote className="w-5 h-5 text-primary/60" />
            <blockquote className="text-base sm:text-lg font-serif text-foreground italic leading-relaxed max-w-xl">
              {isEn
                ? '"Rami delivered quickly and professionally. The site is exactly what I needed — easy to update and looks professional."'
                : '"Rami levererade snabbt och professionellt. Sajten är exakt vad jag behövde — enkel att uppdatera och ser proffsig ut."'}
            </blockquote>
            <p className="text-sm font-mono text-primary tracking-wide">
              — DJ Lobo, DJ Lobo Producciones
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Benefits ─── */
const benefits = (isEn: boolean) => [
  {
    icon: Coffee,
    title: isEn ? 'Live in 7 days' : 'Live på 7 dagar',
    desc: isEn
      ? 'You get a finished website in a week — no waiting for months.'
      : 'Du får en färdig hemsida på en vecka – ingen väntan i månader.',
  },
  {
    icon: Palette,
    title: isEn ? 'Design that stands out' : 'Design som sticker ut',
    desc: isEn
      ? 'Modern and unique design that reflects your brand.'
      : 'Modern och unik design som speglar ditt varumärke.',
  },
  {
    icon: BarChart3,
    title: isEn ? 'Visible on Google' : 'Syns på Google',
    desc: isEn
      ? 'SEO-optimized from the start so that local customers find you.'
      : 'SEO-optimerad från start så att lokala kunder hittar dig.',
  },
];

function BenefitsSection({ isEn }: { isEn: boolean }) {
  return (
    <section className="py-14 sm:py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-2xl sm:text-3xl font-serif gradient-text text-center mb-10">
          {isEn
            ? 'Why small businesses in Gothenburg choose Coffee Code Studio'
            : 'Därför väljer småföretag i Göteborg Coffee Code Studio'}
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

/* ─── Process ─── */
const steps = (isEn: boolean) => [
  {
    icon: Coffee,
    num: '1',
    title: isEn ? 'Digital coffee' : 'Digitalt kaffe',
    desc: isEn
      ? 'We have a short video call where I learn about your business and needs.'
      : 'Vi tar ett kort videomöte där jag lär mig om ditt företag och dina behov.',
  },
  {
    icon: Hammer,
    num: '2',
    title: isEn ? 'I build' : 'Jag bygger',
    desc: isEn
      ? 'Within 5–7 days I build your website and you can follow the process.'
      : 'Inom 5–7 dagar bygger jag din hemsida och du kan följa processen.',
  },
  {
    icon: ThumbsUp,
    num: '3',
    title: isEn ? 'You approve' : 'Du godkänner',
    desc: isEn
      ? 'You test, give feedback and approve. Then we publish!'
      : 'Du testar, ger feedback och godkänner. Sedan publicerar vi!',
  },
];

function ProcessSection({ isEn }: { isEn: boolean }) {
  return (
    <section className="py-14 sm:py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-2xl sm:text-3xl font-serif gradient-text text-center mb-10">
          {isEn ? 'How it works' : 'Så fungerar det'}
        </h2>
        <div className="grid sm:grid-cols-3 gap-6">
          {steps(isEn).map((s, i) => (
            <motion.div
              key={i}
              className="glass-card rounded-2xl p-6 border border-border/30 text-center flex flex-col items-center gap-3"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-lg">
                {s.num}
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

/* ─── Pricing ─── */
function StarterPricing({ isEn }: { isEn: boolean }) {
  const features = isEn
    ? [
        'Responsive one-page design',
        'Contact form',
        'Booking button (BokaDirekt, Calendly etc.)',
        'Image gallery / portfolio',
        'Price list & opening hours',
        'SEO optimized',
        '30 days support',
      ]
    : [
        'Responsiv one-page-design',
        'Kontaktformulär',
        'Bokningsknapp (BokaDirekt, Calendly m.fl.)',
        'Bildgalleri / portfolio',
        'Prislista & öppettider',
        'SEO-optimerad',
        '30 dagars support',
      ];

  return (
    <section className="py-14 sm:py-20 px-4 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="container mx-auto max-w-md relative z-10">
        <h2 className="text-2xl sm:text-3xl font-serif gradient-text text-center mb-10">
          {isEn ? 'Starter package' : 'Starter-paketet'}
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
            {isEn ? 'Book consultation' : 'Boka konsultation'}
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── FAQ ─── */
const faqItems = (isEn: boolean) => [
  {
    q: isEn ? 'What is included in the price of SEK 4,900?' : 'Vad ingår i priset på 4 900 kr?',
    a: isEn
      ? 'A complete one-page website with responsive design, contact form, image gallery, SEO optimization and 30 days support after launch.'
      : 'En komplett one-page-hemsida med responsiv design, kontaktformulär, bildgalleri, SEO-optimering och 30 dagars support efter lansering.',
  },
  {
    q: isEn ? 'Can I update the content myself afterwards?' : 'Kan jag uppdatera innehållet själv efteråt?',
    a: isEn
      ? 'Absolutely! You get a simple guide so that you can change texts, images and prices yourself — no extra cost.'
      : 'Absolut! Du får en enkel guide så att du kan ändra texter, bilder och priser själv – inga extra kostnader.',
  },
  {
    q: isEn ? 'Can it be integrated with my booking system?' : 'Går det att integrera med mitt bokningssystem?',
    a: isEn
      ? 'Yes, I connect your existing booking system such as BokaDirekt, Calendly or similar directly on the page.'
      : 'Ja, jag kopplar in ditt befintliga bokningssystem som BokaDirekt, Calendly eller liknande direkt på sidan.',
  },
  {
    q: isEn ? 'What does it cost to maintain the site?' : 'Vad kostar det att underhålla sidan?',
    a: isEn
      ? 'There are no recurring costs from me. You only pay for domain and possibly web hosting, usually under SEK 100/month.'
      : 'Det finns inga löpande kostnader från mig. Du betalar bara för domän och eventuellt webbhotell, vanligtvis under 100 kr/mån.',
  },
];

function FAQSectionLocal({ isEn }: { isEn: boolean }) {
  const items = faqItems(isEn);
  return (
    <section className="py-14 sm:py-20 px-4">
      <div className="container mx-auto max-w-3xl">
        <h2 className="text-2xl sm:text-3xl font-serif gradient-text text-center mb-10">
          {isEn ? 'Common questions' : 'Vanliga frågor'}
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
            {isEn ? 'Ready to take your business online?' : 'Redo att ta ditt företag online?'}
          </h2>
          <Button
            size="lg"
            className="glow-button bg-primary text-primary-foreground hover:bg-primary/90 text-base sm:text-lg px-8 py-6 rounded-full font-medium"
            onClick={scrollToContact}
          >
            {isEn ? 'Book a digital coffee — takes 15 minutes' : 'Boka ett digitalt kaffe – tar 15 minuter'}
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Page ─── */
function SmaforetagContent() {
  const { pathname } = useLocation();
  const isEn = pathname.startsWith('/en');

  useEffect(() => {
    const localBusiness = {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: 'Coffee Code Studio',
      description: isEn
        ? 'Professional website for small businesses in Gothenburg. Fixed price SEK 4,900, delivery within one week.'
        : 'Professionell hemsida för småföretag i Göteborg. Fast pris 4 900 kr, leverans inom en vecka.',
      url: `https://coffeecodestudio.se${isEn ? '/en' : ''}/smaforetag-goteborg`,
      telephone: '+46738764299',
      email: 'hej@coffeecodestudio.se',
      address: { '@type': 'PostalAddress', addressLocality: 'Gothenburg', addressCountry: 'SE' },
      areaServed: { '@type': 'City', name: 'Gothenburg' },
      priceRange: isEn ? 'from SEK 4,900' : 'från 4 900 kr',
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
    scriptLB.id = 'smaforetag-localbusiness-jsonld';
    scriptLB.type = 'application/ld+json';
    scriptLB.textContent = JSON.stringify(localBusiness);

    const scriptFAQ = document.createElement('script');
    scriptFAQ.id = 'smaforetag-faq-jsonld';
    scriptFAQ.type = 'application/ld+json';
    scriptFAQ.textContent = JSON.stringify(faqPage);

    document.head.appendChild(scriptLB);
    document.head.appendChild(scriptFAQ);

    return () => { scriptLB.remove(); scriptFAQ.remove(); };
  }, [isEn]);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <SEOHead
        title={
          isEn
            ? 'Website for small businesses in Gothenburg | Ready in 7 days | Coffee Code Studio'
            : 'Hemsida för småföretag i Göteborg | Klar på 7 dagar | Coffee Code Studio'
        }
        description={
          isEn
            ? 'Professional website for small businesses in Gothenburg. Fixed price SEK 4,900, delivery within 7 days. Mobile-friendly, with booking and SEO. Book a free consultation.'
            : 'Professionell hemsida för småföretag i Göteborg. Fast pris 4 900 kr, leverans inom 7 dagar. Mobilvänlig, med bokning och SEO. Boka gratis konsultation.'
        }
      />
      <Navbar />
      <main>
        <Hero isEn={isEn} />
        <BusinessPreviewSection isEn={isEn} />
        <CaseSection isEn={isEn} />
        <BenefitsSection isEn={isEn} />
        <ProcessSection isEn={isEn} />
        <StarterPricing isEn={isEn} />
        <FAQSectionLocal isEn={isEn} />
        <FinalCTA isEn={isEn} />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}

export default function SmaforetagGoteborg() {
  return (
    <LanguageProvider>
      <SmaforetagContent />
    </LanguageProvider>
  );
}
