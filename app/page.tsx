'use client';

import { useState, useEffect } from 'react';
import { EmotionTracker } from '@/components/EmotionTracker';
import { ThemeProvider } from '@/components/ThemeProvider';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Preloader } from '@/components/Preloader';
import { Button } from '@/components/ui/button';
import { Brain, Activity } from 'lucide-react';
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
        <div className="min-h-screen bg-background">
          {/* Header */}
          <header className="border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Activity className="w-6 h-6 text-primary" />
                  <h1 className="text-2xl font-bold text-foreground">PrimeX</h1>
                </div>
                <div className="flex items-center space-x-4">
                  <Link href="/3d">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Brain className="w-4 h-4" />
                      3D View
                    </Button>
                  </Link>
                  <ThemeToggle />
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid gap-8">
              {/* Section Title */}
              <div className="border-b pb-4">
                <h2 className="text-3xl font-semibold text-foreground">
                  Emotion & Wellness Tracking
                </h2>
                <p className="text-muted-foreground mt-2">
                  Monitor your emotional state and wellness metrics in real-time
                </p>
              </div>

              {/* Emotion Tracker Component */}
              <div className="bg-card rounded-lg shadow-sm">
                <EmotionTracker />
              </div>
            </div>
          </main>
        </div>
      )}
    </ThemeProvider>
  );
}