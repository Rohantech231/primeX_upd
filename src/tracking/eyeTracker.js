import { TRACKING_CONFIG } from '../config/constants.js';
import { simulateMouseClick, updateMousePosition } from './mouseController.js';

let lastBlinkTime = 0;

export function processEyeTracking(landmarks) {
  const leftEye = getEyePoints(landmarks, 'left');
  const rightEye = getEyePoints(landmarks, 'right');
  
  const leftEyeOpen = calculateEyeOpenness(leftEye);
  const rightEyeOpen = calculateEyeOpenness(rightEye);
  
  checkForBlink(leftEyeOpen, rightEyeOpen);
  trackEyeMovement(leftEye, rightEye);
}

function getEyePoints(landmarks, side) {
  const indices = side === 'left' ? 
    [36, 37, 38, 39, 40, 41] : 
    [42, 43, 44, 45, 46, 47];
  return indices.map(i => landmarks[i]);
}

function calculateEyeOpenness(eyePoints) {
  const topMid = getMidpoint(eyePoints[1], eyePoints[2]);
  const bottomMid = getMidpoint(eyePoints[4], eyePoints[5]);
  const height = getDistance(topMid, bottomMid);
  const width = getDistance(eyePoints[0], eyePoints[3]);
  return height / width;
}

function checkForBlink(leftEyeOpen, rightEyeOpen) {
  const now = Date.now();
  const averageOpenness = (leftEyeOpen + rightEyeOpen) / 2;
  
  if (averageOpenness < TRACKING_CONFIG.BLINK_THRESHOLD && 
      now - lastBlinkTime > TRACKING_CONFIG.BLINK_COOLDOWN) {
    simulateMouseClick();
    lastBlinkTime = now;
  }
}

function trackEyeMovement(leftEye, rightEye) {
  const leftCenter = getEyeCenter(leftEye);
  const rightCenter = getEyeCenter(rightEye);
  const eyeCenter = getMidpoint(leftCenter, rightCenter);
  
  // Normalize coordinates
  const x = eyeCenter.x / window.innerWidth;
  const y = eyeCenter.y / window.innerHeight;
  
  updateMousePosition(x, y);
}

function getEyeCenter(eyePoints) {
  const sumX = eyePoints.reduce((sum, p) => sum + p.x, 0);
  const sumY = eyePoints.reduce((sum, p) => sum + p.y, 0);
  return {
    x: sumX / eyePoints.length,
    y: sumY / eyePoints.length
  };
}

function getMidpoint(p1, p2) {
  return {
    x: (p1.x + p2.x) / 2,
    y: (p1.y + p2.y) / 2
  };
}

function getDistance(p1, p2) {
  return Math.sqrt(
    Math.pow(p2.x - p1.x, 2) + 
    Math.pow(p2.y - p1.y, 2)
  );
}