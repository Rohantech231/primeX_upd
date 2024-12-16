import * as faceapi from 'face-api.js';
import { setupCamera } from '../utils/cameraUtils.js';
import { updateEmotionMetrics } from '../ui/emotionDisplay.js';
import { processEyeTracking } from './eyeTracker.js';
import { processEmotions } from './emotionTracker.js';
import { MODELS_PATH } from '../config/constants.js';

let isTracking = false;
let videoElement;
let canvas;
let lastEmotionUpdate = 0;

export async function initializeTracking() {
  try {
    await loadModels();
    
    videoElement = document.getElementById('video');
    canvas = document.getElementById('overlay');
    
    return true;
  } catch (error) {
    console.error('Error initializing tracking:', error);
    throw error;
  }
}

async function loadModels() {
  try {
    await Promise.all([
      faceapi.nets.tinyFaceDetector.load(MODELS_PATH),
      faceapi.nets.faceLandmark68Net.load(MODELS_PATH),
      faceapi.nets.faceExpressionNet.load(MODELS_PATH)
    ]);
  } catch (error) {
    console.error('Error loading models:', error);
    throw new Error('Failed to load face detection models');
  }
}

export async function startTracking() {
  if (isTracking) return;
  
  try {
    await setupCamera(videoElement);
    isTracking = true;
    requestAnimationFrame(track);
    return true;
  } catch (error) {
    console.error('Error starting tracking:', error);
    throw error;
  }
}

export function stopTracking() {
  isTracking = false;
  if (videoElement && videoElement.srcObject) {
    const tracks = videoElement.srcObject.getTracks();
    tracks.forEach(track => track.stop());
    videoElement.srcObject = null;
  }
}

async function track() {
  if (!isTracking) return;
  
  try {
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
      
      // Process emotions with rate limiting
      const now = Date.now();
      if (now - lastEmotionUpdate > 100) { // Update every 100ms
        const emotions = processEmotions(detection.expressions);
        updateEmotionMetrics(emotions);
        lastEmotionUpdate = now;
      }
      
      // Process eye tracking
      processEyeTracking(detection.landmarks.positions);
      
      // Draw face landmarks
      faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
    }
    
    requestAnimationFrame(track);
  } catch (error) {
    console.error('Error during tracking:', error);
    stopTracking();
  }
}