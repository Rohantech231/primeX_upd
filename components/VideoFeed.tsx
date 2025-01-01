'use client';

import { forwardRef } from 'react';
import { FaceDetectionCanvas } from './FaceDetectionCanvas';

interface VideoFeedProps {
  onVideoMount: (videoElement: HTMLVideoElement) => void;
  className?: string;
}

export const VideoFeed = forwardRef<HTMLVideoElement, VideoFeedProps>(
  ({ onVideoMount, className = '' }, ref) => {
    return (
      <div className="relative w-full h-full">
        <video
          ref={ref}
          autoPlay
          playsInline
          muted
          className={`w-full h-full object-cover mirror-mode ${className}`}
          onLoadedMetadata={(e) => {
            const video = e.target as HTMLVideoElement;
            onVideoMount(video);
          }}
        />
        {ref && 'current' in ref && ref.current && (
          <FaceDetectionCanvas videoRef={ref as React.RefObject<HTMLVideoElement>} />
        )}
      </div>
    );
  }
);

VideoFeed.displayName = 'VideoFeed';