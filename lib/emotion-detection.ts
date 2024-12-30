'use client';

import * as tf from '@tensorflow/tfjs';
import * as faceapi from 'face-api.js';
import { loadModels } from './model-loader';

export type EmotionData = {
  happiness: number;
  sadness: number;
  anger: number;
  timestamp: number;
};

let isModelLoaded = false;

export async function initializeDetection() {
  if (!isModelLoaded) {
    await tf.ready();
    await loadModels();
    isModelLoaded = true;
  }
}

export async function detectEmotions(video: HTMLVideoElement): Promise<EmotionData | null> {
  try {
    if (!isModelLoaded) {
      await initializeDetection();
    }

    const detections = await faceapi
      .detectSingleFace(video)
      .withFaceLandmarks()
      .withFaceExpressions();

    if (!detections) {
      return null;
    }

    const { expressions } = detections;

    return {
      happiness: expressions.happy,
      sadness: expressions.sad,
      anger: expressions.angry,
      timestamp: Date.now(),
    };
  } catch (error) {
    console.error('Error detecting emotions:', error);
    return null;
  }
}