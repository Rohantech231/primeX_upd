'use client';

import { useEffect, useRef } from 'react';
import * as faceapi from 'face-api.js';

interface FaceMeshProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  isEnabled: boolean;
}

export function FaceMesh({ videoRef, isEnabled }: FaceMeshProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const lastDrawTime = useRef<number>(0);
  const FPS_CAP = 30; // Cap at 30 FPS for better performance
  const FRAME_TIME = 1000 / FPS_CAP;

  useEffect(() => {
    if (!isEnabled || !videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d', {
      alpha: false,
      desynchronized: true // Use desynchronized context for lower latency
    });
    if (!context) return;

    // Optimize canvas
    context.imageSmoothingEnabled = false;

    const updateCanvasSize = () => {
      if (!videoRef.current || !canvasRef.current) return;
      
      const displaySize = {
        width: videoRef.current.offsetWidth,
        height: videoRef.current.offsetHeight
      };
      
      // Only update if size actually changed
      if (canvas.width !== displaySize.width || canvas.height !== displaySize.height) {
        canvas.width = displaySize.width;
        canvas.height = displaySize.height;
      }
    };

    const drawMesh = async (timestamp: number) => {
      if (!videoRef.current || !canvasRef.current || !context) return;

      // Implement FPS cap
      const elapsed = timestamp - lastDrawTime.current;
      if (elapsed < FRAME_TIME) {
        animationRef.current = requestAnimationFrame(drawMesh);
        return;
      }
      lastDrawTime.current = timestamp;

      try {
        const detection = await faceapi
          .detectSingleFace(
            videoRef.current,
            new faceapi.TinyFaceDetectorOptions({
              inputSize: 160,
              scoreThreshold: 0.5
            })
          )
          .withFaceLandmarks(true);

        if (detection) {
          const displaySize = {
            width: videoRef.current.offsetWidth,
            height: videoRef.current.offsetHeight
          };

          const resizedDetection = faceapi.resizeResults(detection, displaySize);
          
          // Clear only the necessary area
          const box = resizedDetection.detection.box;
          context.clearRect(box.x - 5, box.y - 5, box.width + 10, box.height + 10);

          // Batch drawing operations
          context.beginPath();
          context.strokeStyle = 'rgba(0, 255, 0, 0.5)';
          context.lineWidth = 1;

          // Draw landmarks in a single path
          const landmarks = resizedDetection.landmarks.positions;
          context.moveTo(landmarks[0].x, landmarks[0].y);
          landmarks.forEach(point => {
            context.lineTo(point.x, point.y);
          });
          context.stroke();
        }
      } catch (error) {
        console.error('Error drawing face mesh:', error);
      }

      animationRef.current = requestAnimationFrame(drawMesh);
    };

    updateCanvasSize();
    const resizeObserver = new ResizeObserver(updateCanvasSize);
    resizeObserver.observe(videoRef.current);

    drawMesh(performance.now());

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      resizeObserver.disconnect();
    };
  }, [videoRef, isEnabled]);

  if (!isEnabled) return null;

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full pointer-events-none"
      style={{ 
        zIndex: 10,
        cursor: 'none' // Hide default cursor
      }}
    />
  );
}
