import { TRACKING_CONFIG } from '../config/constants.js';
import { showError, showSuccess } from './notificationUtils.js';

export async function setupCamera(videoElement) {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    throw new Error('Camera API not available in this browser');
  }

  try {
    // First check if camera permission is granted
    const permission = await checkCameraPermission();
    if (!permission) {
      throw new Error('Camera permission denied');
    }

    // Get the video stream
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        ...TRACKING_CONFIG.VIDEO_CONSTRAINTS,
        facingMode: 'user',
        width: { min: 640, ideal: 1280, max: 1920 },
        height: { min: 480, ideal: 720, max: 1080 }
      }
    });

    // Attach stream to video element
    videoElement.srcObject = stream;
    
    // Wait for video to be ready
    await waitForVideoReady(videoElement);
    
    // Set video dimensions
    setVideoDimensions(videoElement);
    
    showSuccess('Camera initialized successfully');
    return videoElement;
  } catch (error) {
    console.error('Camera setup error:', error);
    showError(getCameraErrorMessage(error));
    throw error;
  }
}

async function checkCameraPermission() {
  try {
    const result = await navigator.permissions.query({ name: 'camera' });
    return result.state === 'granted';
  } catch (error) {
    // If permissions API is not supported, we'll try getUserMedia directly
    return true;
  }
}

function waitForVideoReady(videoElement) {
  return new Promise((resolve, reject) => {
    videoElement.onloadedmetadata = () => {
      videoElement.play()
        .then(() => resolve())
        .catch(reject);
    };
    videoElement.onerror = () => reject(new Error('Video element error'));
  });
}

function setVideoDimensions(videoElement) {
  // Set video dimensions based on the actual stream
  const aspectRatio = videoElement.videoWidth / videoElement.videoHeight;
  const width = Math.min(640, videoElement.videoWidth);
  const height = width / aspectRatio;

  videoElement.width = width;
  videoElement.height = height;
}

function getCameraErrorMessage(error) {
  switch (error.name) {
    case 'NotFoundError':
      return 'No camera found. Please connect a camera and try again.';
    case 'NotAllowedError':
    case 'PermissionDeniedError':
      return 'Camera access denied. Please grant camera permissions to use this feature.';
    case 'NotReadableError':
      return 'Camera is in use by another application. Please close other apps using the camera.';
    case 'OverconstrainedError':
      return 'Camera does not meet the required constraints. Please try a different camera.';
    case 'AbortError':
      return 'Camera access was aborted. Please try again.';
    default:
      return `Camera error: ${error.message}`;
  }
}