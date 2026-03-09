import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Cookie } from 'lucide-react';
import { Link } from 'react-router-dom';

const CONSENT_KEY = 'ccs-cookie-consent';

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(CONSENT_KEY);
    if (!consent) {
      // Small delay so banner doesn't flash on load
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleChoice = (choice: 'accepted' | 'declined') => {
    localStorage.setItem(CONSENT_KEY, choice);
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        >
          <div className="max-w-2xl mx-auto glass-card border border-primary/20 rounded-2xl p-5 sm:p-6 shadow-2xl shadow-black/30">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Cookie className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground font-medium mb-1">Vi använder cookies</p>
                <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                  Vi använder nödvändiga cookies för att webbplatsen ska fungera. Läs mer i vår{' '}
                  <Link to="/cookiepolicy" className="text-primary underline hover:text-primary/80">
                    cookiepolicy
                  </Link>.
                </p>
                <div className="flex gap-3">
                  <Button
                    size="sm"
                    onClick={() => handleChoice('accepted')}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 text-xs px-5 rounded-full"
                  >
                    Acceptera
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleChoice('declined')}
                    className="border-border/50 text-muted-foreground hover:text-foreground text-xs px-5 rounded-full"
                  >
                    Avböj
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
