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
  ResponsiveContainer,
  Area,
  ComposedChart
} from 'recharts';
import { useState, useEffect } from 'react';
import type { EmotionData } from '@/lib/emotion-detection';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { exportToJSON, exportToPDF } from '@/lib/export';

interface EmotionChartProps {
  currentEmotions: EmotionData | null;
}

const EMOTION_COLORS = {
  happiness: '#22c55e',
  sadness: '#60a5fa',
  anger: '#ef4444',
  surprise: '#a855f7',
  fear: '#6b7280',
  disgust: '#16a34a',
  neutral: '#94a3b8'
} as const;

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background/95 p-3 rounded-lg shadow-lg border border-border">
        <p className="text-sm font-medium">{label}</p>
        {payload.map((entry: any) => (
          <p key={entry.name} style={{ color: entry.color }} className="text-sm">
            {entry.name}: {(entry.value * 100).toFixed(1)}%
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function EmotionChart({ currentEmotions }: EmotionChartProps) {
  const [emotionHistory, setEmotionHistory] = useState<Array<EmotionData & { time: string }>>([]);

  useEffect(() => {
    if (currentEmotions) {
      setEmotionHistory(prev => {
        const newHistory = [...prev, {
          ...currentEmotions,
          time: new Date().toLocaleTimeString()
        }].slice(-30);
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
          <ComposedChart data={emotionHistory}>
            <defs>
              {Object.entries(EMOTION_COLORS).map(([emotion, color]) => (
                <linearGradient
                  key={emotion}
                  id={`${emotion}Gradient`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor={color} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis 
              dataKey="time"
              tick={{ fontSize: 12 }}
              interval="preserveStartEnd"
              stroke="#666"
            />
            <YAxis 
              domain={[0, 1]}
              tick={{ fontSize: 12 }}
              label={{ 
                value: 'Emotion Intensity', 
                angle: -90, 
                position: 'insideLeft',
                style: { textAnchor: 'middle' }
              }}
              stroke="#666"
              tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {Object.entries(EMOTION_COLORS).map(([emotion, color]) => (
              <Area
                key={emotion}
                type="monotone"
                dataKey={emotion}
                stroke={color}
                fill={`url(#${emotion}Gradient)`}
                strokeWidth={2}
                name={emotion.charAt(0).toUpperCase() + emotion.slice(1)}
                dot={false}
              />
            ))}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}