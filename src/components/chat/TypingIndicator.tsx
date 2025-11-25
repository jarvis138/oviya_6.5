'use client';

// ============================================
// Typing Indicator Component
// ============================================

import React from 'react';
import { motion } from 'framer-motion';
import { EmotionTheme } from '@/types';

interface TypingIndicatorProps {
  theme: EmotionTheme;
}

export function TypingIndicator({ theme }: TypingIndicatorProps) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-xs font-bold">
        O
      </div>
      <div
        className="px-4 py-3 rounded-2xl rounded-bl-md flex items-center gap-1"
        style={{ backgroundColor: theme.messageBubbleOviya }}
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: theme.accent }}
            animate={{
              y: [0, -6, 0],
            }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: i * 0.15,
            }}
          />
        ))}
      </div>
    </div>
  );
}
