import { useEffect, useRef } from 'react';

interface SEOHeadProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  noindex?: boolean;
}

export function SEOHead({ title, description, canonical, ogImage, noindex }: SEOHeadProps) {
  const createdElements = useRef<Element[]>([]);

  useEffect(() => {
    document.title = title;

    // Clean up previously created elements
    createdElements.current.forEach((el) => el.remove());
    createdElements.current = [];

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
    if (ogImage) ensureMeta('property', 'og:image', ogImage);

    if (noindex) {
      ensureMeta('name', 'robots', 'noindex, nofollow');
    } else {
      const robotsMeta = document.querySelector('meta[name="robots"]');
      if (robotsMeta) robotsMeta.remove();
    }

    // Canonical
    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    const href = canonical || window.location.origin + window.location.pathname;
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
      createdElements.current.push(link);
    }
    link.setAttribute('href', href);

    return () => {
      createdElements.current.forEach((el) => el.remove());
      createdElements.current = [];
    };
  }, [title, description, canonical, ogImage, noindex]);

  return null;
}
