import { EmotionDetector } from './emotionDetector.js';
import { VoiceCommandManager } from './voiceCommandManager.js';
import { modelLoader } from '../config/modelLoader.js';
import { setupCamera } from '../utils/cameraUtils.js';
import { updateEmotionMetrics } from '../ui/emotionDisplay.js';
import { showError, showSuccess, showWarning } from '../utils/notificationUtils.js';

class TrackingManager {
  constructor() {
    this.isTracking = false;
    this.videoElement = null;
    this.emotionDetector = null;
    this.voiceCommandManager = null;
  }

  async initialize() {
    try {
      showWarning('Initializing system...');
      
      // Get video element
      this.videoElement = document.getElementById('video');
      if (!this.videoElement) {
        throw new Error('Video element not found');
      }

      // Load models
      await modelLoader.loadModels();
      
      // Setup camera
      await setupCamera(this.videoElement);
      
      // Initialize components
      this.emotionDetector = new EmotionDetector();
      this.voiceCommandManager = new VoiceCommandManager();
      
      showSuccess('System initialized successfully');
      return true;
    } catch (error) {
      showError(`Initialization failed: ${error.message}`);
      throw error;
    }
  }

  async start() {
    if (this.isTracking) return;
    
    try {
      this.isTracking = true;
      this.voiceCommandManager.start();
      this.track();
      showSuccess('Tracking started');
    } catch (error) {
      this.stop();
      showError(`Failed to start tracking: ${error.message}`);
    }
  }

  stop() {
    if (!this.isTracking) return;
    
    this.isTracking = false;
    this.voiceCommandManager.stop();
    showSuccess('Tracking stopped');
  }

  async track() {
    if (!this.isTracking) return;

    try {
      const emotions = await this.emotionDetector.detectEmotions(this.videoElement);
      if (emotions) {
        updateEmotionMetrics(emotions);
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