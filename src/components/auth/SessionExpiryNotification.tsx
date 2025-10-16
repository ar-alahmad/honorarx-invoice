'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { AlertCircle, Clock } from 'lucide-react';

interface SessionExpiryNotificationProps {
  onExtendSession?: () => void;
  onLogout?: () => void;
}

/**
 * Session expiry notification component
 * Warns users when their session is about to expire
 */
export function SessionExpiryNotification({
  onExtendSession,
  onLogout,
}: SessionExpiryNotificationProps) {
  const { data: session, update } = useSession();
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    if (!session?.user) return;

    // Calculate session expiry time
    const sessionExpiry = new Date(
      session.expires || Date.now() + 2 * 60 * 60 * 1000
    );
    const now = new Date();
    const timeLeft = sessionExpiry.getTime() - now.getTime();

    if (timeLeft <= 0) {
      setShowWarning(true);
      setTimeRemaining(0);
      return;
    }

    // Show warning when 5 minutes or less remain
    if (timeLeft <= 5 * 60 * 1000) {
      setShowWarning(true);
      setTimeRemaining(timeLeft);
    }

    // Update countdown every minute
    const interval = setInterval(() => {
      const newTimeLeft = sessionExpiry.getTime() - Date.now();

      if (newTimeLeft <= 0) {
        setTimeRemaining(0);
        setShowWarning(true);
        clearInterval(interval);
      } else if (newTimeLeft <= 5 * 60 * 1000) {
        setTimeRemaining(newTimeLeft);
        setShowWarning(true);
      } else {
        setShowWarning(false);
      }
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [session]);

  const formatTime = (ms: number): string => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleExtendSession = async () => {
    try {
      await update(); // Refresh the session
      setShowWarning(false);
      onExtendSession?.();
    } catch (error) {
      console.error('Failed to extend session:', error);
    }
  };

  const handleLogout = () => {
    onLogout?.();
  };

  if (!showWarning || !session?.user) {
    return null;
  }

  return (
    <div className='fixed top-4 right-4 z-50 max-w-sm'>
      <div className='bg-yellow-500/90 backdrop-blur-sm rounded-lg p-4 shadow-lg border border-yellow-400/50'>
        <div className='flex items-start gap-3'>
          <div className='flex-shrink-0'>
            {timeRemaining <= 0 ? (
              <AlertCircle className='h-5 w-5 text-red-400' />
            ) : (
              <Clock className='h-5 w-5 text-yellow-400' />
            )}
          </div>

          <div className='flex-1 min-w-0'>
            <h3 className='text-sm font-medium text-white'>
              {timeRemaining <= 0 ? 'Session Expired' : 'Session Expiring Soon'}
            </h3>

            <p className='text-xs text-white/80 mt-1'>
              {timeRemaining <= 0
                ? 'Your session has expired. Please log in again.'
                : `Your session will expire in ${formatTime(timeRemaining)}`}
            </p>

            <div className='flex gap-2 mt-3'>
              {timeRemaining > 0 && (
                <Button
                  onClick={handleExtendSession}
                  size='sm'
                  className='bg-yellow-600 hover:bg-yellow-700 text-white text-xs px-3 py-1'>
                  Extend Session
                </Button>
              )}

              <Button
                onClick={handleLogout}
                variant='outline'
                size='sm'
                className='border-white/20 text-white hover:bg-white/10 text-xs px-3 py-1'>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
