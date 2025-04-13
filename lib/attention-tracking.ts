'use client';

import * as faceapi from 'face-api.js';

export interface AttentionMetrics {
  gazeScore: number;  // 0-1, how focused the gaze is
  faceOrientation: number;  // -1 to 1, where 0 is directly facing camera
  attentionScore: number;  // Overall attention score
  timestamp: number;
}

export interface WellnessMetrics {
  stressLevel: number;  // 0-1, based on facial tension
  fatigueScore: number;  // 0-1, based on eye openness and head position
  blinkRate: number;  // Blinks per minute
  timestamp: number;
}

// Track blink state
let lastEyeState = 'open';
let blinkCount = 0;
let lastBlinkCheck = Date.now();
const BLINK_INTERVAL = 60000; // 1 minute

export async function calculateAttentionMetrics(
  video: HTMLVideoElement
): Promise<AttentionMetrics> {
  try {
    console.log('Detecting face for attention metrics...');
    const detection = await faceapi
      .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks();

    if (!detection) {
      console.log('No face detected for attention metrics');
      return {
        gazeScore: 0,
        faceOrientation: 0,
        attentionScore: 0,
        timestamp: Date.now()
      };
    }

    console.log('Face detected, calculating attention metrics...');
    // Calculate gaze score based on eye landmarks
    const leftEye = detection.landmarks.getLeftEye();
    const rightEye = detection.landmarks.getRightEye();
    const eyeAspectRatio = calculateEyeAspectRatio(leftEye, rightEye);
    const gazeScore = normalizeEyeAspectRatio(eyeAspectRatio);

    // Calculate face orientation
    const jaw = detection.landmarks.getJawOutline();
    const faceOrientation = calculateFaceOrientation(jaw);

    // Calculate overall attention score
    const attentionScore = (gazeScore + (1 - Math.abs(faceOrientation))) / 2;

    console.log('Attention metrics calculated:', { gazeScore, faceOrientation, attentionScore });
    return {
      gazeScore,
      faceOrientation,
      attentionScore,
      timestamp: Date.now()
    };
  } catch (error) {
    console.error('Error calculating attention metrics:', error);
    throw error;
  }
}

export async function calculateWellnessMetrics(
  video: HTMLVideoElement
): Promise<WellnessMetrics> {
  try {
    console.log('Detecting face for wellness metrics...');
    const detection = await faceapi
      .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceExpressions();

    if (!detection) {
      console.log('No face detected for wellness metrics');
      return {
        stressLevel: 0,
        fatigueScore: 0,
        blinkRate: 0,
        timestamp: Date.now()
      };
    }

    console.log('Face detected, calculating wellness metrics...');
    // Calculate stress level based on facial expressions
    const stressLevel = calculateStressLevel(detection.expressions);

    // Calculate fatigue based on eye openness and head position
    const leftEye = detection.landmarks.getLeftEye();
    const rightEye = detection.landmarks.getRightEye();
    const eyeAspectRatio = calculateEyeAspectRatio(leftEye, rightEye);
    
    // Update blink tracking
    const currentEyeState = eyeAspectRatio < 0.2 ? 'closed' : 'open';
    if (currentEyeState === 'closed' && lastEyeState === 'open') {
      blinkCount++;
      console.log('Blink detected, count:', blinkCount);
    }
    lastEyeState = currentEyeState;

    // Calculate blink rate (blinks per minute)
    const currentTime = Date.now();
    let blinkRate = 0;
    const timeElapsed = (currentTime - lastBlinkCheck) / 60000; // Convert to minutes

    if (timeElapsed > 0) {
      blinkRate = blinkCount / timeElapsed;
    }

    if (currentTime - lastBlinkCheck >= BLINK_INTERVAL) {
      console.log('Resetting blink count. Rate was:', blinkRate);
      blinkCount = 0;
      lastBlinkCheck = currentTime;
    }

    const fatigueScore = calculateFatigueScore(eyeAspectRatio, blinkRate);
    console.log('Wellness metrics calculated:', { stressLevel, fatigueScore, blinkRate });

    return {
      stressLevel,
      fatigueScore,
      blinkRate,
      timestamp: currentTime
    };
  } catch (error) {
    console.error('Error calculating wellness metrics:', error);
    throw error;
  }
}

function calculateEyeAspectRatio(leftEye: faceapi.Point[], rightEye: faceapi.Point[]): number {
  const leftRatio = calculateSingleEyeAspectRatio(leftEye);
  const rightRatio = calculateSingleEyeAspectRatio(rightEye);
  return (leftRatio + rightRatio) / 2;
}

function calculateSingleEyeAspectRatio(eye: faceapi.Point[]): number {
  const height1 = distance(eye[1], eye[5]);
  const height2 = distance(eye[2], eye[4]);
  const width = distance(eye[0], eye[3]);
  return (height1 + height2) / (2 * width);
}

function distance(p1: faceapi.Point, p2: faceapi.Point): number {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
}

function normalizeEyeAspectRatio(ratio: number): number {
  // Typical eye aspect ratio ranges from 0.2 (closed) to 0.3 (open)
  return Math.min(Math.max((ratio - 0.2) / 0.1, 0), 1);
}

function calculateFaceOrientation(jaw: faceapi.Point[]): number {
  const leftPoint = jaw[0];
  const rightPoint = jaw[16];
  const midPoint = jaw[8];
  
  // Calculate horizontal asymmetry
  const leftDist = distance(leftPoint, midPoint);
  const rightDist = distance(rightPoint, midPoint);
  
  return (leftDist - rightDist) / (leftDist + rightDist);
}

function calculateStressLevel(expressions: any): number {
  // Weight different expressions that indicate stress
  return Math.min(
    expressions.angry * 0.4 +
    expressions.fearful * 0.3 +
    expressions.disgusted * 0.2 +
    expressions.sad * 0.1,
    1
  );
}

function calculateFatigueScore(eyeAspectRatio: number, blinkRate: number): number {
  // Combine eye openness and blink rate to estimate fatigue
  const eyeOpenness = normalizeEyeAspectRatio(eyeAspectRatio);
  const normalBlinkRate = 15; // Average blink rate is 15-20 blinks per minute
  const blinkFactor = blinkRate > normalBlinkRate ? 
    Math.min((blinkRate - normalBlinkRate) / 10, 1) : 0;
  
  return Math.min((1 - eyeOpenness) * 0.7 + blinkFactor * 0.3, 1);
}
