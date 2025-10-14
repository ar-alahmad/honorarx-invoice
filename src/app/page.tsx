'use client';

import { useState } from 'react';
import { DynamicBackground } from '@/components/background';
import { ErrorBoundary } from '@/components/background/ErrorBoundary';
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
          <h1
            className='text-6xl md:text-8xl font-bold text-white mb-8 cursor-pointer transition-all duration-300 hover:scale-105'
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}>
            HonorarX
          </h1>
          <p className='text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto'>
            Professional invoice management with stunning visual experiences
          </p>
          <button
            className='px-8 py-4 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-colors duration-200'
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}>
            Get Started
          </button>
        </div>
      </div>

      {/* Leva controls (hidden in production) */}
      <Leva hidden />
    </div>
  );
}
