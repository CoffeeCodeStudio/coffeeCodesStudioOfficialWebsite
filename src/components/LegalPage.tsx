import { useNavigate } from 'react-router-dom';
import { SEOHead } from '@/components/SEOHead';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function LegalPage({
  title,
  seoTitle,
  seoDescription,
  children,
}: {
  title: string;
  seoTitle: string;
  seoDescription: string;
  children: React.ReactNode;
}) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <SEOHead title={seoTitle} description={seoDescription} />
      <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-20 max-w-3xl">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/')}
          className="mb-8 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Tillbaka
        </Button>

        <h1 className="text-3xl sm:text-4xl font-serif gradient-text mb-8">{title}</h1>

        <article className="prose prose-invert prose-sm max-w-none space-y-6 text-muted-foreground [&_h2]:text-foreground [&_h2]:font-serif [&_h2]:text-xl [&_h2]:mt-10 [&_h2]:mb-3 [&_h3]:text-foreground [&_h3]:font-serif [&_h3]:text-lg [&_h3]:mt-6 [&_h3]:mb-2 [&_strong]:text-foreground [&_a]:text-primary [&_a]:underline [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_li]:text-muted-foreground">
          {children}
        </article>

        <p className="text-xs text-muted-foreground/60 mt-16 pt-6 border-t border-white/5">
          Senast uppdaterad: mars 2026
        </p>
      </div>
    </div>
  );
}
