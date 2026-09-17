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

              {/* Project detail sections */}
              {selectedProject.title === 'Echo2000' && (
                <div className="space-y-4 mb-6">
                  <div className="glass-card rounded-xl p-4 border border-primary/10">
                    <p className="text-xs font-mono text-primary mb-2">PROBLEM</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Modern social feeds are algorithm-driven, ad-saturated and designed for passive consumption. There was no dedicated space for Swedish adults who grew up on LunarStorm and MSN — people who want real connection without performance pressure.
                    </p>
                  </div>
                  <div className="glass-card rounded-xl p-4 border border-primary/10">
                    <p className="text-xs font-mono text-primary mb-2">ARCHITECTURE & AI WORKFLOW</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Built with React 18, TypeScript, Vite, Tailwind CSS and Supabase. Real-time features (chat, guestbooks, live activity) stream via Supabase WebSocket channels. PostgreSQL Row-Level Security enforces strict data isolation per user. Supabase Edge Functions handle email queues, moderation, bot logic and notifications. AI tools (Claude, Lovable) scaffolded boilerplate and migrations — all security policies, state management and real-time logic were manually engineered. When a production crisis hit, the entire system was rebuilt within 24 hours with 100% user data preserved.
                    </p>
                  </div>
                  <div className="glass-card rounded-xl p-4 border border-primary/10">
                    <p className="text-xs font-mono text-primary mb-3">METRICS</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="text-center">
                        <div className="text-xl font-mono font-bold gradient-text">340+</div>
                        <div className="text-xs text-muted-foreground">Registered Users</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-mono font-bold gradient-text">10+</div>
                        <div className="text-xs text-muted-foreground">Edge Functions</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-mono font-bold gradient-text">24h</div>
                        <div className="text-xs text-muted-foreground">Disaster Recovery</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {selectedProject.title === 'Klar' && (
                <div className="space-y-4 mb-6">
                  <div className="glass-card rounded-xl p-4 border border-primary/10">
                    <p className="text-xs font-mono text-primary mb-2">PROBLEM</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      ~700,000 Swedish adults have dyslexia. Authority letters from Arbetsförmedlingen and Försäkringskassan are dense, formal and stressful. Missing a deadline can mean lost income. No existing app handled Swedish authority documents with AI while also supporting the combination of dyslexia and DLD.
                    </p>
                  </div>
                  <div className="glass-card rounded-xl p-4 border border-primary/10">
                    <p className="text-xs font-mono text-primary mb-2">ARCHITECTURE & AI WORKFLOW</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Built as a PWA with React, TypeScript, Tailwind CSS and Supabase. Gemini API handles document parsing — photos, PDFs and Word files are simplified into 5 clear bullet points. Documents are deleted immediately after analysis (GDPR Article 9). Push notifications and SMS fallback (46elks) power a 3-stage alarm system. Supabase Edge Functions run cron jobs for reminders and auto-deletion. Achieved 100/100 Lighthouse Accessibility score.
                    </p>
                  </div>
                  <div className="glass-card rounded-xl p-4 border border-primary/10">
                    <p className="text-xs font-mono text-primary mb-3">METRICS</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="text-center">
                        <div className="text-xl font-mono font-bold gradient-text">100</div>
                        <div className="text-xs text-muted-foreground">Lighthouse Accessibility</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-mono font-bold gradient-text">10</div>
                        <div className="text-xs text-muted-foreground">Free docs/month</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-mono font-bold gradient-text">WCAG AA</div>
                        <div className="text-xs text-muted-foreground">Compliant</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {selectedProject.title === 'DJ Lobo Producciones' && (
                <div className="space-y-4 mb-6">
                  <div className="glass-card rounded-xl p-4 border border-primary/10">
                    <p className="text-xs font-mono text-primary mb-2">PROBLEM</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      An established Gothenburg DJ with 20+ years experience and 1,000+ shows had a legacy website from 2015 — no booking system, no admin panel, no live radio integration. Bookings were lost to fragmented inboxes.
                    </p>
                  </div>
                  <div className="glass-card rounded-xl p-4 border border-primary/10">
                    <p className="text-xs font-mono text-primary mb-2">ARCHITECTURE & AI WORKFLOW</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Built with React, TypeScript, Vite, Tailwind CSS and Supabase. Features a persistent live radio player (ZenoFM + Mixcloud), automated booking system, Google Calendar sync for upcoming shows, and a 9-tab admin panel for content management. Image upload with built-in cropper. Bilingual (SV/EN). AI tools scaffolded UI components and audio integration — stream buffering and form sanitization were manually implemented.
                    </p>
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex gap-3 flex-wrap">
                {selectedProject.title === 'Echo2000' && (
                  <>
                    <Button
                      className="glow-button bg-primary text-primary-foreground hover:bg-primary/90"
                      onClick={() => window.open('https://echo2000.se', '_blank')}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Explore Echo2000 →
                    </Button>
                    <Button
                      variant="outline"
                      className="border-primary/30 text-primary hover:bg-primary/10"
                      onClick={() => window.open('https://github.com/CoffeeCodeStudio', '_blank')}
                    >
                      <Github className="w-4 h-4 mr-2" />
                      View on GitHub
                    </Button>
                  </>
                )}
                {selectedProject.title === 'Klar' && (
                  <>
                    <Button
                      className="glow-button bg-primary text-primary-foreground hover:bg-primary/90"
                      onClick={() => window.open('https://klar-se.lovable.app', '_blank')}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Try Klar →
                    </Button>
                    <Button
                      variant="outline"
                      className="border-primary/30 text-primary hover:bg-primary/10"
                      onClick={() => window.open('https://github.com/CoffeeCodeStudio', '_blank')}
                    >
                      <Github className="w-4 h-4 mr-2" />
                      View on GitHub
                    </Button>
                  </>
                )}
                {selectedProject.title === 'DJ Lobo Producciones' && (
                  <Button
                    className="glow-button bg-primary text-primary-foreground hover:bg-primary/90"
                    onClick={() => window.open('https://djloboproducciones.com', '_blank')}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Visit Live Site →
                  </Button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
}
