import { EmotionData } from './emotion-detection';

export type CopingStrategy = {
  title: string;
  description: string;
  type: 'immediate' | 'long-term';
  difficulty: 'easy' | 'medium' | 'hard';
};

export type EmotionInsight = {
  pattern: string;
  suggestion: string;
  priority: 'low' | 'medium' | 'high';
};

export function generateCopingStrategies(emotions: EmotionData): CopingStrategy[] {
  const strategies: CopingStrategy[] = [];
  
  if (emotions.anger > 0.6) {
    strategies.push({
      title: "Deep Breathing Exercise",
      description: "Take 5 deep breaths, counting to 4 on inhale and 6 on exhale",
      type: "immediate",
      difficulty: "easy"
    });
  }

  if (emotions.sadness > 0.5) {
    strategies.push({
      title: "Gratitude Practice",
      description: "Write down 3 things you're grateful for right now",
      type: "immediate",
      difficulty: "easy"
    });
  }

  return strategies;
}

export function analyzeEmotionPatterns(history: EmotionData[]): EmotionInsight[] {
  // This would use more sophisticated analysis in production
  return [{
    pattern: "Increased stress levels in the afternoon",
    suggestion: "Consider taking short breaks every 2 hours",
    priority: "medium"
  }];
}