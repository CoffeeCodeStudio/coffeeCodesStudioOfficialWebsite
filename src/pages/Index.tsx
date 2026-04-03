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
        title="Professionell hemsida på 7 dagar från 4 900 kr | Coffee Code Studio"
        description="Få en responsiv, SEO-optimerad hemsida på 7 dagar från 4 900 kr. Webbutveckling i Göteborg med AI-driven process, GDPR-anpassning och 30 dagars support."
        canonical="https://coffeecodestudio.se/"
        ogImage="https://lovable.dev/opengraph-image-p98pqg.png"
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
