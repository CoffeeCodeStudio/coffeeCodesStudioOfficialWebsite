import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

export function ProblemSection() {
  const { t } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="services" className="py-24 relative" ref={ref}>
      <div className="container mx-auto px-6">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-5xl font-serif mb-8">
            <span className="gradient-text">{t.problem.headline}</span>
          </h2>
          
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            {t.problem.body}
          </p>
        </motion.div>

        {/* Animated visual */}
        <motion.div
          className="mt-16 flex justify-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div className="relative">
            {/* Breaking apart icons */}
            <div className="flex gap-8 items-center">
              <motion.div
                className="glass-card p-6 rounded-xl opacity-40"
                animate={isInView ? {
                  rotate: [-5, 5, -5],
                  opacity: [0.4, 0.2, 0.4]
                } : {}}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <span className="text-4xl">📊</span>
              </motion.div>
              
              <motion.div
                className="text-4xl text-primary"
                animate={isInView ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 2, repeat: Infinity }}
              >
                →
              </motion.div>
              
              <motion.div
                className="glass-card cyber-border p-6 rounded-xl"
                animate={isInView ? { 
                  boxShadow: [
                    '0 0 20px hsl(43 96% 56% / 0.2)',
                    '0 0 40px hsl(43 96% 56% / 0.4)',
                    '0 0 20px hsl(43 96% 56% / 0.2)'
                  ]
                } : {}}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <span className="text-4xl">🚀</span>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
