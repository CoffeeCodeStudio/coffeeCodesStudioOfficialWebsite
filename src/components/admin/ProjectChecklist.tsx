import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';

interface ChecklistItem {
  key: string;
  label: string;
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
      { key: 'agreement_signed', label: 'Projektavtal signerat av kunden' },
      { key: 'pub_agreement_signed', label: 'PUB-avtal (GDPR) signerat av kunden' },
      { key: 'price_delivery_documented', label: 'Pris och leveransdatum dokumenterat' },
      { key: 'supabase_dpa_active', label: 'Supabase DPA aktiverad' },
      { key: 'privacy_policy_linked', label: 'Integritetspolicy länkad i footern' },
      { key: 'cookie_banner_works', label: 'Cookie-banner fungerar på kundens sajt' },
    ],
  },
  {
    title: 'Viktigt men inte blockerande',
    color: 'yellow',
    icon: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
    description: 'Bör åtgärdas men hindrar inte lansering.',
    items: [
      { key: 'rate_limiting', label: 'Rate limiting på kontaktformulär' },
      { key: 'resend_sender_verified', label: 'Resend avsändaradress verifierad' },
      { key: 'no_pii_console', label: 'Inga personuppgifter i console.log' },
      { key: 'images_licensed', label: 'Alla bilder licensierade eller ägs av kunden' },
      { key: 'media_licensed', label: 'Musik/media har rätt licens' },
    ],
  },
  {
    title: 'Bra att ha',
    color: 'green',
    icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
    description: 'Extra steg som höjer kvaliteten.',
    items: [
      { key: 'search_console', label: 'Google Search Console kopplat' },
      { key: 'domain_owned', label: 'Domän och hosting ägs av kunden' },
      { key: 'portal_login_sent', label: 'Kunden har fått inlogg till kundportalen' },
      { key: 'review_requested', label: 'Referens och recension efterfrågad' },
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
}

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
