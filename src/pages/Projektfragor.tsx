import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import logoSvg from '@/assets/logo.svg';

const sections = [
  {
    title: '1. Om dig & projektet',
    questions: [
      { num: 1, text: 'Vad heter du och vad heter ditt företag/projekt?' },
      { num: 2, text: 'Beskriv din idé med egna ord — vad vill du bygga?', required: true },
      { num: 3, text: 'Varför gör du det här? Vad är målet på sikt?' },
      { num: 4, text: 'Finns det en befintlig webbplats eller app du inspirerats av?' },
    ],
  },
  {
    title: '2. Målgrupp',
    questions: [
      { num: 5, text: 'Vem är din kund eller användare? Är de i Sverige eller internationellt? Privatpersoner (B2C) eller företag (B2B)?' },
    ],
  },
  {
    title: '3. Funktioner',
    questions: [
      { num: 6, text: 'Vilka funktioner är absolut nödvändiga för att lansera? (must-have)', required: true },
      { num: 7, text: 'Vilka funktioner är önskvärda men inte kritiska? (nice-to-have)' },
    ],
  },
  {
    title: '4. Design & Innehåll',
    questions: [
      { num: 8, text: 'Behöver användare kunna logga in och skapa konton?' },
      { num: 9, text: 'Har du en logga eller grafisk profil redan?' },
      { num: 10, text: 'Finns det en känsla, stil eller färger du vill ha? Bifoga gärna exempel.' },
      { num: 11, text: 'Har du texter och bilder klara, eller behöver det tas fram?', required: true },
    ],
  },
  {
    title: '5. Tekniskt',
    questions: [
      { num: 12, text: 'Har du en domän redan? Vilket namn?', required: true },
      { num: 13, text: 'Behöver du själv kunna uppdatera innehåll utan min hjälp efter lansering?' },
      { num: 14, text: 'Finns det specifika tekniska krav eller integrationer du behöver? (t.ex. bokningssystem, betalning, karta)' },
    ],
  },
  {
    title: '6. Tidslinje & Budget',
    questions: [
      { num: 15, text: 'När vill du ha en första version klar?', required: true },
    ],
  },
  {
    title: '7. Beslut & Övrigt',
    questions: [
      { num: 17, text: 'Finns det en budget du arbetar inom? (ungefär)', required: true },
      { num: 18, text: 'Är du ensam beslutsfattare eller finns det fler inblandade i projektet?' },
      { num: 19, text: 'Är det något annat jag bör veta om projektet?' },
    ],
  },
];

export default function Projektfragor() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Print-friendly styles */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; color: black !important; }
        }
      `}</style>

      {/* Back button */}
      <div className="no-print fixed top-6 left-6 z-50">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Tillbaka
        </Button>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-16 md:py-24">
        {/* Header with centered logo */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <img
            src={logoSvg}
            alt="Coffee Code Studio"
            className="w-16 h-16 mx-auto mb-4"
          />
          <h2 className="font-serif text-lg text-foreground tracking-wide">
            Coffee Code Studio
          </h2>
          <div className="w-12 h-px bg-primary/40 mx-auto mt-6 mb-8" />
          <h1 className="text-3xl md:text-4xl font-serif text-foreground mb-4">
            Projektfrågor
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-md mx-auto">
            För att jag ska kunna leverera rätt sak från start behöver jag förstå ditt projekt.
            Fyll i dina svar och skicka tillbaka dokumentet.
          </p>
          <p className="text-xs text-muted-foreground/60 mt-3">
            <span className="text-primary">*</span> Obligatorisk fråga
          </p>
        </motion.div>

        {/* Sections */}
        <div className="space-y-12">
          {sections.map((section, si) => (
            <motion.div
              key={si}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + si * 0.05 }}
            >
              <h2 className="font-serif text-lg text-foreground mb-6 pb-2 border-b border-border/30">
                {section.title}
              </h2>
              <div className="space-y-6">
                {section.questions.map((q) => (
                  <div key={q.num}>
                    <p className="text-sm text-foreground mb-2">
                      {q.num}. {q.text}
                      {q.required && <span className="text-primary ml-1">*</span>}
                    </p>
                    <div className="min-h-[3rem] rounded-lg border border-border/40 bg-muted/10" />
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer */}
        <motion.div
          className="mt-16 pt-8 border-t border-border/20 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <p className="text-xs text-muted-foreground">
            coffeecodestudio.se · Skicka tillbaka ifyllt dokument så hör jag av mig.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
