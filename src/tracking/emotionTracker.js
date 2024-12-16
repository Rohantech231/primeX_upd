import { EMOTION_THRESHOLD } from '../config/constants.js';

export function processEmotions(expressions) {
  // Normalize and threshold emotions
  const emotions = {
    happiness: normalizeEmotion(expressions.happy),
    sadness: normalizeEmotion(expressions.sad),
    anger: normalizeEmotion(expressions.angry)
  };

  return emotions;
}

function normalizeEmotion(value) {
  // Convert to percentage and ensure it's between 0-100
  return Math.min(Math.round(value * 100), 100);
}