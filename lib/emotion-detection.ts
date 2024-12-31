'use client';

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
    try {
      await loadModels();
      isModelLoaded = true;
      console.log('Face detection initialized successfully');
    } catch (error) {
      console.error('Failed to initialize face detection:', error);
      throw error;
    }
  }
}

export async function detectEmotions(video: HTMLVideoElement): Promise<EmotionData | null> {
  if (!isModelLoaded) {
    await initializeDetection();
  }

  try {
    // Ensure video is playing and has enough data
    if (video.readyState !== video.HAVE_ENOUGH_DATA) {
      return null;
    }

    const detection = await faceapi
      .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions({ inputSize: 224 }))
      .withFaceLandmarks()
      .withFaceExpressions();

    if (!detection) {
      return null;
    }

    const { expressions } = detection;
    
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