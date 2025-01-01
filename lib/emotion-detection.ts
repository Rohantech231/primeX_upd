'use client';

import * as faceapi from 'face-api.js';
import { loadModels } from './model-loader';

export type EmotionData = {
  happiness: number;
  sadness: number;
  anger: number;
  timestamp: number;
};

let isInitialized = false;

export async function initializeDetection() {
  if (!isInitialized) {
    try {
      await loadModels();
      isInitialized = true;
      console.log('Face detection initialized successfully');
    } catch (error) {
      console.error('Failed to initialize face detection:', error);
      throw error;
    }
  }
}

export async function detectEmotions(video: HTMLVideoElement): Promise<EmotionData | null> {
  if (!isInitialized) {
    await initializeDetection();
  }

  try {
    const options = new faceapi.TinyFaceDetectorOptions({ 
      inputSize: 224,  // Reduced for better performance
      scoreThreshold: 0.2  // Lower threshold for better detection
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
      happiness: expressions.happy || 0,
      sadness: expressions.sad || 0,
      anger: expressions.angry || 0,
      timestamp: Date.now(),
    };
  } catch (error) {
    console.error('Error detecting emotions:', error);
    return null;
  }
}