import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { Linkedin, Github } from 'lucide-react';
import { Logo } from './Navbar';

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="py-12 border-t border-white/5">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <Logo />

          <div className="flex items-center gap-6">
            <a 
              href="mailto:CoffeeCodeStudios@gmail.com"
              className="text-muted-foreground hover:text-primary transition-colors text-sm"
              rel="noopener noreferrer"
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
              rel="noopener noreferrer"
              target="_blank"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
            </motion.a>
            <motion.a
              href="#"
              className="w-10 h-10 glass-card rounded-full flex items-center justify-center text-muted-foreground hover:text-primary transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              rel="noopener noreferrer"
              target="_blank"
              aria-label="GitHub"
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
