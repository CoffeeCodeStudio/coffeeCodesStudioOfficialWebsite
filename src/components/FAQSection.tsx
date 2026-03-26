import { useLanguage } from '@/contexts/LanguageContext';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export function FAQSection() {
  const { t } = useLanguage();

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: t.faq.items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  };

  const { language } = useLanguage();

  return (
    <section id="faq" className="py-16 sm:py-24 relative">
      <script
        key={language}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <div className="container mx-auto px-4 sm:px-6 max-w-3xl">
        <h2 className="text-2xl sm:text-3xl font-serif gradient-text text-center mb-10">
          {t.faq.headline}
        </h2>
        <Accordion type="single" collapsible className="space-y-2">
          {t.faq.items.map((item, i) => (
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
