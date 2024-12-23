'use client';

import { createContext, useContext, useEffect, useState } from 'react';

export type Emotion = 'happiness' | 'sadness' | 'anger' | 'neutral';

const themes: Record<Emotion, { background: string; text: string }> = {
  happiness: {
    background: 'bg-yellow-50',
    text: 'text-yellow-900',
  },
  sadness: {
    background: 'bg-blue-50',
    text: 'text-blue-900',
  },
  anger: {
    background: 'bg-red-50',
    text: 'text-red-900',
  },
  neutral: {
    background: 'bg-background',
    text: 'text-foreground',
  },
};

const ThemeContext = createContext<{
  currentEmotion: Emotion;
  setEmotion: (emotion: Emotion) => void;
  theme: { background: string; text: string };
}>({
  currentEmotion: 'neutral',
  setEmotion: () => {},
  theme: themes.neutral,
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [currentEmotion, setCurrentEmotion] = useState<Emotion>('neutral');
  const [theme, setTheme] = useState(themes.neutral);

  const setEmotion = (emotion: Emotion) => {
    setCurrentEmotion(emotion);
    setTheme(themes[emotion]);
  };

  return (
    <ThemeContext.Provider value={{ currentEmotion, setEmotion, theme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);