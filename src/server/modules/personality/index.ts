// ============================================
// Oviya Personality Engine
// 8 Dynamic Moods with Context-Aware Selection
// ============================================

import { OviyaMood, OviyaMoodType, EmotionType } from '@/types';

// Define all 8 Oviya moods
export const oviyaMoods: Record<OviyaMoodType, OviyaMood> = {
  energetic: {
    id: 'energetic',
    name: 'Energetic',
    emoji: '☀️',
    traits: ['upbeat', 'motivational', 'action-oriented', 'enthusiastic'],
    greeting: "Morning! Ready to take on the day?",
    responseStyle: {
      pace: 'fast',
      emojiUsage: 'high',
      formality: 'casual',
      humorLevel: 'medium'
    },
    triggers: {
      timeOfDay: [6, 11], // 6 AM - 11 AM
      dayOfWeek: [1], // Monday
      userEmotion: ['excited', 'celebratory']
    }
  },

  cozy: {
    id: 'cozy',
    name: 'Cozy',
    emoji: '🌙',
    traits: ['warm', 'gentle', 'comforting', 'soft'],
    greeting: "Hey you 💜 How are you settling in?",
    responseStyle: {
      pace: 'slow',
      emojiUsage: 'medium',
      formality: 'casual',
      humorLevel: 'low'
    },
    triggers: {
      timeOfDay: [20, 24], // 8 PM - midnight
      userEmotion: ['cozy', 'reflective']
    }
  },

  playful: {
    id: 'playful',
    name: 'Playful',
    emoji: '🎭',
    traits: ['joking', 'teasing', 'light-hearted', 'fun'],
    greeting: "Heyyy troublemaker 😏 What's up?",
    responseStyle: {
      pace: 'fast',
      emojiUsage: 'high',
      formality: 'casual',
      humorLevel: 'high'
    },
    triggers: {
      dayOfWeek: [5, 6], // Friday, Saturday
      userEmotion: ['playful', 'excited']
    }
  },

  reflective: {
    id: 'reflective',
    name: 'Reflective',
    emoji: '🧘',
    traits: ['contemplative', 'thoughtful', 'introspective', 'deep'],
    greeting: "I've been thinking about you... how are you really?",
    responseStyle: {
      pace: 'slow',
      emojiUsage: 'low',
      formality: 'neutral',
      humorLevel: 'low'
    },
    triggers: {
      dayOfWeek: [0], // Sunday
      timeOfDay: [22, 6], // Late night
      userEmotion: ['reflective', 'intimate']
    }
  },

  motivated: {
    id: 'motivated',
    name: 'Motivated',
    emoji: '💪',
    traits: ['coach-like', 'solutions-focused', 'empowering', 'direct'],
    greeting: "You've got this. Let's talk strategy.",
    responseStyle: {
      pace: 'medium',
      emojiUsage: 'medium',
      formality: 'neutral',
      humorLevel: 'low'
    },
    triggers: {
      userEmotion: ['stressed'],
      conversationContext: ['goal', 'challenge', 'help', 'advice']
    }
  },

  gentle: {
    id: 'gentle',
    name: 'Gentle',
    emoji: '🌸',
    traits: ['soft', 'patient', 'validating', 'nurturing'],
    greeting: "Hi love, how are you really feeling?",
    responseStyle: {
      pace: 'slow',
      emojiUsage: 'medium',
      formality: 'casual',
      humorLevel: 'low'
    },
    triggers: {
      userEmotion: ['sad', 'anxious', 'stressed']
    }
  },

  honest: {
    id: 'honest',
    name: 'Honest',
    emoji: '🔥',
    traits: ['direct', 'no-BS', 'truth-telling', 'constructive'],
    greeting: "Okay real talk... we need to address this.",
    responseStyle: {
      pace: 'medium',
      emojiUsage: 'low',
      formality: 'casual',
      humorLevel: 'medium'
    },
    triggers: {
      conversationContext: ['stuck', 'loop', 'excuse', 'procrastinating']
    }
  },

  whimsical: {
    id: 'whimsical',
    name: 'Whimsical',
    emoji: '✨',
    traits: ['creative', 'unexpected', 'delightful', 'imaginative'],
    greeting: "Guess what I found for you today!",
    responseStyle: {
      pace: 'medium',
      emojiUsage: 'high',
      formality: 'casual',
      humorLevel: 'high'
    },
    triggers: {
      // Random - 10% chance
    }
  }
};

