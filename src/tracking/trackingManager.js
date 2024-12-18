import * as faceapi from 'face-api.js';
import { setupCamera } from '../utils/cameraUtils.js';
import { updateEmotionMetrics } from '../ui/emotionDisplay.js';
import { eyeTracker } from './eyeTracker.js';
import { modelLoader } from '../config/modelLoader.js';
import { showError, showSuccess, showWarning } from '../utils/notificationUtils.js';
import { FaceDetectionManager } from './faceDetectionManager.js';
import { CanvasManager } from './canvasManager.js';

class TrackingManager {
  constructor() {
    this.isTracking = false;
    this.videoElement = null;
    this.canvas = null;
    this.stream = null;
    this.initializationAttempts = 0;
    this.maxInitAttempts = 3;
    this.faceDetectionManager = null;
    this.canvasManager = null;
  }

  async initialize() {
    try {
      if (this.initializationAttempts >= this.maxInitAttempts) {
        throw new Error('Maximum initialization attempts reached. Please refresh the page.');
      }

      this.initializationAttempts++;
      showWarning('Initializing tracking system...');

      // Get DOM elements
      this.videoElement = document.getElementById('video');
      this.canvas = document.getElementById('overlay');
      
      if (!this.videoElement || !this.canvas) {
        throw new Error('Required video or canvas elements not found');
      }

      // Load models first
      await modelLoader.loadModels();
      
      // Validate models after loading
      if (!await modelLoader.validateModels()) {
        throw new Error('Model validation failed. Please refresh and try again.');
      }
      
      // Setup camera after models are loaded
      await setupCamera(this.videoElement);
      
      // Initialize managers
      this.canvasManager = new CanvasManager(this.canvas, this.videoElement);
      this.faceDetectionManager = new FaceDetectionManager();
      
      showSuccess('Tracking system initialized successfully');
      return true;
    } catch (error) {
      console.error('Initialization error:', error);
      
      if (this.initializationAttempts < this.maxInitAttempts) {
        showWarning(`Initialization attempt ${this.initializationAttempts} failed. Retrying...`);
        await new Promise(resolve => setTimeout(resolve, 2000));
        return this.initialize();
      }
      
      showError(`Failed to initialize tracking: ${error.message}`);
      throw error;
    }
  }

  async start() {
    if (this.isTracking) return;
    
    try {
      if (this.videoElement.paused) {
        await this.videoElement.play();
      }
      
      this.isTracking = true;
      eyeTracker.start();
      this.track();
      showSuccess('Tracking started');
    } catch (error) {
      showError('Failed to start tracking: ' + error.message);
      throw error;
    }
  }

  stop() {
    if (!this.isTracking) return;
    
    this.isTracking = false;
    eyeTracker.stop();
    this.canvasManager.clear();
    showSuccess('Tracking stopped');
  }

  async track() {
    if (!this.isTracking) return;

    try {
      const detections = await this.faceDetectionManager.detectFace(this.videoElement);

      if (detections) {
        const displaySize = { 
          width: this.videoElement.width, 
          height: this.videoElement.height 
        };
        
        const resizedDetection = faceapi.resizeResults(detections, displaySize);
        
        // Update UI components
        this.canvasManager.clear();
        updateEmotionMetrics(resizedDetection.expressions);
        eyeTracker.processEyeTracking(resizedDetection.landmarks.positions);
        
        // Draw face landmarks
        this.canvasManager.drawFaceLandmarks(resizedDetection);
      }

      requestAnimationFrame(() => this.track());
    } catch (error) {
      console.error('Tracking error:', error);
      this.stop();
      showError('Tracking failed. Please refresh and try again.');
    }
  }
}

export const trackingManager = new TrackingManager();