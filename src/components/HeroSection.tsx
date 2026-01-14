import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';

export function HeroSection() {
  const { t } = useLanguage();

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 pb-16 overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 code-bg" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
      
      {/* Floating code particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-primary/20 font-mono text-sm"
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

      <div className="container mx-auto px-6 relative z-10">
        {/* Promo Banner */}
        <motion.div
          className="flex justify-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="glass-card px-6 py-3 border border-primary/30 rounded-full">
            <span className="text-sm text-primary font-medium">
              ✨ {t.hero.promo}
            </span>
          </div>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          className="text-4xl md:text-6xl lg:text-7xl font-serif text-center max-w-4xl mx-auto leading-tight mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <span className="gradient-text">{t.hero.headline}</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          className="text-lg md:text-xl text-muted-foreground text-center max-w-2xl mx-auto mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {t.hero.subheadline}
        </motion.p>

        {/* CTA Button */}
        <motion.div
          className="flex justify-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Button 
            size="lg" 
            className="glow-button bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-8 py-6 rounded-full font-medium"
          >
            {t.hero.cta}
          </Button>
        </motion.div>

        {/* Visual Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Planning Card */}
          <motion.div
            className="glass-card cyber-border p-1 rounded-2xl overflow-hidden"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="relative aspect-[4/3] bg-gradient-to-br from-amber-glow/10 to-primary/5 rounded-xl overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="text-6xl mb-4">📋</div>
                  <div className="glass-card px-4 py-2 rounded-lg inline-block">
                    <span className="text-sm font-mono text-primary">wireframe.tsx</span>
                  </div>
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute top-4 left-4 w-24 h-24 border border-primary/20 rounded-lg" />
              <div className="absolute bottom-4 right-4 w-16 h-16 border border-secondary/20 rounded-full" />
            </div>
            <div className="p-4 text-center">
              <span className="text-lg font-medium text-foreground">{t.hero.planning}</span>
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
            <div className="relative aspect-[4/3] bg-gradient-to-br from-secondary/10 to-cyber-blue/5 rounded-xl overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="text-6xl mb-4">💻</div>
                  <div className="glass-card px-4 py-2 rounded-lg inline-block">
                    <span className="text-sm font-mono text-secondary">dashboard.tsx</span>
                  </div>
                </div>
              </div>
              {/* Code lines decoration */}
              <div className="absolute top-4 left-4 space-y-2">
                <div className="w-20 h-1 bg-accent/30 rounded" />
                <div className="w-16 h-1 bg-accent/20 rounded" />
                <div className="w-24 h-1 bg-accent/10 rounded" />
              </div>
            </div>
            <div className="p-4 text-center">
              <span className="text-lg font-medium text-foreground">{t.hero.solution}</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
