import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { MapPin, User } from 'lucide-react';

const stats = [
  { number: '3', label: 'Production Apps Shipped' },
  { number: '340+', label: 'Real-World Users' },
  { number: '100', label: 'Lighthouse Accessibility' },
  { number: '100%', label: 'TypeScript' },
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
            {/* TODO: replace with real headshot */}
            <div className="w-24 h-24 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mb-6" aria-hidden="true">
              <User className="w-12 h-12 text-primary/70" />
            </div>
            <h2 className="text-3xl md:text-5xl font-serif mb-6">
              <span className="gradient-text">About Me</span>
            </h2>

            <p className="text-lg text-muted-foreground leading-relaxed mb-4">
              I decide what an app should do and how it works, then build it with AI tools.
            </p>

            <p className="text-lg text-muted-foreground leading-relaxed mb-4">
              Over the past several months, I built and deployed three web applications with AI tools — Echo2000, Klar, and DJ Lobo Producciones — from idea to real-world registered users. Echo2000 suffered a production crisis; I rebuilt the system from the ground up.
            </p>

            <p className="text-lg text-muted-foreground leading-relaxed">
              I direct the AI, test what it builds and review the result. I'm now looking for a team where I can learn from other developers.
            </p>

            <div className="mt-6 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" aria-hidden="true" />
              <span className="text-sm font-mono text-muted-foreground">
                Based in Gothenburg, Sweden • Open to full-time AI-Assisted Developer roles (hybrid or on-site across Västra Götaland).
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
