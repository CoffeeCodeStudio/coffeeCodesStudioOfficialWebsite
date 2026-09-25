import React, { createContext, useContext, type ReactNode } from 'react'; // v2
import { useLocation, useNavigate } from 'react-router-dom';
import { detectLang, pathForLang } from '@/lib/i18nRoutes';

type Language = 'sv' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const language: Language = detectLang(location.pathname);

  const setLanguage = (lang: Language) => {
    const next = pathForLang(location.pathname, lang);
    if (next !== location.pathname) {
      navigate(next + location.search + location.hash);
    }
  };

  const value = {
    language,
    setLanguage,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
