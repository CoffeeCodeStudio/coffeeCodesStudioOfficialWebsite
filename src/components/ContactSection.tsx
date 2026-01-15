import { useState } from 'react';
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
import { Coffee, Send, CheckCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
interface FormData {
  name: string;
  company: string;
  email: string;
  projectType: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  projectType?: string;
  message?: string;
}

// Sanitize input to prevent XSS
const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>]/g, '') // Remove angle brackets
    .trim()
    .slice(0, 1000); // Limit length
};

// Validate email format
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export function ContactSection() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    company: '',
    email: '',
    projectType: '',
    message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [fillLevel, setFillLevel] = useState(0);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = t.contact.errorName;
    }

    if (!formData.email.trim()) {
      newErrors.email = t.contact.errorEmail;
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = t.contact.errorEmailInvalid;
    }

    if (!formData.projectType) {
      newErrors.projectType = t.contact.errorProjectType;
    }

    if (!formData.message.trim()) {
      newErrors.message = t.contact.errorMessage;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    const sanitized = sanitizeInput(value);
    setFormData((prev) => ({ ...prev, [field]: sanitized }));
    
    // Clear error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }

    // Update coffee fill level based on form completion
    const filledFields = Object.values({ ...formData, [field]: sanitized }).filter(
      (v) => v.trim() !== ''
    ).length;
    setFillLevel((filledFields / 5) * 100);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke('send-contact-email', {
        body: {
          name: formData.name,
          company: formData.company,
          email: formData.email,
          projectType: formData.projectType,
          message: formData.message,
        },
      });

      if (error) {
        console.error('Error sending email:', error);
        toast({
          title: 'Fel',
          description: 'Kunde inte skicka meddelandet. Försök igen.',
          variant: 'destructive',
        });
        setIsSubmitting(false);
        return;
      }

      console.log('Email sent successfully:', data);
      setIsSubmitting(false);
      setIsSuccess(true);
      
      toast({
        title: t.contact.success,
        description: t.contact.successMessage,
      });

      // Reset form after success
      setTimeout(() => {
        setFormData({
          name: '',
          company: '',
          email: '',
          projectType: '',
          message: '',
        });
        setFillLevel(0);
        setIsSuccess(false);
      }, 3000);
    } catch (err) {
      console.error('Error submitting form:', err);
      toast({
        title: 'Fel',
        description: 'Kunde inte skicka meddelandet. Försök igen.',
        variant: 'destructive',
      });
      setIsSubmitting(false);
    }
  };

  const projectTypes = [
    { value: 'webapp', label: t.contact.webApp },
    { value: 'internal', label: t.contact.internalTool },
    { value: 'saas', label: t.contact.saas },
    { value: 'other', label: t.contact.other },
  ];

  return (
    <section id="contact" className="py-24 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 code-bg opacity-50" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-serif mb-4">
            <span className="gradient-text">{t.contact.headline}</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            {t.contact.intro}
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto grid md:grid-cols-5 gap-8 items-start">
          {/* Coffee Cup Animation */}
          <motion.div
            className="md:col-span-2 flex justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <div className="relative w-48 h-64">
              {/* Cup */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-40 bg-card/80 rounded-b-3xl border-2 border-primary/30 overflow-hidden">
                {/* Coffee fill */}
                <motion.div
                  className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-amber-900 via-amber-700 to-amber-600"
                  initial={{ height: '0%' }}
                  animate={{ height: `${fillLevel}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                />
                {/* Steam */}
                <AnimatePresence>
                  {fillLevel > 50 && (
                    <>
                      {[...Array(3)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute -top-8 w-2 h-8 bg-white/20 rounded-full blur-sm"
                          style={{ left: `${30 + i * 20}%` }}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{
                            opacity: [0, 0.5, 0],
                            y: [-10, -30],
                            x: [0, (i - 1) * 5],
                          }}
                          exit={{ opacity: 0 }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: i * 0.3,
                          }}
                        />
                      ))}
                    </>
                  )}
                </AnimatePresence>
              </div>
              {/* Handle */}
              <div className="absolute bottom-8 left-[75%] w-8 h-16 border-4 border-primary/30 rounded-r-full" />
              {/* Saucer */}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-40 h-4 bg-card/60 rounded-full border border-primary/20" />

              {/* Success checkmark */}
              <AnimatePresence>
                {isSuccess && (
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                  >
                    <div className="bg-accent/20 rounded-full p-4">
                      <CheckCircle className="w-16 h-16 text-accent" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.form
            className="md:col-span-3 glass-card p-8 rounded-2xl space-y-6"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <div className="grid md:grid-cols-2 gap-4">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-foreground font-medium">
                  {t.contact.name} <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder={t.contact.namePlaceholder}
                  className="glass-card border-white/10 bg-input/50 focus:border-primary/50 placeholder:text-muted-foreground/60"
                  maxLength={100}
                  required
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name}</p>
                )}
              </div>

              {/* Company */}
              <div className="space-y-2">
                <Label htmlFor="company" className="text-foreground font-medium">
                  {t.contact.company}
                </Label>
                <Input
                  id="company"
                  type="text"
                  value={formData.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                  placeholder={t.contact.companyPlaceholder}
                  className="glass-card border-white/10 bg-input/50 focus:border-primary/50 placeholder:text-muted-foreground/60"
                  maxLength={100}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground font-medium">
                  {t.contact.email} <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder={t.contact.emailPlaceholder}
                  className="glass-card border-white/10 bg-input/50 focus:border-primary/50 placeholder:text-muted-foreground/60"
                  maxLength={255}
                  required
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email}</p>
                )}
              </div>

              {/* Project Type */}
              <div className="space-y-2">
                <Label htmlFor="projectType" className="text-foreground font-medium">
                  {t.contact.projectType} <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.projectType}
                  onValueChange={(value) => handleInputChange('projectType', value)}
                >
                  <SelectTrigger className="glass-card border-white/10 bg-input/50 focus:border-primary/50">
                    <SelectValue placeholder={t.contact.projectTypePlaceholder} />
                  </SelectTrigger>
                  <SelectContent className="glass-card border-white/10 bg-card z-[9999]">
                    {projectTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.projectType && (
                  <p className="text-sm text-destructive">{errors.projectType}</p>
                )}
              </div>
            </div>

            {/* Message */}
            <div className="space-y-2">
              <Label htmlFor="message" className="text-foreground font-medium">
                {t.contact.message} <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => handleInputChange('message', e.target.value)}
                placeholder={t.contact.messagePlaceholder}
                className="glass-card border-white/10 bg-input/50 focus:border-primary/50 min-h-[120px] placeholder:text-muted-foreground/60"
                maxLength={1000}
                required
              />
              {errors.message && (
                <p className="text-sm text-destructive">{errors.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting || isSuccess}
              className="w-full glow-button bg-primary text-primary-foreground hover:bg-primary/90 text-lg py-6 rounded-xl font-medium"
            >
              {isSubmitting ? (
                <motion.div
                  className="flex items-center gap-2"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <Coffee className="w-5 h-5 animate-pulse" />
                  {t.contact.sending}
                </motion.div>
              ) : isSuccess ? (
                <span className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  {t.contact.success}
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Send className="w-5 h-5" />
                  {t.contact.submit}
                </span>
              )}
            </Button>

            {/* Success message */}
            <AnimatePresence>
              {isSuccess && (
                <motion.p
                  className="text-center text-accent"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  {t.contact.successMessage}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.form>
        </div>
      </div>
    </section>
  );
}
