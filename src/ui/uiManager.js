import { trackingManager } from '../tracking/trackingManager.js';
import { AccessibilityController } from '../utils/accessibilityUtils.js';
import { showError, showSuccess } from '../utils/notificationUtils.js';

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
        await trackingManager.start();
        isTracking = true;
        startButton.textContent = 'Stop Tracking';
        statusElement.textContent = 'Tracking active';
        showSuccess('Tracking started successfully');
      } else {
        trackingManager.stop();
        isTracking = false;
        startButton.textContent = 'Start Tracking';
        statusElement.textContent = 'Tracking stopped';
        showSuccess('Tracking stopped');
      }
    } catch (error) {
      console.error('Error:', error);
      statusElement.textContent = error.message;
      showError(error.message);
    }
  });
}

async function requestPermissions() {
  try {
    // Request camera permission
    await navigator.mediaDevices.getUserMedia({ 
      video: true,
      audio: true // Also request audio for voice commands
    });
    
    // Request notification permission
    if (Notification.permission !== 'granted') {
      await Notification.requestPermission();
    }
    
    return true;
  } catch (error) {
    console.error('Permission error:', error);
    throw new Error('Required permissions were denied. Please grant camera and microphone access.');
  }
}