// ============================================
// Universal Language Detection & Code-Switching
// ============================================

import { LanguageProfile } from '@/types';

// Common code-switching patterns by language pair
const codeSwitchingPatterns: Record<string, {
  particles: string[];
  mixingStyle: LanguageProfile['codeSwitchingStyle'];
}> = {
  'hi-en': { // Hinglish
    particles: ['yaar', 'arre', 'na', 'ya', 'bhai', 'matlab', 'accha', 'theek hai'],
    mixingStyle: 'word_level'
  },
  'es-en': { // Spanglish
    particles: ['pues', 'wey', 'güey', 'órale', 'mira', 'bueno', 'ay'],
    mixingStyle: 'sentence_level'
  },
  'ko-en': { // Konglish
    particles: ['oppa', 'unnie', 'ya', 'ah', 'aigoo', 'daebak', 'jinja'],
    mixingStyle: 'word_level'
  },
  'ta-en': { // Tanglish
    particles: ['da', 'di', 'pa', 'ma', 'aama', 'illa', 'poda'],
    mixingStyle: 'word_level'
  },
  'ar-en': { // Arabizi
    particles: ['ya', 'wallah', 'habibi', 'yalla', 'inshallah', 'khalas'],
    mixingStyle: 'sentence_level'
  },
  'fr-en': { // Franglais
    particles: ['ben', 'quoi', 'là', 'genre', 'franchement'],
    mixingStyle: 'sentence_level'
  },
  'pt-en': { // Portunhol/Portuguese-English
    particles: ['né', 'cara', 'tipo', 'olha', 'pô'],
    mixingStyle: 'sentence_level'
  },
  'tl-en': { // Taglish (Filipino-English)
    particles: ['po', 'opo', 'ba', 'naman', 'diba', 'kasi', 'talaga'],
    mixingStyle: 'word_level'
  }
};

// Language detection (simplified - in production use a proper detector)
export function detectLanguage(text: string): {
  primary: string;
  secondary: string[];
  confidence: number;
} {
  const lowerText = text.toLowerCase();

  // Check for specific language patterns
  const languageIndicators: Record<string, RegExp[]> = {
    hi: [/[\u0900-\u097F]/, /\b(hai|hain|ka|ki|ke|mein|kya|nahi)\b/],
    es: [/[áéíóúüñ¿¡]/, /\b(el|la|los|las|que|por|para|como)\b/],
    ko: [/[\uAC00-\uD7AF]/, /[\u1100-\u11FF]/],
    ar: [/[\u0600-\u06FF]/, /[\u0750-\u077F]/],
    ta: [/[\u0B80-\u0BFF]/],
    fr: [/[àâçéèêëîïôùûü]/, /\b(je|tu|il|elle|nous|vous|sont|est)\b/],
    pt: [/[ãõç]/, /\b(não|sim|para|como|muito|bem)\b/],
    tl: [/\b(ang|ng|mga|sa|na|at|ay)\b/],
    ja: [/[\u3040-\u309F]|[\u30A0-\u30FF]|[\u4E00-\u9FAF]/],
    zh: [/[\u4E00-\u9FFF]/],
  };

  const detectedLanguages: string[] = [];

  // Check each language
  for (const [lang, patterns] of Object.entries(languageIndicators)) {
    for (const pattern of patterns) {
      if (pattern.test(text)) {
        if (!detectedLanguages.includes(lang)) {
          detectedLanguages.push(lang);
        }
        break;
      }
    }
  }

  // Check for English (if contains ASCII letters and common English words)
  const hasEnglish = /\b(the|is|are|was|were|have|has|had|do|does|did|will|would|could|should|can|may|might|must|i|you|he|she|it|we|they|a|an|and|but|or|so|if|when|what|how|why|where|who)\b/i.test(text);

  if (hasEnglish && !detectedLanguages.includes('en')) {
    detectedLanguages.unshift('en'); // English as primary if present
  }

  // Default to English if nothing detected
  if (detectedLanguages.length === 0) {
    detectedLanguages.push('en');
  }

  return {
    primary: detectedLanguages[0],
    secondary: detectedLanguages.slice(1),
    confidence: detectedLanguages.length === 1 ? 0.9 : 0.7
  };
}

// Detect cultural particles in text
export function detectParticles(text: string): string[] {
  const lowerText = text.toLowerCase();
  const detectedParticles: string[] = [];

  for (const pattern of Object.values(codeSwitchingPatterns)) {
    for (const particle of pattern.particles) {
      if (lowerText.includes(particle.toLowerCase())) {
        if (!detectedParticles.includes(particle)) {
          detectedParticles.push(particle);
        }
      }
    }
  }

  return detectedParticles;
}

// Build language profile from conversation history
export function buildLanguageProfile(
  messages: Array<{ role: string; content: string }>
): LanguageProfile {
  const userMessages = messages
    .filter(m => m.role === 'user')
    .map(m => m.content);

  if (userMessages.length === 0) {
    return getDefaultLanguageProfile();
  }

  const combinedText = userMessages.join(' ');
  const detection = detectLanguage(combinedText);
  const particles = detectParticles(combinedText);

  // Determine code-switching style
  let codeSwitchingStyle: LanguageProfile['codeSwitchingStyle'] = 'sentence_level';

  if (detection.secondary.length > 0) {
    const languagePair = `${detection.primary}-${detection.secondary[0]}`;
    const pattern = codeSwitchingPatterns[languagePair] || codeSwitchingPatterns[`${detection.secondary[0]}-${detection.primary}`];
    if (pattern) {
      codeSwitchingStyle = pattern.mixingStyle;
    }
  }

  // Detect formality level
  let formalityLevel: LanguageProfile['formalityLevel'] = 'casual';
  if (/\b(please|kindly|would you|could you|sir|ma'am)\b/i.test(combinedText)) {
    formalityLevel = 'formal';
  }

  return {
    primary: detection.primary,
    secondary: detection.secondary,
    codeSwitchingStyle,
    formalityLevel,
    culturalParticles: particles
  };
}

// Get default language profile
export function getDefaultLanguageProfile(): LanguageProfile {
  return {
    primary: 'en',
    secondary: [],
    codeSwitchingStyle: 'sentence_level',
    formalityLevel: 'casual',
    culturalParticles: []
  };
}

// Generate language-aware system prompt
export function generateLanguagePrompt(profile: LanguageProfile): string {
  let prompt = `Language Adaptation:
- Primary language: ${profile.primary}`;

  if (profile.secondary.length > 0) {
    prompt += `
- The user code-switches with: ${profile.secondary.join(', ')}
- Mix languages naturally using ${profile.codeSwitchingStyle.replace('_', ' ')} switching`;
  }

  if (profile.culturalParticles.length > 0) {
    prompt += `
- Naturally incorporate these particles when appropriate: ${profile.culturalParticles.join(', ')}`;
  }

  prompt += `
- Formality level: ${profile.formalityLevel}
- Mirror the user's language style naturally. Don't translate unless asked.`;

  return prompt;
}

// Language name mapping
export const languageNames: Record<string, string> = {
  en: 'English',
  hi: 'Hindi',
  es: 'Spanish',
  fr: 'French',
  de: 'German',
  pt: 'Portuguese',
  ko: 'Korean',
  ja: 'Japanese',
  zh: 'Chinese',
  ar: 'Arabic',
  ta: 'Tamil',
  te: 'Telugu',
  tl: 'Filipino/Tagalog',
  ru: 'Russian',
  it: 'Italian',
  nl: 'Dutch',
  pl: 'Polish',
  tr: 'Turkish',
  vi: 'Vietnamese',
  th: 'Thai'
};
