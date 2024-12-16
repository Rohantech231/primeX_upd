import { initializeTracking } from './tracking/trackingManager.js';
import { setupUI } from './ui/uiManager.js';

document.addEventListener('DOMContentLoaded', async () => {
  const startButton = document.getElementById('startButton');
  const statusElement = document.getElementById('status');
  
  try {
    await initializeTracking();
    startButton.disabled = false;
    statusElement.textContent = 'Ready to start tracking';
  } catch (error) {
    console.error('Initialization error:', error);
    statusElement.textContent = 'Error initializing tracking: ' + error.message;
  }
  
  setupUI();
});