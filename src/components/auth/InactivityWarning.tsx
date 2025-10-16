'use client';

import { useEffect, useState } from 'react';
import { AlertCircle, X } from 'lucide-react';

interface InactivityWarningProps {
  secondsRemaining: number;
  onStayLoggedIn: () => void;
  onLogout: () => void;
}

export function InactivityWarning({
  secondsRemaining,
  onStayLoggedIn,
  onLogout,
}: InactivityWarningProps) {
  const [countdown, setCountdown] = useState(secondsRemaining);

  useEffect(() => {
    setCountdown(secondsRemaining);
  }, [secondsRemaining]);

  useEffect(() => {
    if (countdown <= 0) {
      onLogout();
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown, onLogout]);

  return (
    <div className='fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200'>
      <div className='relative w-full max-w-md mx-4 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl border border-yellow-500/30 overflow-hidden animate-in zoom-in-95 duration-300'>
        {/* Glowing border effect */}
        <div className='absolute inset-0 bg-gradient-to-r from-yellow-500/20 via-orange-500/20 to-yellow-500/20 blur-xl' />
        
        {/* Content */}
        <div className='relative p-6 space-y-6'>
          {/* Header */}
          <div className='flex items-start gap-4'>
            <div className='flex-shrink-0 w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center'>
              <AlertCircle className='w-6 h-6 text-yellow-500 animate-pulse' />
            </div>
            <div className='flex-1'>
              <h3 className='text-xl font-bold text-white mb-1'>
                Inaktivitätswarnung
              </h3>
              <p className='text-sm text-gray-300'>
                Sie waren längere Zeit inaktiv
              </p>
            </div>
            <button
              onClick={onStayLoggedIn}
              className='flex-shrink-0 text-gray-400 hover:text-white transition-colors'
              aria-label='Schließen'>
              <X className='w-5 h-5' />
            </button>
          </div>

          {/* Countdown Circle */}
          <div className='flex flex-col items-center justify-center py-4'>
            <div className='relative w-32 h-32'>
              {/* Background circle */}
              <svg className='w-32 h-32 transform -rotate-90'>
                <circle
                  cx='64'
                  cy='64'
                  r='56'
                  stroke='currentColor'
                  strokeWidth='8'
                  fill='none'
                  className='text-gray-700'
                />
                {/* Progress circle */}
                <circle
                  cx='64'
                  cy='64'
                  r='56'
                  stroke='currentColor'
                  strokeWidth='8'
                  fill='none'
                  strokeDasharray={`${2 * Math.PI * 56}`}
                  strokeDashoffset={`${
                    2 * Math.PI * 56 * (1 - countdown / secondsRemaining)
                  }`}
                  className={`transition-all duration-1000 ${
                    countdown <= 10
                      ? 'text-red-500'
                      : countdown <= 20
                      ? 'text-orange-500'
                      : 'text-yellow-500'
                  }`}
                  strokeLinecap='round'
                />
              </svg>
              {/* Countdown number */}
              <div className='absolute inset-0 flex flex-col items-center justify-center'>
                <span
                  className={`text-5xl font-bold transition-colors ${
                    countdown <= 10
                      ? 'text-red-500'
                      : countdown <= 20
                      ? 'text-orange-500'
                      : 'text-yellow-500'
                  }`}>
                  {countdown}
                </span>
                <span className='text-xs text-gray-400 mt-1'>Sekunden</span>
              </div>
            </div>
          </div>

          {/* Message */}
          <div className='text-center space-y-2'>
            <p className='text-sm text-gray-300'>
              Sie werden in <span className='font-bold text-white'>{countdown} Sekunden</span> automatisch abgemeldet.
            </p>
            <p className='text-xs text-gray-400'>
              Bewegen Sie die Maus oder drücken Sie eine Taste, um Ihre Sitzung fortzusetzen.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
