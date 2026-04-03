import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useEffect, useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

interface PortfolioProject {
  id: string;
  title: string;
  category: string;
  description: string;
  url: string | null;
  image_url: string | null;
  sort_order: number;
}

export function ProjektSection() {
  const { t } = useLanguage();
  const [projects, setProjects] = useState<PortfolioProject[]>([]);

  useEffect(() => {
    supabase
      .from('portfolio_projects')
      .select('id, title, category, description, url, image_url, sort_order')
      .eq('is_visible', true)
      .order('sort_order', { ascending: true })
      .then(({ data }) => setProjects(data as PortfolioProject[] || []));
  }, []);

  return (
    <section id="projekt" className="py-14 sm:py-20 relative">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          className="text-center mb-12 sm:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.6 }}>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-serif mb-4">
            <span className="gradient-text">{t.portfolio.headline}</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            {t.portfolio.intro}
          </p>
        </motion.div>

        {projects.length === 0 ? (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-muted-foreground text-lg font-serif italic">
              {t.portfolio.comingSoon}
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {projects.map((project, i) => (
              <motion.div
                key={project.id}
                className="glass-card cyber-border rounded-2xl overflow-hidden border border-primary/20 flex flex-col"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.6, delay: 0.1 + i * 0.15 }}
                whileHover={{ y: -5 }}>
                {project.image_url && (
                  <div className="relative">
                    <img
                      src={project.image_url}
                      alt={project.title}
                      className="w-full h-48 sm:h-56 object-cover"
                      loading={i === 0 ? 'eager' : 'lazy'}
                      width="768"
                      height="561"
                    />
                  </div>
                )}
                <div className="p-5 sm:p-6 flex flex-col flex-1">
                  {project.category && (
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-1 rounded">
                        {project.category}
                      </span>
                    </div>
                  )}
                  <h3 className="text-lg sm:text-xl font-serif text-foreground mb-2">
                    {project.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-5 flex-1">
                    {project.description}
                  </p>
                  {project.url && (
                    <Button
                      variant="outline"
                      className="border-primary/30 text-primary hover:bg-primary/10 w-fit"
                      onClick={() => window.open(project.url!, '_blank')}>
                      {t.portfolio.viewDemo}
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
