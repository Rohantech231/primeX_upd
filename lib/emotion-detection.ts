import { HfInference } from '@huggingface/inference';
import { captureImageFromVideo } from './image-utils';

const hf = new HfInference(process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY);
const MODEL_ID = 'dima806/facial_emotions_image_detection';

export type EmotionData = {
  happiness: number;
  sadness: number;
  anger: number;
  timestamp: number;
};

export async function detectEmotions(video: HTMLVideoElement): Promise<EmotionData | null> {
  try {
    const imageBlob = await captureImageFromVideo(video);
    
    const formData = new FormData();
    formData.append('image', imageBlob);

    const response = await fetch(
      `https://api-inference.huggingface.co/models/${MODEL_ID}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY}`,
        },
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    const predictions = await response.json();

    const emotions: EmotionData = {
      happiness: 0,
      sadness: 0,
      anger: 0,
      timestamp: Date.now(),
    };

    predictions.forEach((prediction: any) => {
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