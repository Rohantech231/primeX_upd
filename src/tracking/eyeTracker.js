let lastBlinkTime = 0;
const BLINK_THRESHOLD = 0.3;
const BLINK_COOLDOWN = 500; // ms

export function handleEyeTracking(landmarks) {
  const leftEye = getEyePoints(landmarks, 'left');
  const rightEye = getEyePoints(landmarks, 'right');
  
  const leftEyeOpen = calculateEyeOpenness(leftEye);
  const rightEyeOpen = calculateEyeOpenness(rightEye);
  
  handleBlink(leftEyeOpen, rightEyeOpen);
  handleEyeMovement(leftEye, rightEye);
}

function getEyePoints(landmarks, eye) {
  const indices = eye === 'left' ? [36, 37, 38, 39, 40, 41] : [42, 43, 44, 45, 46, 47];
  return indices.map(i => landmarks[i]);
}

function calculateEyeOpenness(eyePoints) {
  const topMid = getMidpoint(eyePoints[1], eyePoints[2]);
  const bottomMid = getMidpoint(eyePoints[4], eyePoints[5]);
  const height = getDistance(topMid, bottomMid);
  const width = getDistance(eyePoints[0], eyePoints[3]);
  return height / width;
}

function handleBlink(leftEyeOpen, rightEyeOpen) {
  const now = Date.now();
  const averageOpenness = (leftEyeOpen + rightEyeOpen) / 2;
  
  if (averageOpenness < BLINK_THRESHOLD && now - lastBlinkTime > BLINK_COOLDOWN) {
    simulateClick();
    lastBlinkTime = now;
  }
}

function handleEyeMovement(leftEye, rightEye) {
  const leftCenter = getCenterPoint(leftEye);
  const rightCenter = getCenterPoint(rightEye);
  const eyeCenter = getMidpoint(leftCenter, rightCenter);
  
  // Convert eye position to screen coordinates
  const x = (eyeCenter.x / window.innerWidth) * screen.width;
  const y = (eyeCenter.y / window.innerHeight) * screen.height;
  
  updateMousePosition(x, y);
}

function getMidpoint(p1, p2) {
  return {
    x: (p1.x + p2.x) / 2,
    y: (p1.y + p2.y) / 2
  };
}

function getDistance(p1, p2) {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
}

function getCenterPoint(eyePoints) {
  const sumX = eyePoints.reduce((sum, p) => sum + p.x, 0);
  const sumY = eyePoints.reduce((sum, p) => sum + p.y, 0);
  return {
    x: sumX / eyePoints.length,
    y: sumY / eyePoints.length
  };
}

function simulateClick() {
  // Create and dispatch a custom event for click simulation
  const clickEvent = new CustomEvent('eyeClick', {
    detail: { timestamp: Date.now() }
  });
  document.dispatchEvent(clickEvent);
}

function updateMousePosition(x, y) {
  // Create and dispatch a custom event for mouse movement
  const moveEvent = new CustomEvent('eyeMove', {
    detail: { x, y, timestamp: Date.now() }
  });
  document.dispatchEvent(moveEvent);
}