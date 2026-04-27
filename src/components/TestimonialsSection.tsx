import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { MessageSquareQuote, Star } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';
import testimonialDjLobo from '@/assets/testimonial-djlobo.webp';

const testimonials = [
  {
    image: testimonialDjLobo,
    quoteSv: 'Rami levererade snabbt och professionellt. Sajten är exakt vad jag behövde — enkel att uppdatera och ser proffsig ut.',
    quoteEn: 'Rami delivered quickly and professionally. The site is exactly what I needed — easy to update and looks professional.',
    name: 'DJ Lobo Producciones',
  },
];

export function TestimonialsSection() {
  const { language } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <section className="py-10 relative" ref={ref}>
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          className="max-w-2xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <a
            href="https://g.page/r/coffeecodestudio/review"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 mb-8 px-4 py-2.5 rounded-full bg-muted/30 border border-border/40 hover:border-primary/40 hover:bg-muted/50 transition-all group"
            aria-label={language === 'sv' ? 'Se våra recensioner på Google' : 'See our reviews on Google'}
            onClick={() => trackEvent('google_reviews_click', { location: 'testimonials_badge', link_url: 'https://g.page/r/coffeecodestudio/review' })}
          >
            <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <div
              className="flex items-center gap-1.5"
              role="img"
              aria-label={language === 'sv' ? 'Genomsnittligt betyg 5,0 av 5 stjärnor' : 'Average rating 5.0 out of 5 stars'}
            >
              <span className="text-sm font-semibold text-foreground" aria-hidden="true">5,0</span>
              <div className="flex items-center gap-0.5" aria-hidden="true">
                {[...Array(5)].map((_, idx) => (
                  <Star key={idx} className="w-3.5 h-3.5 fill-primary text-primary" />
                ))}
              </div>
            </div>
            <span className="text-xs text-muted-foreground group-hover:text-primary transition-colors">
              {language === 'sv' ? 'Baserat på 1 recension' : 'Based on 1 review'}
            </span>
          </a>

          {testimonials.map((t, i) => (
            <div key={i} className="flex flex-col items-center gap-4">
              <motion.div
                className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary shadow-lg shadow-primary/20"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={isInView ? { scale: 1, opacity: 1 } : {}}
                transition={{ duration: 0.4, delay: 0.15 }}
              >
                <img
                  src={t.image}
                  alt={`Kundomdöme från ${t.name}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  width="64"
                  height="64"
                />
              </motion.div>

              <MessageSquareQuote className="w-6 h-6 text-primary/60" />

              <div className="flex items-center gap-1" aria-label="Betyg 5 av 5">
                {[...Array(5)].map((_, idx) => (
                  <Star key={idx} className="w-4 h-4 fill-primary text-primary" />
                ))}
              </div>

              <blockquote className="text-base sm:text-lg font-serif text-foreground italic leading-relaxed">
                "{language === 'sv' ? t.quoteSv : t.quoteEn}"
              </blockquote>

              <p className="text-sm font-mono text-primary tracking-wide">
                — {t.name}
              </p>

              <a
                href="https://g.page/r/coffeecodestudio/review"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors bg-muted/30 px-3 py-1.5 rounded-full border border-border/30 hover:border-primary/30"
                aria-label="Verifiera recensionen på Google"
                onClick={() => trackEvent('google_reviews_click', { location: 'testimonial_verify_pill', link_url: 'https://g.page/r/coffeecodestudio/review' })}
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Verifiera på Google
              </a>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
