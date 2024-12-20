// Model configuration and paths
export const MODEL_CONFIG = {
  paths: {
    // Using only the essential models
    tinyFaceDetector: 'https://justadudewhohacks.github.io/face-api.js/weights/tiny_face_detector_model-weights_manifest.json',
    faceExpressionNet: 'https://justadudewhohacks.github.io/face-api.js/weights/face_expression_model-weights_manifest.json'
  },
  options: {
    tinyFaceDetector: {
      inputSize: 160, // Reduced input size for better performance
      scoreThreshold: 0.5
    }
  }
};