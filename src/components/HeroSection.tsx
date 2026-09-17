import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Check, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { trackEvent } from '@/lib/analytics';
import { CodeRainBackground } from './CodeRainBackground';

export function HeroSection() {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText('hej@coffeecodestudio.se');
      setCopied(true);
      trackEvent('copy_email', { location: 'hero' });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable — fail silently
    }
  };

  const handleExploreWork = () => {
    trackEvent('hero_cta_click', { location: 'hero' });
    document.getElementById('projekt')?.scrollIntoView({ behavior: 'smooth' });
  };

  const stackPills = ['React', 'TypeScript', 'Vite', 'Supabase', 'Tailwind CSS', 'PostgreSQL'];

  return (
    <section className="relative min-h-0 flex-col pt-8 sm:pt-16 pb-0 px-2 sm:px-0 overflow-hidden flex items-center justify-start" aria-label="Hero">
      <CodeRainBackground />
      {/* Subtle gradient fade into next section for seamless transition */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-16 sm:h-24 bg-gradient-to-b from-transparent to-background z-20"
      />
      <div className="container mx-auto px-5 sm:px-6 relative z-10">
        {/* Location badge */}
        <motion.div
          className="flex justify-center mb-4 sm:mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <span className="inline-flex items-center gap-2 font-mono text-xs text-muted-foreground border border-primary/20 rounded-full px-3 py-1">
            <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
            Gothenburg, Sweden
          </span>
        </motion.div>

        {/* H1 */}
        <motion.h1
          className="text-[1.75rem] sm:text-4xl md:text-6xl lg:text-7xl font-serif text-center max-w-4xl mx-auto leading-tight mb-3 sm:mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <span className="gradient-text">Product Engineer building resilient web apps with AI-accelerated workflows.</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          className="text-[0.95rem] sm:text-lg md:text-xl text-muted-foreground text-center max-w-2xl mx-auto mb-7 sm:mb-8 px-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          I ship full-stack applications from 0 to 1 — fast. React, TypeScript, and Supabase with strict type safety and verified architectures.
        </motion.p>

        {/* Stack pills */}
        <motion.div
          className="flex flex-row flex-wrap justify-center gap-2 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {stackPills.map((pill) => (
            <span key={pill} className="font-mono text-xs border border-primary/20 rounded-full px-3 py-1 text-muted-foreground">
              {pill}
            </span>
          ))}
        </motion.div>

        {/* CTA buttons */}
        <motion.div
          className="flex flex-col sm:flex-row justify-center items-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Button
            size="lg"
            className="glow-button bg-primary text-primary-foreground hover:bg-primary/90 text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 rounded-full font-medium"
            onClick={handleExploreWork}
          >
            Explore Shipped Work
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-primary/30 text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 rounded-full font-medium"
            onClick={handleCopyEmail}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 mr-2" aria-hidden="true" />
                Copied
              </>
            ) : (
              'Copy Email'
            )}
          </Button>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <ChevronDown className="text-muted-foreground/40 w-6 h-6 mx-auto" aria-hidden="true" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
