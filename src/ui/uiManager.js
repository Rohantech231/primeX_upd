export function setupUI() {
  const startButton = document.getElementById('startButton');
  const statusElement = document.getElementById('status');
  
  startButton.addEventListener('click', async () => {
    try {
      await requestPermissions();
      startTracking();
      startButton.textContent = 'Stop Tracking';
      statusElement.textContent = 'Tracking active';
    } catch (error) {
      console.error('Permission error:', error);
      statusElement.textContent = 'Error: Could not access camera';
    }
  });
  
  // Listen for eye tracking events
  document.addEventListener('eyeClick', handleEyeClick);
  document.addEventListener('eyeMove', handleEyeMove);
}

async function requestPermissions() {
  try {
    await navigator.mediaDevices.getUserMedia({ video: true });
    return true;
  } catch (error) {
    console.error('Camera permission denied:', error);
    throw new Error('Camera access denied');
  }
}

function handleEyeClick(event) {
  // Handle eye blink click events
  console.log('Eye click detected:', event.detail);
}

function handleEyeMove(event) {
  // Handle eye movement events
  console.log('Eye movement detected:', event.detail);
}