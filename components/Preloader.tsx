'use client';

import { Brain } from 'lucide-react';

export function Preloader() {
  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center z-50">
      <div className="text-center">
        <Brain className="w-16 h-16 animate-bounce text-primary mb-4" />
        <p className="text-lg font-medium animate-pulse">Loading Emotion Tracker...</p>
      </div>
    </div>
  );
}