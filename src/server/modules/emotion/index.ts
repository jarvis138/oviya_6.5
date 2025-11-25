// ============================================
// Emotion Analysis Service
// ============================================

import { EmotionAnalysis, EmotionType } from '@/types';

// Keywords associated with each emotion
const emotionKeywords: Record<EmotionType, string[]> = {
  stressed: [
    'stressed', 'overwhelmed', 'pressure', 'deadline', 'too much', 'swamped',
    'exhausted', 'burned out', 'burnout', 'can\'t cope', 'drowning'
  ],
  anxious: [
    'anxious', 'worried', 'nervous', 'scared', 'afraid', 'panic',
    'what if', 'cant sleep', 'restless', 'uneasy', 'overthinking'
  ],
  sad: [
    'sad', 'depressed', 'down', 'lonely', 'miss', 'crying', 'tears',
    'heartbroken', 'grief', 'loss', 'empty', 'numb'
  ],
  angry: [
    'angry', 'mad', 'furious', 'frustrated', 'annoyed', 'irritated',
    'pissed', 'hate', 'unfair', 'rage'
  ],
  excited: [
    'excited', 'amazing', 'awesome', 'fantastic', 'great news', 'yay',
    'can\'t wait', 'thrilled', 'pumped', 'stoked', '!!!'
  ],
  playful: [
    'haha', 'lol', 'lmao', '😂', '🤣', 'funny', 'joke', 'kidding',
    'tease', 'banter', 'silly'
  ],
  reflective: [
    'thinking', 'wondering', 'realized', 'reflecting', 'looking back',
    'what do you think', 'perspective', 'meaning', 'purpose'
  ],
  cozy: [
    'relaxed', 'comfortable', 'cozy', 'peaceful', 'calm', 'content',
    'grateful', 'blessed', 'happy', 'good day'
  ],
  celebratory: [
    'celebrate', 'congratulations', 'won', 'achieved', 'success',
    'promotion', 'birthday', 'anniversary', 'milestone', 'party'
  ],
  intimate: [
    'love', 'miss you', 'relationship', 'partner', 'date', 'romantic',
    'crush', 'feelings for', 'attracted'
  ],
  neutral: []
};

// Analyze emotion from conversation messages
export async function analyzeEmotion(
  messages: Array<{ role: string; content: string }>
): Promise<EmotionAnalysis> {
  // Get recent user messages
  const recentUserMessages = messages
    .filter(m => m.role === 'user')
    .slice(-5)
    .map(m => m.content.toLowerCase())
    .join(' ');

  // Score each emotion
  const scores: Record<EmotionType, number> = {
    stressed: 0,
    anxious: 0,
    sad: 0,
    angry: 0,
    excited: 0,
    playful: 0,
    reflective: 0,
    cozy: 0,
    celebratory: 0,
    intimate: 0,
    neutral: 0
  };

  // Count keyword matches
  for (const [emotion, keywords] of Object.entries(emotionKeywords)) {
    for (const keyword of keywords) {
      if (recentUserMessages.includes(keyword.toLowerCase())) {
        scores[emotion as EmotionType] += 1;
      }
    }
  }

  // Check for exclamation marks (intensity indicator)
  const exclamationCount = (recentUserMessages.match(/!/g) || []).length;
  if (exclamationCount > 2) {
    scores.excited += 1;
  }

  // Check for question marks (reflective indicator)
  const questionCount = (recentUserMessages.match(/\?/g) || []).length;
  if (questionCount > 2) {
    scores.reflective += 1;
  }

  // Find highest scoring emotion
  let maxScore = 0;
  let detectedEmotion: EmotionType = 'neutral';

  for (const [emotion, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      detectedEmotion = emotion as EmotionType;
    }
  }

  // Calculate intensity (0-1)
  const intensity = Math.min(maxScore / 5, 1);

  // Calculate confidence
  const totalMatches = Object.values(scores).reduce((a, b) => a + b, 0);
  const confidence = totalMatches > 0 ? maxScore / totalMatches : 0.5;

  return {
    emotion: detectedEmotion,
    intensity,
    isCrisis: false,
    confidence,
  };
}

// Get emotion from a single message
export function quickEmotionCheck(message: string): EmotionType {
  const lowerMessage = message.toLowerCase();

  // Quick checks for strong indicators
  if (lowerMessage.includes('stressed') || lowerMessage.includes('overwhelmed')) {
    return 'stressed';
  }
  if (lowerMessage.includes('anxious') || lowerMessage.includes('worried')) {
    return 'anxious';
  }
  if (lowerMessage.includes('sad') || lowerMessage.includes('depressed')) {
    return 'sad';
  }
  if (lowerMessage.includes('angry') || lowerMessage.includes('frustrated')) {
    return 'angry';
  }
  if (lowerMessage.includes('excited') || lowerMessage.includes('amazing')) {
    return 'excited';
  }
  if (lowerMessage.includes('haha') || lowerMessage.includes('lol')) {
    return 'playful';
  }

  return 'neutral';
}
