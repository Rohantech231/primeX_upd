'use client';

import * as faceapi from 'face-api.js';

export async function loadModels() {
  // Use CDN URLs for models to avoid local file issues
  const MODEL_URL = 'https://justadudewhohacks.github.io/face-api.js/models';
  
  try {
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
      faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
      faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL)
    ]);
    
    console.log('Models loaded successfully from CDN');
    return true;
  } catch (error) {
    console.error('Error loading models:', error);
    throw error;
  }
}