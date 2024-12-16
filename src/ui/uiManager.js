import { trackingManager } from '../tracking/trackingManager.js';
import { AccessibilityController } from '../utils/accessibilityUtils.js';

export function setupUI() {
  const startButton = document.getElementById('startButton');
  const statusElement = document.getElementById('status');
  let isTracking = false;
  
  // Initialize accessibility features
  new AccessibilityController();
  
  startButton.addEventListener('click', async () => {
    try {
      if (!isTracking) {
        await requestPermissions();
        trackingManager.start();
        isTracking = true;
        startButton.textContent = 'Stop Tracking';
        statusElement.textContent = 'Tracking active';
      } else {
        trackingManager.stop();
        isTracking = false;
        startButton.textContent = 'Start Tracking';
        statusElement.textContent = 'Tracking stopped';
      }
    } catch (error) {
      console.error('Error:', error);
      statusElement.textContent = error.message;
    }
  });
}

async function requestPermissions() {
  try {
    // Request camera permission
    await navigator.mediaDevices.getUserMedia({ video: true });
    return true;
  } catch (error) {
    console.error('Permission error:', error);
    throw new Error('Camera access denied');
  }
}