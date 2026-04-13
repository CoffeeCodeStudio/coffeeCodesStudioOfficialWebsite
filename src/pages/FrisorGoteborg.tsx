import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import frisorMockup from '@/assets/frisor-mockup.jpg';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ContactSection } from '@/components/ContactSection';
import { SEOHead } from '@/components/SEOHead';
import { Button } from '@/components/ui/button';
import { Check, Clock, Banknote, Pencil, Quote } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const scrollToContact = () =>
  document.getElementById('kontakt')?.scrollIntoView({ behavior: 'smooth' });

/* ─── Hero ─── */
function Hero() {
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
          En hemsida som lockar nya kunder till din salong
        </motion.h1>
        <motion.p
          className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          Jag bygger en modern, mobilvänlig hemsida för frisörer i Göteborg.
          Inklusive prislista, bildgalleri och bokningsknapp – live inom 7 dagar.
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
            Boka gratis konsultation
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Mockup ─── */
function MockupSection() {
  const [imageError, setImageError] = useState(false);

  return (
    <section className="pb-14 sm:pb-20 px-4">
      <div className="container mx-auto max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="relative w-11/12 sm:w-10/12 mx-auto">
            {/* Laptop bezel */}
            <div className="bg-muted rounded-t-xl pt-3 px-3 pb-0 shadow-2xl">
              <div className="flex items-center gap-1.5 mb-2 px-1">
                <div className="w-2 h-2 rounded-full bg-red-500/60" />
                <div className="w-2 h-2 rounded-full bg-yellow-500/60" />
                <div className="w-2 h-2 rounded-full bg-green-500/60" />
                <span className="ml-3 text-[10px] text-muted-foreground/50 font-mono truncate">
                  studiogoteborg.se
                </span>
              </div>
              {/* Screen */}
              <div className="rounded-t-sm overflow-hidden">
                {!imageError ? (
                  <img
                    src={frisorMockup}
                    alt="Exempel på en frisörhemsida – Studio Göteborg"
                    className="w-full h-auto block"
                    loading="lazy"
                    width="1080"
                    height="675"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className="w-full aspect-[16/10] bg-gradient-to-br from-primary/15 via-primary/5 to-background flex items-center justify-center">
                    <span className="text-muted-foreground text-sm">studiogoteborg.se</span>
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
            Exempel på en frisörhemsida – levererad på 5 dagar.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Benefits ─── */
const benefits = [
  { icon: Clock, title: 'Snabb leverans', desc: 'Online på en vecka' },
  { icon: Banknote, title: 'Fast pris 4 900 kr', desc: 'Inga dolda avgifter' },
  { icon: Pencil, title: 'Uppdatera själv', desc: 'Du kan enkelt uppdatera priser och bilder själv' },
];

function BenefitsSection() {
  return (
    <section className="py-14 sm:py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-2xl sm:text-3xl font-serif gradient-text text-center mb-10">
          Därför väljer frisörer i Göteborg Coffee Code Studio
        </h2>
        <div className="grid sm:grid-cols-3 gap-6">
          {benefits.map((b, i) => (
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

/* ─── Testimonial ─── */
function TestimonialSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <section className="py-10 px-4" ref={ref}>
      <div className="container mx-auto max-w-2xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center gap-4"
        >
          <Quote className="w-6 h-6 text-primary/60" />
          <blockquote className="text-base sm:text-lg font-serif text-foreground italic leading-relaxed">
            "Tack vare Coffee Code Studio fick vi en proffsig hemsida på nolltid.
            Kunder bokar tid direkt via sidan!"
          </blockquote>
          <p className="text-sm font-mono text-primary tracking-wide">
            — Emma, Salong Bläck, Göteborg
          </p>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Pricing (Starter focus) ─── */
function StarterPricing() {
  const features = [
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
          Starter-paketet
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
            <p className="text-sm text-muted-foreground mt-1">Engångskostnad · inga månadskostnader</p>
          </div>
          <ul className="space-y-3 mb-6">
            {features.map((f, i) => (
              <li key={i} className="flex items-center gap-2.5 text-sm">
                <Check className="w-4 h-4 text-primary shrink-0" />
                <span className="text-foreground/80">{f}</span>
              </li>
            ))}
          </ul>
          <Button
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl py-3"
            onClick={scrollToContact}
          >
            Boka gratis konsultation
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── FAQ ─── */
const faqItems = [
  {
    q: 'Kan jag visa mina priser och öppettider?',
    a: 'Ja, allt detta ingår. Din hemsida får en tydlig prislista och öppettider som du enkelt kan uppdatera.',
  },
  {
    q: 'Kan kunder boka tid direkt via hemsidan?',
    a: 'Ja, vi integrerar ditt bokningssystem, t.ex. BokaDirekt eller Calendly, så att kunder kan boka direkt.',
  },
  {
    q: 'Vad händer om jag vill byta bilder senare?',
    a: 'Du får en enkel guide så att du kan uppdatera allt själv — inga extra kostnader.',
  },
];

function FAQSectionLocal() {
  return (
    <section className="py-14 sm:py-20 px-4">
      <div className="container mx-auto max-w-3xl">
        <h2 className="text-2xl sm:text-3xl font-serif gradient-text text-center mb-10">
          Vanliga frågor
        </h2>
        <Accordion type="single" collapsible className="space-y-2">
          {faqItems.map((item, i) => (
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
function FinalCTA() {
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
            Redo att ta din salong online?
          </h2>
          <Button
            size="lg"
            className="glow-button bg-primary text-primary-foreground hover:bg-primary/90 text-base sm:text-lg px-8 py-6 rounded-full font-medium"
            onClick={scrollToContact}
          >
            Boka gratis konsultation – tar 15 minuter
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Page ─── */
function FrisorContent() {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <SEOHead
        title="Hemsida för frisörer i Göteborg | Klar på 7 dagar | Coffee Code Studio"
        description="Professionell hemsida för frisörer och salonger i Göteborg. Fast pris 4 900 kr, leverans inom en vecka. Mobilvänlig, bokningssystem och SEO. Boka gratis konsultation."
        canonical="https://coffeecodestudio.se/frisor-goteborg"
      />
      <Navbar />
      <main>
        <Hero />
        <MockupSection />
        <BenefitsSection />
        <TestimonialSection />
        <StarterPricing />
        <FAQSectionLocal />
        <FinalCTA />
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
