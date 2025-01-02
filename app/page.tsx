'use client';

import { useState, useEffect } from 'react';
import { EmotionTracker } from '@/components/EmotionTracker';
import { ThemeProvider } from '@/components/ThemeProvider';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Preloader } from '@/components/Preloader';
import { CustomCursor } from '@/components/CustomCursor';
import { Button } from '@/components/ui/button';
import { Brain } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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
              <div className="flex justify-between items-center">
                <h1 className="text-4xl font-bold text-foreground">
                  Emotion Tracker
                </h1>
                <Link href="/3d">
                  <Button variant="outline" className="gap-2">
                    <Brain className="w-4 h-4" />
                    3D Visualization
                  </Button>
                </Link>
              </div>
              <EmotionTracker />
            </div>
          </main>
        </>
      )}
    </ThemeProvider>
  );
}