// ============================================
// User Store - Zustand State Management
// ============================================

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, LanguageProfile, UserPreferences } from '@/types';

interface UserState {
  // User data
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  setUser: (user: User | null) => void;
  updateLanguageProfile: (profile: Partial<LanguageProfile>) => void;
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
  setLoading: (isLoading: boolean) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      isLoading: true,

      // Actions
      setUser: (user) => {
        set({
          user,
          isAuthenticated: !!user,
          isLoading: false,
        });
      },

      updateLanguageProfile: (profile) => {
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: {
              ...currentUser,
              languageProfile: {
                ...currentUser.languageProfile,
                ...profile,
              },
            },
          });
        }
      },

      updatePreferences: (preferences) => {
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: {
              ...currentUser,
              preferences: {
                ...currentUser.preferences,
                ...preferences,
              },
            },
          });
        }
      },

      setLoading: (isLoading) => {
        set({ isLoading });
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: 'oviya-user-storage',
      partialize: (state) => ({
        // Only persist user preferences locally
        user: state.user
          ? {
              preferences: state.user.preferences,
              languageProfile: state.user.languageProfile,
            }
          : null,
      }),
    }
  )
);
