'use client';

import { useState, useCallback } from 'react';

export function useCamera() {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPermissionGranted, setIsPermissionGranted] = useState(false);

  const initializeStream = useCallback(async (videoElement: HTMLVideoElement) => {
    try {
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
      
      try {
        await videoElement.play();
        setIsPermissionGranted(true);
      } catch (playError) {
        throw new Error(`Failed to play video: ${playError.message}`);
      }
    } catch (err) {
      console.error('Camera access error:', err);
      setError(err instanceof Error ? err.message : 'Failed to access camera');
      setIsPermissionGranted(false);
    }
  }, [stream]);

  return {
    stream,
    error,
    isPermissionGranted,
    initializeStream
  };
}