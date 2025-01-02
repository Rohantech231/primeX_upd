'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, Music } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { SpotifyRecommendation } from '@/lib/spotify';
import { getRecommendationsForMood } from '@/lib/spotify';
import type { EmotionData } from '@/lib/emotion-detection';

interface MusicRecommendationsProps {
  currentEmotions: EmotionData;
}

export function MusicRecommendations({ currentEmotions }: MusicRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<SpotifyRecommendation[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<SpotifyRecommendation | null>(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const newRecommendations = await getRecommendationsForMood(currentEmotions);
        setRecommendations(newRecommendations);
      } catch (error) {
        console.error('Failed to fetch music recommendations:', error);
      }
    };

    fetchRecommendations();
  }, [currentEmotions]);

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">Music Recommendations</h2>
        <Music className="w-6 h-6 text-primary" />
      </div>
      <div className="space-y-4">
        {recommendations.map((track) => (
          <div
            key={track.uri}
            className="flex items-center justify-between p-3 rounded-lg bg-secondary"
          >
            <div>
              <p className="font-medium">{track.name}</p>
              <p className="text-sm text-muted-foreground">{track.artist}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setCurrentTrack(track);
                setIsPlaying(!isPlaying);
              }}
            >
              {isPlaying && currentTrack?.uri === track.uri ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}
            </Button>
          </div>
        ))}
      </div>
    </Card>
  );
}