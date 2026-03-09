import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { SEOHead } from '@/components/SEOHead';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <SEOHead title="404 - Sidan hittades inte | Coffee Code Studio" description="Sidan du letar efter finns inte." noindex />
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold text-foreground">404</h1>
        <p className="mb-4 text-xl text-muted-foreground">Sidan hittades inte</p>
        <a href="/" className="text-primary underline hover:text-primary/90">
          Tillbaka till startsidan
        </a>
      </div>
    </div>
  );
};

export default NotFound;
