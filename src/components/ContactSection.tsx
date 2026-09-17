import { useState } from 'react';
import { trackEvent } from '@/lib/analytics';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Mail,
  Download,
  ExternalLink,
  Check,
  Send,
  CheckCircle,
  Coffee,
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface FormData {
  email: string;
  message: string;
  website: string;
}

interface FormErrors {
  email?: string;
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
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    email: '',
    message: '',
    website: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText('hej@coffeecodestudio.se');
      setCopied(true);
      trackEvent('copy_email', { location: 'contact' });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable — fail silently
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    const sanitized = sanitizeInput(value);
    setFormData((prev) => ({ ...prev, [field]: sanitized }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.email.trim()) newErrors.email = 'Email is required.';
    else if (!isValidEmail(formData.email)) newErrors.email = 'Please enter a valid email address.';
    if (!formData.message.trim()) newErrors.message = 'Message is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);

    try {
      const { error } = await supabase.functions.invoke('send-contact-email', {
        body: {
          email: formData.email,
          message: formData.message,
          name: 'Portfolio visitor',
        },
      });

      if (error) {
        toast({
          title: 'Error',
          description: 'Could not send message. Please try again.',
          variant: 'destructive',
        });
        setIsSubmitting(false);
        return;
      }

      setIsSubmitting(false);
      setIsSuccess(true);
      trackEvent('contact_form_submit', { location: 'contact' });
      toast({
        title: 'Sent!',
        description: 'Thanks for reaching out. I will get back to you soon.',
      });

      setTimeout(() => {
        setFormData({ email: '', message: '', website: '' });
        setIsSuccess(false);
      }, 3000);
    } catch {
      toast({
        title: 'Error',
        description: 'Could not send message. Please try again.',
        variant: 'destructive',
      });
      setIsSubmitting(false);
    }
  };

  return (
    <section id="kontakt" className="relative overflow-hidden" aria-label="Contact">
      <div className="absolute inset-0 code-bg opacity-50" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-start max-w-5xl mx-auto">
          {/* Left column — contact actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif mb-6">
              <span className="gradient-text">Let's Build Something Resilient.</span>
            </h2>

            <p className="text-base sm:text-lg text-muted-foreground mb-8">
              Currently exploring full-time Product Engineer roles in Gothenburg (hybrid/on-site). If you need an engineer who pairs rapid AI workflows with strict TypeScript and resilient Supabase backends — let's connect.
            </p>

            <div className="flex flex-col gap-3">
              <Button
                size="lg"
                className="w-full glow-button bg-primary text-primary-foreground hover:bg-primary/90 text-base sm:text-lg py-5 sm:py-6 rounded-xl font-medium justify-start"
                onClick={handleCopyEmail}
              >
                {copied ? (
                  <>
                    <Check className="w-5 h-5 mr-3" aria-hidden="true" />
                    Copied to clipboard!
                  </>
                ) : (
                  <>
                    <Mail className="w-5 h-5 mr-3 shrink-0" aria-hidden="true" />
                    <span className="truncate">
                      Copy Email
                      <span className="hidden sm:inline"> — hej@coffeecodestudio.se</span>
                    </span>
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="w-full border-primary/30 text-base sm:text-lg py-5 sm:py-6 rounded-xl font-medium justify-start"
                asChild
              >
                <a
                  href="mailto:hej@coffeecodestudio.se?subject=CV%20Request&body=Hi%20Rami%2C%20I%20would%20like%20to%20request%20your%20CV."
                  onClick={() => trackEvent('cv_request', { location: 'contact' })}
                >
                  <Mail className="w-5 h-5 mr-3" aria-hidden="true" />
                  Request CV
                </a>
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="w-full border-primary/30 text-base sm:text-lg py-5 sm:py-6 rounded-xl font-medium justify-start"
                asChild
              >
                <a
                  href="https://www.linkedin.com/in/rami-e-453b77330/"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    trackEvent('social_click', { platform: 'linkedin', location: 'contact' })
                  }
                >
                  <ExternalLink className="w-5 h-5 mr-3" aria-hidden="true" />
                  Connect on LinkedIn
                </a>
              </Button>
            </div>

            <div className="mt-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" aria-hidden="true" />
              <span className="text-sm font-mono text-muted-foreground">
                Available for full-time roles — Gothenburg, SE
              </span>
            </div>
          </motion.div>

          {/* Right column — contact form */}
          <motion.form
            className="glass-card p-5 sm:p-8 rounded-2xl space-y-4 sm:space-y-6"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
          >
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground font-medium text-sm sm:text-base">
                Work Email <span className="text-destructive">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="your@company.se"
                className="glass-card border-white/10 bg-input/50 focus:border-primary/50 placeholder:text-muted-foreground/60 h-11 sm:h-10 text-base sm:text-sm"
                maxLength={255}
                required
              />
              {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="message" className="text-foreground font-medium text-sm sm:text-base">
                Message <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => handleInputChange('message', e.target.value)}
                placeholder="Tell me about the role or project."
                className="glass-card border-white/10 bg-input/50 focus:border-primary/50 min-h-[140px] placeholder:text-muted-foreground/60 text-base sm:text-sm"
                maxLength={1000}
                required
              />
              {errors.message && <p className="text-sm text-destructive">{errors.message}</p>}
            </div>

            {/* Honeypot field */}
            <input
              type="text"
              name="website"
              value={formData.website}
              onChange={(e) => handleInputChange('website', e.target.value)}
              autoComplete="off"
              tabIndex={-1}
              aria-hidden="true"
              style={{ position: 'absolute', left: '-9999px', opacity: 0, height: 0, width: 0 }}
            />

            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting || isSuccess}
              className="w-full glow-button bg-primary text-primary-foreground hover:bg-primary/90 text-base sm:text-lg py-5 sm:py-6 rounded-xl font-medium"
            >
              {isSubmitting ? (
                <motion.div
                  className="flex items-center gap-2"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <Coffee className="w-5 h-5 animate-pulse" aria-hidden="true" />
                  Sending...
                </motion.div>
              ) : isSuccess ? (
                <span className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" aria-hidden="true" />
                  Sent!
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Send className="w-5 h-5" aria-hidden="true" />
                  Send Message
                </span>
              )}
            </Button>
          </motion.form>
        </div>
      </div>
    </section>
  );
}
