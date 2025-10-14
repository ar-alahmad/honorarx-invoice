'use client';

import { useState } from 'react';
import { DynamicBackground } from '@/components/background';
import { ErrorBoundary } from '@/components/background/ErrorBoundary';
import { Button, Pill } from '@/components/ui';
import { Leva } from 'leva';

export default function Home() {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <div className='flex flex-col h-svh justify-between'>
      {/* Dynamic particle background with error boundary */}
      <ErrorBoundary>
        <DynamicBackground
          hovering={isHovering}
          showControls={process.env.NODE_ENV === 'development'}
          speed={1.0}
          opacity={0.8}
          pointSize={8.0}
        />
      </ErrorBoundary>

      {/* Main content - positioned at bottom like archive */}
      <div className='pb-16 mt-auto text-center relative'>
        <Pill className='mb-6'>BETA RELEASE</Pill>
        <h1
          className='text-5xl sm:text-6xl md:text-7xl font-sentient text-white mb-8 cursor-pointer transition-all duration-300 hover:scale-105'
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}>
          <span className='tracking-wider'>HonorarX</span> <br />
          <i className='font-light'>Rechnung</i>
        </h1>
        <p className='font-mono text-sm sm:text-base text-foreground/60 text-balance mt-8 max-w-[440px] mx-auto'>
          Professionelle schnelle sichere <br />
          Rechnungsverwaltung mit beeindruckenden visuellen Erlebnissen
        </p>

        <div className='flex flex-col sm:flex-row gap-4 items-center justify-center mt-14'>
          <Button
            className='max-sm:hidden'
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}>
            [Anmelden]
          </Button>
          <Button
            size='sm'
            className='sm:hidden'
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}>
            [Anmelden]
          </Button>
        </div>
      </div>

      {/* Leva controls (hidden in production) */}
      <Leva hidden />
    </div>
  );
}