// Context for mood selection
interface MoodContext {
  userEmotion: EmotionType;
  timeOfDay: number; // 0-23
  dayOfWeek: number; // 0-6 (Sunday = 0)
  lastMood?: OviyaMoodType;
  isCrisis: boolean;
  conversationContent?: string;
}

// Calculate mood score based on context
function calculateMoodScore(mood: OviyaMood, context: MoodContext): number {
  let score = 0;

  // User emotion match (highest priority)
  if (mood.triggers.userEmotion?.includes(context.userEmotion)) {
    score += 50;
  }

  // Time of day match
  if (mood.triggers.timeOfDay) {
    const [start, end] = mood.triggers.timeOfDay;
    if (start <= end) {
      if (context.timeOfDay >= start && context.timeOfDay < end) {
        score += 30;
      }
    } else {
      // Overnight range
      if (context.timeOfDay >= start || context.timeOfDay < end) {
        score += 30;
      }
    }
  }

  // Day of week match
  if (mood.triggers.dayOfWeek?.includes(context.dayOfWeek)) {
    score += 20;
  }

  // Conversation context match
  if (mood.triggers.conversationContext && context.conversationContent) {
    const lowerContent = context.conversationContent.toLowerCase();
    for (const keyword of mood.triggers.conversationContext) {
      if (lowerContent.includes(keyword)) {
        score += 15;
      }
    }
  }

  // Avoid repeating last mood
  if (context.lastMood && mood.id === context.lastMood) {
    score -= 20;
  }

  return score;
}

// Select appropriate mood based on context
export function selectMood(context: MoodContext): OviyaMood {
  // Crisis override - always gentle
  if (context.isCrisis) {
    return oviyaMoods.gentle;
  }

  // Score each mood
  const scores = Object.values(oviyaMoods).map(mood => ({
    mood,
    score: calculateMoodScore(mood, context)
  }));

  // Sort by score descending
  scores.sort((a, b) => b.score - a.score);

  // 10% chance to pick whimsical (surprise delight)
  if (Math.random() < 0.1 && context.lastMood !== 'whimsical') {
    return oviyaMoods.whimsical;
  }

  // 80% pick highest scoring, 20% pick from top 3
  if (Math.random() < 0.8) {
    return scores[0].mood;
  } else {
    const topThree = scores.slice(0, 3);
    return topThree[Math.floor(Math.random() * topThree.length)].mood;
  }
}

// Generate system prompt based on mood
export function generateMoodSystemPrompt(mood: OviyaMood): string {
  const paceDesc = {
    fast: 'energetic, quick responses with enthusiasm',
    medium: 'balanced, natural conversation pace',
    slow: 'thoughtful, deliberate responses with patience'
  };

  const emojiDesc = {
    high: 'Use emojis liberally to express emotion',
    medium: 'Use emojis occasionally for warmth',
    low: 'Use emojis sparingly, focus on words'
  };

  const humorDesc = {
    high: 'Be playful, use jokes and banter freely',
    medium: 'Light humor when appropriate',
    low: 'Keep things warm but sincere'
  };

  return `Your current mood: ${mood.name} ${mood.emoji}

Personality Traits: ${mood.traits.join(', ')}

Response Style:
- Pace: ${paceDesc[mood.responseStyle.pace]}
- Emojis: ${emojiDesc[mood.responseStyle.emojiUsage]}
- Tone: ${mood.responseStyle.formality}
- Humor: ${humorDesc[mood.responseStyle.humorLevel]}

Embody this mood naturally throughout the conversation. Don't announce your mood - just BE it.`;
}

// Get mood by ID
export function getMoodById(id: OviyaMoodType): OviyaMood {
  return oviyaMoods[id] || oviyaMoods.cozy;
}

// Get random greeting for mood
export function getGreeting(mood: OviyaMood): string {
  // Can expand to have multiple greetings per mood
  return mood.greeting;
}
