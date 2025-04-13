'use client';

import { useRef, useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { calculateAttentionMetrics, calculateWellnessMetrics } from '@/lib/attention-tracking';
import { HealthMonitor } from './HealthMonitor';

interface AttentionWellnessTrackerProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  isEnabled: boolean;
}

export function AttentionWellnessTracker({ videoRef, isEnabled }: AttentionWellnessTrackerProps) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [metrics, setMetrics] = useState({
    stressLevel: 0,
    fatigueScore: 0,
    blinkRate: 0,
    timestamp: Date.now()
  });

  const isTrackingRef = useRef(false);
  const frameIdRef = useRef<number>();

  // Initialize tracking
  useEffect(() => {
    setIsInitialized(true);
    return () => setIsInitialized(false);
  }, []);

  // Start tracking metrics when video is enabled
  useEffect(() => {
    if (!isEnabled || !videoRef.current || !isInitialized) {
      console.log('AttentionWellnessTracker: Waiting for video and initialization', {
        isEnabled,
        hasVideo: !!videoRef.current,
        isInitialized
      });
      return;
    }

    // Wait for video to be ready
    if (!videoRef.current.readyState || videoRef.current.readyState < 2) {
      console.log('Video not ready, waiting for loadeddata event');
      const handleVideoReady = () => {
        console.log('Video ready, starting metrics tracking');
        startTracking();
      };

      videoRef.current.addEventListener('loadeddata', handleVideoReady);
      return () => {
        videoRef.current?.removeEventListener('loadeddata', handleVideoReady);
      };
    }

    console.log('Video ready, starting metrics tracking immediately');
    startTracking();

    function startTracking() {
      if (!videoRef.current || !isEnabled || !isInitialized) return;
      console.log('AttentionWellnessTracker: Starting metrics tracking');
      isTrackingRef.current = true;

      const updateMetrics = async () => {
        if (!isTrackingRef.current || !videoRef.current) return;

        try {
          const [attention, wellness] = await Promise.all([
            calculateAttentionMetrics(videoRef.current),
            calculateWellnessMetrics(videoRef.current)
          ]);

          if (!isTrackingRef.current) return;

          setMetrics({
            stressLevel: wellness.stressLevel,
            fatigueScore: wellness.fatigueScore,
            blinkRate: wellness.blinkRate,
            timestamp: Date.now()
          });
          setError(null);

          if (isTrackingRef.current) {
            frameIdRef.current = requestAnimationFrame(updateMetrics);
          }
        } catch (err) {
          if (!isTrackingRef.current) return;
          console.error('Error updating metrics:', err);
          setError(err instanceof Error ? err.message : 'Failed to update metrics');
        }
      };

      updateMetrics();
    }

    return () => {
      console.log('AttentionWellnessTracker: Cleaning up');
      isTrackingRef.current = false;
      if (frameIdRef.current) {
        cancelAnimationFrame(frameIdRef.current);
      }
    };
  }, [videoRef, isEnabled, isInitialized]);

  if (!isEnabled) {
    return (
      <Card className="p-6">
        <p className="text-center text-muted-foreground">
          Enable camera to track attention and wellness metrics
        </p>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <p className="text-center text-destructive">{error}</p>
      </Card>
    );
  }

  return <HealthMonitor metrics={metrics} />;
}
