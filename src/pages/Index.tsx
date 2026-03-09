import { LanguageProvider } from '@/contexts/LanguageContext';
import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';
import { TjansterSection } from '@/components/TjansterSection';
import { ProjektSection } from '@/components/ProjektSection';
import { TestimonialsSection } from '@/components/TestimonialsSection';
import { PricingSection } from '@/components/PricingSection';
import { AboutSection } from '@/components/AboutSection';
import { ContactSection } from '@/components/ContactSection';
import { Footer } from '@/components/Footer';
import { SEOHead } from '@/components/SEOHead';

const Index = () => {
  return (
    <LanguageProvider>
      <SEOHead
        title="Coffee Code Studio | Skräddarsydda Webbapplikationer"
        description="Din vision, kodad till perfektion. Vi skapar skräddarsydda webbapplikationer med AI-driven utveckling i Göteborg."
        canonical="https://coffeecodestudio.lovable.app/"
        ogImage="https://lovable.dev/opengraph-image-p98pqg.png"
      />
      <div className="min-h-screen bg-background">
        <Navbar />
        <main>
          <HeroSection />
          <TjansterSection />
          <ProjektSection />
          <TestimonialsSection />
          <PricingSection />
          <AboutSection />
          <ContactSection />
        </main>
        <Footer />
      </div>
    </LanguageProvider>
  );
};

export default Index;
