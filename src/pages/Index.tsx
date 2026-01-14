import { LanguageProvider } from '@/contexts/LanguageContext';
import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';
import { ProblemSection } from '@/components/ProblemSection';
import { ProcessSection } from '@/components/ProcessSection';
import { PortfolioSection } from '@/components/PortfolioSection';
import { AboutSection } from '@/components/AboutSection';
import { ContactSection } from '@/components/ContactSection';
import { Footer } from '@/components/Footer';

const Index = () => {
  return (
    <LanguageProvider>
      <div className="min-h-screen bg-background">
        <Navbar />
        <main>
          <HeroSection />
          <ProblemSection />
          <ProcessSection />
          <PortfolioSection />
          <AboutSection />
          <ContactSection />
        </main>
        <Footer />
      </div>
    </LanguageProvider>
  );
};

export default Index;
