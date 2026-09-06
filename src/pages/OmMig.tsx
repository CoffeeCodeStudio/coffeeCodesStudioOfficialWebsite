import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ContactSection } from '@/components/ContactSection';
import { SEOHead } from '@/components/SEOHead';
import { Button } from '@/components/ui/button';
import { Banknote, Clock, MapPin, MessageCircle, Workflow } from 'lucide-react';

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
          {isEn ? 'About Coffee Code Studio' : 'Om Coffee Code Studio'}
        </motion.h1>
        <motion.p
          className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          {isEn
            ? 'Coffee Code Studio is run by Rami, a freelance web developer based in Gothenburg. I build websites for small businesses at a fixed price of SEK 4,900, live within a week — and you always talk directly to the person who builds your site.'
            : 'Coffee Code Studio drivs av mig, Rami, frilansande webbutvecklare i Göteborg. Jag bygger hemsidor åt småföretag till fast pris 4 900 kr, live inom en vecka — och du pratar alltid direkt med den som bygger din hemsida.'}
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

/* ─── Vem är jag ─── */
function AboutMe({ isEn }: { isEn: boolean }) {
  return (
    <section className="py-14 sm:py-20 px-4">
      <div className="container mx-auto max-w-3xl">
        <h2 className="text-2xl sm:text-3xl font-serif gradient-text text-center mb-6">
          {isEn ? 'Who am I?' : 'Vem är jag?'}
        </h2>
        <div className="glass-card rounded-2xl p-6 sm:p-8 border border-border/30 space-y-4 text-sm sm:text-base text-muted-foreground">
          <p>
            {isEn
              ? 'My name is Rami and I am a web developer based in Gothenburg. Coffee Code Studio is a one-person operation: I handle the first conversation, the design, the code, the launch and the follow-up myself.'
              : 'Jag heter Rami och är webbutvecklare baserad i Göteborg. Coffee Code Studio är en enmansverksamhet: jag sköter första samtalet, designen, koden, lanseringen och uppföljningen själv.'}
          </p>
          <p>
            {isEn
              ? 'I work with small businesses in and around Gothenburg — hair salons, tradespeople, restaurants, consultants and everyone else who needs a website that looks professional without a long project or a big budget.'
              : 'Jag jobbar med småföretag i och runt Göteborg — frisörsalonger, hantverkare, restauranger, konsulter och alla andra som behöver en hemsida som ser proffsig ut utan långt projekt eller stor budget.'}
          </p>
          <p className="flex items-center gap-2 text-foreground">
            <MapPin className="w-4 h-4 text-primary shrink-0" />
            {isEn ? 'Based in Gothenburg, Sweden' : 'Baserad i Göteborg, Sverige'}
          </p>
        </div>
      </div>
    </section>
  );
}

