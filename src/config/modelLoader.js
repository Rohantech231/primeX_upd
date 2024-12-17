import * as faceapi from 'face-api.js';
import { MODEL_PATHS } from './modelPaths.js';

class ModelLoader {
  constructor() {
    this.isLoaded = false;
  }

  async loadModels() {
    if (this.isLoaded) return;

    try {
      const modelLoadPromises = [
        this.loadModel('tinyFaceDetector'),
        this.loadModel('faceLandmark68Net'),
        this.loadModel('faceExpressionNet')
      ];

      await Promise.all(modelLoadPromises);
      this.isLoaded = true;
      console.log('Models loaded successfully');
    } catch (error) {
      console.error('Error loading models:', error);
      throw new Error('Failed to load face detection models. Please check your internet connection and try again.');
    }
  }

  async loadModel(modelName) {
    const modelPath = MODEL_PATHS[modelName];
    if (!modelPath) {
      throw new Error(`Model path not found for ${modelName}`);
    }

    try {
      await faceapi.nets[modelName].load(modelPath);
      console.log(`Loaded ${modelName} successfully`);
    } catch (error) {
      console.error(`Error loading ${modelName}:`, error);
      throw error;
    }
  }

  isModelLoaded() {
    return this.isLoaded;
  }
}

export const modelLoader = new ModelLoader();