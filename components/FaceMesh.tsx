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

  useEffect(() => {
    if (!isEnabled || !videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if (!context) return;

    const updateCanvasSize = () => {
      if (!videoRef.current || !canvasRef.current) return;
      const displaySize = {
        width: videoRef.current.clientWidth,
        height: videoRef.current.clientHeight
      };
      canvasRef.current.width = displaySize.width;
      canvasRef.current.height = displaySize.height;
      faceapi.matchDimensions(canvas, displaySize);
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    const drawMesh = async () => {
      if (!videoRef.current || !canvasRef.current || !context) return;

      try {
        const detection = await faceapi
          .detectSingleFace(
            videoRef.current,
            new faceapi.TinyFaceDetectorOptions({
              inputSize: 224,
              scoreThreshold: 0.3
            })
          )
          .withFaceLandmarks();

        if (detection) {
          const displaySize = {
            width: videoRef.current.clientWidth,
            height: videoRef.current.clientHeight
          };
          const resizedDetection = faceapi.resizeResults(detection, displaySize);

          // Clear previous drawing
          context.clearRect(0, 0, canvas.width, canvas.height);

          // Draw face landmarks
          context.strokeStyle = '#22c55e';
          context.lineWidth = 2;
          
          // Draw face outline
          const jawLine = resizedDetection.landmarks.getJawOutline();
          context.beginPath();
          context.moveTo(jawLine[0].x, jawLine[0].y);
          jawLine.forEach((point) => {
            context.lineTo(point.x, point.y);
          });
          context.stroke();

          // Draw eyes
          const leftEye = resizedDetection.landmarks.getLeftEye();
          const rightEye = resizedDetection.landmarks.getRightEye();
          
          context.beginPath();
          context.moveTo(leftEye[0].x, leftEye[0].y);
          leftEye.forEach((point) => {
            context.lineTo(point.x, point.y);
          });
          context.closePath();
          context.stroke();

          context.beginPath();
          context.moveTo(rightEye[0].x, rightEye[0].y);
          rightEye.forEach((point) => {
            context.lineTo(point.x, point.y);
          });
          context.closePath();
          context.stroke();

          // Draw nose
          const nose = resizedDetection.landmarks.getNose();
          context.beginPath();
          context.moveTo(nose[0].x, nose[0].y);
          nose.forEach((point) => {
            context.lineTo(point.x, point.y);
          });
          context.stroke();

          // Draw mouth
          const mouth = resizedDetection.landmarks.getMouth();
          context.beginPath();
          context.moveTo(mouth[0].x, mouth[0].y);
          mouth.forEach((point) => {
            context.lineTo(point.x, point.y);
          });
          context.closePath();
          context.stroke();
        }
      } catch (error) {
        console.error('Error drawing face mesh:', error);
      }

      // Request next frame
      animationRef.current = requestAnimationFrame(drawMesh);
    };

    // Start animation loop
    drawMesh();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', updateCanvasSize);
    };
  }, [videoRef, isEnabled]);

  if (!isEnabled) return null;

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full pointer-events-none"
      style={{ zIndex: 10 }}
    />
  );
}