/* ─── Principer ─── */
function Principles({ isEn }: { isEn: boolean }) {
  const items = isEn
    ? [
        {
          icon: Banknote,
          title: 'Why a fixed price of SEK 4,900?',
          desc: 'Hourly billing makes a website feel like an open-ended risk. A fixed price means you know the full cost before we start, I know exactly what I am delivering, and nobody has to negotiate along the way. No monthly fees — only your domain and hosting, roughly SEK 200 to 500 per year.',
        },
        {
          icon: Clock,
          title: 'Why delivery within 7 days?',
          desc: 'A small business website does not need a three-month project. A tight week keeps the scope focused, keeps your attention on the content that matters and gets you earning from the site sooner. Day 1 we talk and gather content, day 2 to 4 I design and build, day 5 to 6 you review, day 7 it goes live.',
        },
        {
          icon: Workflow,
          title: 'How do I work?',
          desc: 'We start with a free conversation about your business and your customers. I write a proposal, build the site, and show you a live preview you can click through. You get one round of changes included, and a walkthrough at the end so you can update your own texts and images.',
        },
        {
          icon: MessageCircle,
          title: 'Direct contact — you talk to the person who builds it',
          desc: 'No account managers, no ticket queue, no handovers. You message me and I answer. That is also why I only take on a limited number of projects at a time.',
        },
      ]
    : [
        {
          icon: Banknote,
          title: 'Varför fast pris 4 900 kr?',
          desc: 'Timdebitering gör en hemsida till en öppen risk. Med fast pris vet du hela kostnaden innan vi börjar, jag vet exakt vad jag levererar och ingen behöver förhandla längs vägen. Inga månadsavgifter — bara domän och hosting, cirka 200 till 500 kr per år.',
        },
        {
          icon: Clock,
          title: 'Varför leverans inom 7 dagar?',
          desc: 'En hemsida för ett småföretag behöver inget tremånadersprojekt. En tajt vecka håller omfattningen fokuserad, håller din uppmärksamhet på innehållet som faktiskt spelar roll och gör att hemsidan börjar dra in kunder snabbare. Dag 1 pratar vi och samlar innehåll, dag 2–4 designar och bygger jag, dag 5–6 tycker du till, dag 7 går den live.',
        },
        {
          icon: Workflow,
          title: 'Hur jobbar jag?',
          desc: 'Vi börjar med ett kostnadsfritt samtal om din verksamhet och dina kunder. Jag skickar ett förslag, bygger sidan och visar dig en live-förhandsvisning du kan klicka runt i. En ändringsrunda ingår, och på slutet får du en genomgång så du kan uppdatera texter och bilder själv.',
        },
        {
          icon: MessageCircle,
          title: 'Direkt kontakt – du pratar med den som bygger',
          desc: 'Inga projektledare, ingen ärendekö, inga överlämningar. Du skriver till mig och jag svarar. Det är också därför jag tar mig an ett begränsat antal projekt åt gången.',
        },
      ];

  return (
    <section className="py-14 sm:py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="grid sm:grid-cols-2 gap-6">
          {items.map((item, i) => (
            <motion.div
              key={i}
              className="glass-card rounded-2xl p-6 border border-border/30 flex flex-col gap-3"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <item.icon className="w-6 h-6 text-primary" />
              <h2 className="font-serif text-lg text-foreground">{item.title}</h2>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Final CTA ─── */
function FinalCTA({ isEn }: { isEn: boolean }) {
  return (
    <section className="py-14 sm:py-20 px-4">
      <div className="container mx-auto max-w-2xl text-center">
        <motion.h2
          className="text-2xl sm:text-3xl font-serif gradient-text mb-5"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          {isEn ? 'Your website live within a week' : 'Din hemsida live inom en vecka'}
        </motion.h2>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
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
function OmMigContent() {
  const { pathname } = useLocation();
  const isEn = pathname.startsWith('/en');

  useEffect(() => {
    const person = {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: 'Rami',
      jobTitle: isEn ? 'Web developer' : 'Webbutvecklare',
      worksFor: {
        '@type': 'Organization',
        name: 'Coffee Code Studio',
        url: 'https://coffeecodestudio.se',
      },
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Göteborg',
        addressCountry: 'SE',
      },
      url: `https://coffeecodestudio.se${isEn ? '/en/om-mig' : '/om-mig'}`,
    };

    const script = document.createElement('script');
    script.id = 'om-mig-person-jsonld';
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(person);
    document.head.appendChild(script);

    return () => {
      script.remove();
    };
  }, [isEn]);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <SEOHead
        title={
          isEn
            ? 'About Coffee Code Studio – Rami, web developer in Gothenburg'
            : 'Om Coffee Code Studio – Rami, webbutvecklare i Göteborg'
        }
        description={
          isEn
            ? 'Coffee Code Studio is run by Rami, a freelance web developer in Gothenburg. Websites for small businesses from SEK 4,900, live within a week.'
            : 'Coffee Code Studio drivs av Rami, frilansande webbutvecklare i Göteborg. Hemsidor för småföretag från 4 900 kr inom en vecka.'
        }
      />
      <Navbar />
      <main>
        <Hero isEn={isEn} />
        <AboutMe isEn={isEn} />
        <Principles isEn={isEn} />
        <FinalCTA isEn={isEn} />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}

export default function OmMig() {
  return (
    <LanguageProvider>
      <OmMigContent />
    </LanguageProvider>
  );
}
