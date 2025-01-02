'use client';

import { Card } from '@/components/ui/card';
import { Brain, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { CopingStrategy, EmotionInsight } from '@/lib/ai-assistant';
import { generateCopingStrategies, analyzeEmotionPatterns } from '@/lib/ai-assistant';
import type { EmotionData } from '@/lib/emotion-detection';

interface EmotionInsightsProps {
  currentEmotions: EmotionData;
  emotionHistory: EmotionData[];
}

export function EmotionInsights({ currentEmotions, emotionHistory }: EmotionInsightsProps) {
  const [strategies, setStrategies] = useState<CopingStrategy[]>([]);
  const [insights, setInsights] = useState<EmotionInsight[]>([]);

  useEffect(() => {
    setStrategies(generateCopingStrategies(currentEmotions));
    setInsights(analyzeEmotionPatterns(emotionHistory));
  }, [currentEmotions, emotionHistory]);

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">AI Insights</h2>
        <Brain className="w-6 h-6 text-primary" />
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-3">Coping Strategies</h3>
          <div className="space-y-3">
            {strategies.map((strategy, index) => (
              <div key={index} className="p-3 rounded-lg bg-secondary">
                <h4 className="font-medium">{strategy.title}</h4>
                <p className="text-sm text-muted-foreground">{strategy.description}</p>
                <div className="flex gap-2 mt-2">
                  <span className="text-xs px-2 py-1 rounded-full bg-primary/10">
                    {strategy.type}
                  </span>
                  <span className="text-xs px-2 py-1 rounded-full bg-primary/10">
                    {strategy.difficulty}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-3">Pattern Analysis</h3>
          <div className="space-y-3">
            {insights.map((insight, index) => (
              <div key={index} className="p-3 rounded-lg bg-secondary">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="w-4 h-4" />
                  <h4 className="font-medium">{insight.pattern}</h4>
                </div>
                <p className="text-sm text-muted-foreground">{insight.suggestion}</p>
                <span className={`text-xs px-2 py-1 rounded-full bg-primary/10 mt-2 inline-block`}>
                  {insight.priority} priority
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}