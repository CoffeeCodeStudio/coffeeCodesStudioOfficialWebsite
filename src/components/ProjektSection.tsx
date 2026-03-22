import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import djloboScreenshot from '@/assets/djlobo-screenshot.webp';
import djloboScreenshotMobile from '@/assets/djlobo-screenshot-mobile.webp';
import echo2000Screenshot from '@/assets/echo2000-screenshot.webp';
import echo2000ScreenshotMobile from '@/assets/echo2000-screenshot-mobile.webp';

export function ProjektSection() {
  const { t } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="projekt" className="py-16 sm:py-24 relative" ref={ref}>
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          className="text-center mb-12 sm:mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-serif mb-4">
            <span className="gradient-text">{t.portfolio.headline}</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            {t.portfolio.intro}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Project 1 - DJ Lobo */}
          <motion.div
            className="glass-card cyber-border rounded-2xl overflow-hidden border border-primary/20 flex flex-col"
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ y: -5 }}
          >
            <div className="relative">
              <img
                src={djloboScreenshot}
                srcSet={`${djloboScreenshotMobile} 400w, ${djloboScreenshot} 768w`}
                sizes="(max-width: 768px) 400px, 768px"
                alt="djloboproducciones.com - DJ Lobo Producciones webbplats med bokningssystem och live radio"
                className="w-full h-48 sm:h-56 object-cover"
                fetchPriority="high"
                width="768"
                height="561"
              />
            </div>
            <div className="p-5 sm:p-6 flex flex-col flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-1 rounded">
                  {t.portfolio.project1.category}
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-serif text-foreground mb-2">
                {t.portfolio.project1.name}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-5 flex-1">
                {t.portfolio.project1.description}
              </p>
              <Button
                variant="outline"
                className="border-primary/30 text-primary hover:bg-primary/10 w-fit"
                onClick={() => window.open('https://djloboproducciones.com', '_blank')}
              >
                {t.portfolio.viewDemo}
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </motion.div>

          {/* Project 2 - Echo2000 */}
          <motion.div
            className="glass-card cyber-border rounded-2xl overflow-hidden border border-primary/20 flex flex-col"
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.35 }}
            whileHover={{ y: -5 }}
          >
            <div className="relative">
              <img
                src={echo2000Screenshot}
                srcSet={`${echo2000ScreenshotMobile} 400w, ${echo2000Screenshot} 768w`}
                sizes="(max-width: 768px) 400px, 768px"
                alt="Echo2000 - Nostalgisk svensk community inspirerad av LunarStorm och MSN Messenger"
                className="w-full h-48 sm:h-56 object-cover"
                loading="lazy"
                width="768"
                height="651"
              />
            </div>
            <div className="p-5 sm:p-6 flex flex-col flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-1 rounded">
                  {t.portfolio.project2.category}
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-serif text-foreground mb-2">
                {t.portfolio.project2.name}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-5 flex-1">
                {t.portfolio.project2.description}
              </p>
              <Button
                variant="outline"
                className="border-primary/30 text-primary hover:bg-primary/10 w-fit"
                onClick={() => window.open('https://echo2000.lovable.app/', '_blank')}
              >
                {t.portfolio.viewDemo}
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
