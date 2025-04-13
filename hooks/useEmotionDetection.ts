'use client';

import { useEffect, useState, useRef, RefObject } from 'react';
import { detectEmotions, type EmotionData } from '@/lib/emotion-detection';

export function useEmotionDetection(
  videoRef: RefObject<HTMLVideoElement>,
  isEnabled: boolean
) {
  const [emotions, setEmotions] = useState<EmotionData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const frameRef = useRef<number>();

  useEffect(() => {
    if (!isEnabled) {
      setEmotions(null);
      setError(null);
      return;
    }

    const detectFrame = async () => {
      try {
        if (!videoRef.current) {
          setError('Video feed not available');
          return;
        }

        const detectedEmotions = await detectEmotions(videoRef.current);
        if (detectedEmotions) {
          setEmotions(detectedEmotions);
          setError(null);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to detect emotions');
      }

      frameRef.current = requestAnimationFrame(detectFrame);
    };

    detectFrame();

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [videoRef, isEnabled]);

  return { emotions, error };
}