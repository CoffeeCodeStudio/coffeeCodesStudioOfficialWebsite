import { useLanguage } from '@/contexts/LanguageContext';
import { Instagram, Linkedin, Facebook } from 'lucide-react';
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

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="py-10 sm:py-14 border-t border-white/5" role="contentinfo">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Top row: Logo + tagline + email */}
        <div className="flex flex-col items-center gap-6 sm:gap-8 md:flex-row md:justify-between">
          <div className="flex flex-col items-center md:items-start gap-2">
            <Logo />
            <p className="text-xs text-muted-foreground tracking-wide">
              Webbutveckling med AI-precision — Göteborg
            </p>
          </div>

          <a
            href="mailto:hej@coffeecodestudio.se"
            className="text-muted-foreground hover:text-primary transition-colors text-sm"
          >
            hej@coffeecodestudio.se
          </a>
        </div>

        {/* Social icons */}
        <div className="flex justify-center gap-3 mt-8">
          {socialLinks.map((social) => {
            const Icon = social.icon;
            return (
              <Tooltip key={social.label}>
                <TooltipTrigger asChild>
                  <span
                    className="w-10 h-10 rounded-full bg-muted/50 border border-border/30 flex items-center justify-center text-muted-foreground cursor-default transition-colors hover:border-primary/30 hover:text-muted-foreground/80"
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

        {/* Bottom row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-8 pt-6 border-t border-white/5">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Coffee Code Studio. All rights reserved.
          </p>
          <p className="text-xs font-medium text-primary/70 tracking-wide">
            Built & designed by Coffee Code Studio
          </p>
        </div>
      </div>
    </footer>
  );
}
