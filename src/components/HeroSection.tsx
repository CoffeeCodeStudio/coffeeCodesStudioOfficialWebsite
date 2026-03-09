import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { FileText, Monitor } from 'lucide-react';

export function HeroSection() {
  const { t } = useLanguage();

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-16 sm:pt-20 pb-12 sm:pb-16 overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 code-bg" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
      
      {/* Floating code particles - reduced on mobile */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
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
            }}
          >
            {['{ }', '< />', '( )', '[ ]', '=> ', '...'][Math.floor(Math.random() * 6)]}
          </motion.div>
        ))}
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Promo Banner */}
        <motion.div
          className="flex justify-center mb-6 sm:mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="glass-card px-4 sm:px-6 py-2.5 sm:py-3 border border-primary/30 rounded-full">
            <span className="text-xs sm:text-sm text-primary font-medium">
              ✨ {t.hero.promo}
            </span>
          </div>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-serif text-center max-w-4xl mx-auto leading-tight mb-4 sm:mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <span className="gradient-text">{t.hero.headline}</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          className="text-base sm:text-lg md:text-xl text-muted-foreground text-center max-w-2xl mx-auto mb-8 sm:mb-10 px-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {t.hero.subheadline}
        </motion.p>

        {/* CTA Button */}
        <motion.div
          className="flex justify-center mb-12 sm:mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Button 
            size="lg" 
            className="glow-button bg-primary text-primary-foreground hover:bg-primary/90 text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 rounded-full font-medium"
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
          >
            {t.hero.cta}
          </Button>
        </motion.div>

        {/* Visual Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 max-w-5xl mx-auto">
          {/* Planning Card */}
          <motion.div
            className="glass-card cyber-border p-1 rounded-2xl overflow-hidden"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="relative aspect-[4/3] sm:aspect-[4/3] bg-gradient-to-br from-amber-glow/10 to-primary/5 rounded-xl overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center p-6 sm:p-8">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-primary/20 flex items-center justify-center mx-auto mb-3 sm:mb-4"><FileText className="w-7 h-7 sm:w-8 sm:h-8 text-primary" /></div>
                  <div className="glass-card px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg inline-block">
                    <span className="text-xs sm:text-sm font-mono text-primary">wireframe.tsx</span>
                  </div>
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute top-3 sm:top-4 left-3 sm:left-4 w-16 sm:w-24 h-16 sm:h-24 border border-primary/20 rounded-lg" />
              <div className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4 w-12 sm:w-16 h-12 sm:h-16 border border-secondary/20 rounded-full" />
            </div>
            <div className="p-3 sm:p-4 text-center">
              <span className="text-base sm:text-lg font-medium text-foreground">{t.hero.planning}</span>
            </div>
          </motion.div>

          {/* Solution Card */}
          <motion.div
            className="glass-card cyber-border p-1 rounded-2xl overflow-hidden"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="relative aspect-[4/3] sm:aspect-[4/3] bg-gradient-to-br from-secondary/10 to-cyber-blue/5 rounded-xl overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center p-6 sm:p-8">
                  <div className="text-5xl sm:text-6xl mb-3 sm:mb-4">💻</div>
                  <div className="glass-card px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg inline-block">
                    <span className="text-xs sm:text-sm font-mono text-secondary">dashboard.tsx</span>
                  </div>
                </div>
              </div>
              {/* Code lines decoration */}
              <div className="absolute top-3 sm:top-4 left-3 sm:left-4 space-y-1.5 sm:space-y-2">
                <div className="w-14 sm:w-20 h-1 bg-accent/30 rounded" />
                <div className="w-10 sm:w-16 h-1 bg-accent/20 rounded" />
                <div className="w-16 sm:w-24 h-1 bg-accent/10 rounded" />
              </div>
            </div>
            <div className="p-3 sm:p-4 text-center">
              <span className="text-base sm:text-lg font-medium text-foreground">{t.hero.solution}</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
