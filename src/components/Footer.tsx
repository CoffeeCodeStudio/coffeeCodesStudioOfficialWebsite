import { useLanguage } from '@/contexts/LanguageContext';
import { Coffee, Mail, MessageCircle, Phone } from 'lucide-react';
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
      <div className="w-full h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent mb-fluid-header" />

      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 items-start">
          <div className="flex flex-col items-center md:items-start gap-3">
            <Logo />
            <p className="text-xs text-muted-foreground tracking-wide text-center md:text-left">
              Hemsidor för småföretag — Göteborg
            </p>
          </div>

          <div className="hidden md:block" />

          {/* Kontakt med kaffering-bakgrund */}
          <div className="relative flex flex-col items-center md:items-end gap-3">
            {/* Diskret kaffering */}
            <div className="absolute -top-8 right-1/2 md:right-0 translate-x-1/2 md:translate-x-1/4 w-40 h-40 rounded-full bg-gradient-to-br from-primary/5 via-primary/3 to-transparent blur-2xl pointer-events-none" />

            <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-1 relative z-10">
              Kontakt
            </p>
            <div className="flex flex-wrap justify-center md:justify-end gap-3 relative z-10">
              <a
                href="tel:+46738764299"
                className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/30 px-4 py-2 rounded-full border border-border/30 hover:bg-primary/10 hover:border-primary/30 hover:text-primary transition-all group"
              >
                <Phone className="w-4 h-4 group-hover:text-primary transition-colors" />
                073 876 42 99
              </a>
              <a
                href="https://wa.me/46738764299"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/30 px-4 py-2 rounded-full border border-border/30 hover:bg-primary/10 hover:border-primary/30 hover:text-primary transition-all group"
              >
                <MessageCircle className="w-4 h-4 group-hover:text-primary transition-colors" />
                WhatsApp
              </a>
              <a
                href="mailto:hej@coffeecodestudio.se"
                className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/30 px-4 py-2 rounded-full border border-border/30 hover:bg-primary/10 hover:border-primary/30 hover:text-primary transition-all group"
              >
                <Mail className="w-4 h-4 group-hover:text-primary transition-colors" />
                hej@coffeecodestudio.se
              </a>
            </div>
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
          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
            © <Coffee className="w-3 h-3 text-primary/60" /> {new Date().getFullYear()} Coffee Code Studio. {t.footer.rights}.
          </p>
          <p className="text-xs font-medium text-primary/60 tracking-wide flex items-center gap-1.5">
            <Coffee className="w-3 h-3" /> Built &amp; designed by Coffee Code Studio
          </p>
        </div>
      </div>
    </footer>
  );
}
