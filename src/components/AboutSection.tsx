import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { MapPin } from 'lucide-react';

const stats = [
  { number: '3', label: 'Production Apps' },
  { number: '18 538', label: 'Commits' },
  { number: '340+', label: 'Real Users' },
  { number: '< 1 year', label: 'All of this' },
];

export function AboutSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="about" className="relative" ref={ref}>
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Stats grid */}
          <motion.div
            className="order-2 md:order-1"
            initial={{ opacity: 0, x: -24 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="glass-card cyber-border rounded-xl p-6 text-center"
                >
                  <div className="text-3xl font-mono font-bold gradient-text mb-1">
                    {stat.number}
                  </div>
                  <div className="text-sm text-muted-foreground font-mono">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Text content */}
          <motion.div
            className="order-1 md:order-2"
            initial={{ opacity: 0, x: 24 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
          >
            <h2 className="text-3xl md:text-5xl font-serif mb-6">
              <span className="gradient-text">About Me</span>
            </h2>

            <p className="text-lg text-muted-foreground leading-relaxed mb-4">
              I'm Rami — a product engineer based in Gothenburg, Sweden. I build full-stack web applications using React, TypeScript, and Supabase, with AI tools as a core part of my workflow.
            </p>

            <p className="text-lg text-muted-foreground leading-relaxed mb-4">
              I built three production applications — Echo2000, Klar, and DJ Lobo Producciones — entirely solo, from zero to live users, within a year. No team. No hand-holding. Just shipping.
            </p>

            <p className="text-lg text-muted-foreground leading-relaxed">
              I treat AI as a force multiplier: faster scaffolding, faster iteration. But every architecture decision, security policy, and data model is mine. I own the code I ship.
            </p>

            <div className="mt-6 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" aria-hidden="true" />
              <span className="text-sm font-mono text-muted-foreground">
                Gothenburg, Sweden — Open to hybrid & on-site roles
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
