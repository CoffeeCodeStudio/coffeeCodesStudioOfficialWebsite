import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Rocket, Zap, Sparkles, RefreshCw, ArrowRight } from 'lucide-react';

const serviceIcons = [
  { icon: Rocket, color: 'primary' },
  { icon: Zap, color: 'secondary' },
  { icon: Sparkles, color: 'accent' },
  { icon: RefreshCw, color: 'primary' },
];

export function ServicesSection() {
  const { t } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const services = [
    {
      ...serviceIcons[0],
      title: t.services.mvpTitle,
      description: t.services.mvpDescription,
    },
    {
      ...serviceIcons[1],
      title: t.services.rapidTitle,
      description: t.services.rapidDescription,
    },
    {
      ...serviceIcons[2],
      title: t.services.aiTitle,
      description: t.services.aiDescription,
    },
    {
      ...serviceIcons[3],
      title: t.services.iterationTitle,
      description: t.services.iterationDescription,
    },
  ];

  return (
    <section id="services" className="py-16 sm:py-24 relative" ref={ref}>
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          className="text-center mb-10 sm:mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-serif mb-4 sm:mb-6">
            <span className="gradient-text">{t.services.headline}</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto px-2">
            {t.services.intro}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 max-w-5xl mx-auto mb-8 sm:mb-12">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={index}
                className="glass-card cyber-border p-5 sm:p-8 rounded-2xl relative overflow-hidden group"
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                whileHover={{ y: -5 }}
              >
                {/* Icon */}
                <motion.div
                  className={`w-12 sm:w-14 h-12 sm:h-14 mb-4 sm:mb-6 rounded-xl flex items-center justify-center ${
                    index === 0 ? 'bg-primary/20 text-primary' :
                    index === 1 ? 'bg-secondary/20 text-secondary' :
                    index === 2 ? 'bg-accent/20 text-accent' :
                    'bg-primary/20 text-primary'
                  }`}
                  whileHover={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <Icon className="w-6 sm:w-7 h-6 sm:h-7" />
                </motion.div>

                {/* Content */}
                <h3 className="text-lg sm:text-xl font-serif mb-2 sm:mb-3 text-foreground">
                  {service.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {service.description}
                </p>

                {/* Decorative number */}
                <div className="absolute top-3 sm:top-4 right-3 sm:right-4 text-5xl sm:text-6xl font-serif text-white/5">
                  0{index + 1}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Button
            size="lg"
            className="glow-button bg-primary text-primary-foreground hover:bg-primary/90 text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 rounded-full font-medium"
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
          >
            {t.services.cta}
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
