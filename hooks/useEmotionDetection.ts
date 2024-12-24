'use client';

import { useState, useCallback, useRef } from 'react';
import { detectEmotions, type EmotionData } from '@/lib/emotion-detection';

export function useEmotionDetection(
  videoRef: React.RefObject<HTMLVideoElement>,
  isEnabled: boolean
) {
  const [currentEmotions, setCurrentEmotions] = useState<EmotionData | null>(null);
  const intervalRef = useRef<NodeJS.Timeout>();

  const detectLoop = useCallback(async () => {
    if (videoRef.current?.readyState === videoRef.current?.HAVE_ENOUGH_DATA) {
      try {
        const emotions = await detectEmotions(videoRef.current);
        if (emotions) {
          setCurrentEmotions(emotions);
        }
      } catch (err) {
        console.error('Detection error:', err);
      }
    }
  }, [videoRef]);

  const startDetection = useCallback(() => {
    if (isEnabled && !intervalRef.current) {
      intervalRef.current = setInterval(detectLoop, 2000);
    }
  }, [isEnabled, detectLoop]);

  const stopDetection = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = undefined;
    }
  }, []);

  return {
    currentEmotions,
    startDetection,
    stopDetection
  };
}