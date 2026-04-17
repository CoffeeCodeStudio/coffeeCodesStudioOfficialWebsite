import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { Coffee, Crown, Info, ChevronDown, Check } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const packages = [
  { key: 'bas' as const, icon: Coffee, highlighted: false },
  { key: 'standard' as const, icon: Crown, highlighted: true },
];

export function PricingSection() {
  const { t } = useLanguage();
  const p = t.pricing;
  const [maintenanceOpen, setMaintenanceOpen] = useState(false);

  const FeatureList = ({ features }: { features: string[] }) => (
    <ul className="space-y-2">
      {features.map((f, i) => (
        <li key={i} className="flex items-start gap-2 text-sm text-foreground/70 leading-relaxed">
          <Check className="w-3 h-3 text-muted-foreground mt-1 shrink-0" strokeWidth={2.5} />
          <span>{f}</span>
        </li>
      ))}
    </ul>
  );

  return (
    <section id="priser" className="relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="text-center mb-fluid-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-serif text-foreground mb-4">{p.headline}</h2>
          <p className="text-muted-foreground reading-width">{p.intro}</p>
          <p className="text-sm text-muted-foreground/70 reading-width mt-3">{p.scopeNote}</p>
        </motion.div>

        {/* Starter + One-time Project — side by side */}
        <div className="grid md:grid-cols-2 gap-fluid-grid max-w-5xl mx-auto mb-8 items-stretch">
          {/* Starter Card */}
          <motion.div
            className="relative bg-transparent border border-primary/20 rounded-2xl p-10 hover:border-primary/30 transition-all flex flex-col"
            style={{ borderWidth: '0.5px' }}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {/* Spacer to align with badge on highlighted card */}
            <div className="h-6 mb-2" aria-hidden="true" />
            <h3 className="text-xl font-serif text-foreground mb-3">{p.starter.title}</h3>
            <div className="flex items-baseline gap-1.5 mb-6">
              <span className="text-4xl font-light text-foreground">{p.starter.price}</span>
              <span className="text-xs text-muted-foreground tracking-wider">SEK</span>
            </div>

            <p className="text-muted-foreground text-sm mb-6">{p.starter.description}</p>

            <div className="border-t border-primary/10 pt-6 mb-6 flex-1">
              <FeatureList features={p.starter.features} />
            </div>

            <p className="text-xs text-muted-foreground italic mb-6">{p.starter.note}</p>
            <a
              href="#kontakt?plan=starter"
              onClick={(e) => {
                e.preventDefault();
                trackEvent('pricing_cta_click', { plan: 'starter' });
                window.location.hash = 'kontakt?plan=starter';
                document.querySelector('#kontakt')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="block text-center py-3 px-6 rounded-xl font-medium text-sm transition-all bg-transparent text-primary hover:bg-primary/5"
              style={{ border: '0.5px solid hsl(var(--primary) / 0.3)' }}
            >
              {p.starter.cta}
            </a>
          </motion.div>

          {/* One-time Project Card — highlighted */}
          <motion.div
            className="relative bg-transparent border border-primary/40 rounded-2xl p-10 hover:border-primary/60 transition-all flex flex-col"
            style={{ borderWidth: '0.5px' }}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="h-6 mb-2 flex items-center">
              <span className="bg-primary/10 text-primary text-xs px-3 py-1 rounded-full font-medium">
                Rekommenderad
              </span>
            </div>
            <h3 className="text-xl font-serif text-foreground mb-3">{p.oneTime.title}</h3>
            <div className="flex items-baseline gap-1.5 mb-6">
              <span className="text-4xl font-light text-foreground">{p.oneTime.price}</span>
              <span className="text-xs text-muted-foreground tracking-wider">SEK</span>
            </div>

            <p className="text-muted-foreground text-sm mb-6">{p.oneTime.description}</p>

            <div className="border-t border-primary/10 pt-6 mb-6 flex-1">
              <FeatureList features={p.oneTime.features} />
            </div>

            <p className="text-xs text-muted-foreground italic mb-6">{p.oneTime.note}</p>
            <a
              href="#kontakt?plan=onetime"
              onClick={(e) => {
                e.preventDefault();
                trackEvent('pricing_cta_click', { plan: 'onetime' });
                window.location.hash = 'kontakt?plan=onetime';
                document.querySelector('#kontakt')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="block text-center py-3 px-6 rounded-xl font-medium text-sm transition-all bg-primary text-primary-foreground hover:bg-primary/90"
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
              <div className="grid md:grid-cols-2 gap-fluid-grid max-w-3xl mx-auto">
                {packages.map((pkg, index) => {
                  const pkgData = p.packages[pkg.key];
                  return (
                    <motion.div
                      key={pkg.key}
                      className={`relative bg-transparent rounded-2xl p-10 transition-all duration-300 flex flex-col ${
                        pkg.highlighted
                          ? 'border border-primary/40 hover:border-primary/60'
                          : 'border border-primary/20 hover:border-primary/30'
                      }`}
                      style={{ borderWidth: '0.5px' }}
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.15 }}
                    >
                      <div className="h-6 mb-2 flex items-center">
                        {pkg.highlighted && (
                          <span className="bg-primary/10 text-primary text-xs px-3 py-1 rounded-full font-medium">
                            Rekommenderad
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 mb-3">
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
                      <div className="flex items-baseline gap-1.5 mb-6">
                        <span className="text-4xl font-light text-foreground">{pkgData.price}</span>
                        <span className="text-xs text-muted-foreground tracking-wider">SEK</span>
                        <span className="text-muted-foreground text-sm ml-1">{p.perMonth}</span>
                      </div>
                      <p className="text-muted-foreground text-sm mb-6">{pkgData.description}</p>

                      <div className="border-t border-primary/10 pt-6 mb-8 flex-1">
                        <FeatureList features={pkgData.features} />
                      </div>

                      <a
                        href={`#kontakt?plan=maintenance_${pkg.key}`}
                        onClick={(e) => {
                          e.preventDefault();
                          trackEvent('pricing_cta_click', { plan: `maintenance_${pkg.key}` });
                          window.location.hash = `kontakt?plan=maintenance_${pkg.key}`;
                          document.querySelector('#kontakt')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="block text-center py-3 px-6 rounded-xl font-medium text-sm transition-all bg-transparent text-primary hover:bg-primary/5"
                        style={{ border: '0.5px solid hsl(var(--primary) / 0.3)' }}
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
