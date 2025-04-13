'use client';

import * as faceapi from 'face-api.js';

let isInitialized = false;
let initializationPromise: Promise<void> | null = null;

export async function initializeFaceAPI() {
  // If already initialized, return immediately
  if (isInitialized) {
    return;
  }

  // If initialization is in progress, wait for it
  if (initializationPromise) {
    return initializationPromise;
  }

  // Start initialization
  initializationPromise = (async () => {
    try {
      console.log('Starting Face-API initialization...');

      // Ensure we're in a browser environment
      if (typeof window === 'undefined') {
        throw new Error('Face-API initialization requires a browser environment');
      }

      // Load models sequentially to prevent race conditions
      console.log('Loading TinyFaceDetector model...');
      await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
      console.log('TinyFaceDetector model loaded');

      console.log('Loading FaceLandmark68 model...');
      await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
      console.log('FaceLandmark68 model loaded');

      console.log('Loading FaceExpression model...');
      await faceapi.nets.faceExpressionNet.loadFromUri('/models');
      console.log('FaceExpression model loaded');

      isInitialized = true;
      console.log('Face-API initialization complete');
    } catch (error) {
      console.error('Error during Face-API initialization:', error);
      // Reset initialization state on error
      isInitialized = false;
      initializationPromise = null;
      throw error;
    }
  })();

  return initializationPromise;
}

export function isFaceAPIInitialized() {
  return isInitialized;
}
