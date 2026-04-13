import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { Check, Zap as ZapIcon, Star, Rocket, Info, ChevronDown } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const packages = [
  { key: 'bas' as const, icon: ZapIcon, highlighted: false },
  { key: 'standard' as const, icon: Star, highlighted: true },
];

export function PricingSection() {
  const { t } = useLanguage();
  const p = t.pricing;
  const [maintenanceOpen, setMaintenanceOpen] = useState(false);

  return (
    <section id="priser" className="py-14 sm:py-20 relative overflow-hidden">
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
          <p className="text-sm text-muted-foreground/70 max-w-2xl mx-auto mt-3">{p.scopeNote}</p>
        </motion.div>

        {/* Starter + One-time Project — side by side */}
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto mb-8">
          {/* Starter Card — clean, simple */}
          <motion.div
            className="glass-card rounded-2xl p-8 border border-border/30 hover:border-primary/20 transition-all flex flex-col"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center shrink-0">
                <ZapIcon className="w-6 h-6 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-xl font-serif text-foreground">{p.starter.title}</h3>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-3xl font-bold text-primary">{p.starter.price}</span>
                  <span className="text-muted-foreground text-sm">kr</span>
                </div>
              </div>
            </div>
            <p className="text-muted-foreground text-sm mb-5">{p.starter.description}</p>
            <ul className="space-y-3 mb-5 flex-1">
              {p.starter.features.map((feature: string, i: number) => (
                <li key={i} className="flex items-center gap-2.5 text-sm">
                  <Check className="w-4 h-4 text-primary shrink-0" />
                  <span className="text-foreground/80">{feature}</span>
                </li>
              ))}
            </ul>
            <p className="text-xs text-muted-foreground italic mb-5">{p.starter.note}</p>
            <a
              href="#kontakt"
              onClick={(e) => {
                e.preventDefault();
                trackEvent('pricing_cta_click', { plan: 'starter' });
                document.querySelector('#kontakt')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="block text-center py-3 px-6 rounded-xl font-medium text-sm transition-all bg-muted text-foreground hover:bg-muted/80 border border-border/30"
            >
              {p.starter.cta}
            </a>
          </motion.div>

          {/* One-time Project Card — prominent */}
          <motion.div
            className="glass-card rounded-2xl p-8 border-2 border-primary/30 shadow-[0_0_50px_-12px_hsl(var(--primary)/0.25)] hover:border-primary/50 transition-all flex flex-col"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center shrink-0">
                <Rocket className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-serif text-foreground">{p.oneTime.title}</h3>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-3xl font-bold text-primary">{p.oneTime.price}</span>
                  <span className="text-muted-foreground text-sm">kr</span>
                </div>
              </div>
            </div>
            <p className="text-muted-foreground text-sm mb-5">{p.oneTime.description}</p>
            <ul className="space-y-3 mb-5 flex-1">
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
                trackEvent('pricing_cta_click', { plan: 'onetime' });
                document.querySelector('#kontakt')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="block text-center py-3 px-8 rounded-xl font-medium text-sm bg-primary text-primary-foreground hover:brightness-110 shadow-lg shadow-primary/20 transition-all"
            >
              {p.oneTime.cta}
            </a>
          </motion.div>
        </div>

        {/* Disclaimer */}
        <p className="text-xs text-muted-foreground italic text-center max-w-2xl mx-auto mb-16">
          {p.disclaimerText}
        </p>

        {/* Collapsible maintenance section */}
        <div className="max-w-5xl mx-auto mb-12">
          <button
            onClick={() => setMaintenanceOpen(!maintenanceOpen)}
            className="w-full flex items-center justify-center gap-2 text-xl md:text-2xl font-serif text-foreground/80 hover:text-foreground transition-colors cursor-pointer py-4"
          >
            {p.showMaintenance}
            <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${maintenanceOpen ? 'rotate-180' : ''}`} />
          </button>

          {maintenanceOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-sm text-muted-foreground text-center mb-8">{p.maintenanceHeadline}</p>
              <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                {packages.map((pkg, index) => {
                  const pkgData = p.packages[pkg.key];
                  const Icon = pkg.icon;
                  return (
                    <motion.div
                      key={pkg.key}
                      className={`relative glass-card rounded-2xl p-8 transition-all duration-300 hover:scale-[1.02] flex flex-col ${
                        pkg.highlighted
                          ? 'border-2 border-primary/30 shadow-[0_0_50px_-12px_hsl(var(--primary)/0.25)] hover:border-primary/50'
                          : 'border border-border/30 hover:border-primary/20'
                      }`}
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.15 }}
                    >
                      {pkg.highlighted && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full">
                          {p.popular}
                        </div>
                      )}
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${pkg.highlighted ? 'bg-primary/15' : 'bg-muted'}`}>
                        <Icon className={`w-6 h-6 ${pkg.highlighted ? 'text-primary' : 'text-muted-foreground'}`} />
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

                      <ul className="space-y-3 mb-8 flex-1">
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
                          trackEvent('pricing_cta_click', { plan: `maintenance_${pkg.key}` });
                          document.querySelector('#kontakt')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className={`block text-center py-3 px-6 rounded-xl font-medium text-sm transition-all ${
                          pkg.highlighted
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
              <p className="text-sm text-muted-foreground/70 text-center mt-6">{p.maintenanceExtra}</p>
            </motion.div>
          )}
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
