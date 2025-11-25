// ============================================
// Context-Aware Sarcasm & Roasts
// Pattern 5: Personality Over Politeness
// ============================================

export interface SarcasmContext {
  isSafe: boolean;
  reason: string;
  shouldUseSarcasm: boolean;
  type?: 'self_deprecation' | 'excuse_making' | 'overdramatic' | 'humble_brag';
}

// Check if sarcasm is safe to use
export function analyzeSarcasmSafety(
  messages: Array<{ role: string; content: string }>,
  isCrisis: boolean,
  sarcasmEnabled: boolean
): SarcasmContext {
  // Never use if user disabled
  if (!sarcasmEnabled) {
    return {
      isSafe: false,
      reason: 'User has disabled sarcasm',
      shouldUseSarcasm: false
    };
  }

  // Never use during crisis
  if (isCrisis) {
    return {
      isSafe: false,
      reason: 'Crisis detected - being gentle',
      shouldUseSarcasm: false
    };
  }

  const recentUserMessages = messages
    .filter(m => m.role === 'user')
    .slice(-5)
    .map(m => m.content.toLowerCase());

  const combinedText = recentUserMessages.join(' ');

  // Check for vulnerability signals
  const vulnerabilitySignals = [
    'i need support',
    'please be gentle',
    'no jokes',
    'i\'m really struggling',
    'please help',
    'i\'m scared',
    'just lost',
    'passed away',
    'died',
    'funeral'
  ];

  for (const signal of vulnerabilitySignals) {
    if (combinedText.includes(signal)) {
      return {
        isSafe: false,
        reason: 'User is vulnerable',
        shouldUseSarcasm: false
      };
    }
  }

  // Check for sarcasm-appropriate patterns

  // 1. Self-deprecation (3+ instances)
  const selfDeprecation = [
    'i\'m so stupid',
    'i\'m such an idiot',
    'i\'m terrible',
    'i\'m the worst',
    'i suck',
    'i can\'t do anything',
    'i\'m useless'
  ];

  let selfDepCount = 0;
  for (const phrase of selfDeprecation) {
    if (combinedText.includes(phrase)) {
      selfDepCount++;
    }
  }

  if (selfDepCount >= 2) {
    return {
      isSafe: true,
      reason: 'Excessive self-deprecation detected',
      shouldUseSarcasm: true,
      type: 'self_deprecation'
    };
  }

  // 2. Excuse making
  const excusePatterns = [
    'i can\'t because',
    'i don\'t have time',
    'i\'m too tired',
    'maybe tomorrow',
    'i\'ll do it later'
  ];

  let excuseCount = 0;
  for (const phrase of excusePatterns) {
    if (combinedText.includes(phrase)) {
      excuseCount++;
    }
  }

  if (excuseCount >= 2) {
    return {
      isSafe: true,
      reason: 'Excuse-making pattern detected',
      shouldUseSarcasm: true,
      type: 'excuse_making'
    };
  }

  // 3. Overdramatic statements
  const overdramaticPatterns = [
    'my life is over',
    'worst day ever',
    'everything is ruined',
    'nothing will ever',
    'always happens to me',
    'everyone hates me',
    'nobody cares'
  ];

  for (const phrase of overdramaticPatterns) {
    if (combinedText.includes(phrase)) {
      return {
        isSafe: true,
        reason: 'Overdramatic statement detected',
        shouldUseSarcasm: true,
        type: 'overdramatic'
      };
    }
  }

  // Default: safe but not warranted
  return {
    isSafe: true,
    reason: 'No specific pattern detected',
    shouldUseSarcasm: false
  };
}

// Generate sarcastic response structure
export function generateSarcasmStructure(type: SarcasmContext['type']): string {
  switch (type) {
    case 'self_deprecation':
      return `Structure your response as:
1. Playfully agree with their self-criticism (with 🙄 or 😏)
2. List 2-3 contradicting facts about them (things they've done well)
3. Reality check: distinguish between a bad moment and being a bad person
4. End with genuine support and actionable advice`;

    case 'excuse_making':
      return `Structure your response as:
1. Gently call out the excuse with humor (with 😏)
2. Ask what's REALLY stopping them
3. Acknowledge the real barrier might be different
4. Offer practical help if they want it`;

    case 'overdramatic':
      return `Structure your response as:
1. Playfully exaggerate their claim further (with 🙄)
2. Bring it back to reality - what actually happened
3. Acknowledge the feeling is valid, the conclusion isn't
4. End with perspective and support`;

    case 'humble_brag':
      return `Structure your response as:
1. Acknowledge the achievement genuinely
2. Playfully tease about the humble-brag (with 😏)
3. Celebrate with them properly`;

    default:
      return '';
  }
}

// Example responses by type (for reference/templates)
export const sarcasmExamples = {
  self_deprecation: `Oh absolutely. The dumbest person alive. That's why you:
- Remember random facts about your friends
- Give thoughtful advice when they're struggling
- Literally helped your friend move last month

Total idiot behavior. 🙄

You forgot a date. You're not stupid—you're human with ADHD-ish memory. Set a reminder right now. Problem solved.`,

  excuse_making: `Too tired... but not too tired to watch 47 Instagram reels about working out? 😏

Real talk—what's actually stopping you? Because it's not tiredness.`,

  overdramatic: `Oh for sure. Life = over. Time to move to a monastery. Your entire future determined by one Biology quiz. 🙄

You failed an exam. That's it. You didn't fail at life. When's the retake? Let's make a plan.`
};
