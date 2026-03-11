import { useLanguage } from '@/contexts/LanguageContext';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqItems = [
  {
    q: 'Vad innebär AI-driven webbproduktion?',
    a: 'AI-driven webbproduktion betyder att vi använder artificiell intelligens som ett kraftfullt verktyg i utvecklingsprocessen. Det gör att vi kan leverera skräddarsydda webbapplikationer snabbare och med högre kvalitet – utan att kompromissa med design eller funktionalitet.',
  },
  {
    q: 'Varför ska jag välja webbutveckling i Göteborg?',
    a: 'Med en lokal partner i Göteborg får du personlig kontakt, snabb kommunikation och en utvecklare som förstår den svenska marknaden. Vi på Coffee Code Studio kombinerar lokal närvaro med modern AI-teknik för att leverera konkurrenskraftiga lösningar.',
  },
  {
    q: 'Hur lång tid tar det att bygga en skräddarsydd webbapplikation?',
    a: 'Tack vare vår AI-drivna utvecklingsprocess kan vi leverera en MVP (Minimum Viable Product) på så lite som 2–4 veckor. Tidsramen beror på projektets komplexitet, men vi arbetar alltid agilt för att komma igång snabbt.',
  },
  {
    q: 'Vad kostar det att utveckla en webbapplikation?',
    a: 'Priset varierar beroende på projektets omfattning. Vi erbjuder transparenta paketpriser som inkluderar design, utveckling och löpande underhåll. Kontakta oss för en kostnadsfri konsultation så tar vi fram ett förslag anpassat efter dina behov.',
  },
];

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqItems.map((item) => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.a,
    },
  })),
};

export function FAQSection() {
  const { language } = useLanguage();

  return (
    <section id="faq" className="py-16 sm:py-24 relative">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <div className="container mx-auto px-4 sm:px-6 max-w-3xl">
        <h2 className="text-2xl sm:text-3xl font-serif gradient-text text-center mb-10">
          {language === 'sv' ? 'Vanliga frågor om webbutveckling' : 'Frequently Asked Questions'}
        </h2>
        <Accordion type="single" collapsible className="space-y-2">
          {faqItems.map((item, i) => (
            <AccordionItem
              key={i}
              value={`faq-${i}`}
              className="glass-card border border-white/5 rounded-xl px-5 overflow-hidden"
            >
              <AccordionTrigger className="text-left text-sm sm:text-base text-foreground hover:no-underline">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-sm leading-relaxed">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
