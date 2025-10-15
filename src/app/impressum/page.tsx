'use client';

import { DynamicBackground, ErrorBoundary } from '@/components/effects';
import { Leva } from 'leva';

/**
 * Impressum (Legal Notice) Page
 *
 * This page displays the comprehensive legal notice for HonorarX.
 * Features:
 * - Professional legal document layout
 * - Responsive design for all devices
 * - Proper typography hierarchy
 * - Dynamic background integration
 * - Accessible content structure
 * - Functional contact links
 */
export default function ImpressumPage() {
  return (
    <div className='relative min-h-screen'>
      {/* Dynamic particle background with error boundary */}
      <ErrorBoundary>
        <DynamicBackground
          showControls={process.env.NODE_ENV === 'development'}
          speed={0.5}
          opacity={0.3}
          pointSize={4.0}
        />
      </ErrorBoundary>

      {/* Main content container */}
      <div className='relative z-10 min-h-screen'>
        {/* Header section */}
        <div className='pt-48 sm:pt-52 lg:pt-56 pb-8 sm:pb-12 px-4 sm:px-6 lg:px-8'>
          <div className='max-w-6xl mx-auto'>
            <div className='text-center mb-8 sm:mb-12'>
              <h1 className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-sentient text-white mb-3 sm:mb-4'>
                <span className='tracking-wider'>Impressum</span>
              </h1>
              <div className='w-16 sm:w-24 h-px bg-primary mx-auto mb-4 sm:mb-6'></div>
              <p className='text-base sm:text-lg text-foreground/80 font-mono'>
                Angaben gemäß § 5 TMG (Telemediengesetz)
              </p>
            </div>
          </div>
        </div>

        {/* Content section */}
        <div className='px-3 sm:px-4 md:px-6 lg:px-8 pb-12 sm:pb-16'>
          <div className='max-w-6xl mx-auto'>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8'>
              {/* Section 1: Betreiber der Website */}
              <div className='bg-background/80 backdrop-blur-sm border border-border/50 rounded-xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-primary/30 flex flex-col h-full'>
                <div className='flex items-start mb-4'>
                  <div className='w-8 h-8 bg-primary/20 border border-primary/30 rounded-lg flex items-center justify-center mr-3 flex-shrink-0'>
                    <span className='text-primary font-bold text-sm'>1</span>
                  </div>
                  <h2 className='text-lg sm:text-xl font-sentient text-primary tracking-wide leading-tight'>
                    Betreiber der Website
                  </h2>
                </div>
                <div className='space-y-3 text-sm sm:text-base text-foreground/90 leading-relaxed flex-grow'>
                  <p className='font-semibold text-foreground'>
                    Abdul Rhman Alahmad
                  </p>
                  <div className='space-y-1'>
                    <p>Luisenstraße 9B</p>
                    <p>79410 Badenweiler</p>
                    <p>Deutschland</p>
                  </div>
                </div>
              </div>

              {/* Section 2: Kontakt */}
              <div className='bg-background/80 backdrop-blur-sm border border-border/50 rounded-xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-primary/30 flex flex-col h-full'>
                <div className='flex items-start mb-4'>
                  <div className='w-8 h-8 bg-primary/20 border border-primary/30 rounded-lg flex items-center justify-center mr-3 flex-shrink-0'>
                    <span className='text-primary font-bold text-sm'>2</span>
                  </div>
                  <h2 className='text-lg sm:text-xl font-sentient text-primary tracking-wide leading-tight'>
                    Kontakt
                  </h2>
                </div>
                <div className='space-y-3 text-sm sm:text-base text-foreground/90 leading-relaxed flex-grow'>
                  <div className='space-y-2'>
                    <div className='flex items-center gap-2'>
                      <span>📧</span>
                      <a
                        href='mailto:info@honorarx.de'
                        className='text-primary hover:text-primary/80 transition-colors duration-200'>
                        info@honorarx.de
                      </a>
                    </div>
                    <div className='flex items-center gap-2'>
                      <span>🌐</span>
                      <a
                        href='https://honorarx.de'
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-primary hover:text-primary/80 transition-colors duration-200'>
                        https://honorarx.de
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 3: Verantwortlich für den Inhalt */}
              <div className='bg-background/80 backdrop-blur-sm border border-border/50 rounded-xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-primary/30 flex flex-col h-full'>
                <div className='flex items-start mb-4'>
                  <div className='w-8 h-8 bg-primary/20 border border-primary/30 rounded-lg flex items-center justify-center mr-3 flex-shrink-0'>
                    <span className='text-primary font-bold text-sm'>3</span>
                  </div>
                  <h2 className='text-lg sm:text-xl font-sentient text-primary tracking-wide leading-tight'>
                    Verantwortlich für den Inhalt
                  </h2>
                </div>
                <div className='space-y-3 text-sm sm:text-base text-foreground/90 leading-relaxed flex-grow'>
                  <p className='text-xs text-foreground/70 mb-2'>
                    nach § 55 Abs. 2 RStV
                  </p>
                  <p className='font-semibold text-foreground'>
                    Abdul Rhman Alahmad
                  </p>
                  <div className='space-y-1'>
                    <p>Luisenstraße 9B</p>
                    <p>79410 Badenweiler</p>
                    <p>Deutschland</p>
                  </div>
                </div>
              </div>

              {/* Section 4: Haftungsausschluss - Inhalt der Website */}
              <div className='bg-background/80 backdrop-blur-sm border border-border/50 rounded-xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-primary/30 flex flex-col h-full'>
                <div className='flex items-start mb-4'>
                  <div className='w-8 h-8 bg-primary/20 border border-primary/30 rounded-lg flex items-center justify-center mr-3 flex-shrink-0'>
                    <span className='text-primary font-bold text-sm'>4</span>
                  </div>
                  <h2 className='text-lg sm:text-xl font-sentient text-primary tracking-wide leading-tight'>
                    Haftungsausschluss
                  </h2>
                </div>
                <div className='space-y-3 text-sm sm:text-base text-foreground/90 leading-relaxed flex-grow'>
                  <p className='font-semibold text-foreground mb-2'>
                    Inhalt der Website
                  </p>
                  <p>
                    Die Inhalte dieser Website wurden mit größter Sorgfalt
                    erstellt. Für die Richtigkeit, Vollständigkeit und
                    Aktualität der Inhalte kann jedoch keine Gewähr übernommen
                    werden.
                  </p>
                  <p>
                    Als Diensteanbieter bin ich gemäß § 7 Abs. 1 TMG für eigene
                    Inhalte auf diesen Seiten nach den allgemeinen Gesetzen
                    verantwortlich.
                  </p>
                </div>
              </div>

              {/* Section 5: Haftung für Links */}
              <div className='bg-background/80 backdrop-blur-sm border border-border/50 rounded-xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-primary/30 flex flex-col h-full'>
                <div className='flex items-start mb-4'>
                  <div className='w-8 h-8 bg-primary/20 border border-primary/30 rounded-lg flex items-center justify-center mr-3 flex-shrink-0'>
                    <span className='text-primary font-bold text-sm'>5</span>
                  </div>
                  <h2 className='text-lg sm:text-xl font-sentient text-primary tracking-wide leading-tight'>
                    Haftung für Links
                  </h2>
                </div>
                <div className='space-y-3 text-sm sm:text-base text-foreground/90 leading-relaxed flex-grow'>
                  <p>
                    Meine Website enthält Links zu externen Websites Dritter,
                    auf deren Inhalte ich keinen Einfluss habe. Deshalb kann ich
                    für diese fremden Inhalte auch keine Gewähr übernehmen.
                  </p>
                  <p>
                    Für die Inhalte der verlinkten Seiten ist stets der
                    jeweilige Anbieter oder Betreiber der Seiten verantwortlich.
                  </p>
                </div>
              </div>

              {/* Section 6: Urheberrecht */}
              <div className='bg-background/80 backdrop-blur-sm border border-border/50 rounded-xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-primary/30 flex flex-col h-full'>
                <div className='flex items-start mb-4'>
                  <div className='w-8 h-8 bg-primary/20 border border-primary/30 rounded-lg flex items-center justify-center mr-3 flex-shrink-0'>
                    <span className='text-primary font-bold text-sm'>6</span>
                  </div>
                  <h2 className='text-lg sm:text-xl font-sentient text-primary tracking-wide leading-tight'>
                    Urheberrecht
                  </h2>
                </div>
                <div className='space-y-3 text-sm sm:text-base text-foreground/90 leading-relaxed flex-grow'>
                  <p>
                    Die durch den Betreiber erstellten Inhalte und Werke auf
                    diesen Seiten unterliegen dem deutschen Urheberrecht.
                  </p>
                  <p>
                    Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art
                    der Verwertung außerhalb der Grenzen des Urheberrechts
                    bedürfen der schriftlichen Zustimmung des jeweiligen Autors
                    bzw. Erstellers.
                  </p>
                  <p>
                    Downloads und Kopien dieser Seite sind nur für den privaten,
                    nicht kommerziellen Gebrauch gestattet.
                  </p>
                </div>
              </div>

              {/* Section 7: Online-Streitbeilegung */}
              <div className='col-span-full bg-background/80 backdrop-blur-sm border border-border/50 rounded-xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-primary/30'>
                <div className='flex items-center justify-center mb-4'>
                  <div className='w-8 h-8 bg-primary/20 border border-primary/30 rounded-lg flex items-center justify-center mr-3 flex-shrink-0'>
                    <span className='text-primary font-bold text-sm'>7</span>
                  </div>
                  <h2 className='text-lg sm:text-xl font-sentient text-primary tracking-wide leading-tight'>
                    Online-Streitbeilegung (OS-Plattform)
                  </h2>
                </div>
                <div className='space-y-3 text-sm sm:text-base text-foreground/90 leading-relaxed text-center'>
                  <p>
                    Die Europäische Kommission stellt eine Plattform zur
                    Online-Streitbeilegung (OS) bereit:
                  </p>
                  <div className='flex items-center justify-center gap-2'>
                    <span>👉</span>
                    <a
                      href='https://ec.europa.eu/consumers/odr'
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-primary hover:text-primary/80 transition-colors duration-200 break-all'>
                      https://ec.europa.eu/consumers/odr
                    </a>
                  </div>
                  <p>
                    Ich bin weder verpflichtet noch bereit, an einem
                    Streitbeilegungsverfahren vor einer
                    Verbraucherschlichtungsstelle teilzunehmen.
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className='col-span-full bg-background/60 backdrop-blur-sm border border-border/30 rounded-xl p-4 sm:p-6 shadow-md'>
                <p className='text-foreground/60 text-xs sm:text-sm font-mono text-center'>
                  (Stand: Oktober 2025)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Leva controls (hidden in production) */}
      <Leva hidden />
    </div>
  );
}
