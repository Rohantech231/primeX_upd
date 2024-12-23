'use client';

import { EmotionTracker } from '@/components/EmotionTracker';
import { EmotionDashboard } from '@/components/EmotionDashboard';
import { ThemeProvider } from '@/components/ThemeProvider';

export default function Home() {
  return (
    <ThemeProvider>
      <main className="min-h-screen p-8 bg-background">
        <div className="max-w-7xl mx-auto space-y-8">
          <h1 className="text-4xl font-bold text-center text-foreground">
            Emotion Tracker
          </h1>
          <EmotionTracker />
          <EmotionDashboard />
        </div>
      </main>
    </ThemeProvider>
  );
}