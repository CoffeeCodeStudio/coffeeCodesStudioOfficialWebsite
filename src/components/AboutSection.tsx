import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

export function AboutSection() {
  const { t } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="py-24 relative" ref={ref}>
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Visual */}
          <motion.div
            className="order-2 md:order-1"
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <div className="glass-card cyber-border p-8 rounded-2xl relative overflow-hidden">
              <div className="relative z-10 text-center">
                <motion.div
                  className="text-8xl mb-6"
                  animate={{ 
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  ☕
                </motion.div>
                
                <div className="flex items-center justify-center gap-4">
                  <div className="w-12 h-1 bg-primary/50 rounded" />
                  <span className="text-sm font-mono text-muted-foreground">+</span>
                  <div className="text-2xl">💻</div>
                  <span className="text-sm font-mono text-muted-foreground">=</span>
                  <div className="text-2xl">✨</div>
                </div>
              </div>

              {/* Background decoration */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            className="order-1 md:order-2"
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-3xl md:text-5xl font-serif mb-6">
              <span className="gradient-text">{t.about.headline}</span>
            </h2>
            
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t.about.body}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
