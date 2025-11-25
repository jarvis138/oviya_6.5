'use client';

// ============================================
// Main Chat Interface Component
// ============================================

import React, { useEffect, useRef } from 'react';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';
import { TypingIndicator } from './TypingIndicator';
import { useChatStore } from '@/store/chat';
import { useTheme } from '@/components/providers/ThemeProvider';
import { OviyaMoodType } from '@/types';
import { oviyaMoods } from '@/server/modules/personality';
import { CrisisResourceCard } from './CrisisResourceCard';

interface ChatInterfaceProps {
  conversationId?: string;
}

export function ChatInterface({ conversationId }: ChatInterfaceProps) {
  const {
    messages,
    isGenerating,
    streamingContent,
    currentMood,
    addMessage,
    setGenerating,
    updateStreamingContent,
    finalizeStream,
  } = useChatStore();

  const { theme, isCrisis } = useTheme();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingContent]);

  // Handle sending message
  const handleSendMessage = async (content: string) => {
    if (!content.trim() || isGenerating) return;

    // Add user message
    addMessage({
      conversationId: conversationId || 'temp',
      role: 'user',
      content: content.trim(),
    });

    // Start generating
    setGenerating(true);

    // Add placeholder for Oviya's response
    addMessage({
      conversationId: conversationId || 'temp',
      role: 'oviya',
      content: '',
      streaming: true,
      oviyaMood: currentMood,
    });

    try {
      // Call streaming API
      const response = await fetch('/api/chat/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: content.trim(),
          conversationId,
          messages: messages.slice(-10), // Send last 10 messages for context
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullContent = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') {
                continue;
              }
              try {
                const parsed = JSON.parse(data);
                if (parsed.type === 'token' && parsed.data) {
                  fullContent += parsed.data;
                  updateStreamingContent(fullContent);
                }
              } catch {
                // Ignore parse errors for incomplete chunks
              }
            }
          }
        }
      }

      // Finalize the stream
      finalizeStream(fullContent);
    } catch (error) {
      console.error('Chat error:', error);
      finalizeStream("I'm sorry, I had trouble responding. Can you try again?");
    }
  };

  const mood = oviyaMoods[currentMood as OviyaMoodType];

  return (
    <div className="flex flex-col h-full max-h-screen">
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 backdrop-blur-lg border-b"
        style={{
          backgroundColor: theme.inputBackground,
          borderColor: 'rgba(255, 255, 255, 0.1)',
        }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold">
            O
          </div>
          <div>
            <h1 className="font-semibold" style={{ color: theme.textPrimary }}>
              Oviya
            </h1>
            <p className="text-xs" style={{ color: theme.textSecondary }}>
              {mood?.emoji} {mood?.name || 'Your AI friend'}
            </p>
          </div>
        </div>
      </div>

      {/* Crisis Resources (if in crisis mode) */}
      {isCrisis && (
        <div className="px-4 py-2">
          <CrisisResourceCard countryCode="US" />
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <MessageList
          messages={messages}
          streamingContent={streamingContent}
          theme={theme}
        />

        {isGenerating && !streamingContent && <TypingIndicator theme={theme} />}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 backdrop-blur-lg border-t" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}>
        <ChatInput
          onSend={handleSendMessage}
          disabled={isGenerating}
          placeholder="Message Oviya..."
          theme={theme}
        />
      </div>
    </div>
  );
}
