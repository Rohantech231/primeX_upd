'use client';

import { useRef, useEffect, useState } from 'react';
import { Camera, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { initializeModels, detectEmotions, type EmotionData } from '@/lib/emotion-detection';
import { useTheme } from './ThemeProvider';
import { EmotionOverlay } from './EmotionOverlay';

export function EmotionTracker() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [permission, setPermission] = useState<boolean>(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isModelReady, setIsModelReady] = useState(false);
  const { setEmotion } = useTheme();
  const [currentEmotions, setCurrentEmotions] = useState<EmotionData | null>(null);

  const requestPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true 
      });
      setStream(stream);
      setPermission(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      await initializeModels();
      setIsModelReady(true);
    } catch (err) {
      console.error('Error accessing webcam:', err);
      setPermission(false);
    }
  };

  useEffect(() => {
    let animationFrame: number;

    const detectLoop = async () => {
      if (videoRef.current && isModelReady) {
        const emotions = await detectEmotions(videoRef.current);
        if (emotions) {
          setCurrentEmotions(emotions);
          // Update theme based on dominant emotion
          const dominantEmotion = Object.entries(emotions)
            .filter(([key]) => key !== 'timestamp')
            .reduce((a, b) => (a[1] > b[1] ? a : b))[0];
          setEmotion(dominantEmotion as any);
        }
      }
      animationFrame = requestAnimationFrame(detectLoop);
    };

    if (permission && isModelReady) {
      detectLoop();
    }

    return () => {
      cancelAnimationFrame(animationFrame);
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [permission, isModelReady, stream, setEmotion]);

  if (!permission) {
    return (
      <div className="space-y-4">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Camera Permission Required</AlertTitle>
          <AlertDescription>
            We need access to your camera to analyze emotions in real-time.
            Your privacy is important - all processing happens locally on your device.
          </AlertDescription>
        </Alert>
        <Button onClick={requestPermission}>
          <Camera className="mr-2 h-4 w-4" />
          Enable Camera
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