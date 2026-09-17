import { motion } from 'framer-motion';

const steps = [
  {
    number: '01',
    title: 'Architectural Scoping',
    label: 'Human-Led',
    description: 'Before generating a single line of code, I model PostgreSQL schemas, define TypeScript domain types, and map authentication and security boundaries.',
  },
  {
    number: '02',
    title: 'High-Velocity Scaffolding',
    label: 'AI-Assisted',
    description: 'I direct Claude, Cursor, and Lovable to scaffold component trees, draft CRUD functions and API integrations — in minutes instead of days.',
  },
  {
    number: '03',
    title: 'Rigorous Hardening',
    label: 'Human-Led',
    description: 'All machine-generated code is audited, stripped of redundant dependencies, typed strictly without any, and secured with granular PostgreSQL Row-Level Security policies.',
  },
  {
    number: '04',
    title: 'Deterministic Deployment',
    label: 'Verified',
    description: 'Automated verification through ESLint, strict TypeScript compiler checks (tsc --noEmit), and edge deployment on Vercel and Supabase.',
  },
];

export function MethodologySection() {
  return (
    <section id="methodology" className="relative py-16 sm:py-24 px-4 sm:px-6" aria-label="Engineering methodology">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          className="text-center mb-12 sm:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif gradient-text mb-4">
            Engineering Methodology
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
            How I combine modern AI acceleration with strict production standards.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              className="glass-card cyber-border rounded-xl p-6 flex flex-col"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div className="flex items-center justify-between mb-6">
                <span className="text-3xl font-mono font-bold text-primary/80">
                  {step.number}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-wider border border-primary/20 rounded-full px-2 py-0.5 text-muted-foreground">
                  {step.label}
                </span>
              </div>
              <h3 className="text-lg font-semibold mb-3">
                {step.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
