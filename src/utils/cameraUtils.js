import { TRACKING_CONFIG } from '../config/constants.js';

export async function setupCamera(videoElement) {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    throw new Error('Camera API not available in this browser');
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: TRACKING_CONFIG.VIDEO_CONSTRAINTS
    });

    videoElement.srcObject = stream;

    return new Promise((resolve, reject) => {
      videoElement.onloadedmetadata = () => {
        videoElement.width = videoElement.videoWidth;
        videoElement.height = videoElement.videoHeight;
        resolve(videoElement);
      };
      
      videoElement.onerror = () => {
        reject(new Error('Video element error'));
      };
    });
  } catch (error) {
    console.error('Camera access error:', error);
    throw new Error('Could not access camera. Please ensure camera permissions are granted.');
  }
}