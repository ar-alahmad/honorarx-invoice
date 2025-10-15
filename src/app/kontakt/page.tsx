'use client';

import { useState, useRef, useEffect } from 'react';
import { DynamicBackground, ErrorBoundary } from '@/components/effects';
import { Button } from '@/components/ui';
import { Leva } from 'leva';
import {
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle,
  ChevronDown,
  Shield,
  Users,
  MessageCircle,
} from 'lucide-react';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

const subjectOptions = [
  'Bitte wählen Sie einen Betreff',
  'Fragen zu Honorar X',
  'Feedback geben',
  'Technisches Problem melden',
  'Allgemeine Anfrage',
  'Fragen zur Rechnungserstellung',
  'Konto und Anmeldung',
  'Datenschutz',
  'Sonstiges',
];

export default function KontaktPage() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [visibleCards, setVisibleCards] = useState<number[]>([]);
  const [visibleFormElements, setVisibleFormElements] = useState<number[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Animate cards and form elements on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      // Animate cards first
      [0, 1, 2].forEach((index) => {
        setTimeout(() => {
          setVisibleCards((prev) => [...prev, index]);
        }, index * 200);
      });

      // Animate form elements after cards
      [0, 1, 2, 3, 4].forEach((index) => {
        setTimeout(() => {
          setVisibleFormElements((prev) => [...prev, index]);
        }, 600 + index * 100);
      });
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name ist erforderlich';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'E-Mail-Adresse ist erforderlich';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Bitte geben Sie eine gültige E-Mail-Adresse ein';
    }

    if (
      !formData.subject ||
      formData.subject === 'Bitte wählen Sie einen Betreff'
    ) {
      newErrors.subject = 'Bitte wählen Sie einen Betreff';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Nachricht ist erforderlich';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Nachricht muss mindestens 10 Zeichen lang sein';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Send email using our API
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Fehler beim Senden der E-Mail');
      }

      setIsSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error('Form submission error:', error);
      setErrors({
        message:
          'Fehler beim Senden der Nachricht. Bitte versuchen Sie es erneut.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  if (isSubmitted) {
    return (
      <div className='relative min-h-screen'>
        <ErrorBoundary>
          <DynamicBackground
            showControls={process.env.NODE_ENV === 'development'}
            speed={0.5}
            opacity={0.3}
            pointSize={4.0}
          />
        </ErrorBoundary>

        <div className='relative z-10 min-h-screen flex items-center justify-center'>
          <div className='text-center max-w-md mx-auto px-4'>
            <div className='bg-background/80 backdrop-blur-sm border border-border/50 rounded-xl p-8 shadow-lg'>
              <CheckCircle className='w-16 h-16 text-primary mx-auto mb-4' />
              <h2 className='text-2xl font-sentient text-white mb-4'>
                Nachricht gesendet!
              </h2>
              <p className='text-foreground/80 mb-6'>
                Vielen Dank für Ihre Nachricht. Wir werden uns innerhalb von
                24–48 Stunden bei Ihnen melden.
              </p>
              <Button onClick={() => setIsSubmitted(false)} className='w-full'>
                Neue Nachricht senden
              </Button>
            </div>
          </div>
        </div>

        <Leva hidden />
      </div>
    );
  }

  return (
    <div className='relative min-h-screen'>
      <ErrorBoundary>
        <DynamicBackground
          showControls={process.env.NODE_ENV === 'development'}
          speed={0.5}
          opacity={0.3}
          pointSize={4.0}
        />
      </ErrorBoundary>

      <div className='relative z-10 min-h-screen'>
        {/* Header section */}
        <div className='pt-48 sm:pt-52 lg:pt-56 pb-8 sm:pb-12 px-4 sm:px-6 lg:px-8'>
          <div className='max-w-5xl mx-auto'>
            <div className='text-center mb-8 sm:mb-12'>
              <div className='flex items-center justify-center mb-4'>
                <h1 className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-sentient text-white mb-3 sm:mb-4'>
                  <span className='tracking-wider'>Kontakt</span>
                </h1>
              </div>
              <div className='w-16 sm:w-24 h-px bg-primary mx-auto mb-4 sm:mb-6'></div>
              <p className='text-base sm:text-lg text-foreground/80 font-mono max-w-3xl mx-auto'>
                Schreiben Sie uns – wir helfen Ihnen gerne weiter. Ihr Feedback
                ist uns wichtig.
              </p>

              {/* Trust Indicators */}
              <div className='flex flex-col sm:flex-row gap-4 justify-center items-center mt-8'>
                <div className='flex items-center gap-2 text-sm text-foreground/60 font-mono'>
                  <Shield className='w-4 h-4 text-primary' />
                  <span>DSGVO-konform</span>
                </div>
                <div className='flex items-center gap-2 text-sm text-foreground/60 font-mono'>
                  <Users className='w-4 h-4 text-primary' />
                  <span>Persönlicher Support</span>
                </div>
                <div className='flex items-center gap-2 text-sm text-foreground/60 font-mono'>
                  <MessageCircle className='w-4 h-4 text-primary' />
                  <span>Schnelle Antwort</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className='px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16'>
          <div className='max-w-5xl mx-auto'>
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch'>
              {/* Contact Form - First on mobile, Right on desktop */}
              <div
                className='lg:order-2 lg:col-span-2 bg-background/80 backdrop-blur-sm border border-border/50 rounded-xl p-6 shadow-lg relative flex flex-col'
                style={{ zIndex: 10000 }}>
                <div
                  className={`transform transition-all duration-700 ease-out ${
                    visibleFormElements.includes(0)
                      ? 'opacity-100 translate-y-0 scale-100'
                      : 'opacity-0 translate-y-8 scale-95'
                  }`}
                  style={{ transitionDelay: '0ms' }}>
                  <h2 className='text-xl font-sentient text-primary tracking-wide mb-5'>
                    Nachricht senden
                  </h2>
                </div>

                <form
                  onSubmit={handleSubmit}
                  className='space-y-4 flex-1 flex flex-col'>
                  {/* Name Field */}
                  <div
                    className={`transform transition-all duration-700 ease-out ${
                      visibleFormElements.includes(1)
                        ? 'opacity-100 translate-y-0 scale-100'
                        : 'opacity-0 translate-y-8 scale-95'
                    }`}
                    style={{ transitionDelay: '100ms' }}>
                    <label
                      htmlFor='name'
                      className='block text-sm font-medium text-foreground/90 mb-2'>
                      Ihr Name *
                    </label>
                    <input
                      type='text'
                      id='name'
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange('name', e.target.value)
                      }
                      className={`w-full px-3 py-2.5 bg-background/50 border rounded-lg text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors ${
                        errors.name ? 'border-red-500' : 'border-border'
                      }`}
                      placeholder='Max Mustermann'
                    />
                    {errors.name && (
                      <p className='mt-1 text-sm text-red-400'>{errors.name}</p>
                    )}
                  </div>

                  {/* Email Field */}
                  <div
                    className={`transform transition-all duration-700 ease-out ${
                      visibleFormElements.includes(2)
                        ? 'opacity-100 translate-y-0 scale-100'
                        : 'opacity-0 translate-y-8 scale-95'
                    }`}
                    style={{ transitionDelay: '200ms' }}>
                    <label
                      htmlFor='email'
                      className='block text-sm font-medium text-foreground/90 mb-2'>
                      Ihre E-Mail-Adresse *
                    </label>
                    <input
                      type='email'
                      id='email'
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange('email', e.target.value)
                      }
                      className={`w-full px-3 py-2.5 bg-background/50 border rounded-lg text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors ${
                        errors.email ? 'border-red-500' : 'border-border'
                      }`}
                      placeholder='max@beispiel.de'
                    />
                    {errors.email && (
                      <p className='mt-1 text-sm text-red-400'>
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Subject Field */}
                  <div
                    className={`transition-opacity duration-1000 ease-out ${
                      visibleFormElements.includes(3)
                        ? 'opacity-100'
                        : 'opacity-0'
                    }`}
                    style={{ transitionDelay: '300ms' }}>
                    <label
                      htmlFor='subject'
                      className='block text-sm font-medium text-foreground/90 mb-2'>
                      Betreff *
                    </label>
                    <div className='relative' ref={dropdownRef}>
                      <button
                        type='button'
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className={`w-full px-3 py-2.5 bg-background/50 border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors text-left flex items-center justify-between ${
                          errors.subject ? 'border-red-500' : 'border-border'
                        }`}>
                        <span
                          className={
                            formData.subject
                              ? 'text-foreground'
                              : 'text-foreground/50'
                          }>
                          {formData.subject || 'Bitte wählen Sie einen Betreff'}
                        </span>
                        <ChevronDown
                          className={`w-4 h-4 text-foreground/50 transition-transform ${
                            isDropdownOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </button>

                      {/* Custom Dropdown */}
                      {isDropdownOpen && (
                        <div className='absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-lg shadow-xl z-[9999] max-h-48 overflow-y-auto'>
                          {subjectOptions.map((option) => (
                            <button
                              key={option}
                              type='button'
                              onClick={() => {
                                handleInputChange('subject', option);
                                setIsDropdownOpen(false);
                              }}
                              className={`w-full px-3 py-2 text-left text-sm hover:bg-primary/10 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                                formData.subject === option
                                  ? 'bg-primary/10 text-primary'
                                  : 'text-foreground'
                              }`}>
                              {option}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    {errors.subject && (
                      <p className='mt-1 text-sm text-red-400'>
                        {errors.subject}
                      </p>
                    )}
                  </div>

                  {/* Message Field */}
                  <div
                    className={`flex-1 flex flex-col transform transition-all duration-700 ease-out ${
                      visibleFormElements.includes(4)
                        ? 'opacity-100 translate-y-0 scale-100'
                        : 'opacity-0 translate-y-8 scale-95'
                    }`}
                    style={{ transitionDelay: '400ms' }}>
                    <label
                      htmlFor='message'
                      className='block text-sm font-medium text-foreground/90 mb-2'>
                      Nachricht *
                    </label>
                    <textarea
                      id='message'
                      rows={4}
                      value={formData.message}
                      onChange={(e) =>
                        handleInputChange('message', e.target.value)
                      }
                      className={`w-full px-3 py-2.5 bg-background/50 border rounded-lg text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors resize-vertical flex-1 ${
                        errors.message ? 'border-red-500' : 'border-border'
                      }`}
                      placeholder='Beschreiben Sie Ihr Anliegen...'
                    />
                    {errors.message && (
                      <p className='mt-1 text-sm text-red-400'>
                        {errors.message}
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div
                    className={`transform transition-all duration-700 ease-out ${
                      visibleFormElements.includes(4)
                        ? 'opacity-100 translate-y-0 scale-100'
                        : 'opacity-0 translate-y-8 scale-95'
                    }`}
                    style={{ transitionDelay: '500ms' }}>
                    <Button
                      type='submit'
                      disabled={isSubmitting}
                      className='w-full flex items-center justify-center gap-2'>
                      {isSubmitting ? (
                        <>
                          <div className='w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin' />
                          Wird gesendet...
                        </>
                      ) : (
                        <>
                          <Send className='w-4 h-4' />
                          Nachricht senden
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </div>

              {/* Contact Information Cards - Left Side */}
              <div className='lg:order-1 lg:col-span-1 flex flex-col gap-4 h-full'>
                {/* Email Card */}
                <div
                  className={`transform transition-all duration-700 ease-out flex-1 ${
                    visibleCards.includes(0)
                      ? 'opacity-100 translate-y-0 scale-100'
                      : 'opacity-0 translate-y-8 scale-95'
                  }`}
                  style={{ transitionDelay: '0ms' }}>
                  <div className='bg-[#1A1A1A] backdrop-blur-sm border border-[#C9A227]/30 rounded-xl p-5 shadow-lg hover:shadow-xl hover:shadow-[#C9A227]/20 transition-all duration-300 hover:scale-105 hover:border-[#C9A227]/50 h-full flex flex-col'>
                    <div className='flex items-start flex-1'>
                      <div className='w-12 h-12 bg-[#2B2D31] border border-[#C9A227]/30 rounded-lg flex items-center justify-center mr-4 flex-shrink-0'>
                        <Mail className='w-6 h-6 text-[#C9A227]' />
                      </div>
                      <div className='flex flex-col justify-center flex-1'>
                        <h3 className='text-lg font-sentient text-[#C9A227] tracking-wide mb-2'>
                          E-Mail Support
                        </h3>
                        <p className='text-[#F5F5F5]/90 mb-3 text-sm leading-relaxed'>
                          Schreiben Sie uns eine E-Mail für direkten Support
                        </p>
                        <a
                          href='mailto:info@honorarx.de'
                          className='text-[#C9A227] font-mono text-sm hover:text-[#D9B43A] transition-colors duration-200 font-medium'>
                          info@honorarx.de
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Address Card */}
                <div
                  className={`transform transition-all duration-700 ease-out flex-1 ${
                    visibleCards.includes(1)
                      ? 'opacity-100 translate-y-0 scale-100'
                      : 'opacity-0 translate-y-8 scale-95'
                  }`}
                  style={{ transitionDelay: '200ms' }}>
                  <div className='bg-[#1A1A1A] backdrop-blur-sm border border-[#C9A227]/30 rounded-xl p-5 shadow-lg hover:shadow-xl hover:shadow-[#C9A227]/20 transition-all duration-300 hover:scale-105 hover:border-[#C9A227]/50 h-full flex flex-col'>
                    <div className='flex items-start flex-1'>
                      <div className='w-12 h-12 bg-[#2B2D31] border border-[#C9A227]/30 rounded-lg flex items-center justify-center mr-4 flex-shrink-0'>
                        <MapPin className='w-6 h-6 text-[#C9A227]' />
                      </div>
                      <div className='flex flex-col justify-center flex-1'>
                        <h3 className='text-lg font-sentient text-[#C9A227] tracking-wide mb-2'>
                          Unser Standort
                        </h3>
                        <p className='text-[#F5F5F5]/90 mb-3 text-sm leading-relaxed'>
                          Besuchen Sie uns in Badenweiler
                        </p>
                        <address className='text-[#F5F5F5]/80 font-mono text-sm not-italic leading-relaxed'>
                          Luisenstraße 9B
                          <br />
                          79410 Badenweiler
                          <br />
                          Deutschland
                        </address>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Response Time Card */}
                <div
                  className={`transform transition-all duration-700 ease-out flex-1 ${
                    visibleCards.includes(2)
                      ? 'opacity-100 translate-y-0 scale-100'
                      : 'opacity-0 translate-y-8 scale-95'
                  }`}
                  style={{ transitionDelay: '400ms' }}>
                  <div className='bg-[#1A1A1A] backdrop-blur-sm border border-[#C9A227]/30 rounded-xl p-5 shadow-lg hover:shadow-xl hover:shadow-[#C9A227]/20 transition-all duration-300 hover:scale-105 hover:border-[#C9A227]/50 h-full flex flex-col'>
                    <div className='flex items-start flex-1'>
                      <div className='w-12 h-12 bg-[#2B2D31] border border-[#C9A227]/30 rounded-lg flex items-center justify-center mr-4 flex-shrink-0'>
                        <Clock className='w-6 h-6 text-[#C9A227]' />
                      </div>
                      <div className='flex flex-col justify-center flex-1'>
                        <h3 className='text-lg font-sentient text-[#C9A227] tracking-wide mb-2'>
                          Schnelle Antwort
                        </h3>
                        <p className='text-[#F5F5F5]/90 mb-3 text-sm leading-relaxed'>
                          Wir bemühen uns um schnelle Antworten
                        </p>
                        <p className='text-[#F5F5F5]/80 font-mono text-sm font-medium'>
                          Innerhalb von 24–48 Stunden
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Leva hidden />
    </div>
  );
}
