'use client';

import { useState, useCallback, useEffect } from 'react';

export function useCamera() {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPermissionGranted, setIsPermissionGranted] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);

  const initializeStream = useCallback(async (videoElement: HTMLVideoElement) => {
    if (isInitializing || isPermissionGranted) return;
    
    try {
      setIsInitializing(true);
      setError(null);
      
      // Stop any existing stream
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }

      // Check if camera permissions are already granted
      const permissions = await navigator.permissions.query({ name: 'camera' as PermissionName });
      if (permissions.state === 'denied') {
        throw new Error('Camera permission denied. Please enable camera access in your browser settings.');
      }

      const newStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user',
          frameRate: { ideal: 30 }
        },
        audio: false
      });

      // Verify we have a valid video track
      const videoTrack = newStream.getVideoTracks()[0];
      if (!videoTrack) {
        throw new Error('No video track available');
      }

      setStream(newStream);
      videoElement.srcObject = newStream;
      
      // Wait for video to be ready with timeout
      await Promise.race([
        new Promise((resolve) => {
          videoElement.onloadedmetadata = resolve;
        }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Video loading timeout')), 5000)
        )
      ]);

      await videoElement.play();
      setIsPermissionGranted(true);
    } catch (err) {
      console.error('Camera access error:', err);
      setError(err instanceof Error ? err.message : 'Failed to access camera');
      setIsPermissionGranted(false);
      setStream(null);
      if (videoElement.srcObject) {
        videoElement.srcObject = null;
      }
    } finally {
      setIsInitializing(false);
    }
  }, [stream, isInitializing, isPermissionGranted]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => {
          track.stop();
        });
        setStream(null);
        setIsPermissionGranted(false);
      }
    };
  }, [stream]);

  // Auto-retry on error
  useEffect(() => {
    let retryTimeout: NodeJS.Timeout;
    if (error && !isInitializing && !isPermissionGranted) {
      retryTimeout = setTimeout(() => {
        setError(null);
      }, 5000);
    }
    return () => {
      if (retryTimeout) {
        clearTimeout(retryTimeout);
      }
    };
  }, [error, isInitializing, isPermissionGranted]);

  return {
    stream,
    error,
    isPermissionGranted,
    isInitializing,
    initializeStream
  };
}