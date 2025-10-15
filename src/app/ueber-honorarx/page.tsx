'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
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
} from 'lucide-react';

const features = [
  {
    icon: Calendar,
    title: 'Einfach & Schnell',
    description:
      'Wählen Sie einfach die Daten aus dem Kalender aus – die App erledigt den Rest automatisch.',
    color: 'from-[#1A1A1A] to-[#1A1A1A]',
    iconColor: 'text-[#C9A227]',
    borderColor: 'border-[#C9A227]/30',
    delay: 0,
  },
  {
    icon: FileText,
    title: 'PDF-Rechnung generieren',
    description:
      'Automatische Erstellung professioneller PDF-Rechnungen mit allen notwendigen Informationen.',
    color: 'from-[#1A1A1A] to-[#1A1A1A]',
    iconColor: 'text-[#C9A227]',
    borderColor: 'border-[#C9A227]/30',
    delay: 100,
  },
  {
    icon: Send,
    title: 'Automatischer Versand',
    description:
      'Rechnungen werden automatisch an die AWO gesendet – keine manuellen Schritte erforderlich.',
    color: 'from-[#1A1A1A] to-[#1A1A1A]',
    iconColor: 'text-[#C9A227]',
    borderColor: 'border-[#C9A227]/30',
    delay: 200,
  },
  {
    icon: Database,
    title: 'Sichere Speicherung',
    description:
      'Alle Rechnungen werden sicher in Ihrem Konto gespeichert und sind jederzeit verfügbar.',
    color: 'from-[#1A1A1A] to-[#1A1A1A]',
    iconColor: 'text-[#C9A227]',
    borderColor: 'border-[#C9A227]/30',
    delay: 300,
  },
  {
    icon: Shield,
    title: 'Maximale Privatsphäre',
    description:
      'Ihre Daten und Rechnungen sind verschlüsselt – niemand kann darauf zugreifen.',
    color: 'from-[#1A1A1A] to-[#1A1A1A]',
    iconColor: 'text-[#C9A227]',
    borderColor: 'border-[#C9A227]/30',
    delay: 400,
  },
  {
    icon: BarChart3,
    title: 'Excel-Übersicht',
    description:
      'Automatische Excel-Tabellen mit Summen und allen Rechnungsinformationen.',
    color: 'from-[#1A1A1A] to-[#1A1A1A]',
    iconColor: 'text-[#C9A227]',
    borderColor: 'border-[#C9A227]/30',
    delay: 500,
  },
  {
    icon: Search,
    title: 'Intelligente Suche',
    description:
      'Filter, Suche und viele produktive Tools für optimale Rechnungsverwaltung.',
    color: 'from-[#1A1A1A] to-[#1A1A1A]',
    iconColor: 'text-[#C9A227]',
    borderColor: 'border-[#C9A227]/30',
    delay: 600,
  },
  {
    icon: Zap,
    title: 'Produktivitäts-Boost',
    description:
      'Sparen Sie Zeit und steigern Sie Ihre Effizienz mit intelligenten Automatisierungen.',
    color: 'from-[#1A1A1A] to-[#1A1A1A]',
    iconColor: 'text-[#C9A227]',
    borderColor: 'border-[#C9A227]/30',
    delay: 700,
  },
];

export default function UeberHonorarxPage() {
  const [visibleCards, setVisibleCards] = useState<number[]>([]);
  const [isCtaVisible, setIsCtaVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      features.forEach((_, index) => {
        setTimeout(() => {
          setVisibleCards((prev) => [...prev, index]);
        }, index * 150);
      });

      // Show CTA section after all cards are visible
      setTimeout(() => {
        setIsCtaVisible(true);
      }, features.length * 150 + 500);
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
              <h1 className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-sentient text-[#F5F5F5] mb-3 sm:mb-4'>
                <span className='tracking-wider'>Über HonorarX</span>
              </h1>
              <div className='w-16 sm:w-24 h-px bg-[#C9A227] mx-auto mb-4 sm:mb-6'></div>
              <p className='text-base sm:text-lg text-[#F5F5F5]/80 font-mono max-w-3xl mx-auto'>
                Die revolutionäre Rechnungsverwaltung, die Ihre Arbeit
                vereinfacht und Ihre Produktivität steigert
              </p>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className='px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16'>
          <div className='max-w-6xl mx-auto'>
            {/* Features Grid */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16'>
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
                      className={`bg-gradient-to-br ${feature.color} backdrop-blur-sm border ${feature.borderColor} rounded-xl p-6 shadow-lg hover:shadow-xl hover:shadow-[#C9A227]/20 transition-all duration-300 hover:scale-105 hover:border-[#D9B43A] h-full group`}>
                      <div className='flex flex-col h-full'>
                        <div className='flex items-center mb-4'>
                          <div
                            className={`w-12 h-12 bg-[#2B2D31]/50 border ${feature.borderColor} rounded-lg flex items-center justify-center mr-4 group-hover:border-[#D9B43A] transition-colors duration-300`}>
                            <Icon
                              className={`w-6 h-6 ${feature.iconColor} group-hover:text-[#D9B43A] transition-colors duration-300`}
                            />
                          </div>
                          <h3 className='text-lg font-sentient text-[#F5F5F5] tracking-wide'>
                            {feature.title}
                          </h3>
                        </div>
                        <p className='text-[#F5F5F5]/90 text-sm leading-relaxed flex-grow'>
                          {feature.description}
                        </p>
                        <div className='mt-4 flex items-center text-xs text-[#F5F5F5]/60 font-mono'>
                          <div className='w-2 h-2 bg-[#C9A227] rounded-full mr-2 animate-pulse group-hover:bg-[#D9B43A] transition-colors duration-300'></div>
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
              <div
                className={`transform transition-all duration-700 ease-out ${
                  isCtaVisible
                    ? 'opacity-100 translate-y-0 scale-100'
                    : 'opacity-0 translate-y-8 scale-95'
                }`}>
                <div className='bg-gradient-to-r from-[#2B2D31] to-[#2B2D31]/80 backdrop-blur-sm border border-[#C9A227]/30 rounded-2xl p-8 lg:p-12 shadow-lg shadow-[#C9A227]/10'>
                  <h3 className='text-2xl sm:text-3xl font-sentient text-[#C9A227] tracking-wide mb-4'>
                    Bereit für den nächsten Schritt?
                  </h3>
                  <p className='text-[#F5F5F5]/80 mb-8 max-w-2xl mx-auto'>
                    Erleben Sie die Zukunft der Rechnungsverwaltung. Einfach,
                    sicher und effizient.
                  </p>
                  <div className='flex justify-center'>
                    <Button asChild size='sm'>
                      <Link href='/registrieren'>
                        <CheckCircle className='w-4 h-4' />
                        JETZT STARTEN
                        <ArrowRight className='w-4 h-4' />
                      </Link>
                    </Button>
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
