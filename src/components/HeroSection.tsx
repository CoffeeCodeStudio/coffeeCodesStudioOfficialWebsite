import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import djloboMockupWebp from '@/assets/djlobo-mockup.webp';
import djloboMockupPng from '@/assets/djlobo-mockup.png';
import { trackEvent } from '@/lib/analytics';
import { CodeRainBackground } from './CodeRainBackground';

export function HeroSection() {
  const { t } = useLanguage();
  const [imageError, setImageError] = useState(false);

  return (
    <section className="relative min-h-0 flex-col pt-28 sm:pt-32 pb-0 px-2 sm:px-0 overflow-hidden flex items-center justify-start" aria-label="Hero">
      <div className="container mx-auto px-5 sm:px-6 relative z-10">
        <motion.h1
          className="text-[1.75rem] sm:text-4xl md:text-6xl lg:text-7xl font-serif text-center max-w-4xl mx-auto leading-tight mb-3 sm:mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <span className="gradient-text">{t.hero.headline}</span>
        </motion.h1>

        <motion.p
          className="text-[0.95rem] sm:text-lg md:text-xl text-muted-foreground text-center max-w-2xl mx-auto mb-7 sm:mb-8 px-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {t.hero.subheadline}
        </motion.p>

        <motion.div
          className="flex justify-center mb-8 sm:mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Button
            size="lg"
            className="glow-button bg-primary text-primary-foreground hover:bg-primary/90 text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 rounded-full font-medium"
            onClick={() => { trackEvent('hero_cta_click', { location: 'hero' }); document.getElementById('kontakt')?.scrollIntoView({ behavior: 'smooth' }); }}
          >
            {t.hero.cta}
          </Button>
        </motion.div>

        {/* Laptop Mockup */}
        <motion.div
          className="max-w-2xl mx-auto mb-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="relative w-11/12 sm:w-10/12 md:w-9/12 lg:w-8/12 mx-auto">
            {/* Laptop bezel */}
            <div className="bg-muted rounded-t-xl pt-3 px-3 pb-0 shadow-2xl">
              {/* Browser dots */}
              <div className="flex items-center gap-1.5 mb-2 px-1">
                <div className="w-2 h-2 rounded-full bg-red-500/60" />
                <div className="w-2 h-2 rounded-full bg-yellow-500/60" />
                <div className="w-2 h-2 rounded-full bg-green-500/60" />
                <span className="ml-3 text-[10px] text-muted-foreground/50 font-mono truncate">djloboproducciones.com</span>
              </div>
              {/* Screen */}
              <div className="rounded-t-sm overflow-hidden">
                {!imageError ? (
                  <picture>
                    <source srcSet={djloboMockupWebp} type="image/webp" />
                    <img
                      src={djloboMockupPng}
                      alt={t.hero.mockupAlt}
                      className="w-full h-auto block"
                      loading="eager"
                      width="540"
                      height="338"
                      onError={() => setImageError(true)}
                    />
                  </picture>
                ) : (
                  <div className="w-full aspect-[16/10] bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                    <span className="text-muted-foreground text-sm">djloboproducciones.com</span>
                  </div>
                )}
              </div>
            </div>
          {/* Laptop base */}
            <div className="bg-muted h-3 rounded-b-lg mx-auto overflow-hidden" style={{ width: 'calc(100% + 20px)', marginLeft: '-10px', maxWidth: '110%' }} />
            <div className="bg-muted/80 h-1.5 rounded-b-xl mx-auto" style={{ width: '40%' }} />
          </div>

          {/* Tagline under mockup */}
          <p className="text-sm text-muted-foreground font-mono text-center mt-4">
            {t.hero.mockupTagline}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
