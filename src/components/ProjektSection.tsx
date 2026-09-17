import { motion } from 'framer-motion';
import { useEffect, useState, useCallback } from 'react';
import { ExternalLink, Github, X } from 'lucide-react';
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
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [selectedProject, setSelectedProject] = useState<PortfolioProject | null>(null);

  useEffect(() => {
    supabase
      .from('portfolio_projects')
      .select('id, title, category, description, url, image_url, sort_order')
      .eq('is_visible', true)
      .order('sort_order', { ascending: true })
      .then(({ data }) => setProjects(data as PortfolioProject[] || []));
  }, []);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedProject(null);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const handleCardClick = useCallback((project: PortfolioProject) => {
    setSelectedProject(project);
  }, []);

  return (
    <section id="projekt" className="relative">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          className="text-center mb-fluid-header"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.45, ease: 'easeOut' }}>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-serif mb-4">
            <span className="gradient-text">Shipped Work</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground reading-width">
            Production applications built and deployed — real users, real systems.
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
              Projects loading...
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-fluid-grid max-w-5xl mx-auto">
            {projects.map((project, i) => (
              <motion.div
                key={project.id}
                className="glass-card cyber-border rounded-2xl overflow-hidden border border-primary/20 flex flex-col"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.5, delay: i * 0.08, ease: 'easeOut' }}
                whileHover={{ y: -5 }}
                onClick={() => handleCardClick(project)}
                style={{ cursor: 'pointer' }}
              >
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
                  <p className="text-muted-foreground text-sm leading-relaxed mb-3 flex-1">
                    {project.description}
                  </p>
                  <div className="flex items-center gap-2 mt-auto pt-3">
                    <span className="text-xs font-mono text-primary">Click to explore →</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {selectedProject && (
          <div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
            onClick={() => setSelectedProject(null)}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />

            {/* Panel */}
            <motion.div
              className="relative w-full sm:max-w-2xl max-h-[90vh] overflow-y-auto glass-card cyber-border rounded-t-2xl sm:rounded-2xl p-6 sm:p-8 z-10"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Category */}
              {selectedProject.category && (
                <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-1 rounded mb-3 inline-block">
                  {selectedProject.category}
                </span>
              )}

              {/* Title */}
              <h3 className="text-2xl font-serif gradient-text mb-3">
                {selectedProject.title}
              </h3>

              {/* Image */}
              {selectedProject.image_url && (
                <img
                  src={selectedProject.image_url}
                  alt={selectedProject.title}
                  className="w-full h-48 object-cover rounded-xl mb-4"
                />
              )}

              {/* Description */}
              <p className="text-muted-foreground leading-relaxed mb-6">
                {selectedProject.description}
              </p>

              {/* Placeholder sections */}
              <div className="space-y-4 mb-6">
                <div className="glass-card rounded-xl p-4 border border-primary/10">
                  <p className="text-xs font-mono text-primary mb-1">PROBLEM</p>
                  <p className="text-sm text-muted-foreground">Details coming soon.</p>
                </div>
                <div className="glass-card rounded-xl p-4 border border-primary/10">
                  <p className="text-xs font-mono text-primary mb-1">ARCHITECTURE & AI WORKFLOW</p>
                  <p className="text-sm text-muted-foreground">Details coming soon.</p>
                </div>
                <div className="glass-card rounded-xl p-4 border border-primary/10">
                  <p className="text-xs font-mono text-primary mb-1">METRICS</p>
                  <p className="text-sm text-muted-foreground">Details coming soon.</p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3 flex-wrap">
                {selectedProject.url && (
                  <Button
                    className="glow-button bg-primary text-primary-foreground hover:bg-primary/90"
                    onClick={() => window.open(selectedProject.url!, '_blank')}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Launch Live App
                  </Button>
                )}
                <Button
                  variant="outline"
                  className="border-primary/30 text-primary hover:bg-primary/10"
                  onClick={() => window.open('https://github.com/CoffeeCodeStudio', '_blank')}
                >
                  <Github className="w-4 h-4 mr-2" />
                  View on GitHub
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
}
