import { mouseController } from './mouseController.js';
import { showWarning } from '../utils/notificationUtils.js';

const EYE_CONSTANTS = {
  BLINK_THRESHOLD: 0.25,
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
      isCalibrated: false,
      baseline: null
    };
  }

  start() {
    this.isTracking = true;
    this.startCalibration();
    mouseController.enable();
    console.log('Eye tracker started');
  }

  stop() {
    this.isTracking = false;
    mouseController.disable();
    console.log('Eye tracker stopped');
  }

  startCalibration() {
    this.calibrationData = {
      samples: [],
      isCalibrated: false,
      baseline: null
    };
    showWarning('Calibration in progress. Please look at the center of the screen.');
  }

  processEyeTracking(landmarks) {
    if (!this.isTracking || !landmarks) return;

    const leftEye = this.getEyePoints(landmarks, 36, 41);
    const rightEye = this.getEyePoints(landmarks, 42, 47);

    if (!this.calibrationData.isCalibrated) {
      this.collectCalibrationData(leftEye, rightEye);
      return;
    }

    const eyeState = this.processEyeState(leftEye, rightEye);
    this.updateMouseControl(eyeState);
  }

  getEyePoints(landmarks, startIndex, endIndex) {
    return landmarks.slice(startIndex, endIndex + 1);
  }

  collectCalibrationData(leftEye, rightEye) {
    if (this.calibrationData.samples.length >= EYE_CONSTANTS.CALIBRATION_SAMPLES) {
      this.finishCalibration();
      return;
    }

    const sample = {
      left: this.calculateEyeCenter(leftEye),
      right: this.calculateEyeCenter(rightEye)
    };

    this.calibrationData.samples.push(sample);
  }

  calculateEyeCenter(eyePoints) {
    const sum = eyePoints.reduce((acc, point) => ({
      x: acc.x + point.x,
      y: acc.y + point.y
    }), { x: 0, y: 0 });

    return {
      x: sum.x / eyePoints.length,
      y: sum.y / eyePoints.length
    };
  }

  processEyeState(leftEye, rightEye) {
    const leftClosed = this.isEyeClosed(leftEye);
    const rightClosed = this.isEyeClosed(rightEye);
    const center = this.calculateGazePosition(leftEye, rightEye);

    return { leftClosed, rightClosed, center };
  }

  isEyeClosed(eyePoints) {
    const height = this.getEyeHeight(eyePoints);
    const width = this.getEyeWidth(eyePoints);
    const ratio = height / width;
    return ratio < EYE_CONSTANTS.BLINK_THRESHOLD;
  }

  getEyeHeight(points) {
    const top = Math.min(...points.map(p => p.y));
    const bottom = Math.max(...points.map(p => p.y));
    return bottom - top;
  }

  getEyeWidth(points) {
    const left = Math.min(...points.map(p => p.x));
    const right = Math.max(...points.map(p => p.x));
    return right - left;
  }

  calculateGazePosition(leftEye, rightEye) {
    const leftCenter = this.calculateEyeCenter(leftEye);
    const rightCenter = this.calculateEyeCenter(rightEye);

    return {
      x: (leftCenter.x + rightCenter.x) / 2,
      y: (leftCenter.y + rightCenter.y) / 2
    };
  }

  updateMouseControl(eyeState) {
    if (eyeState.leftClosed && eyeState.rightClosed) {
      const now = Date.now();
      if (now - this.lastBlinkTime > EYE_CONSTANTS.BLINK_COOLDOWN) {
        this.lastBlinkTime = now;
        mouseController.click();
      }
    } else {
      mouseController.updatePosition(eyeState.center.x, eyeState.center.y);
    }
  }

  finishCalibration() {
    const avgPosition = this.calculateAveragePosition();
    this.calibrationData.baseline = avgPosition;
    this.calibrationData.isCalibrated = true;
    showWarning('Calibration complete. You can now control the mouse with your eyes.');
  }

  calculateAveragePosition() {
    const sum = this.calibrationData.samples.reduce((acc, sample) => ({
      left: {
        x: acc.left.x + sample.left.x,
        y: acc.left.y + sample.left.y
      },
      right: {
        x: acc.right.x + sample.right.x,
        y: acc.right.y + sample.right.y
      }
    }), { left: { x: 0, y: 0 }, right: { x: 0, y: 0 } });

    const count = this.calibrationData.samples.length;
    return {
      left: {
        x: sum.left.x / count,
        y: sum.left.y / count
      },
      right: {
        x: sum.right.x / count,
        y: sum.right.y / count
      }
    };
  }
}

export const eyeTracker = new EyeTracker();