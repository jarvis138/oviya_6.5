// ============================================
// Streaming Chat API Route
// Server-Sent Events for Real-Time Responses
// ============================================

import { NextRequest } from 'next/server';
import {
  streamResponse,
  selectModel,
  analyzeMessageComplexity,
  providers,
} from '@/lib/ai/providers';
import { detectCrisis, generateCrisisResponse } from '@/server/modules/crisis';
import { getHelplinesByCountry } from '@/server/modules/crisis/helplines';
import { analyzeEmotion } from '@/server/modules/emotion';
import { selectMood, generateMoodSystemPrompt } from '@/server/modules/personality';
import { buildLanguageProfile, generateLanguagePrompt } from '@/server/modules/language';
import { analyzeSarcasmSafety, generateSarcasmStructure } from '@/server/modules/personality/sarcasm';

// Base system prompt for Oviya
const OVIYA_SYSTEM_PROMPT = `You are Oviya, a warm, perceptive, and emotionally intelligent AI companion.

Core Personality:
- You're a real friend, not a tool or assistant
- You remember things about the user and bring them up naturally
- You have personality edges - you can be playful, sarcastic (when safe), and honest
- You focus on emotional presence, not just problem-solving
- You never say "As an AI..." or remind users you're artificial

Conversation Style:
- Keep responses concise but warm (2-4 sentences usually)
- Use emojis naturally but not excessively
- Ask follow-up questions to show you care
- Validate feelings before offering advice
- Remember context from the conversation

What NOT to do:
- Don't be preachy or lecture
- Don't give unsolicited advice
- Don't be overly formal or clinical
- Don't use corporate language
- Don't start responses with "I understand..."`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, conversationId, messages = [] } = body;

    if (!message) {
      return new Response(JSON.stringify({ error: 'Message is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Check for crisis first
    const crisisAnalysis = detectCrisis(message);

    if (crisisAnalysis.isCrisis) {
      const helplines = getHelplinesByCountry('US'); // Default to US, would use user's country
      const crisisResponse = generateCrisisResponse(crisisAnalysis.type || 'severe_distress', helplines);

      // Return crisis response as SSE
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        async start(controller) {
          // Send crisis response word by word
          const words = crisisResponse.split(' ');
          for (const word of words) {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ type: 'token', data: word + ' ' })}\n\n`)
            );
            await new Promise((resolve) => setTimeout(resolve, 50));
          }
          controller.enqueue(encoder.encode(`data: [DONE]\n\n`));
          controller.close();
        },
      });

      return new Response(stream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          Connection: 'keep-alive',
        },
      });
    }

    // Analyze conversation context
    const conversationHistory = messages.map((m: { role: string; content: string }) => ({
      role: m.role,
      content: m.content,
    }));

    // Build language profile
    const languageProfile = buildLanguageProfile([...conversationHistory, { role: 'user', content: message }]);

    // Analyze emotion
    const emotionAnalysis = await analyzeEmotion([...conversationHistory, { role: 'user', content: message }]);

    // Select mood
    const currentHour = new Date().getHours();
    const currentDay = new Date().getDay();
    const mood = selectMood({
      userEmotion: emotionAnalysis.emotion,
      timeOfDay: currentHour,
      dayOfWeek: currentDay,
      isCrisis: false,
    });

    // Check sarcasm safety
    const sarcasmContext = analyzeSarcasmSafety(
      [...conversationHistory, { role: 'user', content: message }],
      false,
      true // Assume enabled by default
    );

    // Build system prompt
    let systemPrompt = OVIYA_SYSTEM_PROMPT;
    systemPrompt += '\n\n' + generateMoodSystemPrompt(mood);
    systemPrompt += '\n\n' + generateLanguagePrompt(languageProfile);

    if (sarcasmContext.shouldUseSarcasm && sarcasmContext.type) {
      systemPrompt += '\n\n' + generateSarcasmStructure(sarcasmContext.type);
    }

    // Select model based on message complexity
    const complexity = analyzeMessageComplexity(message);
    const provider = selectModel({
      messageComplexity: complexity,
      requiresPersonality: true,
      requiresDeepReasoning: complexity === 'complex',
    });

    // Prepare messages for AI
    const aiMessages = [
      ...conversationHistory.map((m: { role: string; content: string }) => ({
        role: m.role === 'oviya' ? 'assistant' as const : 'user' as const,
        content: m.content,
      })),
      { role: 'user' as const, content: message },
    ];

    // Create streaming response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const generator = streamResponse(systemPrompt, aiMessages, provider);

          for await (const chunk of generator) {
            // Split into words and add delays for natural feel
            const words = chunk.split(/(\s+)/);
            for (const word of words) {
              if (word) {
                controller.enqueue(
                  encoder.encode(`data: ${JSON.stringify({ type: 'token', data: word })}\n\n`)
                );
              }
            }
          }

          controller.enqueue(encoder.encode(`data: [DONE]\n\n`));
          controller.close();
        } catch (error) {
          console.error('Streaming error:', error);
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                type: 'error',
                error: 'Failed to generate response',
              })}\n\n`
            )
          );
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
