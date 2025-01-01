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
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { exportToJSON, exportToPDF } from '@/lib/export';

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
        }].slice(-20);
        return newHistory;
      });
    }
  }, [currentEmotions]);

  const handleExportJSON = () => {
    exportToJSON(emotionHistory);
  };

  const handleExportPDF = () => {
    exportToPDF(emotionHistory);
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Emotion Analysis</h2>
        <div className="space-x-2">
          <Button
            variant="outline"
            onClick={handleExportJSON}
            disabled={emotionHistory.length === 0}
          >
            <Download className="w-4 h-4 mr-2" />
            Export JSON
          </Button>
          <Button
            variant="outline"
            onClick={handleExportPDF}
            disabled={emotionHistory.length === 0}
          >
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>
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
              stroke="#22c55e"
              strokeWidth={2}
              dot={false}
              name="Happiness"
            />
            <Line
              type="monotone"
              dataKey="sadness"
              stroke="#60a5fa"
              strokeWidth={2}
              dot={false}
              name="Sadness"
            />
            <Line
              type="monotone"
              dataKey="anger"
              stroke="#ef4444"
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