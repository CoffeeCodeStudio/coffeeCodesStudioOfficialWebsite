import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { ExternalLink, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ProjektSection() {
  const { t } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="projects" className="py-16 sm:py-24 relative" ref={ref}>
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          className="text-center mb-12 sm:mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-serif mb-4">
            <span className="gradient-text">{t.portfolio.headline}</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            {t.portfolio.intro}
          </p>
        </motion.div>

        {/* Case Study Card */}
        <motion.div
          className="max-w-3xl mx-auto glass-card cyber-border rounded-2xl overflow-hidden border border-primary/20"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          whileHover={{ y: -5 }}
        >
          {/* Preview Header */}
          <div className="relative bg-gradient-to-br from-primary/10 to-secondary/5 p-8 sm:p-12">
            <div className="absolute top-4 left-4 flex gap-2">
              <div className="w-3 h-3 rounded-full bg-destructive/50" />
              <div className="w-3 h-3 rounded-full bg-primary/50" />
              <div className="w-3 h-3 rounded-full bg-accent/50" />
            </div>
            <div className="flex items-center justify-center">
              <motion.div
                className="w-20 h-20 rounded-2xl bg-primary/20 flex items-center justify-center"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <Globe className="w-10 h-10 text-primary" />
              </motion.div>
            </div>
          </div>

          {/* Project Info */}
          <div className="p-6 sm:p-8">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-1 rounded">
                {t.portfolio.project1.category}
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-serif text-foreground mb-3">
              {t.portfolio.project1.name}
            </h3>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed mb-6">
              {t.portfolio.project1.description}
            </p>
            <Button
              variant="outline"
              className="border-primary/30 text-primary hover:bg-primary/10"
              onClick={() => window.open('https://djloboproducciones.com', '_blank')}
            >
              {t.portfolio.viewDemo}
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
