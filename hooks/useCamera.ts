'use client';

import { useState, useCallback, useEffect } from 'react';

export function useCamera() {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPermissionGranted, setIsPermissionGranted] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);

  const initializeStream = useCallback(async (videoElement: HTMLVideoElement) => {
    if (isInitializing) return;
    
    try {
      setIsInitializing(true);
      setError(null);
      
      // Stop any existing stream
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }

      const newStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        },
        audio: false
      });

      setStream(newStream);
      videoElement.srcObject = newStream;
      
      // Wait for video to be ready
      await new Promise((resolve) => {
        videoElement.onloadedmetadata = resolve;
      });

      await videoElement.play();
      setIsPermissionGranted(true);
    } catch (err) {
      console.error('Camera access error:', err);
      setError(err instanceof Error ? err.message : 'Failed to access camera');
      setIsPermissionGranted(false);
    } finally {
      setIsInitializing(false);
    }
  }, [stream]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  return {
    stream,
    error,
    isPermissionGranted,
    isInitializing,
    initializeStream
  };
}