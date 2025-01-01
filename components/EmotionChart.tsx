'use client';

import { Card } from '@/components/ui/card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { useState, useEffect } from 'react';
import type { EmotionData } from '@/lib/emotion-detection';

interface EmotionChartProps {
  currentEmotions: EmotionData | null;
}

export function EmotionChart({ currentEmotions }: EmotionChartProps) {
  const [emotionHistory, setEmotionHistory] = useState<Array<EmotionData & { time: string }>>([]);

  useEffect(() => {
    if (currentEmotions) {
      setEmotionHistory(prev => {
        const newHistory = [...prev, {
          ...currentEmotions,
          time: new Date().toLocaleTimeString()
        }].slice(-20); // Keep last 20 readings
        return newHistory;
      });
    }
  }, [currentEmotions]);

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Emotion Analysis</h2>
      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={emotionHistory}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="time"
              tick={{ fontSize: 12 }}
              interval="preserveStartEnd"
            />
            <YAxis 
              domain={[0, 1]}
              tick={{ fontSize: 12 }}
              label={{ value: 'Emotion Level', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="happiness"
              stroke="hsl(var(--chart-1))"
              strokeWidth={2}
              dot={false}
              name="Happiness"
            />
            <Line
              type="monotone"
              dataKey="sadness"
              stroke="hsl(var(--chart-2))"
              strokeWidth={2}
              dot={false}
              name="Sadness"
            />
            <Line
              type="monotone"
              dataKey="anger"
              stroke="hsl(var(--chart-3))"
              strokeWidth={2}
              dot={false}
              name="Anger"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}