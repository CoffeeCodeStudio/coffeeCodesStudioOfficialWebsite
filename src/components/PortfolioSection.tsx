import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

export function PortfolioSection() {
  const { t } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const projects = [
    {
      name: t.portfolio.project1.name,
      category: t.portfolio.project1.category,
      description: t.portfolio.project1.description,
      cta: t.portfolio.viewDemo,
      icon: '🍳',
      gradient: 'from-amber-glow/20 to-primary/10',
      borderColor: 'border-primary/30',
    },
    {
      name: t.portfolio.project2.name,
      category: t.portfolio.project2.category,
      description: t.portfolio.project2.description,
      cta: t.portfolio.explorePrototype,
      icon: '🎵',
      gradient: 'from-secondary/20 to-cyber-blue/10',
      borderColor: 'border-secondary/30',
    },
    {
      name: t.portfolio.project3.name,
      category: t.portfolio.project3.category,
      description: t.portfolio.project3.description,
      cta: t.portfolio.seeDesign,
      icon: '📝',
      gradient: 'from-accent/20 to-accent/5',
      borderColor: 'border-accent/30',
    },
  ];

  return (
    <section id="projects" className="py-24 relative" ref={ref}>
      <div className="container mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-5xl font-serif mb-6">
            <span className="gradient-text">{t.portfolio.headline}</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t.portfolio.intro}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              className={`glass-card rounded-2xl overflow-hidden border ${project.borderColor} group`}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              whileHover={{ y: -8 }}
            >
              {/* Project Preview */}
              <div className={`relative aspect-video bg-gradient-to-br ${project.gradient} p-6`}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.span 
                    className="text-5xl"
                    whileHover={{ scale: 1.2, rotate: 10 }}
                  >
                    {project.icon}
                  </motion.span>
                </div>
                
                {/* Decorative UI elements */}
                <div className="absolute top-4 left-4 flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/50" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                  <div className="w-3 h-3 rounded-full bg-green-500/50" />
                </div>
              </div>

              {/* Project Info */}
              <div className="p-6">
                <div className="mb-3">
                  <h3 className="text-xl font-serif text-foreground mb-1">
                    {project.name}
                  </h3>
                  <p className="text-sm text-primary font-medium">
                    {project.category}
                  </p>
                </div>

                <p className="text-sm text-muted-foreground mb-6 line-clamp-3">
                  {project.description}
                </p>

                <Button 
                  variant="outline" 
                  size="sm"
                  className="w-full border-primary/30 text-primary hover:bg-primary/10 group-hover:border-primary transition-colors"
                >
                  {project.cta}
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
