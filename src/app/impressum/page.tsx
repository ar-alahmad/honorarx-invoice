'use client';

import { useState, useEffect } from 'react';
import { DynamicBackground, ErrorBoundary } from '@/components/effects';
import { Leva } from 'leva';
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Globe,
  FileText,
  Shield,
  Scale,
  CheckCircle,
  ArrowRight,
} from 'lucide-react';

const legalSections = [
  {
    icon: Building2,
    title: 'Anbieter',
    content: 'HonorarX GmbH',
    color: 'from-blue-500/20 to-cyan-500/20',
    iconColor: 'text-blue-400',
    borderColor: 'border-blue-500/30',
  },
  {
    icon: MapPin,
    title: 'Anschrift',
    content: 'Luisenstraße 9B\n79410 Badenweiler\nDeutschland',
    color: 'from-green-500/20 to-emerald-500/20',
    iconColor: 'text-green-400',
    borderColor: 'border-green-500/30',
  },
  {
    icon: Phone,
    title: 'Telefon',
    content: '+49 (0) 123 456 789',
    color: 'from-purple-500/20 to-violet-500/20',
    iconColor: 'text-purple-400',
    borderColor: 'border-purple-500/30',
  },
  {
    icon: Mail,
    title: 'E-Mail',
    content: 'info@honorarx.de',
    color: 'from-orange-500/20 to-amber-500/20',
    iconColor: 'text-orange-400',
    borderColor: 'border-orange-500/30',
  },
  {
    icon: Globe,
    title: 'Website',
    content: 'www.honorarx.de',
    color: 'from-teal-500/20 to-cyan-500/20',
    iconColor: 'text-teal-400',
    borderColor: 'border-teal-500/30',
  },
  {
    icon: FileText,
    title: 'Handelsregister',
    content: 'Amtsgericht Freiburg\nHRB 12345',
    color: 'from-indigo-500/20 to-blue-500/20',
    iconColor: 'text-indigo-400',
    borderColor: 'border-indigo-500/30',
  },
  {
    icon: Scale,
    title: 'Umsatzsteuer-ID',
    content: 'DE123456789',
    color: 'from-red-500/20 to-rose-500/20',
    iconColor: 'text-red-400',
    borderColor: 'border-red-500/30',
  },
  {
    icon: Shield,
    title: 'Verantwortlich',
    content: 'Geschäftsführung\nHonorarX GmbH',
    color: 'from-yellow-500/20 to-orange-500/20',
    iconColor: 'text-yellow-400',
    borderColor: 'border-yellow-500/30',
  },
];

