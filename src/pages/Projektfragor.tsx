import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Send, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import logoSvg from '@/assets/logo.svg';

interface Question {
  num: number;
  text: string;
  required?: boolean;
  type: 'input' | 'textarea';
}

interface Section {
  title: string;
  questions: Question[];
}

const sections: Section[] = [
  {
    title: '1. Om dig & projektet',
    questions: [
      { num: 1, text: 'Vad heter du och vad heter ditt företag/projekt?', type: 'input' },
      { num: 2, text: 'Beskriv din idé med egna ord — vad vill du bygga?', required: true, type: 'textarea' },
      { num: 3, text: 'Varför gör du det här? Vad är målet på sikt?', type: 'textarea' },
      { num: 4, text: 'Finns det en befintlig webbplats eller app du inspirerats av?', type: 'input' },
    ],
  },
  {
    title: '2. Målgrupp',
    questions: [
      { num: 5, text: 'Vem är din kund eller användare? Är de i Sverige eller internationellt? Privatpersoner (B2C) eller företag (B2B)?', type: 'textarea' },
    ],
  },
  {
    title: '3. Funktioner',
    questions: [
      { num: 6, text: 'Vilka funktioner är absolut nödvändiga för att lansera? (must-have)', required: true, type: 'textarea' },
      { num: 7, text: 'Vilka funktioner är önskvärda men inte kritiska? (nice-to-have)', type: 'textarea' },
    ],
  },
  {
    title: '4. Design & Innehåll',
    questions: [
      { num: 8, text: 'Behöver användare kunna logga in och skapa konton?', type: 'input' },
      { num: 9, text: 'Har du en logga eller grafisk profil redan?', type: 'input' },
      { num: 10, text: 'Finns det en känsla, stil eller färger du vill ha? Bifoga gärna exempel.', type: 'textarea' },
      { num: 11, text: 'Har du texter och bilder klara, eller behöver det tas fram?', required: true, type: 'input' },
    ],
  },
  {
    title: '5. Tekniskt',
    questions: [
      { num: 12, text: 'Har du en domän redan? Vilket namn?', required: true, type: 'input' },
      { num: 13, text: 'Behöver du själv kunna uppdatera innehåll utan min hjälp efter lansering?', type: 'input' },
      { num: 14, text: 'Finns det specifika tekniska krav eller integrationer du behöver? (t.ex. bokningssystem, betalning, karta)', type: 'textarea' },
    ],
  },
  {
    title: '6. Tidslinje & Budget',
    questions: [
      { num: 15, text: 'När vill du ha en första version klar?', required: true, type: 'input' },
    ],
  },
  {
    title: '7. Beslut & Övrigt',
    questions: [
      { num: 17, text: 'Finns det en budget du arbetar inom? (ungefär)', required: true, type: 'input' },
      { num: 18, text: 'Är du ensam beslutsfattare eller finns det fler inblandade i projektet?', type: 'input' },
      { num: 19, text: 'Är det något annat jag bör veta om projektet?', type: 'textarea' },
    ],
  },
];

const allQuestions = sections.flatMap(s => s.questions);
const requiredNums = allQuestions.filter(q => q.required).map(q => q.num);

