'use client';

import { useState, useEffect } from 'react';
import { Brain } from 'lucide-react';

export function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    window.addEventListener('mousemove', updatePosition);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    document.body.style.cursor = 'none';

    return () => {
      window.removeEventListener('mousemove', updatePosition);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'auto';
    };
  }, []);

  return (
    <>
      {/* Main cursor */}
      <div 
        className="fixed pointer-events-none z-50 transition-transform duration-100 mix-blend-difference"
        style={{
          left: position.x,
          top: position.y,
          transform: `translate(-50%, -50%) scale(${isClicking ? 0.8 : 1})`,
        }}
      >
        <div className="relative">
          {/* Outer ring */}
          <div className="absolute -inset-4 border-2 border-white rounded-full animate-[spin_4s_linear_infinite]" />
          
          {/* Inner dot */}
          <div className="w-2 h-2 bg-white rounded-full" />
          
          {/* Trailing particles */}
          <div className="absolute -inset-8 flex items-center justify-center">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full animate-ping"
                style={{
                  transform: `rotate(${i * 60}deg) translateY(-12px)`,
                  animationDelay: `${i * 0.2}s`,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Secondary cursor for hover effects */}
      <div
        className="fixed pointer-events-none z-40 transition-all duration-300 ease-out"
        style={{
          left: position.x,
          top: position.y,
          transform: `translate(-50%, -50%) scale(${isClicking ? 1.2 : 1})`,
        }}
      >
        <Brain 
          className="w-8 h-8 text-primary/20 animate-pulse" 
          style={{ transform: 'rotate(-15deg)' }}
        />
      </div>
    </>
  );
}