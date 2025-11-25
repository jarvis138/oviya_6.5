'use client';

// ============================================
// Emotion Theme Provider
// Dynamic gradient backgrounds based on emotion
// ============================================

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { EmotionType, EmotionTheme } from '@/types';
import { emotionThemes, crisisTheme, defaultTheme, applyTheme } from '@/lib/emotion-themes';
import { useChatStore } from '@/store/chat';

interface ThemeContextType {
  emotion: EmotionType;
  theme: EmotionTheme;
  isCrisis: boolean;
  setEmotion: (emotion: EmotionType) => void;
  setCrisis: (isCrisis: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  emotion: 'neutral',
  theme: defaultTheme,
  isCrisis: false,
  setEmotion: () => {},
  setCrisis: () => {},
});

export const useTheme = () => useContext(ThemeContext);

interface ThemeProviderProps {
  children: ReactNode;
}

export function EmotionThemeProvider({ children }: ThemeProviderProps) {
  const { currentEmotion, isCrisis, setEmotion, setCrisis } = useChatStore();
  const [theme, setTheme] = useState<EmotionTheme>(defaultTheme);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Update theme when emotion changes
  useEffect(() => {
    setIsTransitioning(true);

    const newTheme = isCrisis ? crisisTheme : emotionThemes[currentEmotion] || defaultTheme;

    // Apply CSS variables
    applyTheme(newTheme);
    setTheme(newTheme);

    // Reset transition state after animation
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 1500); // Match CSS transition duration

    return () => clearTimeout(timer);
  }, [currentEmotion, isCrisis]);

  return (
    <ThemeContext.Provider
      value={{
        emotion: currentEmotion,
        theme,
        isCrisis,
        setEmotion,
        setCrisis,
      }}
    >
      <div
        className="theme-container min-h-screen transition-all duration-[1500ms] ease-out"
        style={{
          background: theme.gradient,
        }}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
}
