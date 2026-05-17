import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { StructuredData } from './StructuredData';
import {
  SITE_URL,
  detectLang,
  isLocalizedPath,
  pathForLang,
  stripLangPrefix,
} from '@/lib/i18nRoutes';

interface SEOHeadProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  noindex?: boolean;
}

export function SEOHead({ title, description, canonical, ogImage, noindex }: SEOHeadProps) {
  const location = useLocation();
  const createdElements = useRef<Element[]>([]);

  useEffect(() => {
    document.title = title;

    // Clean up previously created elements
    createdElements.current.forEach((el) => el.remove());
    createdElements.current = [];

    const lang = detectLang(location.pathname);
    document.documentElement.lang = lang;

    const ensureMeta = (attr: string, key: string, content: string) => {
      let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
        createdElements.current.push(el);
      }
      el.setAttribute('content', content);
    };

    ensureMeta('name', 'description', description);
    ensureMeta('property', 'og:title', title);
    ensureMeta('property', 'og:description', description);
    ensureMeta('property', 'og:type', 'website');
    ensureMeta('property', 'og:locale', lang === 'en' ? 'en_US' : 'sv_SE');
    if (ogImage) {
      ensureMeta('property', 'og:image', ogImage);
      ensureMeta('name', 'twitter:card', 'summary_large_image');
      ensureMeta('name', 'twitter:image', ogImage);
    }

    if (noindex) {
      ensureMeta('name', 'robots', 'noindex, nofollow');
    } else {
      const robotsMeta = document.querySelector('meta[name="robots"]');
      if (robotsMeta) robotsMeta.remove();
    }

    // Canonical — points at the current language version
    const canonicalHref =
      canonical || SITE_URL + (stripLangPrefix(location.pathname) === '/'
        ? (lang === 'en' ? '/en' : '/')
        : pathForLang(location.pathname, lang));

    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
      createdElements.current.push(link);
    }
    link.setAttribute('href', canonicalHref);

    // Remove any previously injected hreflang tags so they don't accumulate
    document
      .querySelectorAll('link[rel="alternate"][hreflang]')
      .forEach((el) => el.remove());

    // Emit hreflang only for routes that have an English counterpart and that
    // are actually indexable (skip when noindex).
    if (!noindex && isLocalizedPath(location.pathname)) {
      const svHref = SITE_URL + pathForLang(location.pathname, 'sv');
      const enHref = SITE_URL + pathForLang(location.pathname, 'en');

      const addAlt = (hreflang: string, href: string) => {
        const el = document.createElement('link');
        el.setAttribute('rel', 'alternate');
        el.setAttribute('hreflang', hreflang);
        el.setAttribute('href', href);
        document.head.appendChild(el);
        createdElements.current.push(el);
      };

      addAlt('sv', svHref);
      addAlt('en', enHref);
      addAlt('x-default', svHref);
    }

    ensureMeta('property', 'og:url', canonicalHref);

    return () => {
      createdElements.current.forEach((el) => el.remove());
      createdElements.current = [];
    };
  }, [title, description, canonical, ogImage, noindex, location.pathname]);

  return <StructuredData />;
}
