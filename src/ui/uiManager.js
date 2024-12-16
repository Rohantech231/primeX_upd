import { startTracking, stopTracking } from '../tracking/trackingManager.js';

export function setupUI() {
  const startButton = document.getElementById('startButton');
  const statusElement = document.getElementById('status');
  let isTracking = false;
  
  startButton.addEventListener('click', async () => {
    try {
      if (!isTracking) {
        await startTracking();
        isTracking = true;
        startButton.textContent = 'Stop Tracking';
        statusElement.textContent = 'Tracking active';
      } else {
        stopTracking();
        isTracking = false;
        startButton.textContent = 'Start Tracking';
        statusElement.textContent = 'Tracking stopped';
      }
    } catch (error) {
      console.error('Tracking error:', error);
      statusElement.textContent = error.message;
      startButton.textContent = 'Start Tracking';
      isTracking = false;
    }
  });
  
  setupEventListeners();
}

function setupEventListeners() {
  document.addEventListener('eyeClick', handleEyeClick);
  document.addEventListener('eyeMove', handleEyeMove);
}

function handleEyeClick(event) {
  const { timestamp } = event.detail;
  console.log('Eye click detected:', timestamp);
  // Implement click handling logic here
}

function handleEyeMove(event) {
  const { x, y, timestamp } = event.detail;
  console.log('Eye movement detected:', { x, y, timestamp });
  // Implement mouse movement logic here
}