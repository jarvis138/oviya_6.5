'use client';

// ============================================
// Message List Component
// ============================================

import React from 'react';
import { MessageBubble } from './MessageBubble';
import { Message, EmotionTheme } from '@/types';

interface MessageListProps {
  messages: Message[];
  streamingContent: string;
  theme: EmotionTheme;
}

export function MessageList({ messages, streamingContent, theme }: MessageListProps) {
  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-4">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-3xl font-bold mb-4">
          O
        </div>
        <h2
          className="text-2xl font-bold mb-2"
          style={{ color: theme.textPrimary }}
        >
          Hey there! 💜
        </h2>
        <p
          className="max-w-sm"
          style={{ color: theme.textSecondary }}
        >
          I'm Oviya, your AI friend. I'm here to listen, chat, and maybe make your day a little better. What's on your mind?
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {messages.map((message, index) => (
        <MessageBubble
          key={message.id || index}
          message={message}
          theme={theme}
          isStreaming={message.streaming && index === messages.length - 1}
          streamingContent={
            message.streaming && index === messages.length - 1
              ? streamingContent
              : undefined
          }
        />
      ))}
    </div>
  );
}
