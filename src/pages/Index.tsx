import { LanguageProvider, useLanguage } from '@/contexts/LanguageContext';
import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';
import { TjansterSection } from '@/components/TjansterSection';
import { ProjektSection } from '@/components/ProjektSection';
import { TestimonialsSection } from '@/components/TestimonialsSection';
import { PricingSection } from '@/components/PricingSection';
import { AboutSection } from '@/components/AboutSection';
import { ContactSection } from '@/components/ContactSection';
import { FAQSection } from '@/components/FAQSection';
import { Footer } from '@/components/Footer';
import { SEOHead } from '@/components/SEOHead';

function IndexContent() {
  const { language } = useLanguage();

  return (
    <div key={language}>
      <SEOHead
        title={language === 'sv'
          ? 'Hemsidor för småföretag i Göteborg | Coffee Code Studio'
          : 'Websites for Small Businesses | Coffee Code Studio'}
        description={language === 'sv'
          ? 'Professionell hemsida från 4 900 kr — ofta live inom en vecka. Jag bygger snabba, mobilanpassade hemsidor för småföretag i Göteborg. Boka gratis konsultation.'
          : 'Professional website from 4,900 SEK — often live within a week. Fast, mobile-friendly websites for small businesses. Book a free consultation.'}
        canonical="https://coffeecodestudio.se/"
        ogImage="https://coffeecodestudio.se/og-image.png"
      />
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:top-2 focus:left-2 focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded-md">
        Hoppa till innehåll
      </a>
      <div className="min-h-screen bg-background overflow-x-hidden">
        <Navbar />
        <main id="main-content">
          <HeroSection />
          <TestimonialsSection />
          <TjansterSection />
          <ProjektSection />
          <FAQSection />
          <PricingSection />
          <AboutSection />
          <ContactSection />
        </main>
        <Footer />
      </div>
    </div>
  );
}

const Index = () => {
  return (
    <LanguageProvider>
      <IndexContent />
    </LanguageProvider>
  );
};

export default Index;
