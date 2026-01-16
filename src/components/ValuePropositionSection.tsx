import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Shield, Clock, BarChart3, ArrowRight } from 'lucide-react';

export function ValuePropositionSection() {
  const { t } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const stats = [
    { value: t.value.stat1, label: t.value.stat1Label },
    { value: t.value.stat2, label: t.value.stat2Label },
    { value: t.value.stat3, label: t.value.stat3Label },
    { value: t.value.stat4, label: t.value.stat4Label },
  ];

  const benefits = [
    {
      icon: Shield,
      title: t.value.benefit1Title,
      text: t.value.benefit1Text,
      color: 'primary',
    },
    {
      icon: Clock,
      title: t.value.benefit2Title,
      text: t.value.benefit2Text,
      color: 'secondary',
    },
    {
      icon: BarChart3,
      title: t.value.benefit3Title,
      text: t.value.benefit3Text,
      color: 'accent',
    },
  ];

  return (
    <section id="value" className="py-24 relative overflow-hidden" ref={ref}>
      {/* Background effect */}
      <div className="absolute inset-0 code-bg opacity-30" />
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-5xl font-serif mb-6">
            <span className="gradient-text">{t.value.headline}</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t.value.intro}
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-16">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="glass-card p-6 rounded-xl text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <motion.div
                className="text-4xl md:text-5xl font-serif gradient-text mb-2"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.8, delay: 0.3 + index * 0.1 }}
              >
                {stat.value}
              </motion.div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Benefits */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-12">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={index}
                className="glass-card cyber-border p-8 rounded-2xl text-center"
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.4 + index * 0.15 }}
                whileHover={{ y: -5 }}
              >
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
                <h3 className="text-xl font-serif mb-3 text-foreground">
                  {benefit.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {benefit.text}
                </p>
              </motion.div>
            );
          })}
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
            variant="outline"
            className="border-primary/50 text-primary hover:bg-primary/10 text-lg px-8 py-6 rounded-full font-medium"
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
          >
            {t.value.cta}
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
