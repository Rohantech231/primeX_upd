'use client';

import { useState, useEffect } from 'react';

export function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', updatePosition);
    return () => window.removeEventListener('mousemove', updatePosition);
  }, []);

  return (
    <div 
      className="fixed w-8 h-8 pointer-events-none z-50 mix-blend-difference"
      style={{
        left: position.x - 16,
        top: position.y - 16,
        transform: 'translate(0, 0)',
      }}
    >
      <div className="absolute inset-0 border-2 border-primary rounded-full animate-ping" />
      <div className="absolute inset-0 bg-primary/10 rounded-full" />
    </div>
  );
}