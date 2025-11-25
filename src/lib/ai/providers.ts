// ============================================
// AI Provider Configuration & Orchestration
// Multi-Provider Strategy with Cost Optimization
// ============================================

import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';
import Groq from 'groq-sdk';
import { AIProvider, AIResponse } from '@/types';

// Provider configurations
export const providers: Record<string, AIProvider> = {
  'groq-llama': {
    id: 'groq-llama',
    name: 'Groq',
    model: 'llama-3.1-70b-versatile',
    costPer1MTokens: { input: 0.59, output: 0.79 },
    latency: 'fast',
    maxTokens: 8192
  },
  'anthropic-haiku': {
    id: 'anthropic-haiku',
    name: 'Anthropic',
    model: 'claude-3-haiku-20240307',
    costPer1MTokens: { input: 0.25, output: 1.25 },
    latency: 'fast',
    maxTokens: 200000
  },
  'anthropic-sonnet': {
    id: 'anthropic-sonnet',
    name: 'Anthropic',
    model: 'claude-3-5-sonnet-20241022',
    costPer1MTokens: { input: 3.00, output: 15.00 },
    latency: 'medium',
    maxTokens: 200000
  },
  'openai-gpt4o': {
    id: 'openai-gpt4o',
    name: 'OpenAI',
    model: 'gpt-4o',
    costPer1MTokens: { input: 2.50, output: 10.00 },
    latency: 'medium',
    maxTokens: 128000
  }
};

// Initialize clients lazily
let anthropicClient: Anthropic | null = null;
let openaiClient: OpenAI | null = null;
let groqClient: Groq | null = null;

function getAnthropicClient(): Anthropic {
  if (!anthropicClient) {
    anthropicClient = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY
    });
  }
  return anthropicClient;
}

function getOpenAIClient(): OpenAI {
  if (!openaiClient) {
    openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }
  return openaiClient;
}

function getGroqClient(): Groq {
  if (!groqClient) {
    groqClient = new Groq({
      apiKey: process.env.GROQ_API_KEY
    });
  }
  return groqClient;
}

// Smart model selection based on query complexity
export interface SelectionContext {
  messageComplexity: 'simple' | 'moderate' | 'complex';
  requiresPersonality: boolean;
  requiresDeepReasoning: boolean;
  maxBudgetPerMessage?: number; // in cents
}

export function selectModel(context: SelectionContext): AIProvider {
  // Simple greeting/acknowledgment → Groq Llama (cheapest, fastest)
  if (context.messageComplexity === 'simple' && !context.requiresPersonality) {
    return providers['groq-llama'];
  }

  // Personality/emotion/sarcasm → Claude Haiku (balanced)
  if (context.requiresPersonality && !context.requiresDeepReasoning) {
    return providers['anthropic-haiku'];
  }

  // Complex reasoning/growth insights → Claude Sonnet (best)
  if (context.requiresDeepReasoning) {
    return providers['anthropic-sonnet'];
  }

  // Default to Haiku for good balance
  return providers['anthropic-haiku'];
}

// Analyze message to determine complexity
export function analyzeMessageComplexity(message: string): SelectionContext['messageComplexity'] {
  const length = message.length;
  const questionMarks = (message.match(/\?/g) || []).length;

  // Simple: short messages, greetings
  if (length < 50 || /^(hi|hello|hey|good morning|gm|sup|yo|thanks|ok|okay|cool)[\s!?.]*$/i.test(message)) {
    return 'simple';
  }

  // Complex: long messages, multiple questions, deep topics
  if (length > 300 || questionMarks > 2) {
    return 'complex';
  }

  // Check for complex topics
  const complexKeywords = [
    'meaning', 'purpose', 'life', 'philosophy', 'advice', 'help me understand',
    'what should i do', 'career', 'relationship', 'future'
  ];

  for (const keyword of complexKeywords) {
    if (message.toLowerCase().includes(keyword)) {
      return 'complex';
    }
  }

  return 'moderate';
}

