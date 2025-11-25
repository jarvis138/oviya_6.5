// ============================================
// OVIYA - Type Definitions
// ============================================

// --------------------------------------------
// User Types
// --------------------------------------------
export interface User {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string;
  timezone: string;
  languageProfile: LanguageProfile;
  preferences: UserPreferences;
  subscriptionTier: 'free' | 'premium' | 'lifetime';
  subscriptionExpiresAt?: Date;
  createdAt: Date;
  lastSeenAt: Date;
  onboardingCompleted: boolean;
}

export interface UserPreferences {
  sarcasmEnabled: boolean;
  dailyRitualsEnabled: boolean;
  morningCheckInTime: string;
  eveningGratitudeTime: string;
  notificationsEnabled: boolean;
}

// --------------------------------------------
// Language Types
// --------------------------------------------
export interface LanguageProfile {
  primary: string; // ISO 639-1 code
  secondary: string[];
  codeSwitchingStyle: 'sentence_level' | 'word_level' | 'particle';
  formalityLevel: 'casual' | 'neutral' | 'formal';
  culturalParticles: string[];
}

// --------------------------------------------
// Conversation Types
// --------------------------------------------
export interface Conversation {
  id: string;
  userId: string;
  title?: string;
  lastMessageAt: Date;
  createdAt: Date;
}

export interface Message {
  id: string;
  conversationId: string;
  role: 'user' | 'oviya' | 'system';
  content: string;
  emotion?: EmotionType;
  oviyaMood?: OviyaMoodType;
  tokensUsed?: number;
  modelUsed?: string;
  latencyMs?: number;
  createdAt: Date;
  metadata?: Record<string, unknown>;
  streaming?: boolean;
}

// --------------------------------------------
// Emotion Types
// --------------------------------------------
export type EmotionType =
  | 'stressed'
  | 'anxious'
  | 'sad'
  | 'angry'
  | 'excited'
  | 'playful'
  | 'reflective'
  | 'cozy'
  | 'celebratory'
  | 'intimate'
  | 'neutral';

export interface EmotionAnalysis {
  emotion: EmotionType;
  intensity: number; // 0-1
  isCrisis: boolean;
  crisisType?: 'self_harm' | 'suicide' | 'abuse' | 'severe_distress';
  confidence: number;
  keywords?: string[];
}

export interface EmotionTheme {
  id: EmotionType;
  gradient: string;
  messageBubbleUser: string;
  messageBubbleOviya: string;
  textPrimary: string;
  textSecondary: string;
  inputBackground: string;
  accent: string;
}

// --------------------------------------------
// Personality & Mood Types
// --------------------------------------------
export type OviyaMoodType =
  | 'energetic'
  | 'cozy'
  | 'playful'
  | 'reflective'
  | 'motivated'
  | 'gentle'
  | 'honest'
  | 'whimsical';

export interface OviyaMood {
  id: OviyaMoodType;
  name: string;
  emoji: string;
  traits: string[];
  greeting: string;
  responseStyle: {
    pace: 'fast' | 'medium' | 'slow';
    emojiUsage: 'high' | 'medium' | 'low';
    formality: 'casual' | 'neutral' | 'formal';
    humorLevel: 'high' | 'medium' | 'low';
  };
  triggers: {
    timeOfDay?: [number, number];
    dayOfWeek?: number[];
    userEmotion?: EmotionType[];
    conversationContext?: string[];
  };
}

// --------------------------------------------
// Memory Types
// --------------------------------------------
export interface Memory {
  id: string;
  userId: string;
  content: string;
  category: 'personal_fact' | 'preference' | 'event' | 'pattern';
  importance: number; // 1-10
  embedding?: number[];
  createdAt: Date;
  lastAccessedAt: Date;
  metadata?: {
    extractedFrom?: string;
    relatedEntities?: string[];
  };
}

// --------------------------------------------
// Ritual Types
// --------------------------------------------
export type RitualType = 'morning' | 'afternoon' | 'evening';

export interface Ritual {
  id: string;
  userId: string;
  type: RitualType;
  scheduledTime: string; // HH:mm format
  enabled: boolean;
  lastCompleted?: Date;
  streak: number;
  totalCompletions: number;
  createdAt: Date;
}

export interface RitualResponse {
  id: string;
  ritualId: string;
  userId: string;
  responseText?: string;
  gratitudeItems?: string[];
  mood?: string;
  completedAt: Date;
}

// --------------------------------------------
// Crisis Types
// --------------------------------------------
export interface CrisisAnalysis {
  isCrisis: boolean;
  type: 'self_harm' | 'suicide' | 'abuse' | 'severe_distress' | null;
  severity: 'low' | 'medium' | 'high';
  confidence: number;
  keywords: string[];
}

export interface Helpline {
  country: string;
  countryCode: string;
  name: string;
  number: string;
  available: string;
  url?: string;
}

// --------------------------------------------
// Care Package Types
// --------------------------------------------
export interface CarePackage {
  id: string;
  userId: string;
  triggerReason: string;
  contents: {
    message: string;
    recommendations?: string[];
    musicPlaylist?: string;
    affirmations?: string[];
  };
  sentAt: Date;
  openedAt?: Date;
  userFeedback?: string;
}

// --------------------------------------------
// Strength Detection Types
// --------------------------------------------
export interface DetectedStrength {
  id: string;
  userId: string;
  strengthType: string;
  context: string;
  evidenceMessageIds: string[];
  detectedAt: Date;
  acknowledgedByUser: boolean;
}

// --------------------------------------------
// Anniversary Types
// --------------------------------------------
export interface Anniversary {
  id: string;
  userId: string;
  milestoneType: string;
  milestoneValue: number;
  celebratedAt: Date;
  userResponse?: string;
}

// --------------------------------------------
// Shared Moment Types
// --------------------------------------------
export interface SharedMoment {
  id: string;
  userId: string;
  messageId: string;
  emotionCategory?: string;
  userNote?: string;
  createdAt: Date;
}

// --------------------------------------------
// AI Provider Types
// --------------------------------------------
export type AIProviderType = 'anthropic' | 'openai' | 'groq';

export interface AIProvider {
  id: string;
  name: string;
  model: string;
  costPer1MTokens: {
    input: number;
    output: number;
  };
  latency: 'fast' | 'medium' | 'slow';
  maxTokens: number;
}

export interface AIResponse {
  content: string;
  tokensUsed: {
    input: number;
    output: number;
  };
  model: string;
  latencyMs: number;
}

// --------------------------------------------
// API Types
// --------------------------------------------
export interface ChatRequest {
  message: string;
  conversationId?: string;
}

export interface StreamToken {
  type: 'token' | 'done' | 'error';
  data?: string;
  error?: string;
}
