import * as faceapi from 'face-api.js';
import { EMOTION_THRESHOLD } from '../config/constants.js';

export class EmotionDetector {
  constructor() {
    this.detectionOptions = new faceapi.TinyFaceDetectorOptions({
      inputSize: 224,
      scoreThreshold: 0.5
    });
  }

  async detectEmotions(videoElement) {
    try {
      const detection = await faceapi
        .detectSingleFace(videoElement, this.detectionOptions)
        .withFaceExpressions();

      if (detection) {
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
    return Math.min(Math.round(value * 100), 100);
  }
}