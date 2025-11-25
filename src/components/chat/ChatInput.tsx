'use client';

// ============================================
// Chat Input Component
// ============================================

import React, { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { EmotionTheme } from '@/types';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
  maxLength?: number;
  theme: EmotionTheme;
}

export function ChatInput({
  onSend,
  disabled = false,
  placeholder = 'Type a message...',
  maxLength = 2000,
  theme,
}: ChatInputProps) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  }, [message]);

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSend(message);
      setMessage('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      className="flex items-end gap-3 rounded-2xl p-2"
      style={{ backgroundColor: theme.inputBackground }}
    >
      <textarea
        ref={textareaRef}
        value={message}
        onChange={(e) => setMessage(e.target.value.slice(0, maxLength))}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        rows={1}
        className="flex-1 bg-transparent resize-none outline-none text-sm leading-relaxed py-2 px-2"
        style={{
          color: theme.textPrimary,
          maxHeight: '120px',
        }}
        aria-label="Message input"
      />

      {/* Character count */}
      {message.length > maxLength * 0.8 && (
        <span
          className="text-xs self-end mb-2"
          style={{ color: theme.textSecondary }}
        >
          {message.length}/{maxLength}
        </span>
      )}

      {/* Send button */}
      <button
        onClick={handleSend}
        disabled={!message.trim() || disabled}
        className="p-2 rounded-full transition-all duration-200 disabled:opacity-50"
        style={{
          backgroundColor: message.trim() ? theme.accent : 'transparent',
          color: theme.textPrimary,
        }}
        aria-label="Send message"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="22" y1="2" x2="11" y2="13" />
          <polygon points="22 2 15 22 11 13 2 9 22 2" />
        </svg>
      </button>
    </div>
  );
}
