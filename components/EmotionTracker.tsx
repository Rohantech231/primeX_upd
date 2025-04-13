'use client';

import { useRef, useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { VideoFeed } from './VideoFeed';
import { EmotionChart } from './EmotionChart';
import { EmotionOverlay } from './EmotionOverlay';
import { EmotionVisualization3D } from './EmotionVisualization3D';
import { EmotionRecommendations } from './EmotionRecommendations';
import { useEmotionDetection } from '@/hooks/useEmotionDetection';
import { Button } from '@/components/ui/button';
import { Camera, CameraOff, AlertTriangle } from 'lucide-react';
import { FaceMesh } from './FaceMesh';
import { AttentionWellnessTracker } from './AttentionWellnessTracker';
import { initializeFaceAPI, isFaceAPIInitialized } from '@/lib/face-api-init';

export function EmotionTracker() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoEnabled, setIsVideoEnabled] = useState(false);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [initError, setInitError] = useState<string | null>(null);
  const { emotions, error: emotionError } = useEmotionDetection(videoRef, isVideoEnabled);

  // Initialize face-api models
  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        if (!isFaceAPIInitialized()) {
          setIsLoading(true);
          await initializeFaceAPI();
        }
        if (mounted) {
          setIsModelLoaded(true);
          setIsLoading(false);
          setInitError(null);
        }
      } catch (error) {
        if (mounted) {
          console.error('Failed to load face-api models:', error);
          setInitError('Failed to initialize face detection models');
          setIsLoading(false);
        }
      }
    };

    init();

    return () => {
      mounted = false;
    };
  }, []);

  const handleToggleVideo = () => {
    setIsVideoEnabled(!isVideoEnabled);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading face detection models...</p>
        </div>
      </div>
    );
  }

  if (initError) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="p-6 max-w-md">
          <div className="flex items-center gap-3 text-destructive mb-4">
            <AlertTriangle className="h-6 w-6" />
            <h3 className="font-semibold">Initialization Error</h3>
          </div>
          <p className="text-sm text-muted-foreground">{initError}</p>
          <p className="text-sm text-muted-foreground mt-2">Please try refreshing the page.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid gap-6 p-6 md:grid-cols-2">
      {/* Left Column */}
      <div className="space-y-6">
        {/* Video Feed Card */}
        <Card className="relative aspect-video overflow-hidden">
          <VideoFeed ref={videoRef} enabled={isVideoEnabled} />
          {emotions && isVideoEnabled && <EmotionOverlay emotions={emotions} />}
          <FaceMesh videoRef={videoRef} isEnabled={isVideoEnabled} />
          <Button
            variant="secondary"
            size="icon"
            className="absolute bottom-4 right-4 rounded-full"
            onClick={handleToggleVideo}
          >
            {isVideoEnabled ? (
              <CameraOff className="h-4 w-4" />
            ) : (
              <Camera className="h-4 w-4" />
            )}
          </Button>
        </Card>

        {/* Attention and Wellness Tracker */}
        <AttentionWellnessTracker
          videoRef={videoRef}
          isEnabled={isVideoEnabled}
        />

        {/* 3D Visualization */}
        <Card className="aspect-square overflow-hidden">
          {emotions && (
            <EmotionVisualization3D
              emotions={emotions}
              width={400}
              height={400}
            />
          )}
        </Card>
      </div>

      {/* Right Column */}
      <div className="space-y-6">
        {/* Emotion Chart */}
        <Card className="aspect-[4/3]">
          {emotions && <EmotionChart currentEmotions={emotions} />}
        </Card>

        {/* Recommendations */}
        {emotions && <EmotionRecommendations emotions={emotions} />}

        {/* Error Message */}
        {emotionError && (
          <Card className="p-4">
            <div className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="w-5 h-5" />
              <p className="text-sm">{emotionError}</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}