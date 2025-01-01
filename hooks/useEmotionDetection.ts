'use client';

import { useState, useEffect, useRef } from 'react';
import { detectEmotions, type EmotionData } from '@/lib/emotion-detection';

export function useEmotionDetection(videoRef: React.RefObject<HTMLVideoElement>) {
  const [currentEmotions, setCurrentEmotions] = useState<EmotionData | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const detectionInterval = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const startDetection = async () => {
      if (!videoRef.current || videoRef.current.readyState < 2) return;
      
      try {
        setIsDetecting(true);
        const emotions = await detectEmotions(videoRef.current);
        if (emotions) {
          setCurrentEmotions(emotions);
        }
      } catch (error) {
        console.error('Emotion detection error:', error);
      } finally {
        setIsDetecting(false);
      }
    };

    // Start detection loop when video is ready
    const startDetectionLoop = () => {
      if (detectionInterval.current) {
        clearInterval(detectionInterval.current);
      }
      detectionInterval.current = setInterval(startDetection, 1000); // Reduced frequency for better performance
    };

    if (videoRef.current && videoRef.current.readyState >= 2) {
      startDetectionLoop();
    }

    const videoElement = videoRef.current;
    videoElement?.addEventListener('loadeddata', startDetectionLoop);

    return () => {
      if (detectionInterval.current) {
        clearInterval(detectionInterval.current);
      }
      videoElement?.removeEventListener('loadeddata', startDetectionLoop);
    };
  }, [videoRef]);

  return {
    currentEmotions,
    isDetecting
  };
}