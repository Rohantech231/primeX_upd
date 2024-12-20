import * as faceapi from 'face-api.js';
import { MODEL_CONFIG } from './modelConfig.js';
import { showError, showSuccess, showWarning } from '../utils/notificationUtils.js';
import { validateModelPaths } from '../utils/modelUtils.js';

class ModelLoader {
  constructor() {
    this.isLoaded = false;
    this.modelLoadAttempts = 0;
    this.maxLoadAttempts = 3;
  }

  async loadModels() {
    if (this.isLoaded) return true;

    try {
      showWarning('Validating model paths...');
      const pathsValid = await validateModelPaths(MODEL_CONFIG.paths);
      if (!pathsValid) {
        throw new Error('Model files not found or inaccessible');
      }

      showWarning('Loading face detection models...');
      
      // Load models with proper error handling
      await Promise.all([
        this.loadModelWithRetry('tinyFaceDetector'),
        this.loadModelWithRetry('faceExpressionNet')
      ]);

      // Verify models are loaded correctly
      if (!this.verifyModels()) {
        throw new Error('Model verification failed');
      }

      this.isLoaded = true;
      showSuccess('Models loaded successfully');
      return true;
    } catch (error) {
      this.isLoaded = false;
      showError(`Failed to load models: ${error.message}`);
      throw error;
    }
  }

  async loadModelWithRetry(modelName, attempt = 1) {
    try {
      if (!faceapi.nets[modelName]) {
        throw new Error(`Model ${modelName} not found`);
      }

      // Clear any existing model data
      if (faceapi.nets[modelName].isLoaded) {
        await faceapi.nets[modelName].dispose();
      }

      await faceapi.nets[modelName].load(MODEL_CONFIG.paths[modelName]);
      return true;
    } catch (error) {
      console.error(`Error loading ${modelName}:`, error);
      
      if (attempt < this.maxLoadAttempts) {
        const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.loadModelWithRetry(modelName, attempt + 1);
      }
      throw error;
    }
  }

  verifyModels() {
    return Object.keys(MODEL_CONFIG.paths).every(
      modelName => faceapi.nets[modelName]?.isLoaded
    );
  }
}

export const modelLoader = new ModelLoader();