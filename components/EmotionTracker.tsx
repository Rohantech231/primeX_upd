'use client';

import { useCallback, useRef, useEffect } from 'react';
import { Camera, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useTheme } from './ThemeProvider';
import { EmotionOverlay } from './EmotionOverlay';
import { useCamera } from '@/hooks/useCamera';
import { useEmotionDetection } from '@/hooks/useEmotionDetection';
import { VideoFeed } from './VideoFeed';
import { CameraStatus } from './CameraStatus';

export function EmotionTracker() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const { error, isPermissionGranted, isInitializing, initializeStream } = useCamera();
  const { currentEmotions, startDetection, stopDetection } = useEmotionDetection();
  const { setEmotion } = useTheme();

  const handleVideoMount = useCallback((videoElement: HTMLVideoElement) => {
    videoRef.current = videoElement;
  }, []);

  // Auto-initialize camera on mount
  useEffect(() => {
    if (videoRef.current && !isPermissionGranted && !isInitializing && !error) {
      initializeStream(videoRef.current);
    }
  }, [isPermissionGranted, isInitializing, error, initializeStream]);

  const handleEnableCamera = useCallback(() => {
    if (videoRef.current) {
      initializeStream(videoRef.current);
    }
  }, [initializeStream]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Camera Feed</h2>
        <CameraStatus isEnabled={isPermissionGranted} error={error} />
      </div>

      {(!isPermissionGranted || error) && (
        <div className="space-y-4">
          <Alert variant={error ? "destructive" : "default"}>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{error ? 'Error' : 'Camera Permission Required'}</AlertTitle>
            <AlertDescription>
              {error || 'We need access to your camera to analyze emotions in real-time.'}
            </AlertDescription>
          </Alert>
          <Button 
            onClick={handleEnableCamera}
            disabled={isInitializing}
          >
            <Camera className="mr-2 h-4 w-4" />
            {isInitializing ? 'Initializing...' : error ? 'Retry' : 'Enable Camera'}
          </Button>
        </div>
      )}

      <div className="relative aspect-video max-w-2xl mx-auto rounded-lg overflow-hidden border-2 border-border bg-black">
        <VideoFeed onVideoMount={handleVideoMount} />
        {currentEmotions && <EmotionOverlay emotions={currentEmotions} />}
      </div>
    </div>
  );
}