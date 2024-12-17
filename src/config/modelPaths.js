// Define model paths and configurations
export const MODEL_PATHS = {
  tinyFaceDetector: '/models/tiny_face_detector_model-weights_manifest.json',
  faceLandmark68Net: '/models/face_landmark_68_model-weights_manifest.json',
  faceExpressionNet: '/models/face_expression_model-weights_manifest.json'
};

export const MODEL_OPTIONS = {
  tinyFaceDetector: {
    inputSize: 224,
    scoreThreshold: 0.5
  }
};