export default function ImpressumPage() {
  const [visibleCards, setVisibleCards] = useState<number[]>([]);
  const [visibleAdditionalCards, setVisibleAdditionalCards] =
    useState<boolean>(false);
  const [visibleHeroSection, setVisibleHeroSection] = useState<boolean>(false);
  const [visibleFooterNote, setVisibleFooterNote] = useState<boolean>(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      legalSections.forEach((_, index) => {
        setTimeout(() => {
          setVisibleCards((prev) => [...prev, index]);
        }, index * 100);
      });
    }, 300);

    // Show additional cards after main cards
    const additionalTimer = setTimeout(() => {
      setVisibleAdditionalCards(true);
    }, 1200);

    // Show hero section after additional cards
    const heroTimer = setTimeout(() => {
      setVisibleHeroSection(true);
    }, 1800);

    // Show footer note after hero section
    const footerTimer = setTimeout(() => {
      setVisibleFooterNote(true);
    }, 2400);

    return () => {
      clearTimeout(timer);
      clearTimeout(additionalTimer);
      clearTimeout(heroTimer);
      clearTimeout(footerTimer);
    };
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
                <h1 className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-sentient text-white mb-3 sm:mb-4'>
                  <span className='tracking-wider'>Impressum</span>
                </h1>
              </div>
              <div className='w-16 sm:w-24 h-px bg-primary mx-auto mb-4 sm:mb-6'></div>
              <p className='text-base sm:text-lg text-foreground/80 font-mono max-w-3xl mx-auto'>
                Angaben gemäß § 5 TMG (Telemediengesetz) – Transparenz und
                Vertrauen
              </p>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className='px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16'>
          <div className='max-w-6xl mx-auto'>
            {/* Legal Information Grid */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16'>
              {legalSections.map((section, index) => {
                const Icon = section.icon;
                const isVisible = visibleCards.includes(index);

                return (
                  <div
                    key={index}
                    className={`transform transition-all duration-700 ease-out ${
                      isVisible
                        ? 'opacity-100 translate-y-0 scale-100'
                        : 'opacity-0 translate-y-8 scale-95'
                    }`}
                    style={{ transitionDelay: `${index * 100}ms` }}>
                    <div className='bg-[#1A1A1A] backdrop-blur-sm border border-[#C9A227]/30 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:border-[#D9B43A]/50 hover:shadow-[#C9A227]/20 hover:shadow-lg h-full'>
                      <div className='flex flex-col h-full'>
                        <div className='flex items-center mb-4'>
                          <div className='w-12 h-12 bg-[#2B2D31] border border-[#C9A227]/40 rounded-lg flex items-center justify-center mr-4'>
                            <Icon className='w-6 h-6 text-[#C9A227]' />
                          </div>
                          <h3 className='text-lg font-sentient text-[#F5F5F5] tracking-wide'>
                            {section.title}
                          </h3>
                        </div>
                        <div className='text-[#F5F5F5] text-sm leading-relaxed flex-grow'>
                          {section.content
                            .split('\n')
                            .map((line, lineIndex) => (
                              <div
                                key={lineIndex}
                                className={lineIndex > 0 ? 'mt-1' : ''}>
                                {line}
                              </div>
                            ))}
                        </div>
                        <div className='mt-4 flex items-center text-xs text-[#F5F5F5]/60 font-mono'>
                          <div className='w-2 h-2 bg-[#C9A227] rounded-full mr-2'></div>
                          Rechtlich erforderlich
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Additional Legal Information */}
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16'>
              {/* Haftungsausschluss */}
              <div
                className={`transform transition-all duration-700 ease-out ${
                  visibleAdditionalCards
                    ? 'opacity-100 translate-y-0 scale-100'
                    : 'opacity-0 translate-y-8 scale-95'
                }`}
                style={{ transitionDelay: '0ms' }}>
                <div className='bg-[#2B2D31] backdrop-blur-sm border border-[#C9A227]/30 rounded-xl p-6 shadow-lg shadow-[#C9A227]/10 hover:border-[#D9B43A]/50 hover:shadow-[#C9A227]/20 hover:scale-105 transition-all duration-300'>
                  <h3 className='text-xl font-sentient text-[#C9A227] tracking-wide mb-4 flex items-center'>
                    <Shield className='w-6 h-6 mr-3 text-[#C9A227]' />
                    Haftungsausschluss
                  </h3>
                  <div className='space-y-4 text-[#F5F5F5]/90 text-sm leading-relaxed'>
                    <p>
                      Die Inhalte unserer Seiten wurden mit größter Sorgfalt
                      erstellt. Für die Richtigkeit, Vollständigkeit und
                      Aktualität der Inhalte können wir jedoch keine Gewähr
                      übernehmen.
                    </p>
                    <p>
                      Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für
                      eigene Inhalte auf diesen Seiten nach den allgemeinen
                      Gesetzen verantwortlich.
                    </p>
                  </div>
                </div>
              </div>

              {/* Urheberrecht */}
              <div
                className={`transform transition-all duration-700 ease-out ${
                  visibleAdditionalCards
                    ? 'opacity-100 translate-y-0 scale-100'
                    : 'opacity-0 translate-y-8 scale-95'
                }`}
                style={{ transitionDelay: '200ms' }}>
                <div className='bg-[#2B2D31] backdrop-blur-sm border border-[#C9A227]/30 rounded-xl p-6 shadow-lg shadow-[#C9A227]/10 hover:border-[#D9B43A]/50 hover:shadow-[#C9A227]/20 hover:scale-105 transition-all duration-300'>
                  <h3 className='text-xl font-sentient text-[#C9A227] tracking-wide mb-4 flex items-center'>
                    <FileText className='w-6 h-6 mr-3 text-[#C9A227]' />
                    Urheberrecht
                  </h3>
                  <div className='space-y-4 text-[#F5F5F5]/90 text-sm leading-relaxed'>
                    <p>
                      Die durch die Seitenbetreiber erstellten Inhalte und Werke
                      auf diesen Seiten unterliegen dem deutschen Urheberrecht.
                    </p>
                    <p>
                      Die Vervielfältigung, Bearbeitung, Verbreitung und jede
                      Art der Verwertung außerhalb der Grenzen des
                      Urheberrechtes bedürfen der schriftlichen Zustimmung des
                      jeweiligen Autors.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Hero Section */}
            <div className='text-center mb-16'>
              <div
                className={`transform transition-all duration-800 ease-out ${
                  visibleHeroSection
                    ? 'opacity-100 translate-y-0 scale-100'
                    : 'opacity-0 translate-y-12 scale-95'
                }`}>
                <div className='bg-background/80 backdrop-blur-sm border border-border/50 rounded-2xl p-8 lg:p-12 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300'>
                  <h2 className='text-2xl sm:text-3xl lg:text-4xl font-sentient text-primary tracking-wide mb-6'>
                    Rechtliche Transparenz
                  </h2>
                  <p className='text-lg text-foreground/90 mb-8 max-w-4xl mx-auto leading-relaxed'>
                    Als verantwortungsbewusstes Unternehmen stellen wir alle
                    wichtigen rechtlichen Informationen transparent und
                    übersichtlich zur Verfügung. Vertrauen durch Transparenz –
                    das ist unser Anspruch.
                  </p>
                  <div className='flex items-center justify-center gap-2 text-sm text-foreground/60 font-mono'>
                    <CheckCircle className='w-4 h-4 text-primary' />
                    Vollständig konform mit deutschem Recht
                    <ArrowRight className='w-4 h-4 text-primary' />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Note */}
            <div className='mt-12 text-center'>
              <div
                className={`transform transition-all duration-700 ease-out ${
                  visibleFooterNote
                    ? 'opacity-100 translate-y-0 scale-100'
                    : 'opacity-0 translate-y-8 scale-95'
                }`}>
                <div className='bg-gradient-to-r from-[#C9A227]/10 to-[#C9A227]/5 backdrop-blur-sm border border-[#C9A227]/30 rounded-xl p-6 shadow-lg shadow-[#C9A227]/10 hover:shadow-xl hover:shadow-[#C9A227]/20 hover:scale-[1.02] transition-all duration-300'>
                  <p className='text-[#F5F5F5]/80 text-sm font-mono'>
                    Stand: Oktober 2024 • Alle Angaben ohne Gewähr •
                    <a
                      href='/kontakt'
                      className='text-[#C9A227] hover:text-[#D9B43A] transition-colors ml-1'>
                      Fragen? Kontaktieren Sie uns
                    </a>
                  </p>
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
