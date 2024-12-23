'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { exportToJSON, exportToPDF } from '@/lib/export';
import type { EmotionDataPoint } from '@/lib/export';
import { Recommendations } from './Recommendations';

export function EmotionDashboard() {
  const [emotionHistory, setEmotionHistory] = useState<EmotionDataPoint[]>([]);
  const [currentEmotion, setCurrentEmotion] = useState<EmotionDataPoint | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (currentEmotion) {
        setEmotionHistory(prev => [...prev, currentEmotion].slice(-20));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [currentEmotion]);

  const formattedData = emotionHistory.map(point => ({
    time: new Date(point.timestamp).toLocaleTimeString(),
    happiness: point.happiness,
    sadness: point.sadness,
    anger: point.anger,
  }));

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Emotion Analysis</h2>
          <div className="space-x-2">
            <Button
              variant="outline"
              onClick={() => exportToJSON(emotionHistory)}
            >
              <Download className="w-4 h-4 mr-2" />
              Export JSON
            </Button>
            <Button
              variant="outline"
              onClick={() => exportToPDF(emotionHistory)}
            >
              <Download className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
          </div>
        </div>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={formattedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="happiness" 
                stroke="hsl(var(--chart-1))" 
                strokeWidth={2} 
              />
              <Line 
                type="monotone" 
                dataKey="sadness" 
                stroke="hsl(var(--chart-2))" 
                strokeWidth={2} 
              />
              <Line 
                type="monotone" 
                dataKey="anger" 
                stroke="hsl(var(--chart-3))" 
                strokeWidth={2} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
      {currentEmotion && <Recommendations emotions={currentEmotion} />}
    </div>
  );
}