'use client';

// ============================================
// Message Bubble Component
// ============================================

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Message, EmotionTheme } from '@/types';
import { formatTimestamp } from '@/lib/utils';

interface MessageBubbleProps {
  message: Message;
  theme: EmotionTheme;
  isStreaming?: boolean;
  streamingContent?: string;
}

export function MessageBubble({
  message,
  theme,
  isStreaming,
  streamingContent,
}: MessageBubbleProps) {
  const [showTimestamp, setShowTimestamp] = useState(false);
  const isUser = message.role === 'user';
  const content = isStreaming ? streamingContent : message.content;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
      onClick={() => setShowTimestamp(!showTimestamp)}
    >
      <div className={`max-w-[85%] ${isUser ? 'order-2' : 'order-1'}`}>
        {/* Avatar for Oviya */}
        {!isUser && (
          <div className="flex items-center gap-2 mb-1">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-xs font-bold">
              O
            </div>
            <span
              className="text-xs font-medium"
              style={{ color: theme.textSecondary }}
            >
              Oviya
            </span>
          </div>
        )}

        {/* Message bubble */}
        <div
          className={`px-4 py-3 rounded-2xl ${
            isUser
              ? 'rounded-br-md'
              : 'rounded-bl-md'
          }`}
          style={{
            backgroundColor: isUser
              ? theme.messageBubbleUser
              : theme.messageBubbleOviya,
            color: theme.textPrimary,
          }}
        >
          <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">
            {content || (isStreaming ? '...' : '')}
            {isStreaming && (
              <span className="inline-block w-1 h-4 ml-1 bg-current animate-pulse" />
            )}
          </p>
        </div>

        {/* Timestamp */}
        {showTimestamp && message.createdAt && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`text-xs mt-1 ${isUser ? 'text-right' : 'text-left'}`}
            style={{ color: theme.textSecondary }}
          >
            {formatTimestamp(new Date(message.createdAt))}
          </motion.p>
        )}
      </div>
    </motion.div>
  );
}
