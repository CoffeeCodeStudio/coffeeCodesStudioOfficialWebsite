import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { FileText, Monitor } from 'lucide-react';

export function HeroSection() {
  const { t } = useLanguage();

  return (
    <section className="relative min-h-[calc(100vh-2rem)] flex-col pt-20 sm:pt-24 pb-10 sm:pb-12 px-2 sm:px-0 overflow-hidden flex items-center justify-center" aria-label="Hero">
      {/* Animated background */}
      <div className="absolute inset-0 code-bg" />
      {/* Bottom fade for seamless transition */}
      <div className="hero-fade-bottom" />
      
      
      {/* Floating code particles - reduced on mobile */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) =>
        <motion.div
          key={i}
          className="absolute text-primary/20 font-mono text-sm hidden sm:block"
          initial={{
            x: Math.random() * 100 + '%',
            y: -20,
            opacity: 0
          }}
          animate={{
            y: '120vh',
            opacity: [0, 0.5, 0]
          }}
          transition={{
            duration: 10 + Math.random() * 10,
            repeat: Infinity,
            delay: Math.random() * 5
          }}>
          
            {['{ }', '< />', '( )', '[ ]', '=> ', '...'][Math.floor(Math.random() * 6)]}
          </motion.div>
        )}
      </div>

      <div className="container mx-auto px-5 sm:px-6 relative z-10">
        {/* Promo Banner */}
        <motion.div
          className="flex justify-center mb-5 sm:mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}>
          
          <div className="glass-card px-4 sm:px-6 py-2 sm:py-3 border border-primary/30 rounded-full">
            <span className="text-xs sm:text-sm text-primary font-medium leading-tight">
              ✨ {t.hero.promo}
            </span>
          </div>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          className="text-[1.75rem] sm:text-4xl md:text-6xl lg:text-7xl font-serif text-center max-w-4xl mx-auto leading-tight mb-3 sm:mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}>
          
          <span className="gradient-text">{t.hero.headline}</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          className="text-[0.95rem] sm:text-lg md:text-xl text-muted-foreground text-center max-w-2xl mx-auto mb-7 sm:mb-10 px-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}>
          
          {t.hero.subheadline}
        </motion.p>

        {/* CTA Button */}
        <motion.div
          className="flex justify-center mb-10 sm:mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}>
          
          <Button
            size="lg"
            className="glow-button bg-primary text-primary-foreground hover:bg-primary/90 text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 rounded-full font-medium"
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>
            
            {t.hero.cta}
          </Button>
        </motion.div>
      </div>
    </section>);

}