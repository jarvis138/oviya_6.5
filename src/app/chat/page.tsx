'use client';

// ============================================
// Chat Page
// ============================================

import React, { useEffect } from 'react';
import { ChatInterface } from '@/components/chat/ChatInterface';
import { EmotionThemeProvider } from '@/components/providers/ThemeProvider';
import { useChatStore } from '@/store/chat';

export default function ChatPage() {
  const { createNewConversation, currentConversationId } = useChatStore();

  // Create a new conversation if none exists
  useEffect(() => {
    if (!currentConversationId) {
      createNewConversation();
    }
  }, [currentConversationId, createNewConversation]);

  return (
    <EmotionThemeProvider>
      <div className="h-screen">
        <ChatInterface conversationId={currentConversationId || undefined} />
      </div>
    </EmotionThemeProvider>
  );
}
