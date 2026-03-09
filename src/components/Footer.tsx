import { useLanguage } from '@/contexts/LanguageContext';
import { Instagram, Linkedin, Facebook, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Logo } from './Navbar';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
    </svg>
  );
}

const socialLinks = [
  { icon: Instagram, label: 'Instagram' },
  { icon: Linkedin, label: 'LinkedIn' },
  { icon: TikTokIcon, label: 'TikTok' },
  { icon: Facebook, label: 'Facebook' },
];

const legalLinks = [
  { to: '/integritetspolicy', label: 'Integritetspolicy' },
  { to: '/cookiepolicy', label: 'Cookiepolicy' },
  { to: '/anvandardvillkor', label: 'Användarvillkor' },
];

export function Footer() {
  return (
    <footer className="pt-1 pb-12 sm:pb-16" role="contentinfo">
      {/* Gold divider */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent mb-12 sm:mb-16" />

      <div className="container mx-auto px-4 sm:px-6">
        {/* 3-column layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 items-start">
          {/* Left: Logo + tagline */}
          <div className="flex flex-col items-center md:items-start gap-3">
            <Logo />
            <p className="text-xs text-muted-foreground tracking-wide text-center md:text-left">
              Webbutveckling med AI-precision
              <br />
              — Göteborg
            </p>
          </div>

          {/* Center: Social icons */}
          <div className="flex flex-col items-center gap-3">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-1">
              Sociala medier
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <Tooltip key={social.label}>
                    <TooltipTrigger asChild>
                      <span
                        className="w-10 h-10 rounded-full border border-border/30 bg-muted/30 flex items-center justify-center text-muted-foreground cursor-default transition-all duration-300 hover:border-primary/50 hover:text-primary hover:bg-primary/10 hover:shadow-[0_0_12px_hsl(var(--primary)/0.15)]"
                        aria-label={social.label}
                      >
                        <Icon className="w-4 h-4" />
                      </span>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="text-xs">
                      Kommer snart
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
          </div>

          {/* Right: Email */}
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

        {/* Legal links */}
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

        {/* Bottom row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-8 pt-6 border-t border-white/5">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Coffee Code Studio. All rights reserved.
          </p>
          <p className="text-xs font-medium text-primary/60 tracking-wide">
            Built &amp; designed by Coffee Code Studio
          </p>
        </div>
      </div>
    </footer>
  );
}
