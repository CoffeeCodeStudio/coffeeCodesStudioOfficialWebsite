import { LanguageProvider, useLanguage } from '@/contexts/LanguageContext';
import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';
import { ProjektSection } from '@/components/ProjektSection';
import { MethodologySection } from '@/components/MethodologySection';
import { AboutSection } from '@/components/AboutSection';
import { ContactSection } from '@/components/ContactSection';
import { Footer } from '@/components/Footer';
import { SEOHead } from '@/components/SEOHead';

function IndexContent() {
  const { language } = useLanguage();

  return (
    <div key={language}>
      <SEOHead
        title={language === 'sv'
          ? 'Rami — AI-Assisted Developer | Portfolio'
          : 'Rami — AI-Assisted Developer | Portfolio'}
        description={language === 'sv'
          ? 'Portfolio för Rami, AI-Assisted Developer i Göteborg. Case studies: Echo2000, Klar och DJ Lobo Producciones — byggda med React, TypeScript och Supabase.'
          : 'Portfolio of Rami, AI-Assisted Developer in Gothenburg. Case studies: Echo2000, Klar and DJ Lobo Producciones — built with React, TypeScript and Supabase.'}
        canonical={`https://coffeecodestudio.se${language === 'en' ? '/en' : '/'}`}
        ogImage="https://coffeecodestudio.se/og-image-v2.png"
      />
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:top-2 focus:left-2 focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded-md">
        Hoppa till innehåll
      </a>
      <div className="min-h-screen bg-background overflow-x-hidden">
        <Navbar />
        <main id="main-content">
          <HeroSection />
          <ProjektSection />
          <MethodologySection />
          <AboutSection />
          <ContactSection />
        </main>
        <Footer />
      </div>
    </div>
  );
}

const Index = () => <IndexContent />;

export default Index;
