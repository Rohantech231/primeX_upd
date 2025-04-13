import { EmotionData } from './emotion-detection';

// Spotify API configuration
const SPOTIFY_API_URL = 'https://api.spotify.com/v1';
const SPOTIFY_CLIENT_ID = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;

interface SpotifyTrack {
  id: string;
  name: string;
  artists: { name: string }[];
  external_urls: { spotify: string };
}

// Mapping emotions to Spotify seed genres and attributes
const EMOTION_MUSIC_MAPPING = {
  happiness: {
    genres: ['pop', 'happy', 'dance'],
    valence: 0.8,
    energy: 0.7
  },
  sadness: {
    genres: ['sad', 'piano', 'indie'],
    valence: 0.2,
    energy: 0.3
  },
  anger: {
    genres: ['metal', 'rock', 'hardcore'],
    valence: 0.4,
    energy: 0.9
  },
  surprise: {
    genres: ['electronic', 'experimental', 'jazz'],
    valence: 0.6,
    energy: 0.8
  },
  fear: {
    genres: ['ambient', 'classical', 'instrumental'],
    valence: 0.3,
    energy: 0.4
  },
  disgust: {
    genres: ['punk', 'grunge', 'metal'],
    valence: 0.3,
    energy: 0.8
  },
  neutral: {
    genres: ['pop', 'indie', 'alternative'],
    valence: 0.5,
    energy: 0.5
  }
};

// Advice messages for different emotions
const EMOTION_ADVICE = {
  happiness: [
    "Keep spreading that joy! Your positive energy is contagious.",
    "Perfect time to tackle that project you've been putting off!",
    "Share your happiness with someone who might need it today.",
    "Consider starting a gratitude journal to capture these moments."
  ],
  sadness: [
    "Remember that it's okay not to be okay. Take time to process your feelings.",
    "Try reaching out to a friend or family member for support.",
    "Consider a short walk in nature to clear your mind.",
    "Practice self-care and be gentle with yourself today."
  ],
  anger: [
    "Take deep breaths and count to ten before reacting.",
    "Channel this energy into something productive, like exercise.",
    "Write down your thoughts to process them more clearly.",
    "Step away from the situation if possible and return with a fresh perspective."
  ],
  surprise: [
    "Embrace the unexpected! Sometimes the best moments are unplanned.",
    "Use this energy to try something new today.",
    "Share your experience with others - they might offer new insights.",
    "Take a moment to reflect on what surprised you and why."
  ],
  fear: [
    "Remember that courage isn't the absence of fear, but facing it.",
    "Break down what's frightening you into smaller, manageable steps.",
    "Consider talking to someone you trust about your concerns.",
    "Try some grounding exercises to stay present."
  ],
  disgust: [
    "Focus on things that bring you joy and positivity.",
    "Consider if there's something you can do to improve the situation.",
    "Take a break and reset your environment if needed.",
    "Practice acceptance for things outside your control."
  ],
  neutral: [
    "This is a good time for mindfulness and reflection.",
    "Consider setting some new goals or reviewing existing ones.",
    "Try something new to add some excitement to your day.",
    "Use this balanced state to make important decisions."
  ]
};

export async function getSpotifyRecommendations(emotions: EmotionData): Promise<{ tracks: SpotifyTrack[], advice: string }> {
  // Find the dominant emotion
  const dominantEmotion = Object.entries(emotions)
    .filter(([key]) => key !== 'timestamp')
    .reduce((max, [key, value]) => value > max.value ? { key, value } : max, { key: '', value: -1 });

  const emotion = dominantEmotion.key as keyof typeof EMOTION_MUSIC_MAPPING;
  const mapping = EMOTION_MUSIC_MAPPING[emotion];

  try {
    // Get access token (You'll need to implement token management)
    const token = await getSpotifyToken();

    // Get recommendations from Spotify
    const params = new URLSearchParams({
      seed_genres: mapping.genres.join(','),
      target_valence: mapping.valence.toString(),
      target_energy: mapping.energy.toString(),
      limit: '3'
    });

    const response = await fetch(`${SPOTIFY_API_URL}/recommendations?${params}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch recommendations');
    }

    const data = await response.json();
    
    // Get random advice for the emotion
    const adviceList = EMOTION_ADVICE[emotion];
    const randomAdvice = adviceList[Math.floor(Math.random() * adviceList.length)];

    return {
      tracks: data.tracks,
      advice: randomAdvice
    };
  } catch (error) {
    console.error('Error getting recommendations:', error);
    return {
      tracks: [],
      advice: EMOTION_ADVICE[emotion][0]
    };
  }
}

async function getSpotifyToken(): Promise<string> {
  // Implement token management here
  // You'll need to handle OAuth flow or use client credentials flow
  // For now, return an empty string
  return '';
}
