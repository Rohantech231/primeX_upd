type Recommendation = {
  type: 'music' | 'activity' | 'tip';
  content: string;
};

const recommendations: Record<string, Recommendation[]> = {
  happy: [
    { type: 'music', content: 'Upbeat pop or dance music to maintain your mood' },
    { type: 'activity', content: 'Share your joy with friends or family' },
    { type: 'tip', content: 'Use this positive energy for creative projects' },
  ],
  sad: [
    { type: 'music', content: 'Calming classical or ambient music' },
    { type: 'activity', content: 'Take a peaceful walk in nature' },
    { type: 'tip', content: 'Practice deep breathing exercises' },
  ],
  angry: [
    { type: 'music', content: 'Soothing meditation music' },
    { type: 'activity', content: 'Try progressive muscle relaxation' },
    { type: 'tip', content: 'Write down your thoughts in a journal' },
  ],
  neutral: [
    { type: 'music', content: 'Your favorite playlist' },
    { type: 'activity', content: 'Regular daily activities' },
    { type: 'tip', content: 'Set goals for the day' },
  ],
};

export function getRecommendations(emotions: { 
  happiness: number;
  sadness: number;
  anger: number;
}): Recommendation[] {
  const maxEmotion = Object.entries(emotions).reduce((a, b) => 
    a[1] > b[1] ? a : b
  )[0];

  const emotionMap: Record<string, string> = {
    happiness: 'happy',
    sadness: 'sad',
    anger: 'angry',
  };

  return recommendations[emotionMap[maxEmotion] || 'neutral'];
}