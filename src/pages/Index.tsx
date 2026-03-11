import { LanguageProvider } from '@/contexts/LanguageContext';
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

const Index = () => {
  return (
    <LanguageProvider>
      <SEOHead
        title="Coffee Code Studio | Skräddarsydda Webbapplikationer"
        description="Din vision, kodad till perfektion. Vi skapar skräddarsydda webbapplikationer med AI-driven utveckling i Göteborg."
        canonical="https://coffeecodestudio.se/"
        ogImage="https://lovable.dev/opengraph-image-p98pqg.png"
      />
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:top-2 focus:left-2 focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded-md">
        Hoppa till innehåll
      </a>
      <div className="min-h-screen bg-background">
        <Navbar />
        <main id="main-content">
          <HeroSection />
          <TjansterSection />
          <ProjektSection />
          <TestimonialsSection />
          <PricingSection />
          <AboutSection />
          <ContactSection />
          <FAQSection />
        </main>
        <Footer />
      </div>
    </LanguageProvider>
  );
};

export default Index;
