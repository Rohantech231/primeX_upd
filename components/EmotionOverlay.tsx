'use client';

import { Smile, Frown, Angry, AlertCircle, Ghost, Skull, CircleDot } from 'lucide-react';
import type { EmotionData } from '@/lib/emotion-detection';

const EMOTION_ICONS = {
  happiness: { icon: Smile, color: 'text-yellow-500', label: 'Happy' },
  sadness: { icon: Frown, color: 'text-blue-500', label: 'Sad' },
  anger: { icon: Angry, color: 'text-red-500', label: 'Angry' },
  surprise: { icon: AlertCircle, color: 'text-purple-500', label: 'Surprised' },
  fear: { icon: Ghost, color: 'text-gray-500', label: 'Fearful' },
  disgust: { icon: Skull, color: 'text-green-500', label: 'Disgusted' },
  neutral: { icon: CircleDot, color: 'text-gray-400', label: 'Neutral' }
} as const;

type EmotionKey = keyof typeof EMOTION_ICONS;

export function EmotionOverlay({ emotions }: { emotions: EmotionData }) {
  // Find the dominant emotion (excluding neutral if others are present)
  const emotionsWithoutNeutral = Object.entries(emotions).filter(
    ([key, value]) => key !== 'timestamp' && key !== 'neutral' && value > 0.1
  ) as [EmotionKey, number][];

  const dominantEmotion = emotionsWithoutNeutral.length > 0
    ? emotionsWithoutNeutral.reduce((max, [key, value]) => 
        value > max[1] ? [key, value] : max
      )
    : ['neutral', emotions.neutral] as [EmotionKey, number];

  const emotionKey = dominantEmotion[0];
  const { icon: Icon, color, label } = EMOTION_ICONS[emotionKey];

  return (
    <div className="absolute top-4 right-4 bg-background/80 p-3 rounded-lg backdrop-blur-sm flex items-center gap-2">
      <Icon className={`w-8 h-8 ${color}`} />
      <div className="flex flex-col">
        <span className="text-sm font-medium">{label}</span>
        <span className="text-xs text-muted-foreground">
          {(dominantEmotion[1] * 100).toFixed(0)}%
        </span>
      </div>
    </div>
  );
}