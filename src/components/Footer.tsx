import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
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
              href="mailto:hej@coffeecodestudio.se"
              className="text-muted-foreground hover:text-primary transition-colors text-sm text-center"
              rel="noopener noreferrer"
            >
              hej@coffeecodestudio.se
            </a>
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
