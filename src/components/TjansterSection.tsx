import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Rocket, Zap, Sparkles, MessageCircle, Code, RocketIcon, ArrowRight } from 'lucide-react';

const serviceIcons = [Rocket, Zap, Sparkles];
const stepIcons = [MessageCircle, Code, RocketIcon];

export function TjansterSection() {
  const { t } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const services = [
    { icon: serviceIcons[0], title: t.services.mvpTitle, description: t.services.mvpDescription },
    { icon: serviceIcons[1], title: t.services.rapidTitle, description: t.services.rapidDescription },
    { icon: serviceIcons[2], title: t.services.aiTitle, description: t.services.aiDescription },
  ];

  const steps = [
    { icon: stepIcons[0], title: t.process.step1.title, text: t.process.step1.text },
    { icon: stepIcons[1], title: t.process.step2.title, text: t.process.step2.text },
    { icon: stepIcons[2], title: t.process.step3.title, text: t.process.step3.text },
  ];

  return (
    <section id="tjanster" className="py-14 sm:py-20 relative" ref={ref}>
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          className="text-center mb-12 sm:mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-serif mb-4 sm:mb-6">
            <span className="gradient-text">{t.services.headline}</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto">
            {t.services.intro}
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto mb-16 sm:mb-20">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={index}
                className="glass-card cyber-border p-6 sm:p-8 rounded-2xl relative overflow-hidden group"
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                whileHover={{ y: -5 }}
              >
                <motion.div
                  className={`w-12 h-12 mb-4 rounded-xl flex items-center justify-center ${
                    index === 0 ? 'bg-primary/20 text-primary' :
                    index === 1 ? 'bg-secondary/20 text-secondary' :
                    'bg-accent/20 text-accent'
                  }`}
                  whileHover={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <Icon className="w-6 h-6" />
                </motion.div>
                <h3 className="text-lg font-serif mb-2 text-foreground">{service.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{service.description}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Process Steps */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h3 className="text-xl sm:text-2xl md:text-3xl font-serif mb-2">
            <span className="gradient-text">{t.process.headline}</span>
          </h3>
        </motion.div>

        <div className="grid md:grid-cols-[1fr_auto_1fr_auto_1fr] gap-4 sm:gap-6 max-w-5xl mx-auto items-start">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="contents">
                <motion.div
                  className="flex items-start gap-4 p-5 rounded-xl glass-card border border-border/20"
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.15 }}
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/20 text-primary flex items-center justify-center font-bold text-sm">
                    0{index + 1}
                  </div>
                  <div>
                    <h4 className="font-serif text-foreground mb-1">{step.title}</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">{step.text}</p>
                  </div>
                </motion.div>
                {index < steps.length - 1 && (
                  <div className="hidden md:flex items-center justify-center self-center">
                    <ArrowRight className="w-5 h-5 text-primary/30" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
