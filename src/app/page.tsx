'use client';

import { useState } from 'react';
import { DynamicBackground } from '@/components/background';
import { ErrorBoundary } from '@/components/background/ErrorBoundary';
import { Button, Pill } from '@/components/ui';
import { Leva } from 'leva';

export default function Home() {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <div className='relative min-h-screen'>
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

      {/* Main content */}
      <div className='relative z-10 flex flex-col items-center justify-center min-h-screen px-4'>
        <div className='text-center'>
          <Pill className='mb-6'>BETA RELEASE</Pill>
          <h1
            className='text-5xl sm:text-6xl md:text-7xl font-sentient font-bold text-white mb-8 cursor-pointer transition-all duration-300 hover:scale-105'
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}>
            HonorarX
          </h1>
          <p className='font-mono text-sm sm:text-base text-foreground/60 text-balance mt-8 max-w-[440px] mx-auto mb-12'>
            Professional invoice management with stunning visual experiences
          </p>

          <div className='flex flex-col sm:flex-row gap-4 items-center justify-center'>
            <Button
              className='max-sm:hidden'
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}>
              [Get Started]
            </Button>
            <Button
              size='sm'
              className='sm:hidden'
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}>
              [Get Started]
            </Button>
          </div>
        </div>
      </div>

      {/* Leva controls (hidden in production) */}
      <Leva hidden />
    </div>
  );
}
