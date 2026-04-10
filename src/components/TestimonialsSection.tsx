import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Quote } from 'lucide-react';
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

              <Quote className="w-6 h-6 text-primary/60" />

              <blockquote className="text-base sm:text-lg font-serif text-foreground italic leading-relaxed">
                "{language === 'sv' ? t.quoteSv : t.quoteEn}"
              </blockquote>

              <p className="text-sm font-mono text-primary tracking-wide">
                — {t.name}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
