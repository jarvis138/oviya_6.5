// ============================================
// OVIYA - Emotion Theme System
// 8 Dynamic Themes Based on User Emotion
// ============================================

import { EmotionType, EmotionTheme } from '@/types';

// Theme definitions for each emotion
export const emotionThemes: Record<EmotionType, EmotionTheme> = {
  stressed: {
    id: 'stressed',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    messageBubbleUser: 'rgba(103, 126, 234, 0.25)',
    messageBubbleOviya: 'rgba(118, 75, 162, 0.2)',
    textPrimary: '#ffffff',
    textSecondary: 'rgba(255, 255, 255, 0.7)',
    inputBackground: 'rgba(255, 255, 255, 0.1)',
    accent: '#a78bfa',
  },

  anxious: {
    id: 'anxious',
    gradient: 'linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)',
    messageBubbleUser: 'rgba(251, 194, 235, 0.3)',
    messageBubbleOviya: 'rgba(166, 193, 238, 0.25)',
    textPrimary: '#1f2937',
    textSecondary: 'rgba(31, 41, 55, 0.7)',
    inputBackground: 'rgba(255, 255, 255, 0.5)',
    accent: '#ec4899',
  },

  sad: {
    id: 'sad',
    gradient: 'linear-gradient(135deg, #4b6cb7 0%, #182848 100%)',
    messageBubbleUser: 'rgba(75, 108, 183, 0.3)',
    messageBubbleOviya: 'rgba(24, 40, 72, 0.3)',
    textPrimary: '#ffffff',
    textSecondary: 'rgba(255, 255, 255, 0.7)',
    inputBackground: 'rgba(255, 255, 255, 0.1)',
    accent: '#60a5fa',
  },

  angry: {
    id: 'angry',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    messageBubbleUser: 'rgba(240, 147, 251, 0.25)',
    messageBubbleOviya: 'rgba(245, 87, 108, 0.2)',
    textPrimary: '#ffffff',
    textSecondary: 'rgba(255, 255, 255, 0.7)',
    inputBackground: 'rgba(255, 255, 255, 0.1)',
    accent: '#f472b6',
  },

  excited: {
    id: 'excited',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    messageBubbleUser: 'rgba(240, 147, 251, 0.25)',
    messageBubbleOviya: 'rgba(245, 87, 108, 0.2)',
    textPrimary: '#ffffff',
    textSecondary: 'rgba(255, 255, 255, 0.7)',
    inputBackground: 'rgba(255, 255, 255, 0.15)',
    accent: '#f472b6',
  },

  playful: {
    id: 'playful',
    gradient: 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)',
    messageBubbleUser: 'rgba(224, 195, 252, 0.35)',
    messageBubbleOviya: 'rgba(142, 197, 252, 0.3)',
    textPrimary: '#1f2937',
    textSecondary: 'rgba(31, 41, 55, 0.7)',
    inputBackground: 'rgba(255, 255, 255, 0.5)',
    accent: '#a78bfa',
  },

  reflective: {
    id: 'reflective',
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    messageBubbleUser: 'rgba(79, 172, 254, 0.25)',
    messageBubbleOviya: 'rgba(0, 242, 254, 0.2)',
    textPrimary: '#ffffff',
    textSecondary: 'rgba(255, 255, 255, 0.7)',
    inputBackground: 'rgba(255, 255, 255, 0.1)',
    accent: '#22d3ee',
  },

  cozy: {
    id: 'cozy',
    gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    messageBubbleUser: 'rgba(250, 112, 154, 0.25)',
    messageBubbleOviya: 'rgba(254, 225, 64, 0.2)',
    textPrimary: '#1f2937',
    textSecondary: 'rgba(31, 41, 55, 0.7)',
    inputBackground: 'rgba(255, 255, 255, 0.5)',
    accent: '#f472b6',
  },

  celebratory: {
    id: 'celebratory',
    gradient: 'linear-gradient(135deg, #fddb92 0%, #d1fdff 100%)',
    messageBubbleUser: 'rgba(253, 219, 146, 0.3)',
    messageBubbleOviya: 'rgba(209, 253, 255, 0.25)',
    textPrimary: '#1f2937',
    textSecondary: 'rgba(31, 41, 55, 0.7)',
    inputBackground: 'rgba(255, 255, 255, 0.5)',
    accent: '#fbbf24',
  },

  intimate: {
    id: 'intimate',
    gradient: 'linear-gradient(135deg, #2c3e50 0%, #4ca1af 100%)',
    messageBubbleUser: 'rgba(44, 62, 80, 0.35)',
    messageBubbleOviya: 'rgba(76, 161, 175, 0.25)',
    textPrimary: '#ffffff',
    textSecondary: 'rgba(255, 255, 255, 0.7)',
    inputBackground: 'rgba(255, 255, 255, 0.1)',
    accent: '#14b8a6',
  },

  neutral: {
    id: 'neutral',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    messageBubbleUser: 'rgba(103, 126, 234, 0.2)',
    messageBubbleOviya: 'rgba(118, 75, 162, 0.15)',
    textPrimary: '#ffffff',
    textSecondary: 'rgba(255, 255, 255, 0.7)',
    inputBackground: 'rgba(255, 255, 255, 0.1)',
    accent: '#a78bfa',
  },
};

// Crisis theme - soft and safe
export const crisisTheme: EmotionTheme = {
  id: 'neutral',
  gradient: 'linear-gradient(135deg, #fce4ec 0%, #e1bee7 100%)',
  messageBubbleUser: 'rgba(252, 228, 236, 0.4)',
  messageBubbleOviya: 'rgba(225, 190, 231, 0.35)',
  textPrimary: '#1f2937',
  textSecondary: 'rgba(31, 41, 55, 0.7)',
  inputBackground: 'rgba(255, 255, 255, 0.6)',
  accent: '#ec4899',
};

// Default theme (cozy)
export const defaultTheme = emotionThemes.cozy;

// Get theme by emotion
export const getThemeByEmotion = (emotion: EmotionType, isCrisis: boolean = false): EmotionTheme => {
  if (isCrisis) {
    return crisisTheme;
  }
  return emotionThemes[emotion] || defaultTheme;
};

// CSS variable names for theme
export const themeVars = {
  gradient: '--oviya-gradient',
  messageBubbleUser: '--oviya-bubble-user',
  messageBubbleOviya: '--oviya-bubble-oviya',
  textPrimary: '--oviya-text-primary',
  textSecondary: '--oviya-text-secondary',
  inputBackground: '--oviya-input-bg',
  accent: '--oviya-accent',
};

// Apply theme to CSS variables
export const applyTheme = (theme: EmotionTheme) => {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;
  root.style.setProperty(themeVars.gradient, theme.gradient);
  root.style.setProperty(themeVars.messageBubbleUser, theme.messageBubbleUser);
  root.style.setProperty(themeVars.messageBubbleOviya, theme.messageBubbleOviya);
  root.style.setProperty(themeVars.textPrimary, theme.textPrimary);
  root.style.setProperty(themeVars.textSecondary, theme.textSecondary);
  root.style.setProperty(themeVars.inputBackground, theme.inputBackground);
  root.style.setProperty(themeVars.accent, theme.accent);
};
