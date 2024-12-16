import { mouseController } from './mouseController.js';

const EYE_CONSTANTS = {
  BLINK_THRESHOLD: 0.25, // Adjusted for better sensitivity
  BLINK_COOLDOWN: 500,
  SMOOTHING_FACTOR: 0.3,
  CALIBRATION_SAMPLES: 30
};

class EyeTracker {
  constructor() {
    this.lastBlinkTime = 0;
    this.isTracking = false;
    this.calibrationData = {
      samples: [],
      isCalibrated: false
    };
  }

  start() {
    this.isTracking = true;
    this.startCalibration();
    mouseController.enable();
  }

  stop() {
    this.isTracking = false;
    mouseController.disable();
  }

  startCalibration() {
    this.calibrationData.samples = [];
    this.calibrationData.isCalibrated = false;
  }

  processEyeTracking(landmarks) {
    if (!this.isTracking) return;

    const leftEye = this.getEyePoints(landmarks, 'left');
    const rightEye = this.getEyePoints(landmarks, 'right');
    
    if (!this.calibrationData.isCalibrated) {
      this.collectCalibrationData(leftEye, rightEye);
      return;
    }
    
    this.processBlinking(leftEye, rightEye);
    this.processEyeMovement(leftEye, rightEye);
  }

  collectCalibrationData(leftEye, rightEye) {
    const leftCenter = this.calculateEyeCenter(leftEye);
    const rightCenter = this.calculateEyeCenter(rightEye);
    
    this.calibrationData.samples.push({
      left: leftCenter,
      right: rightCenter
    });

    if (this.calibrationData.samples.length >= EYE_CONSTANTS.CALIBRATION_SAMPLES) {
      this.finishCalibration();
    }
  }

  finishCalibration() {
    // Calculate average eye positions for calibration
    const avgPositions = this.calibrationData.samples.reduce((acc, sample) => {
      return {
        left: {
          x: acc.left.x + sample.left.x,
          y: acc.left.y + sample.left.y
        },
        right: {
          x: acc.right.x + sample.right.x,
          y: acc.right.y + sample.right.y
        }
      };
    }, { left: { x: 0, y: 0 }, right: { x: 0, y: 0 } });

    const count = this.calibrationData.samples.length;
    this.calibrationData.baseline = {
      left: {
        x: avgPositions.left.x / count,
        y: avgPositions.left.y / count
      },
      right: {
        x: avgPositions.right.x / count,
        y: avgPositions.right.y / count
      }
    };

    this.calibrationData.isCalibrated = true;
  }

  // Rest of the methods remain the same...
  [Previous methods from eyeTracker.js remain unchanged]
}

export const eyeTracker = new EyeTracker();