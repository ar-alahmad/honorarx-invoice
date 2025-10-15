'use client';

import { useState, useEffect } from 'react';
import { DynamicBackground, ErrorBoundary } from '@/components/effects';
import { Button } from '@/components/ui';
import { Leva } from 'leva';
import {
  Calendar,
  FileText,
  Send,
  Shield,
  Database,
  BarChart3,
  Search,
  Zap,
  CheckCircle,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

const features = [
  {
    icon: Calendar,
    title: 'Einfach & Schnell',
    description:
      'Wählen Sie einfach die Daten aus dem Kalender aus – die App erledigt den Rest automatisch.',
    color: 'from-blue-500/20 to-cyan-500/20',
    iconColor: 'text-blue-400',
    borderColor: 'border-blue-500/30',
    delay: '0',
  },
  {
    icon: FileText,
    title: 'PDF-Rechnung generieren',
    description:
      'Automatische Erstellung professioneller PDF-Rechnungen mit allen notwendigen Informationen.',
    color: 'from-green-500/20 to-emerald-500/20',
    iconColor: 'text-green-400',
    borderColor: 'border-green-500/30',
    delay: '100',
  },
  {
    icon: Send,
    title: 'Automatischer Versand',
    description:
      'Rechnungen werden automatisch an die AWO gesendet – keine manuellen Schritte erforderlich.',
    color: 'from-purple-500/20 to-violet-500/20',
    iconColor: 'text-purple-400',
    borderColor: 'border-purple-500/30',
    delay: '200',
  },
  {
    icon: Database,
    title: 'Sichere Speicherung',
    description:
      'Alle Rechnungen werden sicher in Ihrem Konto gespeichert und sind jederzeit verfügbar.',
    color: 'from-orange-500/20 to-amber-500/20',
    iconColor: 'text-orange-400',
    borderColor: 'border-orange-500/30',
    delay: '300',
  },
  {
    icon: Shield,
    title: 'Maximale Privatsphäre',
    description:
      'Ihre Daten und Rechnungen sind verschlüsselt – niemand kann darauf zugreifen.',
    color: 'from-red-500/20 to-rose-500/20',
    iconColor: 'text-red-400',
    borderColor: 'border-red-500/30',
    delay: '400',
  },
  {
    icon: BarChart3,
    title: 'Excel-Übersicht',
    description:
      'Automatische Excel-Tabellen mit Summen und allen Rechnungsinformationen.',
    color: 'from-teal-500/20 to-cyan-500/20',
    iconColor: 'text-teal-400',
    borderColor: 'border-teal-500/30',
    delay: '500',
  },
  {
    icon: Search,
    title: 'Intelligente Suche',
    description:
      'Filter, Suche und viele produktive Tools für optimale Rechnungsverwaltung.',
    color: 'from-indigo-500/20 to-blue-500/20',
    iconColor: 'text-indigo-400',
    borderColor: 'border-indigo-500/30',
    delay: '600',
  },
  {
    icon: Zap,
    title: 'Produktivitäts-Boost',
    description:
      'Sparen Sie Zeit und steigern Sie Ihre Effizienz mit intelligenten Automatisierungen.',
    color: 'from-yellow-500/20 to-orange-500/20',
    iconColor: 'text-yellow-400',
    borderColor: 'border-yellow-500/30',
    delay: '700',
  },
];

export default function UeberHonorarxPage() {
  const [visibleCards, setVisibleCards] = useState<number[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      features.forEach((_, index) => {
        setTimeout(() => {
          setVisibleCards((prev) => [...prev, index]);
        }, index * 150);
      });
    }, 300);

    return () => clearTimeout(timer);
  }, []);

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
          <div className='max-w-6xl mx-auto'>
            <div className='text-center mb-8 sm:mb-12'>
              <div className='flex items-center justify-center mb-4'>
                <Sparkles className='w-8 h-8 text-primary mr-3 animate-pulse' />
                <h1 className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-sentient text-white mb-3 sm:mb-4'>
                  <span className='tracking-wider'>Über HonorarX</span>
                </h1>
                <Sparkles className='w-8 h-8 text-primary ml-3 animate-pulse' />
              </div>
              <div className='w-16 sm:w-24 h-px bg-primary mx-auto mb-4 sm:mb-6'></div>
              <p className='text-base sm:text-lg text-foreground/80 font-mono max-w-3xl mx-auto'>
                Die revolutionäre Rechnungsverwaltung, die Ihre Arbeit
                vereinfacht und Ihre Produktivität steigert
              </p>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className='px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16'>
          <div className='max-w-6xl mx-auto'>
            {/* Hero Section */}
            <div className='text-center mb-16'>
              <div className='bg-background/80 backdrop-blur-sm border border-border/50 rounded-2xl p-8 lg:p-12 shadow-lg'>
                <h2 className='text-2xl sm:text-3xl lg:text-4xl font-sentient text-primary tracking-wide mb-6'>
                  Warum HonorarX?
                </h2>
                <p className='text-lg text-foreground/90 mb-8 max-w-4xl mx-auto leading-relaxed'>
                  HonorarX ist mehr als nur eine Rechnungsverwaltung – es ist
                  Ihr intelligenter Partner für effiziente Rechnungsabwicklung.
                  Mit modernster Technologie und benutzerfreundlichem Design
                  machen wir Ihre Rechnungsverwaltung so einfach wie nie zuvor.
                </p>
                <div className='flex flex-col sm:flex-row gap-4 justify-center items-center'>
                  <Button className='flex items-center gap-2'>
                    <CheckCircle className='w-4 h-4' />
                    Jetzt starten
                    <ArrowRight className='w-4 h-4' />
                  </Button>
                  <p className='text-sm text-foreground/60 font-mono'>
                    ✓ Kostenlos testen ✓ Keine Kreditkarte erforderlich
                  </p>
                </div>
              </div>
            </div>

            {/* Features Grid */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
              {features.map((feature, index) => {
                const Icon = feature.icon;
                const isVisible = visibleCards.includes(index);

                return (
                  <div
                    key={index}
                    className={`transform transition-all duration-700 ease-out ${
                      isVisible
                        ? 'opacity-100 translate-y-0 scale-100'
                        : 'opacity-0 translate-y-8 scale-95'
                    }`}
                    style={{ transitionDelay: `${feature.delay}ms` }}>
                    <div
                      className={`bg-gradient-to-br ${feature.color} backdrop-blur-sm border ${feature.borderColor} rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 h-full`}>
                      <div className='flex flex-col h-full'>
                        <div className='flex items-center mb-4'>
                          <div
                            className={`w-12 h-12 bg-background/20 border ${feature.borderColor} rounded-lg flex items-center justify-center mr-4`}>
                            <Icon className={`w-6 h-6 ${feature.iconColor}`} />
                          </div>
                          <h3 className='text-lg font-sentient text-primary tracking-wide'>
                            {feature.title}
                          </h3>
                        </div>
                        <p className='text-foreground/90 text-sm leading-relaxed flex-grow'>
                          {feature.description}
                        </p>
                        <div className='mt-4 flex items-center text-xs text-foreground/60 font-mono'>
                          <div className='w-2 h-2 bg-primary rounded-full mr-2 animate-pulse'></div>
                          Feature {index + 1}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom CTA Section */}
            <div className='mt-16 text-center'>
              <div className='bg-gradient-to-r from-primary/10 to-primary/5 backdrop-blur-sm border border-primary/30 rounded-2xl p-8 lg:p-12 shadow-lg'>
                <h3 className='text-2xl sm:text-3xl font-sentient text-primary tracking-wide mb-4'>
                  Bereit für den nächsten Schritt?
                </h3>
                <p className='text-foreground/80 mb-8 max-w-2xl mx-auto'>
                  Erleben Sie die Zukunft der Rechnungsverwaltung. Einfach,
                  sicher und effizient.
                </p>
                <div className='flex flex-col sm:flex-row gap-4 justify-center items-center'>
                  <Button size='sm' className='flex items-center gap-2'>
                    <Zap className='w-4 h-4' />
                    Kostenlos registrieren
                  </Button>
                  <Button
                    variant='outline'
                    size='sm'
                    className='flex items-center gap-2'>
                    <FileText className='w-4 h-4' />
                    Demo ansehen
                  </Button>
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
