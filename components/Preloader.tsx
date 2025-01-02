'use client';

import { useEffect, useState } from 'react';

export function Preloader() {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 flex items-center justify-center z-50">
      <div className="relative">
        {/* Animated brain wireframe */}
        <div className="w-32 h-32 rounded-full border-4 border-white animate-[spin_3s_linear_infinite] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        <div className="w-32 h-32 rounded-full border-4 border-white animate-[spin_3s_linear_infinite_reverse] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-45" />
        
        {/* Pulsing circles */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="w-40 h-40 rounded-full bg-white/20 animate-ping" />
          <div className="w-40 h-40 rounded-full bg-white/10 animate-pulse" />
        </div>

        {/* Loading text */}
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-8">
          <p className="text-white text-xl font-bold tracking-wider">
            Initializing{dots}
          </p>
          <p className="text-white/80 text-sm mt-2 text-center">
            Preparing Neural Networks
          </p>
        </div>
      </div>
    </div>
  );
}