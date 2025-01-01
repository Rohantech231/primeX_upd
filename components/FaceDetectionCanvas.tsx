'use client';

import { useRef, useEffect } from 'react';
import * as faceapi from 'face-api.js';

interface FaceDetectionCanvasProps {
  videoRef: React.RefObject<HTMLVideoElement>;
}

export function FaceDetectionCanvas({ videoRef }: FaceDetectionCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const displaySize = {
      width: videoRef.current.videoWidth,
      height: videoRef.current.videoHeight
    };

    faceapi.matchDimensions(canvas, displaySize);

    const drawDetections = async () => {
      if (!videoRef.current || !canvasRef.current) return;

      const detections = await faceapi
        .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions();

      if (detections) {
        const resizedDetections = faceapi.resizeResults(detections, displaySize);
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Clear previous drawings
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw face outline
        ctx.strokeStyle = '#00ff00';
        ctx.lineWidth = 2;
        const box = resizedDetections.detection.box;
        ctx.beginPath();
        ctx.rect(box.x, box.y, box.width, box.height);
        ctx.stroke();
      }

      requestAnimationFrame(drawDetections);
    };

    drawDetections();

    return () => {
      const ctx = canvas.getContext('2d');
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, [videoRef]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full"
    />
  );
}