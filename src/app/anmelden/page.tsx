'use client';

import { DynamicBackground, ErrorBoundary } from '@/components/effects';
import { Leva } from 'leva';

export default function AnmeldenPage() {
  return (
    <div className='relative min-h-screen'>
      <ErrorBoundary>
        <DynamicBackground />
      </ErrorBoundary>

      <div className='relative z-10 min-h-screen flex items-center justify-center'>
        <h1 className='text-4xl font-bold'>Anmelden - HonorarX Rechnung</h1>
      </div>

      <Leva hidden />
    </div>
  );
}
