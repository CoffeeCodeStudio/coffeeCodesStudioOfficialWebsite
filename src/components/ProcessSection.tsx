import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { MessageCircle, Code, Rocket } from 'lucide-react';

const steps = [
  {
    icon: MessageCircle,
    color: 'primary',
  },
  {
    icon: Code,
    color: 'secondary',
  },
  {
    icon: Rocket,
    color: 'accent',
  },
];

export function ProcessSection() {
  const { t } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const processSteps = [
    { ...steps[0], title: t.process.step1.title, subtitle: t.process.step1.subtitle, text: t.process.step1.text },
    { ...steps[1], title: t.process.step2.title, subtitle: t.process.step2.subtitle, text: t.process.step2.text },
    { ...steps[2], title: t.process.step3.title, subtitle: t.process.step3.subtitle, text: t.process.step3.text },
  ];

  return (
    <section id="process" className="py-24 relative" ref={ref}>
      <div className="container mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-5xl font-serif mb-6">
            <span className="gradient-text">{t.process.headline}</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t.process.intro}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {processSteps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={index}
                className="glass-card cyber-border p-8 rounded-2xl text-center relative overflow-hidden group"
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ y: -5 }}
              >
                {/* Step number */}
                <div className="absolute top-4 right-4 text-6xl font-serif text-white/5">
                  0{index + 1}
                </div>

                {/* Icon */}
                <motion.div
                  className={`w-16 h-16 mx-auto mb-6 rounded-xl flex items-center justify-center ${
                    index === 0 ? 'bg-primary/20 text-primary' :
                    index === 1 ? 'bg-secondary/20 text-secondary' :
                    'bg-accent/20 text-accent'
                  }`}
                  whileHover={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <Icon className="w-8 h-8" />
                </motion.div>

                {/* Title */}
                <h3 className="text-xl font-serif mb-2 text-foreground">
                  {step.title}
                </h3>
                <p className="text-sm text-primary mb-4 font-medium">
                  {step.subtitle}
                </p>

                {/* Description */}
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {step.text}
                </p>

                {/* Connecting line */}
                {index < 2 && (
                  <div className="hidden md:block absolute -right-4 top-1/2 w-8 h-0.5 bg-gradient-to-r from-primary/50 to-transparent" />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
