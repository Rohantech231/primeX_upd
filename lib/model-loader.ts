'use client';

import * as faceapi from 'face-api.js';

let modelsLoaded = false;

export async function loadModels() {
  if (modelsLoaded) return true;
  
  const MODEL_URL = 'https://justadudewhohacks.github.io/face-api.js/models';
  
  try {
    await Promise.all([
      faceapi.nets.tinyFaceDetector.load(MODEL_URL),
      faceapi.nets.faceLandmark68Net.load(MODEL_URL),
      faceapi.nets.faceExpressionNet.load(MODEL_URL)
    ]);
    
    modelsLoaded = true;
    console.log('Models loaded successfully');
    return true;
  } catch (error) {
    console.error('Error loading models:', error);
    throw error;
  }
}

export function areModelsLoaded() {
  return modelsLoaded;
}