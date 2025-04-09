'use client';

import { forwardRef } from 'react';

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
      </div>
    );
  }
);

VideoFeed.displayName = 'VideoFeed';