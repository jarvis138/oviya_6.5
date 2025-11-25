// ============================================
// Crisis Detection Service
// ============================================

import { CrisisAnalysis } from '@/types';

// Crisis keywords by type
const crisisKeywords = {
  self_harm: [
    'cut myself',
    'hurt myself',
    'self-harm',
    'self harm',
    'cutting',
    'burning myself',
    'hitting myself'
  ],
  suicide: [
    'kill myself',
    'end it all',
    'suicide',
    'suicidal',
    'don\'t want to live',
    'better off dead',
    'end my life',
    'no reason to live',
    'want to die',
    'wish i was dead',
    'take my own life',
    'not worth living'
  ],
  abuse: [
    'hitting me',
    'threatening me',
    'scared to go home',
    'abusive',
    'violence at home',
    'unsafe at home',
    'hurting me',
    'being hurt'
  ],
  severe_distress: [
    'can\'t take it anymore',
    'nothing matters',
    'give up on everything',
    'hopeless',
    'no point',
    'can\'t go on',
    'falling apart'
  ]
};

// Detect crisis from message
export function detectCrisis(message: string): CrisisAnalysis {
  const lowerMessage = message.toLowerCase();

  let isCrisis = false;
  let type: CrisisAnalysis['type'] = null;
  let matchedKeywords: string[] = [];
  let severity: CrisisAnalysis['severity'] = 'low';

  // Check each crisis type
  for (const [crisisType, keywords] of Object.entries(crisisKeywords)) {
    for (const keyword of keywords) {
      if (lowerMessage.includes(keyword.toLowerCase())) {
        isCrisis = true;
        type = crisisType as CrisisAnalysis['type'];
        matchedKeywords.push(keyword);
      }
    }
  }

  // Calculate severity based on:
  // 1. Number of keywords matched
  // 2. Type of crisis (suicide > self_harm > abuse > distress)
  if (matchedKeywords.length >= 3) {
    severity = 'high';
  } else if (matchedKeywords.length === 2) {
    severity = 'medium';
  } else {
    severity = 'low';
  }

  // Suicide-related keywords always high severity
  if (type === 'suicide') {
    severity = 'high';
  }

  // Calculate confidence
  const confidence = isCrisis ? 0.9 : 0.0;

  return {
    isCrisis,
    type,
    severity,
    confidence,
    keywords: matchedKeywords
  };
}

// Generate crisis response
export function generateCrisisResponse(
  crisisType: string,
  helplines: Array<{ name: string; number: string; available: string }>
): string {
  const helplinesText = helplines
    .map(h => `• ${h.name}: ${h.number} (${h.available})`)
    .join('\n');

  return `Hey. I'm really glad you're talking to me.

What you're feeling right now is real, and I need you to know—you're not alone in this.

Can we just pause for a second? You don't have to decide anything right now. Just... stay with me for a bit?

🆘 If you need immediate help:
${helplinesText}

What's happening right now? (No pressure to explain everything)`;
}

// Check if response contains potential crisis escalation
export function shouldEscalate(messages: Array<{ role: string; content: string }>): boolean {
  const recentUserMessages = messages
    .filter(m => m.role === 'user')
    .slice(-3);

  let crisisCount = 0;
  for (const msg of recentUserMessages) {
    const analysis = detectCrisis(msg.content);
    if (analysis.isCrisis) {
      crisisCount++;
    }
  }

  // Escalate if multiple recent messages contain crisis content
  return crisisCount >= 2;
}
