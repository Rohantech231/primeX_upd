'use client';

import * as faceapi from 'face-api.js';
import { loadModels } from './model-loader';

export type EmotionData = {
  happiness: number;
  sadness: number;
  anger: number;
  surprise: number;
  fear: number;
  disgust: number;
  neutral: number;
  timestamp: number;
};

let isInitialized = false;
let initializationPromise: Promise<void> | null = null;

export async function initializeDetection() {
  if (isInitialized) return;
  
  if (initializationPromise) {
    return initializationPromise;
  }

  initializationPromise = (async () => {
    try {
      await loadModels();
      isInitialized = true;
      console.log('Face detection initialized successfully');
    } catch (error) {
      console.error('Failed to initialize face detection:', error);
      isInitialized = false;
      initializationPromise = null;
      throw error;
    }
  })();

  return initializationPromise;
}

export async function detectEmotions(video: HTMLVideoElement): Promise<EmotionData | null> {
  if (!isInitialized) {
    try {
      await initializeDetection();
    } catch (error) {
      console.error('Failed to initialize detection:', error);
      return null;
    }
  }

  try {
    // Check if video is ready
    if (video.readyState !== 4) {
      return null;
    }

    const options = new faceapi.TinyFaceDetectorOptions({ 
      inputSize: 224,
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
      happiness: expressions.happy || 0,
      sadness: expressions.sad || 0,
      anger: expressions.angry || 0,
      surprise: expressions.surprised || 0,
      fear: expressions.fearful || 0,
      disgust: expressions.disgusted || 0,
      neutral: expressions.neutral || 0,
      timestamp: Date.now(),
    };
  } catch (error) {
    console.error('Error detecting emotions:', error);
    return null;
  }
}