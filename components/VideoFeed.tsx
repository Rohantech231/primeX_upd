'use client';

import { forwardRef, useEffect, useState } from 'react';

interface VideoFeedProps {
  enabled: boolean;
}

export const VideoFeed = forwardRef<HTMLVideoElement, VideoFeedProps>(
  function VideoFeed({ enabled }, ref) {
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
      if (!enabled) {
        if (stream) {
          console.log('Stopping video stream');
          stream.getTracks().forEach(track => track.stop());
          setStream(null);
        }
        return;
      }

      async function startCamera() {
        try {
          console.log('Requesting camera access...');
          const mediaStream = await navigator.mediaDevices.getUserMedia({
            video: {
              width: { ideal: 640 },
              height: { ideal: 480 },
              facingMode: 'user'
            }
          });
          console.log('Camera access granted');
          setStream(mediaStream);
          setError(null);
        } catch (err) {
          console.error('Error accessing camera:', err);
          setError(err instanceof Error ? err.message : 'Failed to access camera');
          setStream(null);
        }
      }

      startCamera();

      return () => {
        if (stream) {
          console.log('Cleaning up video stream');
          stream.getTracks().forEach(track => track.stop());
        }
      };
    }, [enabled]);

    // Update video element when stream changes
    useEffect(() => {
      const videoElement = ref as React.MutableRefObject<HTMLVideoElement>;
      if (videoElement?.current && stream) {
        console.log('Setting video stream');
        videoElement.current.srcObject = stream;
        videoElement.current.play().catch(err => {
          console.error('Error playing video:', err);
          setError('Failed to start video playback');
        });
      }
    }, [stream, ref]);

    return (
      <>
        <video
          ref={ref}
          autoPlay
          playsInline
          muted
          className={`w-full h-full ${enabled ? 'opacity-100' : 'opacity-0'}`}
          style={{ transform: 'scaleX(-1)' }} // Mirror the video
        />
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}
        {!enabled && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80">
            <p className="text-sm text-muted-foreground">Camera is disabled</p>
          </div>
        )}
      </>
    );
  }
);

VideoFeed.displayName = 'VideoFeed';