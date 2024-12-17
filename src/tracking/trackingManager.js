import * as faceapi from 'face-api.js';
import { setupCamera } from '../utils/cameraUtils.js';
import { updateEmotionMetrics } from '../ui/emotionDisplay.js';
import { eyeTracker } from './eyeTracker.js';
import { MODEL_OPTIONS } from '../config/modelPaths.js';
import { modelLoader } from '../config/modelLoader.js';

class TrackingManager {
  constructor() {
    this.isTracking = false;
    this.videoElement = null;
    this.canvas = null;
  }

  async initialize() {
    try {
      // Get DOM elements
      this.videoElement = document.getElementById('video');
      this.canvas = document.getElementById('overlay');
      
      if (!this.videoElement || !this.canvas) {
        throw new Error('Required video or canvas elements not found');
      }

      // Load models first
      await modelLoader.loadModels();
      
      // Setup camera after models are loaded
      await setupCamera(this.videoElement);
      
      // Set canvas dimensions to match video
      this.canvas.width = this.videoElement.width;
      this.canvas.height = this.videoElement.height;
      
      return true;
    } catch (error) {
      console.error('Initialization error:', error);
      throw new Error(`Failed to initialize tracking: ${error.message}`);
    }
  }

  start() {
    if (this.isTracking) return;
    
    this.isTracking = true;
    eyeTracker.start();
    this.track();
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

      if (detections) {
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
      }

      requestAnimationFrame(() => this.track());
    } catch (error) {
      console.error('Tracking error:', error);
      this.stop();
      throw new Error('Tracking failed. Please refresh the page and try again.');
    }
  }
}

export const trackingManager = new TrackingManager();