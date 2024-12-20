import * as faceapi from 'face-api.js';
import { MODEL_CONFIG } from '../config/modelConfig.js';

export class EmotionDetector {
  constructor() {
    this.detectionOptions = new faceapi.TinyFaceDetectorOptions(
      MODEL_CONFIG.options.tinyFaceDetector
    );
  }

  async detectEmotions(videoElement) {
    if (!videoElement || videoElement.paused) {
      return null;
    }

    try {
      const detection = await faceapi
        .detectSingleFace(videoElement, this.detectionOptions)
        .withFaceExpressions();

      if (detection?.expressions) {
        return this.processEmotions(detection.expressions);
      }
      return null;
    } catch (error) {
      console.error('Emotion detection error:', error);
      return null;
    }
  }

  processEmotions(expressions) {
    return {
      happiness: this.normalizeEmotion(expressions.happy),
      sadness: this.normalizeEmotion(expressions.sad),
      anger: this.normalizeEmotion(expressions.angry)
    };
  }

  normalizeEmotion(value) {
    return Math.min(Math.round((value || 0) * 100), 100);
  }
}