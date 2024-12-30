'use client';

import { useCallback } from 'react';
import { Camera, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useTheme } from './ThemeProvider';
import { EmotionOverlay } from './EmotionOverlay';
import { useCamera } from '@/hooks/useCamera';
import { useEmotionDetection } from '@/hooks/useEmotionDetection';
import { VideoFeed } from './VideoFeed';

export function EmotionTracker() {
  const { error, isPermissionGranted, initializeStream } = useCamera();
  const { currentEmotions, startDetection, stopDetection } = useEmotionDetection();
  const { setEmotion } = useTheme();

  const handleVideoMount = useCallback((videoElement: HTMLVideoElement) => {
    if (!isPermissionGranted) {
      initializeStream(videoElement);
    }
  }, [isPermissionGranted, initializeStream]);

  const handleRetry = useCallback((videoElement: HTMLVideoElement) => {
    initializeStream(videoElement);
  }, [initializeStream]);

  return (
    <div className="space-y-4">
      {!isPermissionGranted || error ? (
        <div className="space-y-4">
          <Alert variant={error ? "destructive" : "default"}>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{error ? 'Error' : 'Camera Permission Required'}</AlertTitle>
            <AlertDescription>
              {error || 'We need access to your camera to analyze emotions in real-time.'}
            </AlertDescription>
          </Alert>
          <Button onClick={() => handleRetry}>
            <Camera className="mr-2 h-4 w-4" />
            {error ? 'Retry' : 'Enable Camera'}
          </Button>
        </div>
      ) : (
        <div className="relative aspect-video max-w-2xl mx-auto rounded-lg overflow-hidden border-2 border-border bg-black">
          <VideoFeed onVideoMount={handleVideoMount} />
          {currentEmotions && <EmotionOverlay emotions={currentEmotions} />}
        </div>
      )}
    </div>
  );
}