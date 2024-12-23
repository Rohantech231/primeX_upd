'use client';

import { useRef, useEffect, useState } from 'react';
import { Camera, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { detectEmotions, type EmotionData } from '@/lib/emotion-detection';
import { useTheme } from './ThemeProvider';
import { EmotionOverlay } from './EmotionOverlay';

export function EmotionTracker() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [permission, setPermission] = useState<boolean>(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { setEmotion } = useTheme();
  const [currentEmotions, setCurrentEmotions] = useState<EmotionData | null>(null);

  const requestPermission = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      setStream(stream);
      setPermission(true);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error('Error accessing webcam:', err);
      setError(err instanceof Error ? err.message : 'Failed to access camera');
      setPermission(false);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;

    const detectLoop = async () => {
      if (videoRef.current && permission) {
        try {
          const emotions = await detectEmotions(videoRef.current);
          if (emotions) {
            setCurrentEmotions(emotions);
            const dominantEmotion = Object.entries(emotions)
              .filter(([key]) => key !== 'timestamp')
              .reduce((a, b) => (a[1] > b[1] ? a : b))[0];
            setEmotion(dominantEmotion as any);
          }
        } catch (err) {
          console.error('Detection error:', err);
        }
      }
    };

    if (permission) {
      // Run detection every 1 second to avoid API rate limits
      interval = setInterval(detectLoop, 1000);
    }

    return () => {
      clearInterval(interval);
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [permission, stream, setEmotion]);

  if (!permission || error) {
    return (
      <div className="space-y-4">
        <Alert variant={error ? "destructive" : "default"}>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{error ? 'Error' : 'Camera Permission Required'}</AlertTitle>
          <AlertDescription>
            {error || 'We need access to your camera to analyze emotions in real-time.'}
          </AlertDescription>
        </Alert>
        <Button onClick={requestPermission}>
          <Camera className="mr-2 h-4 w-4" />
          {error ? 'Retry' : 'Enable Camera'}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative aspect-video max-w-2xl mx-auto rounded-lg overflow-hidden border-2 border-border">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />
        {currentEmotions && <EmotionOverlay emotions={currentEmotions} />}
      </div>
    </div>
  );
}