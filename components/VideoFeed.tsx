'use client';

import { useEffect, useRef } from 'react';

interface VideoFeedProps {
  onVideoMount: (videoElement: HTMLVideoElement) => void;
  className?: string;
}

export function VideoFeed({ onVideoMount, className = '' }: VideoFeedProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      onVideoMount(videoRef.current);
    }
  }, [onVideoMount]);

  return (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      muted
      className={`w-full h-full object-cover mirror-mode ${className}`}
    />
  );
}