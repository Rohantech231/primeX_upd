export const MODELS_PATH = '/models';

export const FACE_API_MODELS = {
  tinyFaceDetector: 'tiny_face_detector_model-weights_manifest.json',
  faceLandmark68Net: 'face_landmark_68_model-weights_manifest.json',
  faceExpressionNet: 'face_expression_model-weights_manifest.json'
};

export const TRACKING_CONFIG = {
  BLINK_THRESHOLD: 0.3,
  BLINK_COOLDOWN: 500, // ms
  VIDEO_CONSTRAINTS: {
    facingMode: 'user',
    width: { min: 640, ideal: 1280, max: 1920 },
    height: { min: 480, ideal: 720, max: 1080 },
    frameRate: { ideal: 30, max: 60 }
  }
};

export const EMOTION_THRESHOLD = {
  MIN_CONFIDENCE: 0.2,
  UPDATE_INTERVAL: 100 // ms
};