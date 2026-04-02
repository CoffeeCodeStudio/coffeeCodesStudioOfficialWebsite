import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { Check, Star, Zap, Crown, Rocket, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const packages = [
  { key: 'bas' as const, icon: Zap, popular: false },
  { key: 'standard' as const, icon: Star, popular: true },
  { key: 'premium' as const, icon: Crown, popular: false },
];

export function PricingSection() {
  const { t } = useLanguage();
  const p = t.pricing;

  return (
    <section id="priser" className="py-24 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-serif text-foreground mb-4">{p.headline}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">{p.intro}</p>
        </motion.div>

        {/* One-time Project Card — FIRST and prominent */}
        <motion.div
          className="max-w-3xl mx-auto mb-8 glass-card rounded-2xl p-10 border-2 border-primary/30 shadow-[0_0_50px_-12px_hsl(var(--primary)/0.25)] hover:border-primary/50 transition-all"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col sm:flex-row sm:items-start gap-6">
            <div className="w-16 h-16 rounded-2xl bg-primary/15 flex items-center justify-center shrink-0">
              <Rocket className="w-8 h-8 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-serif text-foreground mb-2">{p.oneTime.title}</h3>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-4xl font-bold text-primary">{p.oneTime.price}</span>
                <span className="text-muted-foreground text-sm">kr</span>
              </div>
              <p className="text-muted-foreground text-sm mb-6">{p.oneTime.description}</p>
              <ul className="grid sm:grid-cols-2 gap-3 mb-6">
                {p.oneTime.features.map((feature: string, i: number) => (
                  <li key={i} className="flex items-center gap-2.5 text-sm">
                    <Check className="w-4 h-4 text-primary shrink-0" />
                    <span className="text-foreground/80">{feature}</span>
                  </li>
                ))}
              </ul>
              <p className="text-xs text-muted-foreground italic mb-5">{p.oneTime.note}</p>
              <a
                href="#kontakt"
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector('#kontakt')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-block text-center py-3 px-8 rounded-xl font-medium text-sm bg-primary text-primary-foreground hover:brightness-110 shadow-lg shadow-primary/20 transition-all"
              >
                {p.oneTime.cta}
              </a>
            </div>
          </div>
        </motion.div>

        {/* Disclaimer */}
        <p className="text-xs text-muted-foreground italic text-center max-w-2xl mx-auto mb-16">
          {p.disclaimerText}
        </p>

        {/* Maintenance headline */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-xl md:text-2xl font-serif text-foreground/80">{p.maintenanceHeadline}</h3>
        </motion.div>

        {/* Maintenance packages */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
          {packages.map((pkg, index) => {
            const pkgData = p.packages[pkg.key];
            const Icon = pkg.icon;
            return (
              <motion.div
                key={pkg.key}
                className={`relative glass-card rounded-2xl p-8 border transition-all duration-300 hover:scale-[1.02] ${
                  pkg.popular
                    ? 'border-primary/40 shadow-[0_0_40px_-10px_hsl(var(--primary)/0.3)]'
                    : 'border-border/30 hover:border-primary/20'
                }`}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-4 py-1 rounded-full">
                    {p.popular}
                  </div>
                )}

                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${pkg.popular ? 'bg-primary/20' : 'bg-muted'}`}>
                  <Icon className={`w-6 h-6 ${pkg.popular ? 'text-primary' : 'text-muted-foreground'}`} />
                </div>

                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-xl font-serif text-foreground">{pkgData.name}</h3>
                  <TooltipProvider delayDuration={200}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="w-4 h-4 text-muted-foreground/60 hover:text-primary cursor-help transition-colors" />
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-[220px] text-xs">
                        {p.tooltipText}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-3xl font-bold text-primary">{pkgData.price}</span>
                  <span className="text-muted-foreground text-sm">{p.perMonth}</span>
                </div>
                <p className="text-muted-foreground text-sm mb-6">{pkgData.description}</p>

                <ul className="space-y-3 mb-8">
                  {pkgData.features.map((feature: string, i: number) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm">
                      <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      <span className="text-foreground/80">{feature}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href="#kontakt"
                  onClick={(e) => {
                    e.preventDefault();
                    document.querySelector('#kontakt')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={`block text-center py-3 px-6 rounded-xl font-medium text-sm transition-all ${
                    pkg.popular
                      ? 'bg-primary text-primary-foreground hover:brightness-110 shadow-lg shadow-primary/20'
                      : 'bg-muted text-foreground hover:bg-muted/80 border border-border/30'
                  }`}
                >
                  {p.cta}
                </a>
              </motion.div>
            );
          })}
        </div>

        {/* Payment note */}
        <motion.div
          className="max-w-3xl mx-auto text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <p className="text-sm text-muted-foreground">{p.paymentNote}</p>
        </motion.div>
      </div>
    </section>
  );
}
