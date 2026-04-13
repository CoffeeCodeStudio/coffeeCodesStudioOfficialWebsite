import { useState, useEffect } from 'react';
import { trackEvent } from '@/lib/analytics';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Coffee, Send, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface FormData {
  name: string;
  company: string;
  email: string;
  projectType: string;
  budget: string;
  message: string;
  website: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  projectType?: string;
  message?: string;
}

const sanitizeInput = (input: string): string => {
  return input.replace(/[<>]/g, '').trim().slice(0, 1000);
};

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export function ContactSection() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>({
    name: '', company: '', email: '', projectType: '', budget: '', message: '', website: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const hash = window.location.hash;
    const match = hash.match(/[?&]plan=([^&]*)/);
    if (!match) return;

    const planKey = decodeURIComponent(match[1]);
    const planNames: Record<string, { sv: string; en: string }> = {
      starter: { sv: 'Starter (4 900 kr)', en: 'Starter (4,900 SEK)' },
      onetime: { sv: 'Engångsprojekt (9 900 kr)', en: 'One-time Project (9,900 SEK)' },
      maintenance_bas: { sv: 'Underhåll Bas (799 kr/mån)', en: 'Maintenance Basic (799 SEK/mo)' },
      maintenance_standard: { sv: 'Underhåll Standard (1 499 kr/mån)', en: 'Maintenance Standard (1,499 SEK/mo)' },
    };

    const plan = planNames[planKey];
    if (!plan) return;

    const isSv = t.hero.cta.includes('Boka');
    const prefill = isSv
      ? `Jag är intresserad av paketet: ${plan.sv}.`
      : `I am interested in the package: ${plan.en}.`;

    setFormData((prev) => ({
      ...prev,
      message: prev.message ? `${prev.message}\n${prefill}` : prefill,
    }));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.name.trim()) newErrors.name = t.contact.errorName;
    if (!formData.email.trim()) newErrors.email = t.contact.errorEmail;
    else if (!isValidEmail(formData.email)) newErrors.email = t.contact.errorEmailInvalid;
    if (!formData.projectType) newErrors.projectType = t.contact.errorProjectType;
    if (!formData.message.trim()) newErrors.message = t.contact.errorMessage;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    const sanitized = sanitizeInput(value);
    setFormData((prev) => ({ ...prev, [field]: sanitized }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);

    try {
      const { error } = await supabase.functions.invoke('send-contact-email', {
        body: {
          name: formData.name, company: formData.company, email: formData.email,
          projectType: formData.projectType, budget: formData.budget,
          message: formData.message, website: formData.website,
        },
      });

      if (error) {
        toast({ title: 'Fel', description: 'Kunde inte skicka meddelandet. Försök igen.', variant: 'destructive' });
        setIsSubmitting(false);
        return;
      }

      setIsSubmitting(false);
      setIsSuccess(true);
      trackEvent('contact_form_submit', { project_type: formData.projectType, budget: formData.budget });
      toast({ title: t.contact.success, description: t.contact.successMessage });

      setTimeout(() => {
        setFormData({ name: '', company: '', email: '', projectType: '', budget: '', message: '', website: '' });
        setIsSuccess(false);
      }, 3000);
    } catch {
      toast({ title: 'Fel', description: 'Kunde inte skicka meddelandet. Försök igen.', variant: 'destructive' });
      setIsSubmitting(false);
    }
  };

  const projectTypes = [
    { value: 'website', label: t.contact.website },
    { value: 'webshop', label: t.contact.webshop },
    { value: 'booking', label: t.contact.booking },
    { value: 'webapp', label: t.contact.webApp },
    { value: 'other', label: t.contact.other },
  ];

  return (
    <section id="kontakt" className="py-16 sm:py-24 relative overflow-hidden" aria-label="Kontaktformulär">
      <div className="absolute inset-0 code-bg opacity-50" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <motion.div
          className="text-center mb-8 sm:mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif mb-3 sm:mb-4">
            <span className="gradient-text">{t.contact.headline}</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto px-2">
            {t.contact.intro}
          </p>
        </motion.div>

        <motion.form
          className="max-w-2xl mx-auto glass-card p-5 sm:p-8 rounded-2xl space-y-4 sm:space-y-6"
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground font-medium text-sm sm:text-base">
                {t.contact.name} <span className="text-destructive">*</span>
              </Label>
              <Input id="name" type="text" value={formData.name} onChange={(e) => handleInputChange('name', e.target.value)} placeholder={t.contact.namePlaceholder} className="glass-card border-white/10 bg-input/50 focus:border-primary/50 placeholder:text-muted-foreground/60 h-11 sm:h-10 text-base sm:text-sm" maxLength={100} required />
              {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="company" className="text-foreground font-medium text-sm sm:text-base">{t.contact.company}</Label>
              <Input id="company" type="text" value={formData.company} onChange={(e) => handleInputChange('company', e.target.value)} placeholder={t.contact.companyPlaceholder} className="glass-card border-white/10 bg-input/50 focus:border-primary/50 placeholder:text-muted-foreground/60 h-11 sm:h-10 text-base sm:text-sm" maxLength={100} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground font-medium text-sm sm:text-base">
                {t.contact.email} <span className="text-destructive">*</span>
              </Label>
              <Input id="email" type="email" value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)} placeholder={t.contact.emailPlaceholder} className="glass-card border-white/10 bg-input/50 focus:border-primary/50 placeholder:text-muted-foreground/60 h-11 sm:h-10 text-base sm:text-sm" maxLength={255} required />
              {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="projectType" className="text-foreground font-medium text-sm sm:text-base">
                {t.contact.projectType} <span className="text-destructive">*</span>
              </Label>
              <Select value={formData.projectType} onValueChange={(value) => handleInputChange('projectType', value)}>
                <SelectTrigger className="glass-card border-white/10 bg-input/50 focus:border-primary/50 h-11 sm:h-10 text-base sm:text-sm" aria-label={t.contact.projectTypePlaceholder}>
                  <SelectValue placeholder={t.contact.projectTypePlaceholder} />
                </SelectTrigger>
                <SelectContent className="glass-card border-white/10 bg-card z-[9999]">
                  {projectTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value} className="text-base sm:text-sm">{type.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.projectType && <p className="text-sm text-destructive">{errors.projectType}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="budget" className="text-foreground font-medium text-sm sm:text-base">{t.contact.budget}</Label>
            <Select value={formData.budget} onValueChange={(value) => handleInputChange('budget', value)}>
              <SelectTrigger className="glass-card border-white/10 bg-input/50 focus:border-primary/50 h-11 sm:h-10 text-base sm:text-sm" aria-label={t.contact.budgetPlaceholder}>
                <SelectValue placeholder={t.contact.budgetPlaceholder} />
              </SelectTrigger>
              <SelectContent className="glass-card border-white/10 bg-card z-[9999]">
                {t.contact.budgetOptions.map((option) => (
                  <SelectItem key={option} value={option} className="text-base sm:text-sm">{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message" className="text-foreground font-medium text-sm sm:text-base">
              {t.contact.message} <span className="text-destructive">*</span>
            </Label>
            <Textarea id="message" value={formData.message} onChange={(e) => handleInputChange('message', e.target.value)} placeholder={t.contact.messagePlaceholder} className="glass-card border-white/10 bg-input/50 focus:border-primary/50 min-h-[100px] sm:min-h-[120px] placeholder:text-muted-foreground/60 text-base sm:text-sm" maxLength={1000} required />
            <input type="text" name="website" value={formData.website} onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))} autoComplete="off" tabIndex={-1} aria-hidden="true" style={{ position: 'absolute', left: '-9999px', opacity: 0, height: 0, width: 0 }} />
            {errors.message && <p className="text-sm text-destructive">{errors.message}</p>}
          </div>

          <Button type="submit" size="lg" disabled={isSubmitting || isSuccess} className="w-full glow-button bg-primary text-primary-foreground hover:bg-primary/90 text-base sm:text-lg py-5 sm:py-6 rounded-xl font-medium">
            {isSubmitting ? (
              <motion.div className="flex items-center gap-2" animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1, repeat: Infinity }}>
                <Coffee className="w-5 h-5 animate-pulse" />
                {t.contact.sending}
              </motion.div>
            ) : isSuccess ? (
              <span className="flex items-center gap-2"><CheckCircle className="w-5 h-5" />{t.contact.success}</span>
            ) : (
              <span className="flex items-center gap-2"><Send className="w-5 h-5" />{t.contact.submit}</span>
            )}
          </Button>

          <AnimatePresence>
            {isSuccess && (
              <motion.p className="text-center text-accent text-sm sm:text-base" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                {t.contact.successMessage}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.form>
      </div>
    </section>
  );
}
