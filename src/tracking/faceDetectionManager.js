import * as faceapi from 'face-api.js';
import { MODEL_OPTIONS } from '../config/modelPaths.js';

export class FaceDetectionManager {
  constructor() {
    this.detectorOptions = new faceapi.TinyFaceDetectorOptions(MODEL_OPTIONS.tinyFaceDetector);
  }

  async detectFace(videoElement) {
    return await faceapi
      .detectSingleFace(videoElement, this.detectorOptions)
      .withFaceLandmarks()
      .withFaceExpressions();
  }
}