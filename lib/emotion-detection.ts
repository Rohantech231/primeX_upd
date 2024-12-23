import { HfInference } from '@huggingface/inference';

const hf = new HfInference(process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY);
const MODEL_ID = 'dima806/facial_emotions_image_detection'; // Free emotion detection model

export type EmotionData = {
  happiness: number;
  sadness: number;
  anger: number;
  timestamp: number;
};

async function imageToBase64(video: HTMLVideoElement): Promise<string> {
  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext('2d');
  ctx?.drawImage(video, 0, 0);
  return canvas.toDataURL('image/jpeg').split(',')[1];
}

export async function detectEmotions(video: HTMLVideoElement): Promise<EmotionData | null> {
  try {
    const base64Image = await imageToBase64(video);
    
    const response = await hf.imageClassification({
      model: MODEL_ID,
      data: base64Image,
    });

    // Map HuggingFace outputs to our emotion format
    const emotions = {
      happiness: 0,
      sadness: 0,
      anger: 0,
      timestamp: Date.now(),
    };

    response.forEach((prediction) => {
      const label = prediction.label.toLowerCase();
      if (label in emotions) {
        emotions[label as keyof typeof emotions] = prediction.score;
      }
    });

    return emotions;
  } catch (error) {
    console.error('Error detecting emotions:', error);
    return null;
  }
}