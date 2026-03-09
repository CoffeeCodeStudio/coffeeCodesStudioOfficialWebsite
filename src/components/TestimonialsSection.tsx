import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Quote } from 'lucide-react';
import testimonialDjLobo from '@/assets/testimonial-djlobo.webp';

// Update this array to add more testimonials
const testimonials = [
  {
    image: testimonialDjLobo, // Replace with actual client photo
    quoteSv: 'Rami byggde min nya sajt snabbt och proffsigt. Allt på ett ställe nu.',
    quoteEn: 'Rami built my new site quickly and professionally. Everything in one place now.',
    name: 'DJ Lobo Producciones',
  },
];

export function TestimonialsSection() {
  const { language } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="py-16 sm:py-24 relative" ref={ref}>
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          className="max-w-2xl mx-auto text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          {testimonials.map((t, i) => (
            <div key={i} className="flex flex-col items-center gap-6">
              {/* Profile Photo */}
              <motion.div
                className="w-20 h-20 rounded-full overflow-hidden border-2 border-primary shadow-lg shadow-primary/20"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={isInView ? { scale: 1, opacity: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <img
                  src={t.image}
                  alt={`Kundomdöme från ${t.name}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  width="80"
                  height="80"
                />
              </motion.div>

              {/* Quote Icon */}
              <Quote className="w-8 h-8 text-primary/60" />

              {/* Quote Text */}
              <blockquote className="text-lg sm:text-xl font-serif text-foreground italic leading-relaxed">
                "{language === 'sv' ? t.quoteSv : t.quoteEn}"
              </blockquote>

              {/* Name */}
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
