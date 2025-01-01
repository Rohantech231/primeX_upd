'use client';

import { useState, useEffect } from 'react';
import { EmotionTracker } from '@/components/EmotionTracker';
import { ThemeProvider } from '@/components/ThemeProvider';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Preloader } from '@/components/Preloader';
import { CustomCursor } from '@/components/CustomCursor';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <ThemeProvider>
      {isLoading ? (
        <Preloader />
      ) : (
        <>
          <CustomCursor />
          <ThemeToggle />
          <main className="min-h-screen p-8 bg-background">
            <div className="max-w-7xl mx-auto space-y-8">
              <h1 className="text-4xl font-bold text-center text-foreground">
                Emotion Tracker
              </h1>
              <EmotionTracker />
            </div>
          </main>
        </>
      )}
    </ThemeProvider>
  );
}