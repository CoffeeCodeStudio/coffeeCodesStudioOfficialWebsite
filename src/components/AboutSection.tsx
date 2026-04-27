import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

export function AboutSection() {
  const { t } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="about" className="relative" ref={ref}>
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-fluid-section items-center max-w-6xl mx-auto">
          {/* Pull-quote / stats */}
          <motion.div
            className="order-2 md:order-1"
            initial={{ opacity: 0, x: -24 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <div className="glass-card cyber-border p-8 rounded-2xl relative overflow-hidden">
              <div className="relative z-10 text-center">
                <p className="text-xl sm:text-2xl font-serif gradient-text leading-relaxed">
                  {t.about.pullQuote}
                </p>
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            className="order-1 md:order-2"
            initial={{ opacity: 0, x: 24 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
          >
            <h2 className="text-3xl md:text-5xl font-serif mb-6">
              <span className="gradient-text">{t.about.headline}</span>
            </h2>
            
            <p className="text-lg text-muted-foreground leading-relaxed reading-width ml-0">
              {t.about.body}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
