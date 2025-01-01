'use client';

import { Card } from '@/components/ui/card';
import { Music, Activity, Lightbulb } from 'lucide-react';
import { getRecommendations } from '@/lib/recommendations';

type RecommendationsProps = {
  emotions: {
    happiness: number;
    sadness: number;
    anger: number;
  };
};

export function Recommendations({ emotions }: RecommendationsProps) {
  const recommendations = getRecommendations(emotions);

  const icons = {
    music: Music,
    activity: Activity,
    tip: Lightbulb,
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Recommendations</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {recommendations.map((rec, index) => {
          const Icon = icons[rec.type as keyof typeof icons];
          return (
            <Card key={index} className="p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Icon className="w-5 h-5" />
                <h3 className="font-medium capitalize">{rec.type}</h3>
              </div>
              <p className="text-sm text-muted-foreground">{rec.content}</p>
            </Card>
          );
        })}
      </div>
    </Card>
  );
}