'use client';

import { Smile, Frown, Angry } from 'lucide-react';
import type { EmotionData } from '@/lib/emotion-detection';

export function EmotionOverlay({ emotions }: { emotions: EmotionData }) {
  const { happiness, sadness, anger } = emotions;
  const maxEmotion = Math.max(happiness, sadness, anger);

  return (
    <div className="absolute top-4 right-4 bg-background/80 p-2 rounded-lg backdrop-blur-sm">
      {maxEmotion === happiness && (
        <Smile className="w-8 h-8 text-yellow-500" />
      )}
      {maxEmotion === sadness && (
        <Frown className="w-8 h-8 text-blue-500" />
      )}
      {maxEmotion === anger && (
        <Angry className="w-8 h-8 text-red-500" />
      )}
    </div>
  );
}