import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';

interface ChecklistItem {
  key: string;
  label: string;
  help: string;
}

interface ChecklistCategory {
  title: string;
  color: 'red' | 'yellow' | 'green';
  icon: React.ReactNode;
  description: string;
  items: ChecklistItem[];
}

const CHECKLIST_CATEGORIES: ChecklistCategory[] = [
  {
    title: 'Måste vara klart före lansering',
    color: 'red',
    icon: <XCircle className="w-5 h-5 text-red-500" />,
    description: 'Dessa punkter måste vara avklarade innan sajten kan gå live.',
    items: [
      { key: 'agreement_signed', label: 'Projektavtal signerat av kunden', help: 'Kunden har godkänt vad som ska göras och vad det kostar.' },
      { key: 'pub_agreement_signed', label: 'PUB-avtal (GDPR) signerat av kunden', help: 'Ett avtal som reglerar hur vi hanterar kundens användares personuppgifter.' },
      { key: 'price_delivery_documented', label: 'Pris och leveransdatum dokumenterat', help: 'Det finns skriftligt vad projektet kostar och när det ska vara klart.' },
      { key: 'supabase_dpa_active', label: 'Supabase DPA aktiverad', help: 'Databasens leverantör har ett aktivt databehandlingsavtal med oss.' },
      { key: 'privacy_policy_linked', label: 'Integritetspolicy länkad i footern', help: 'Besökare kan hitta information om hur deras data hanteras längst ner på sidan.' },
      { key: 'cookie_banner_works', label: 'Cookie-banner fungerar på kundens sajt', help: 'En ruta visas för besökare där de kan godkänna eller neka cookies.' },
    ],
  },
  {
    title: 'Viktigt men inte blockerande',
    color: 'yellow',
    icon: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
    description: 'Bör åtgärdas men hindrar inte lansering.',
    items: [
      { key: 'rate_limiting', label: 'Rate limiting på kontaktformulär', help: 'Skydd mot att någon skickar hundratals meddelanden via formuläret.' },
      { key: 'resend_sender_verified', label: 'Resend avsändaradress verifierad', help: 'E-post skickas från en verifierad adress så den inte hamnar i skräppost.' },
      { key: 'no_pii_console', label: 'Inga personuppgifter i console.log', help: 'Namn, e-post eller annan känslig data syns inte i webbläsarens utvecklarverktyg.' },
      { key: 'images_licensed', label: 'Alla bilder licensierade eller ägs av kunden', help: 'Vi har rätt att använda alla bilder på sajten – inga stulna bilder.' },
      { key: 'media_licensed', label: 'Musik/media har rätt licens', help: 'Eventuell musik eller video på sajten har rätt tillstånd för användning.' },
    ],
  },
  {
    title: 'Bra att ha',
    color: 'green',
    icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
    description: 'Extra steg som höjer kvaliteten.',
    items: [
      { key: 'search_console', label: 'Google Search Console kopplat', help: 'Google kan hitta och visa sajten i sökresultat.' },
      { key: 'domain_owned', label: 'Domän och hosting ägs av kunden', help: 'Kunden äger sin webbadress och sitt webbhotell själv.' },
      { key: 'portal_login_sent', label: 'Kunden har fått inlogg till kundportalen', help: 'Kunden kan logga in och följa sitt projekt.' },
      { key: 'review_requested', label: 'Referens och recension efterfrågad', help: 'Vi har bett kunden om en recension eller referens.' },
    ],
  },
];

const colorMap = {
  red: {
    border: 'border-red-500/30',
    bg: 'bg-red-500/5',
    badge: 'bg-red-500/15 text-red-400',
  },
  yellow: {
    border: 'border-yellow-500/30',
    bg: 'bg-yellow-500/5',
    badge: 'bg-yellow-500/15 text-yellow-400',
  },
  green: {
    border: 'border-emerald-500/30',
    bg: 'bg-emerald-500/5',
    badge: 'bg-emerald-500/15 text-emerald-400',
  },
};

interface Props {
  projectId: string;
  projectName?: string;
}

const RED_KEYS = CHECKLIST_CATEGORIES
  .filter(c => c.color === 'red')
  .flatMap(c => c.items.map(i => i.key));

export function ProjectChecklist({ projectId }: Props) {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetch = async () => {
      const { data, error } = await supabase
        .from('project_checklists')
        .select('item_key, checked')
        .eq('project_id', projectId);

      if (!error && data) {
        const map: Record<string, boolean> = {};
        data.forEach((row: any) => { map[row.item_key] = row.checked; });
        setCheckedItems(map);
      }
      setLoading(false);
    };
    fetch();
  }, [projectId]);

  const toggle = async (key: string, checked: boolean) => {
    setCheckedItems(prev => ({ ...prev, [key]: checked }));

    const { error } = await supabase
      .from('project_checklists')
      .upsert(
        { project_id: projectId, item_key: key, checked } as any,
        { onConflict: 'project_id,item_key' }
      );

    if (error) {
      setCheckedItems(prev => ({ ...prev, [key]: !checked }));
      toast({ title: 'Fel', description: 'Kunde inte spara.', variant: 'destructive' });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const allItems = CHECKLIST_CATEGORIES.flatMap(c => c.items);
  const doneCount = allItems.filter(i => checkedItems[i.key]).length;

  return (
    <div
      className="space-y-5"
      style={{ fontFamily: 'Arial, Helvetica, sans-serif', lineHeight: 1.8 }}
    >
      {/* Progress summary */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">
          Lanseringschecklista
        </h3>
        <span className="text-sm text-muted-foreground">
          {doneCount} / {allItems.length} klara
        </span>
      </div>

      {CHECKLIST_CATEGORIES.map(category => {
        const colors = colorMap[category.color];
        const catDone = category.items.filter(i => checkedItems[i.key]).length;

        return (
          <div
            key={category.title}
            className={`rounded-xl border ${colors.border} ${colors.bg} p-4 space-y-3`}
          >
            <div className="flex items-center gap-2">
              {category.icon}
              <span className="font-semibold text-foreground text-base">
                {category.title}
              </span>
              <span className={`ml-auto text-xs px-2 py-0.5 rounded-full font-medium ${colors.badge}`}>
                {catDone}/{category.items.length}
              </span>
            </div>

            <p className="text-sm text-muted-foreground">
              {category.description}
            </p>

            <div className="space-y-2">
              {category.items.map(item => (
                <label
                  key={item.key}
                  className="flex items-start gap-3 cursor-pointer group py-1"
                >
                  <Checkbox
                    checked={!!checkedItems[item.key]}
                    onCheckedChange={(v) => toggle(item.key, !!v)}
                    className="mt-1 shrink-0"
                  />
                   <span
                    className={`text-sm transition-colors ${
                      checkedItems[item.key]
                        ? 'line-through text-muted-foreground/60'
                        : 'text-foreground'
                    }`}
                  >
                    {item.label}
                    <span className="block text-xs text-muted-foreground font-normal mt-0.5 no-underline" style={{ textDecoration: 'none' }}>
                      {item.help}
                    </span>
                  </span>
                </label>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
