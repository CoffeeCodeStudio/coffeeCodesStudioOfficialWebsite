import { useLanguage } from '@/contexts/LanguageContext';
import { Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Logo } from './Navbar';

const legalLinks = [
  { to: '/integritetspolicy', label: 'Integritetspolicy' },
  { to: '/cookiepolicy', label: 'Cookiepolicy' },
  { to: '/anvandardvillkor', label: 'Användarvillkor' },
];

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="pt-1 pb-12 sm:pb-16" role="contentinfo">
      <div className="w-full h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent mb-12 sm:mb-16" />

      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 items-start">
          <div className="flex flex-col items-center md:items-start gap-3">
            <Logo />
            <p className="text-xs text-muted-foreground tracking-wide text-center md:text-left">
              Webbutveckling med AI-precision
              <br />
              — Göteborg
            </p>
          </div>

          <div className="hidden md:block" />

          <div className="flex flex-col items-center md:items-end gap-3">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-1">
              Kontakt
            </p>
            <a
              href="mailto:hej@coffeecodestudio.se"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group"
            >
              <Mail className="w-4 h-4 group-hover:text-primary transition-colors" />
              hej@coffeecodestudio.se
            </a>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mt-10">
          {legalLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-8 pt-6 border-t border-white/5">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Coffee Code Studio. {t.footer.rights}.
          </p>
          <p className="text-xs font-medium text-primary/60 tracking-wide">
            Built &amp; designed by Coffee Code Studio
          </p>
        </div>
      </div>
    </footer>
  );
}
