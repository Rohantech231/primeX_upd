import * as faceapi from 'face-api.js';
import { setupCamera } from '../utils/cameraUtils.js';
import { updateEmotionMetrics } from '../ui/emotionDisplay.js';
import { handleEyeTracking } from './eyeTracker.js';

let isTracking = false;
let videoElement;
let canvas;

export async function initializeTracking() {
  await Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
    faceapi.nets.faceExpressionNet.loadFromUri('/models')
  ]);
  
  videoElement = document.getElementById('video');
  canvas = document.getElementById('overlay');
  
  await setupCamera(videoElement);
}

export function startTracking() {
  if (isTracking) return;
  isTracking = true;
  
  requestAnimationFrame(track);
}

export function stopTracking() {
  isTracking = false;
}

async function track() {
  if (!isTracking) return;
  
  const detections = await faceapi
    .detectAllFaces(videoElement, new faceapi.TinyFaceDetectorOptions())
    .withFaceLandmarks()
    .withFaceExpressions();
    
  const displaySize = { width: videoElement.width, height: videoElement.height };
  faceapi.matchDimensions(canvas, displaySize);
  
  const resizedDetections = faceapi.resizeResults(detections, displaySize);
  
  canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
  
  if (resizedDetections.length > 0) {
    const detection = resizedDetections[0];
    
    // Update emotion metrics
    updateEmotionMetrics(detection.expressions);
    
    // Handle eye tracking and mouse control
    handleEyeTracking(detection.landmarks.positions);
    
    // Draw face landmarks
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
  }
  
  requestAnimationFrame(track);
}