export default function Projektfragor() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data: project } = await supabase
        .from('projects')
        .select('id, status')
        .eq('client_user_id', user.id)
        .limit(1)
        .single();

      if (project) {
        setProjectId(project.id);

        // Check if already submitted
        const { data: existing } = await supabase
          .from('project_responses' as any)
          .select('id')
          .eq('project_id', project.id)
          .limit(1);

        if (existing && (existing as any[]).length > 0) {
          setAlreadySubmitted(true);
        }
      }
      setLoading(false);
    };
    init();
  }, []);

  const updateAnswer = (num: number, value: string) => {
    setAnswers(prev => ({ ...prev, [num]: value }));
  };

  const handleSubmit = async () => {
    // Validate required fields
    const missing = requiredNums.filter(num => !answers[num]?.trim());
    if (missing.length > 0) {
      toast({
        title: 'Obligatoriska fält saknas',
        description: `Vänligen fyll i alla frågor markerade med *`,
        variant: 'destructive',
      });
      return;
    }

    if (!projectId) {
      toast({
        title: 'Inget projekt hittades',
        description: 'Du måste vara inloggad och ha ett projekt kopplat till ditt konto.',
        variant: 'destructive',
      });
      return;
    }

    setSubmitting(true);

    // Build structured responses
    const responses: Record<string, string> = {};
    allQuestions.forEach(q => {
      if (answers[q.num]?.trim()) {
        responses[`q${q.num}`] = answers[q.num].trim();
      }
    });

    // Save to project_responses
    const { error: insertError } = await supabase
      .from('project_responses' as any)
      .insert({
        project_id: projectId,
        responses,
      } as any);

    if (insertError) {
      console.error('Insert error:', insertError);
      toast({
        title: 'Kunde inte skicka',
        description: insertError.message,
        variant: 'destructive',
      });
      setSubmitting(false);
      return;
    }

    // Update project status from questionnaire → design
    const { error: statusError } = await supabase
      .from('projects')
      .update({ status: 'design' })
      .eq('id', projectId);

    if (statusError) {
      console.error('Status update error:', statusError);
    }

    // Log event
    await supabase.from('status_logs').insert({
      project_id: projectId,
      message: 'Kunden skickade in projektfrågor',
      author_name: 'Kund',
      event_type: 'questionnaire_submitted',
    });

    setSubmitting(false);
    setSubmitted(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Confirmation view
  if (submitted || alreadySubmitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <motion.div
          className="max-w-md text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8 text-accent" />
          </div>
          <h1 className="text-2xl font-serif text-foreground mb-3">
            {alreadySubmitted ? 'Svar redan inskickade' : 'Tack för dina svar!'}
          </h1>
          <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
            {alreadySubmitted
              ? 'Du har redan skickat in dina projektfrågor. Jag kommer höra av mig snart.'
              : 'Jag har tagit emot dina svar och börjar nu arbeta på designförslaget. Du kan följa framstegen i din kundportal.'
            }
          </p>
          <Button onClick={() => navigate('/portal')} className="gap-2">
            Gå till kundportalen
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Back button */}
      <div className="fixed top-6 left-6 z-50">
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
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <img src={logoSvg} alt="Coffee Code Studio" className="w-16 h-16 mx-auto mb-4" />
          <h2 className="font-serif text-lg text-foreground tracking-wide">Coffee Code Studio</h2>
          <div className="w-12 h-px bg-primary/40 mx-auto mt-6 mb-8" />
          <h1 className="text-3xl md:text-4xl font-serif text-foreground mb-4">Projektfrågor</h1>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-md mx-auto">
            För att jag ska kunna leverera rätt sak från start behöver jag förstå ditt projekt.
            Fyll i dina svar nedan och klicka på skicka.
          </p>
          <p className="text-xs text-muted-foreground/60 mt-3">
            <span className="text-primary">*</span> Obligatorisk fråga
          </p>
          {!projectId && (
            <p className="text-xs text-destructive mt-4 bg-destructive/10 rounded-lg px-4 py-2 inline-block">
              Du måste vara inloggad med ett kopplat projekt för att skicka svar.
            </p>
          )}
        </motion.div>

        {/* Form sections */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="space-y-12"
        >
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
                    <label htmlFor={`q${q.num}`} className="text-sm text-foreground mb-2 block">
                      {q.num}. {q.text}
                      {q.required && <span className="text-primary ml-1">*</span>}
                    </label>
                    {q.type === 'textarea' ? (
                      <Textarea
                        id={`q${q.num}`}
                        value={answers[q.num] || ''}
                        onChange={(e) => updateAnswer(q.num, e.target.value)}
                        placeholder="Skriv ditt svar här..."
                        rows={4}
                        required={q.required}
                        className="bg-muted/10 border-border/40 focus:border-primary/50"
                      />
                    ) : (
                      <Input
                        id={`q${q.num}`}
                        value={answers[q.num] || ''}
                        onChange={(e) => updateAnswer(q.num, e.target.value)}
                        placeholder="Skriv ditt svar här..."
                        required={q.required}
                        className="bg-muted/10 border-border/40 focus:border-primary/50"
                      />
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}

          {/* Submit */}
          <motion.div
            className="pt-8 border-t border-border/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Button
              type="submit"
              size="lg"
              disabled={submitting || !projectId}
              className="w-full gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Skickar...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Skicka svar
                </>
              )}
            </Button>
          </motion.div>
        </form>

        {/* Footer */}
        <motion.div
          className="mt-16 pt-8 border-t border-border/20 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <p className="text-xs text-muted-foreground">
            coffeecodestudio.se
          </p>
        </motion.div>
      </div>
    </div>
  );
}
