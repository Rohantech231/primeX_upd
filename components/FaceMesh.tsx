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
      
      // Get the actual dimensions of the video element
      const displaySize = {
        width: videoRef.current.offsetWidth,
        height: videoRef.current.offsetHeight
      };

      // Set canvas size to match video dimensions
      canvasRef.current.width = displaySize.width;
      canvasRef.current.height = displaySize.height;

      // Match dimensions for face-api
      faceapi.matchDimensions(canvas, displaySize);
    };

    const drawMesh = async () => {
      if (!videoRef.current || !canvasRef.current || !context) return;

      try {
        // Detect face with landmarks
        const detection = await faceapi
          .detectSingleFace(
            videoRef.current,
            new faceapi.TinyFaceDetectorOptions({
              inputSize: 224,
              scoreThreshold: 0.5
            })
          )
          .withFaceLandmarks();

        if (detection) {
          // Get the dimensions of the video element
          const displaySize = {
            width: videoRef.current.offsetWidth,
            height: videoRef.current.offsetHeight
          };

          // Resize detection to match display size
          const resizedDetection = faceapi.resizeResults(detection, displaySize);

          // Clear previous drawing
          context.clearRect(0, 0, canvas.width, canvas.height);

          // Set drawing styles
          context.strokeStyle = '#00ff00';
          context.lineWidth = 2;
          context.fillStyle = 'rgba(0, 255, 0, 0.1)';

          // Draw face outline
          const jawOutline = resizedDetection.landmarks.getJawOutline();
          context.beginPath();
          context.moveTo(jawOutline[0].x, jawOutline[0].y);
          jawOutline.forEach((point) => {
            context.lineTo(point.x, point.y);
          });
          context.closePath();
          context.stroke();
          context.fill();

          // Draw eyes
          const leftEye = resizedDetection.landmarks.getLeftEye();
          const rightEye = resizedDetection.landmarks.getRightEye();

          [leftEye, rightEye].forEach(eye => {
            context.beginPath();
            context.moveTo(eye[0].x, eye[0].y);
            eye.forEach((point) => {
              context.lineTo(point.x, point.y);
            });
            context.closePath();
            context.stroke();
            context.fill();
          });

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
          context.fill();
        }
      } catch (error) {
        console.error('Error drawing face mesh:', error);
      }

      // Request next frame
      animationRef.current = requestAnimationFrame(drawMesh);
    };

    // Initial setup
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

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
