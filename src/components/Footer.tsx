import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Mail, Linkedin, Github } from 'lucide-react';
import { Logo } from './Navbar';

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer id="contact" className="py-16 border-t border-white/5">
      <div className="container mx-auto px-6">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-serif mb-6">
            <span className="gradient-text">{t.footer.cta}</span>
          </h2>
          
          <Button 
            size="lg" 
            className="glow-button bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-8 py-6 rounded-full font-medium"
          >
            <Mail className="w-5 h-5 mr-2" />
            {t.hero.cta}
          </Button>
        </motion.div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-8 pt-8 border-t border-white/5">
          <Logo />

          <div className="flex items-center gap-6">
            <a 
              href="mailto:CoffeeCodeStudios@gmail.com"
              className="text-muted-foreground hover:text-primary transition-colors text-sm"
            >
              CoffeeCodeStudios@gmail.com
            </a>
          </div>

          <div className="flex items-center gap-4">
            <motion.a
              href="#"
              className="w-10 h-10 glass-card rounded-full flex items-center justify-center text-muted-foreground hover:text-primary transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Linkedin className="w-5 h-5" />
            </motion.a>
            <motion.a
              href="#"
              className="w-10 h-10 glass-card rounded-full flex items-center justify-center text-muted-foreground hover:text-primary transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Github className="w-5 h-5" />
            </motion.a>
          </div>
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Coffee Code Studio. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
