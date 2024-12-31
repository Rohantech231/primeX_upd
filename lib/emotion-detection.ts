'use client';

import * as faceapi from 'face-api.js';
import { loadModels, areModelsLoaded } from './model-loader';

export type EmotionData = {
  happiness: number;
  sadness: number;
  anger: number;
  timestamp: number;
};

export async function initializeDetection() {
  if (!areModelsLoaded()) {
    try {
      await loadModels();
      console.log('Face detection initialized successfully');
    } catch (error) {
      console.error('Failed to initialize face detection:', error);
      throw error;
    }
  }
}

export async function detectEmotions(video: HTMLVideoElement): Promise<EmotionData | null> {
  if (!areModelsLoaded()) {
    await initializeDetection();
  }

  try {
    if (video.readyState !== video.HAVE_ENOUGH_DATA) {
      return null;
    }

    const options = new faceapi.TinyFaceDetectorOptions({ 
      inputSize: 512,
      scoreThreshold: 0.3
    });

    const detection = await faceapi
      .detectSingleFace(video, options)
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