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
        canvas.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw face detection box
        faceapi.draw.drawDetections(canvas, resizedDetections);
        
        // Draw face landmarks
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
        
        // Draw expressions
        if (resizedDetections.expressions) {
          const expressions = resizedDetections.expressions;
          const maxExpression = Object.entries(expressions).reduce((a, b) => 
            expressions[a] > expressions[b] ? a : b
          )[0];
          
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.font = '16px Arial';
            ctx.fillStyle = 'white';
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 3;
            ctx.strokeText(maxExpression, 10, 30);
            ctx.fillText(maxExpression, 10, 30);
          }
        }
      }

      requestAnimationFrame(drawDetections);
    };

    drawDetections();
  }, [videoRef]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full"
    />
  );
}