import * as faceapi from 'face-api.js';
import { setupCamera } from '../utils/cameraUtils.js';
import { updateEmotionMetrics } from '../ui/emotionDisplay.js';
import { eyeTracker } from './eyeTracker.js';
import { MODEL_PATHS, MODEL_OPTIONS } from '../config/modelPaths.js';

class TrackingManager {
  constructor() {
    this.isTracking = false;
    this.videoElement = null;
    this.canvas = null;
  }

  async initialize() {
    try {
      this.videoElement = document.getElementById('video');
      this.canvas = document.getElementById('overlay');
      
      await this.loadModels();
      await setupCamera(this.videoElement);
      
      return true;
    } catch (error) {
      console.error('Initialization error:', error);
      throw error;
    }
  }

  async loadModels() {
    try {
      const modelLoadPromises = [
        faceapi.nets.tinyFaceDetector.load(MODEL_PATHS.tinyFaceDetector),
        faceapi.nets.faceLandmark68Net.load(MODEL_PATHS.faceLandmark68),
        faceapi.nets.faceExpressionNet.load(MODEL_PATHS.faceExpression)
      ];

      await Promise.all(modelLoadPromises);
    } catch (error) {
      console.error('Error loading models:', error);
      throw new Error('Failed to load face detection models');
    }
  }

  start() {
    if (this.isTracking) return;
    
    this.isTracking = true;
    eyeTracker.start();
    requestAnimationFrame(() => this.track());
  }

  stop() {
    this.isTracking = false;
    eyeTracker.stop();
  }

  async track() {
    if (!this.isTracking) return;

    try {
      const detectorOptions = new faceapi.TinyFaceDetectorOptions(MODEL_OPTIONS.tinyFaceDetector);
      
      const detections = await faceapi
        .detectSingleFace(this.videoElement, detectorOptions)
        .withFaceLandmarks()
        .withFaceExpressions();

      if (!detections) {
        requestAnimationFrame(() => this.track());
        return;
      }

      const displaySize = { 
        width: this.videoElement.width, 
        height: this.videoElement.height 
      };
      
      const resizedDetection = faceapi.resizeResults(detections, displaySize);
      
      const ctx = this.canvas.getContext('2d');
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      // Update emotion metrics
      updateEmotionMetrics(resizedDetection.expressions);
      
      // Process eye tracking
      eyeTracker.processEyeTracking(resizedDetection.landmarks.positions);
      
      // Draw face landmarks
      faceapi.draw.drawFaceLandmarks(this.canvas, resizedDetection);

      requestAnimationFrame(() => this.track());
    } catch (error) {
      console.error('Tracking error:', error);
      this.stop();
    }
  }
}

export const trackingManager = new TrackingManager();