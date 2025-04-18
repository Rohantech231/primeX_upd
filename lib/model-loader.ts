'use client';

import * as faceapi from 'face-api.js';

let modelsLoaded = false;

// Use a more reliable CDN with all required models
const MODEL_URL = 'https://justadudewhohacks.github.io/face-api.js/models/';

export async function loadModels() {
  if (modelsLoaded) return true;
  
  try {
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
      faceapi.nets.faceLandmark68TinyNet.loadFromUri(MODEL_URL),
      faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
      faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL)
    ]);
    
    modelsLoaded = true;
    console.log('Models loaded successfully');
    return true;
  } catch (error) {
    console.error('Error loading models:', error);
    throw error;
  }
}