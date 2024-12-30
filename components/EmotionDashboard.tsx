'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { exportToJSON, exportToPDF } from '@/lib/export';
import type { EmotionData } from '@/lib/emotion-detection';

interface EmotionDashboardProps {
  currentEmotions: EmotionData | null;
}

export function EmotionDashboard({ currentEmotions }: EmotionDashboardProps) {
  const [emotionHistory, setEmotionHistory] = useState<EmotionData[]>([]);

  useEffect(() => {
    if (currentEmotions) {
      setEmotionHistory(prev => [...prev, currentEmotions].slice(-30));
    }
  }, [currentEmotions]);

  const formattedData = emotionHistory.map(point => ({
    time: new Date(point.timestamp).toLocaleTimeString(),
    happiness: (point.happiness * 100).toFixed(1),
    sadness: (point.sadness * 100).toFixed(1),
    anger: (point.anger * 100).toFixed(1),
  }));

  return (
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
            <XAxis 
              dataKey="time"
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              domain={[0, 100]}
              tick={{ fontSize: 12 }}
              label={{ value: 'Emotion Level (%)', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="happiness" 
              stroke="hsl(var(--chart-1))" 
              strokeWidth={2}
              name="Happiness"
            />
            <Line 
              type="monotone" 
              dataKey="sadness" 
              stroke="hsl(var(--chart-2))" 
              strokeWidth={2}
              name="Sadness"
            />
            <Line 
              type="monotone" 
              dataKey="anger" 
              stroke="hsl(var(--chart-3))" 
              strokeWidth={2}
              name="Anger"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}