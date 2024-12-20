import * as faceapi from 'face-api.js';
import { MODELS_PATH } from './constants.js';
import { showError, showSuccess, showWarning } from '../utils/notificationUtils.js';
import { validateModelPaths } from '../utils/modelUtils.js';

class ModelLoader {
  constructor() {
    this.isLoaded = false;
    this.modelLoadAttempts = 0;
    this.maxLoadAttempts = 3;
    this.models = {
      tinyFaceDetector: `${MODELS_PATH}/tiny_face_detector_model-weights_manifest.json`,
      faceLandmark68Net: `${MODELS_PATH}/face_landmark_68_model-weights_manifest.json`,
      faceExpressionNet: `${MODELS_PATH}/face_expression_model-weights_manifest.json`
    };
  }

  async loadModels() {
    if (this.isLoaded) return true;

    try {
      showWarning('Validating model paths...');
      const pathsValid = await validateModelPaths(this.models);
      if (!pathsValid) {
        throw new Error('Model files not found or inaccessible');
      }

      showWarning('Loading face detection models...');
      
      // Reset all models before loading
      await this.resetModels();
      
      // Load models sequentially with proper error handling
      for (const [modelName, modelPath] of Object.entries(this.models)) {
        await this.loadModelWithRetry(modelName, modelPath);
      }

      // Verify all models are loaded
      const modelsValid = await this.validateModels();
      if (!modelsValid) {
        throw new Error('Model validation failed after loading');
      }

      this.isLoaded = true;
      showSuccess('All models loaded successfully');
      return true;
    } catch (error) {
      this.isLoaded = false;
      const errorMessage = `Failed to load models: ${error.message}`;
      showError(errorMessage);
      throw new Error(errorMessage);
    }
  }

  async resetModels() {
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
      
      if (!faceapi.nets[modelName]) {
        throw new Error(`Model ${modelName} not found in face-api`);
      }

      if (await this.isModelLoaded(modelName)) {
        return true;
      }

      await faceapi.nets[modelName].load(modelPath);
      
      if (!await this.isModelLoaded(modelName)) {
        throw new Error(`Model ${modelName} failed verification after load`);
      }

      return true;
    } catch (error) {
      if (attempt < this.maxLoadAttempts) {
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