'use client';

import { useRef, useEffect } from 'react';
import { VideoFeed } from './VideoFeed';
import { CameraStatus } from './CameraStatus';
import { EmotionOverlay } from './EmotionOverlay';
import { EmotionChart } from './EmotionChart';
import { useCamera } from '@/hooks/useCamera';
import { useEmotionDetection } from '@/hooks/useEmotionDetection';
import { initializeDetection } from '@/lib/emotion-detection';
import { ExportPanel } from './ExportPanel';

export function EmotionTracker() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { error, isPermissionGranted, isInitializing, initializeStream } = useCamera();
  const { currentEmotions, isDetecting } = useEmotionDetection(videoRef);

  useEffect(() => {
    initializeDetection().catch(console.error);
  }, []);

  useEffect(() => {
    if (videoRef.current && !isPermissionGranted && !isInitializing && !error) {
      initializeStream(videoRef.current);
    }
  }, [isPermissionGranted, isInitializing, error, initializeStream]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Emotion Detection</h2>
        <div className="flex gap-2">
          <CameraStatus 
            isEnabled={isPermissionGranted} 
            error={error} 
            isAnalyzing={isDetecting}
          />
        </div>
      </div>

      <div className="relative aspect-video max-w-2xl mx-auto rounded-lg overflow-hidden border-2 border-border bg-black">
        <VideoFeed
          ref={videoRef}
          onVideoMount={initializeStream}
        />
        {currentEmotions && <EmotionOverlay emotions={currentEmotions} />}
      </div>

      <div className="space-y-4">
        <EmotionChart currentEmotions={currentEmotions} />
        <ExportPanel currentEmotions={currentEmotions} />
      </div>
    </div>
  );
}