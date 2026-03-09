import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { Linkedin, Github } from 'lucide-react';
import { Logo } from './Navbar';

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="py-8 sm:py-12 border-t border-white/5" role="contentinfo">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col items-center gap-6 sm:gap-8 md:flex-row md:justify-between">
          <Logo />

          <div className="flex items-center">
            <a 
              href="mailto:CoffeeCodeStudios@gmail.com"
              className="text-muted-foreground hover:text-primary transition-colors text-sm text-center"
              rel="noopener noreferrer"
            >
              CoffeeCodeStudios@gmail.com
            </a>
          </div>

          <div className="flex items-center gap-4">
            <motion.a
              href="#"
              className="w-11 h-11 sm:w-10 sm:h-10 glass-card rounded-full flex items-center justify-center text-muted-foreground hover:text-primary active:bg-primary/10 transition-colors"
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
              className="w-11 h-11 sm:w-10 sm:h-10 glass-card rounded-full flex items-center justify-center text-muted-foreground hover:text-primary active:bg-primary/10 transition-colors"
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

        <div className="text-center mt-6 sm:mt-8">
          <p className="text-xs sm:text-sm text-muted-foreground">
            © {new Date().getFullYear()} Coffee Code Studio. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
