import * as faceapi from 'face-api.js';
import { showError, showSuccess, showWarning } from '../utils/notificationUtils.js';

class ModelLoader {
  constructor() {
    this.isLoaded = false;
    this.modelLoadAttempts = 0;
    this.maxLoadAttempts = 3;
    this.models = {
      tinyFaceDetector: '/models/tiny_face_detector_model-weights_manifest.json',
      faceLandmark68Net: '/models/face_landmark_68_model-weights_manifest.json',
      faceExpressionNet: '/models/face_expression_model-weights_manifest.json'
    };
  }

  async loadModels() {
    if (this.isLoaded) return true;

    try {
      showWarning('Loading face detection models...');
      
      // Reset all models before loading to ensure clean state
      await this.resetModels();
      
      // Load models sequentially to prevent race conditions
      for (const [modelName, modelPath] of Object.entries(this.models)) {
        await this.loadModelWithRetry(modelName, modelPath);
      }

      this.isLoaded = true;
      showSuccess('All models loaded successfully');
      return true;
    } catch (error) {
      this.isLoaded = false;
      const errorMessage = 'Failed to load face detection models. Please check your internet connection and try again.';
      showError(errorMessage);
      throw new Error(errorMessage);
    }
  }

  async resetModels() {
    // Clear any existing model data
    for (const modelName of Object.keys(this.models)) {
      if (faceapi.nets[modelName]) {
        // @ts-ignore - Reset internal model state
        faceapi.nets[modelName].isLoaded = false;
      }
    }
  }

  async loadModelWithRetry(modelName, modelPath, attempt = 1) {
    try {
      showWarning(`Loading ${modelName}... Attempt ${attempt}/${this.maxLoadAttempts}`);
      
      // Ensure the model exists in face-api
      if (!faceapi.nets[modelName]) {
        throw new Error(`Model ${modelName} not found in face-api`);
      }

      // Check if model is already loaded
      if (await this.isModelLoaded(modelName)) {
        console.log(`${modelName} is already loaded`);
        return true;
      }

      // Load the model
      await faceapi.nets[modelName].load(modelPath);
      
      // Verify the model loaded correctly
      if (!await this.isModelLoaded(modelName)) {
        throw new Error(`Model ${modelName} failed verification after load`);
      }

      console.log(`${modelName} loaded successfully`);
      return true;
    } catch (error) {
      console.error(`Error loading ${modelName}:`, error);
      
      if (attempt < this.maxLoadAttempts) {
        // Add exponential backoff delay
        const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.loadModelWithRetry(modelName, modelPath, attempt + 1);
      }
      
      throw new Error(`Failed to load ${modelName} after ${this.maxLoadAttempts} attempts`);
    }
  }

  async isModelLoaded(modelName) {
    try {
      return faceapi.nets[modelName].isLoaded;
    } catch (error) {
      console.error(`Error checking if ${modelName} is loaded:`, error);
      return false;
    }
  }

  async validateModels() {
    for (const modelName of Object.keys(this.models)) {
      if (!await this.isModelLoaded(modelName)) {
        return false;
      }
    }
    return true;
  }
}

export const modelLoader = new ModelLoader();