// Generate response using selected provider
export async function generateResponse(
  systemPrompt: string,
  messages: Array<{ role: 'user' | 'assistant'; content: string }>,
  provider: AIProvider
): Promise<AIResponse> {
  const startTime = Date.now();

  try {
    if (provider.name === 'Anthropic') {
      return await generateAnthropicResponse(systemPrompt, messages, provider);
    } else if (provider.name === 'OpenAI') {
      return await generateOpenAIResponse(systemPrompt, messages, provider);
    } else if (provider.name === 'Groq') {
      return await generateGroqResponse(systemPrompt, messages, provider);
    }

    throw new Error(`Unknown provider: ${provider.name}`);
  } catch (error) {
    console.error(`Error with provider ${provider.name}:`, error);

    // Fallback to different provider
    if (provider.id !== 'anthropic-haiku') {
      console.log('Falling back to Claude Haiku...');
      return await generateAnthropicResponse(systemPrompt, messages, providers['anthropic-haiku']);
    }

    throw error;
  }
}

// Anthropic Claude response
async function generateAnthropicResponse(
  systemPrompt: string,
  messages: Array<{ role: 'user' | 'assistant'; content: string }>,
  provider: AIProvider
): Promise<AIResponse> {
  const startTime = Date.now();
  const client = getAnthropicClient();

  const response = await client.messages.create({
    model: provider.model,
    max_tokens: 1024,
    system: systemPrompt,
    messages: messages.map(m => ({
      role: m.role,
      content: m.content
    }))
  });

  const content = response.content[0].type === 'text' ? response.content[0].text : '';

  return {
    content,
    tokensUsed: {
      input: response.usage.input_tokens,
      output: response.usage.output_tokens
    },
    model: provider.model,
    latencyMs: Date.now() - startTime
  };
}

// OpenAI GPT response
async function generateOpenAIResponse(
  systemPrompt: string,
  messages: Array<{ role: 'user' | 'assistant'; content: string }>,
  provider: AIProvider
): Promise<AIResponse> {
  const startTime = Date.now();
  const client = getOpenAIClient();

  const response = await client.chat.completions.create({
    model: provider.model,
    max_tokens: 1024,
    messages: [
      { role: 'system', content: systemPrompt },
      ...messages
    ]
  });

  return {
    content: response.choices[0].message.content || '',
    tokensUsed: {
      input: response.usage?.prompt_tokens || 0,
      output: response.usage?.completion_tokens || 0
    },
    model: provider.model,
    latencyMs: Date.now() - startTime
  };
}

// Groq Llama response
async function generateGroqResponse(
  systemPrompt: string,
  messages: Array<{ role: 'user' | 'assistant'; content: string }>,
  provider: AIProvider
): Promise<AIResponse> {
  const startTime = Date.now();
  const client = getGroqClient();

  const response = await client.chat.completions.create({
    model: provider.model,
    max_tokens: 1024,
    messages: [
      { role: 'system', content: systemPrompt },
      ...messages
    ]
  });

  return {
    content: response.choices[0].message.content || '',
    tokensUsed: {
      input: response.usage?.prompt_tokens || 0,
      output: response.usage?.completion_tokens || 0
    },
    model: provider.model,
    latencyMs: Date.now() - startTime
  };
}

// Streaming response generator (for real-time chat)
export async function* streamResponse(
  systemPrompt: string,
  messages: Array<{ role: 'user' | 'assistant'; content: string }>,
  provider: AIProvider = providers['anthropic-haiku']
): AsyncGenerator<string, void, unknown> {
  if (provider.name === 'Anthropic') {
    const client = getAnthropicClient();

    const stream = await client.messages.stream({
      model: provider.model,
      max_tokens: 1024,
      system: systemPrompt,
      messages: messages.map(m => ({
        role: m.role,
        content: m.content
      }))
    });

    for await (const event of stream) {
      if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
        yield event.delta.text;
      }
    }
  } else {
    // For non-Anthropic, use non-streaming and yield all at once
    const response = await generateResponse(systemPrompt, messages, provider);
    yield response.content;
  }
}
