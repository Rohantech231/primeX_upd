'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { getSpotifyRecommendations } from '@/lib/spotify-service';
import type { EmotionData } from '@/lib/emotion-detection';
import { Music, HeartPulse } from 'lucide-react';

interface EmotionRecommendationsProps {
  emotions: EmotionData;
}

export function EmotionRecommendations({ emotions }: EmotionRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<{
    tracks: Array<{
      id: string;
      name: string;
      artists: Array<{ name: string }>;
      external_urls: { spotify: string };
    }>;
    advice: string;
  }>({ tracks: [], advice: '' });

  useEffect(() => {
    const fetchRecommendations = async () => {
      const result = await getSpotifyRecommendations(emotions);
      setRecommendations(result);
    };

    fetchRecommendations();
  }, [emotions]);

  if (!recommendations.tracks.length && !recommendations.advice) {
    return null;
  }

  return (
    <Card className="p-6 bg-background/95 backdrop-blur-sm">
      <div className="space-y-6">
        {/* Advice Section */}
        <div className="flex items-start space-x-4">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <HeartPulse className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2">Emotional Insight</h3>
            <p className="text-muted-foreground">{recommendations.advice}</p>
          </div>
        </div>

        {/* Music Recommendations */}
        {recommendations.tracks.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Music className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">Recommended Tracks</h3>
            </div>
            <div className="grid gap-4">
              {recommendations.tracks.map((track) => (
                <a
                  key={track.id}
                  href={track.external_urls.spotify}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-3 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors"
                >
                  <div>
                    <p className="font-medium">{track.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {track.artists.map(a => a.name).join(', ')}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
