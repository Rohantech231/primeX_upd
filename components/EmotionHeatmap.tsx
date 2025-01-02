'use client';

import { Card } from '@/components/ui/card';
import { useState } from 'react';
import type { EmotionData } from '@/lib/emotion-detection';

type HeatmapData = {
  day: number;
  hour: number;
  value: number;
};

interface EmotionHeatmapProps {
  emotionHistory: EmotionData[];
}

export function EmotionHeatmap({ emotionHistory }: EmotionHeatmapProps) {
  const [selectedEmotion, setSelectedEmotion] = useState<'happiness' | 'sadness' | 'anger'>('happiness');

  const processData = (): HeatmapData[] => {
    const heatmapData: HeatmapData[] = [];
    
    emotionHistory.forEach(emotion => {
      const date = new Date(emotion.timestamp);
      const day = date.getDay();
      const hour = date.getHours();
      
      heatmapData.push({
        day,
        hour,
        value: emotion[selectedEmotion]
      });
    });

    return heatmapData;
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Weekly Emotion Heatmap</h2>
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setSelectedEmotion('happiness')}
          className={`px-3 py-1 rounded ${
            selectedEmotion === 'happiness' ? 'bg-green-500 text-white' : 'bg-gray-200'
          }`}
        >
          Happiness
        </button>
        <button
          onClick={() => setSelectedEmotion('sadness')}
          className={`px-3 py-1 rounded ${
            selectedEmotion === 'sadness' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          Sadness
        </button>
        <button
          onClick={() => setSelectedEmotion('anger')}
          className={`px-3 py-1 rounded ${
            selectedEmotion === 'anger' ? 'bg-red-500 text-white' : 'bg-gray-200'
          }`}
        >
          Anger
        </button>
      </div>
      <div className="grid grid-cols-24 gap-1">
        {processData().map((data, index) => (
          <div
            key={index}
            className="w-4 h-4 rounded"
            style={{
              backgroundColor: `rgba(var(--${selectedEmotion}-rgb), ${data.value})`,
              gridColumn: data.hour + 1,
              gridRow: data.day + 1
            }}
            title={`${data.value.toFixed(2)} at ${data.hour}:00`}
          />
        ))}
      </div>
    </Card>
  );
}