import * as tf from '@tensorflow/tfjs';

export async function initializeTensorFlow() {
  // Set the backend to 'webgl' for better performance
  await tf.setBackend('webgl');
  await tf.ready();
  
  // Enable debug mode in development
  if (process.env.NODE_ENV === 'development') {
    tf.enableDebugMode();
  }
  
  return tf.engine().backend != null;
}