'use client';

import { useState } from 'react';
import { InactivityWarning } from '@/components/auth/InactivityWarning';
import { Button } from '@/components/ui/button';
import { DynamicBackground } from '@/components/effects/background';

export default function InactivityWarningDemoPage() {
  const [showWarning, setShowWarning] = useState(false);
  const [countdown, setCountdown] = useState(30);

  const handleShow = () => {
    setShowWarning(true);
    setCountdown(30);
  };

  const handleStayLoggedIn = () => {
    setShowWarning(false);
    alert('Timer reset! User stayed logged in.');
  };

  const handleLogout = () => {
    setShowWarning(false);
    alert('User logged out!');
  };

  return (
    <div className='relative min-h-screen'>
      <DynamicBackground />
      
      <div className='relative z-10 min-h-screen flex flex-col items-center justify-center p-8'>
        <div className='max-w-2xl w-full bg-gray-900/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-700'>
          <h1 className='text-3xl font-bold text-white mb-4'>
            Inactivity Warning Demo
          </h1>
          
          <p className='text-gray-300 mb-6'>
            This page allows you to preview and customize the inactivity warning design.
            Click the button below to see the warning popup.
          </p>

          <div className='space-y-4 mb-8'>
            <div className='bg-gray-800 rounded-lg p-4'>
              <h3 className='text-white font-semibold mb-2'>Production Settings:</h3>
              <ul className='text-sm text-gray-300 space-y-1'>
                <li>⏰ <strong>Warning appears:</strong> After 9.5 minutes of inactivity</li>
                <li>⚠️ <strong>Countdown:</strong> 30 seconds</li>
                <li>🚪 <strong>Total time:</strong> 10 minutes until logout</li>
                <li>🎨 <strong>Colors:</strong> Yellow → Orange → Red</li>
              </ul>
            </div>

            <div className='bg-gray-800 rounded-lg p-4'>
              <h3 className='text-white font-semibold mb-2'>How It Works:</h3>
              <ul className='text-sm text-gray-300 space-y-1'>
                <li>✅ Any mouse movement resets the timer</li>
                <li>✅ Any keyboard input resets the timer</li>
                <li>✅ Scrolling resets the timer</li>
                <li>✅ Touch events reset the timer</li>
                <li>❌ Warning disappears when you interact</li>
              </ul>
            </div>

            <div className='bg-gray-800 rounded-lg p-4'>
              <h3 className='text-white font-semibold mb-2'>Countdown Slider:</h3>
              <div className='flex items-center gap-4'>
                <input
                  type='range'
                  min='5'
                  max='60'
                  value={countdown}
                  onChange={(e) => setCountdown(Number(e.target.value))}
                  className='flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer'
                />
                <span className='text-white font-bold w-16 text-right'>
                  {countdown}s
                </span>
              </div>
            </div>
          </div>

          <Button
            onClick={handleShow}
            className='w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold py-4 text-lg rounded-lg transition-all duration-200 shadow-lg hover:shadow-yellow-500/50'>
            Show Warning Popup
          </Button>

          <div className='mt-8 p-4 bg-blue-900/30 border border-blue-500/30 rounded-lg'>
            <h3 className='text-blue-300 font-semibold mb-2 flex items-center gap-2'>
              <span>💡</span> Customization Tips:
            </h3>
            <ul className='text-sm text-blue-200 space-y-1'>
              <li>• Edit <code className='bg-blue-900/50 px-1 rounded'>InactivityWarning.tsx</code> to change colors</li>
              <li>• Adjust countdown duration with the slider above</li>
              <li>• Modify animations in the component file</li>
              <li>• Change text messages to match your brand</li>
            </ul>
          </div>

          <div className='mt-4 text-center'>
            <a
              href='/dashboard'
              className='text-gray-400 hover:text-white transition-colors text-sm'>
              ← Back to Dashboard
            </a>
          </div>
        </div>
      </div>

      {showWarning && (
        <InactivityWarning
          secondsRemaining={countdown}
          onStayLoggedIn={handleStayLoggedIn}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
}
