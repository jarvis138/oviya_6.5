// ============================================
// Chat Store - Zustand State Management
// ============================================

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Message, EmotionType, OviyaMoodType, Conversation } from '@/types';
import { v4 as uuidv4 } from 'uuid';

interface ChatState {
  // Current conversation
  currentConversationId: string | null;
  messages: Message[];
  isGenerating: boolean;
  streamingContent: string;

  // Emotion & Mood
  currentEmotion: EmotionType;
  currentMood: OviyaMoodType;
  isCrisis: boolean;

  // Conversations list
  conversations: Conversation[];

  // Actions
  setCurrentConversation: (id: string | null) => void;
  addMessage: (message: Omit<Message, 'id' | 'createdAt'>) => void;
  updateStreamingContent: (content: string) => void;
  finalizeStream: (fullContent: string) => void;
  setGenerating: (isGenerating: boolean) => void;
  setEmotion: (emotion: EmotionType) => void;
  setMood: (mood: OviyaMoodType) => void;
  setCrisis: (isCrisis: boolean) => void;
  clearMessages: () => void;
  loadMessages: (messages: Message[]) => void;
  setConversations: (conversations: Conversation[]) => void;
  createNewConversation: () => string;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentConversationId: null,
      messages: [],
      isGenerating: false,
      streamingContent: '',
      currentEmotion: 'neutral',
      currentMood: 'cozy',
      isCrisis: false,
      conversations: [],

      // Actions
      setCurrentConversation: (id) => {
        set({ currentConversationId: id, messages: [] });
      },

      addMessage: (message) => {
        const newMessage: Message = {
          ...message,
          id: uuidv4(),
          createdAt: new Date(),
        };
        set((state) => ({
          messages: [...state.messages, newMessage],
        }));
      },

      updateStreamingContent: (content) => {
        set({ streamingContent: content });
      },

      finalizeStream: (fullContent) => {
        set((state) => {
          // Update the last message (the streaming one) with full content
          const messages = [...state.messages];
          if (messages.length > 0) {
            const lastMessage = messages[messages.length - 1];
            if (lastMessage.role === 'oviya' && lastMessage.streaming) {
              messages[messages.length - 1] = {
                ...lastMessage,
                content: fullContent,
                streaming: false,
              };
            }
          }
          return {
            messages,
            streamingContent: '',
            isGenerating: false,
          };
        });
      },

      setGenerating: (isGenerating) => {
        set({ isGenerating });
      },

      setEmotion: (emotion) => {
        set({ currentEmotion: emotion });
      },

      setMood: (mood) => {
        set({ currentMood: mood });
      },

      setCrisis: (isCrisis) => {
        set({ isCrisis });
      },

      clearMessages: () => {
        set({ messages: [], streamingContent: '' });
      },

      loadMessages: (messages) => {
        set({ messages });
      },

      setConversations: (conversations) => {
        set({ conversations });
      },

      createNewConversation: () => {
        const newId = uuidv4();
        const newConversation: Conversation = {
          id: newId,
          userId: '', // Will be set when saved to DB
          lastMessageAt: new Date(),
          createdAt: new Date(),
        };
        set((state) => ({
          conversations: [newConversation, ...state.conversations],
          currentConversationId: newId,
          messages: [],
        }));
        return newId;
      },
    }),
    {
      name: 'oviya-chat-storage',
      partialize: (state) => ({
        currentConversationId: state.currentConversationId,
        currentEmotion: state.currentEmotion,
        currentMood: state.currentMood,
      }),
    }
  )
);
