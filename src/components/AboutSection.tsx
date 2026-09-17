import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { MapPin } from 'lucide-react';

const stats = [
  { number: '3', label: 'Production Apps Shipped' },
  { number: '340+', label: 'Real-World Users' },
  { number: '100', label: 'Lighthouse Accessibility' },
  { number: 'Jan 2026', label: 'First Live Deploy' },
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
              I bridge the gap between product vision and production-grade engineering.
            </p>

            <p className="text-lg text-muted-foreground leading-relaxed mb-4">
              Over the past year, I built and deployed three full-stack applications — Echo2000, Klar, and DJ Lobo Producciones — taking them from initial schema design to active, real-world users. When Echo2000 suffered a production crisis, I rebuilt the entire system within 24 hours and reactivated 129 users.
            </p>

            <p className="text-lg text-muted-foreground leading-relaxed">
              I leverage modern AI developer workflows as a force multiplier to compress delivery cycles. But fast scaffolding means nothing without structural discipline: every architecture trade-off, PostgreSQL Row-Level Security policy, and type contract is manually designed, vetted, and maintained by me. I've worked solo on all three projects — architecture, code, deployment, and production support. That's taught me to be my own reviewer. I'm now looking for a team where I can learn from engineers who've done this at scale.
            </p>

            <div className="mt-6 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" aria-hidden="true" />
              <span className="text-sm font-mono text-muted-foreground">
                Based in Gothenburg, Sweden • Open to full-time product engineering roles (hybrid or on-site across Västra Götaland).
              </span>
            </div>

            <p className="text-sm font-mono text-muted-foreground mt-2">
              🌐 Languages: Swedish (native) · English (fluent) · Arabic (fluent)
            </p>

            <p className="text-sm font-mono text-muted-foreground mt-1">
              🤖 AI Stack: Claude Code · Lovable · Groq · Gemini
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
