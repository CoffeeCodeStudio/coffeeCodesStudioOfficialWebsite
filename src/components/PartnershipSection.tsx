import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Rocket, TrendingUp, HeartHandshake, ArrowRight } from 'lucide-react';

export function PartnershipSection() {
  const { t } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const phases = [
    {
      icon: Rocket,
      title: t.partnership.phase1Title,
      text: t.partnership.phase1Text,
      color: 'primary',
      number: '01',
    },
    {
      icon: TrendingUp,
      title: t.partnership.phase2Title,
      text: t.partnership.phase2Text,
      color: 'secondary',
      number: '02',
    },
    {
      icon: HeartHandshake,
      title: t.partnership.phase3Title,
      text: t.partnership.phase3Text,
      color: 'accent',
      number: '03',
    },
  ];

  return (
    <section id="partnership" className="py-24 relative" ref={ref}>
      <div className="container mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-5xl font-serif mb-6">
            <span className="gradient-text">{t.partnership.headline}</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t.partnership.intro}
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="relative">
            {/* Connecting line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/50 via-secondary/50 to-accent/50 hidden md:block" />
            
            {phases.map((phase, index) => {
              const Icon = phase.icon;
              const isEven = index % 2 === 0;
              
              return (
                <motion.div
                  key={index}
                  className={`flex items-center gap-8 mb-12 last:mb-0 ${
                    isEven ? 'md:flex-row' : 'md:flex-row-reverse'
                  } flex-col md:text-left text-center`}
                  initial={{ opacity: 0, x: isEven ? -40 : 40 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                >
                  {/* Content */}
                  <div className={`flex-1 ${isEven ? 'md:text-right' : 'md:text-left'}`}>
                    <motion.div
                      className="glass-card cyber-border p-6 rounded-2xl inline-block"
                      whileHover={{ y: -5 }}
                    >
                      <h3 className="text-xl font-serif mb-2 text-foreground">
                        {phase.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
                        {phase.text}
                      </p>
                    </motion.div>
                  </div>

                  {/* Icon (center on desktop) */}
                  <motion.div
                    className={`relative z-10 w-16 h-16 rounded-xl flex items-center justify-center ${
                      index === 0 ? 'bg-primary/20 text-primary border-2 border-primary/30' :
                      index === 1 ? 'bg-secondary/20 text-secondary border-2 border-secondary/30' :
                      'bg-accent/20 text-accent border-2 border-accent/30'
                    }`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <Icon className="w-8 h-8" />
                    <span className="absolute -top-2 -right-2 text-xs font-mono bg-card rounded-full w-6 h-6 flex items-center justify-center border border-white/10">
                      {phase.number}
                    </span>
                  </motion.div>

                  {/* Spacer for opposite side */}
                  <div className="flex-1 hidden md:block" />
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Button
            size="lg"
            className="glow-button bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-8 py-6 rounded-full font-medium"
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
          >
            {t.partnership.cta}
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
