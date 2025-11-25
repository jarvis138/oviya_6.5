// ============================================
// User Router - tRPC Endpoints
// ============================================

import { z } from 'zod';
import { router, protectedProcedure, publicProcedure } from '../init';
import { TRPCError } from '@trpc/server';

export const userRouter = router({
  // Get current user profile
  me: protectedProcedure.query(async ({ ctx }) => {
    const { supabase, user } = ctx;

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      // User doesn't exist in our table yet, return auth user info
      return {
        id: user.id,
        email: user.email,
        name: null,
        avatarUrl: null,
        timezone: 'UTC',
        languageProfile: {
          primary: 'en',
          secondary: [],
          codeSwitchingStyle: 'sentence_level',
          formalityLevel: 'casual',
          culturalParticles: [],
        },
        preferences: {
          sarcasmEnabled: true,
          dailyRitualsEnabled: true,
          morningCheckInTime: '09:00',
          eveningGratitudeTime: '21:00',
          notificationsEnabled: true,
        },
        subscriptionTier: 'free',
        onboardingCompleted: false,
      };
    }

    return data;
  }),

  // Update user profile
  update: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).max(100).optional(),
        timezone: z.string().optional(),
        languageProfile: z
          .object({
            primary: z.string(),
            secondary: z.array(z.string()),
            codeSwitchingStyle: z.enum(['sentence_level', 'word_level', 'particle']),
            formalityLevel: z.enum(['casual', 'neutral', 'formal']),
            culturalParticles: z.array(z.string()),
          })
          .optional(),
        preferences: z
          .object({
            sarcasmEnabled: z.boolean(),
            dailyRitualsEnabled: z.boolean(),
            morningCheckInTime: z.string(),
            eveningGratitudeTime: z.string(),
            notificationsEnabled: z.boolean(),
          })
          .optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { supabase, user } = ctx;

      const updateData: Record<string, unknown> = {
        last_seen_at: new Date().toISOString(),
      };

      if (input.name) updateData.name = input.name;
      if (input.timezone) updateData.timezone = input.timezone;
      if (input.languageProfile) updateData.language_profile = input.languageProfile;
      if (input.preferences) updateData.preferences = input.preferences;

      const { data, error } = await supabase
        .from('users')
        .upsert({
          id: user.id,
          email: user.email,
          ...updateData,
        })
        .select()
        .single();

      if (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update user',
        });
      }

      return data;
    }),

  // Complete onboarding
  completeOnboarding: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).max(100),
        timezone: z.string(),
        languageProfile: z.object({
          primary: z.string(),
          secondary: z.array(z.string()),
          codeSwitchingStyle: z.enum(['sentence_level', 'word_level', 'particle']),
          formalityLevel: z.enum(['casual', 'neutral', 'formal']),
          culturalParticles: z.array(z.string()),
        }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { supabase, user } = ctx;

      const { data, error } = await supabase
        .from('users')
        .upsert({
          id: user.id,
          email: user.email,
          name: input.name,
          timezone: input.timezone,
          language_profile: input.languageProfile,
          preferences: {
            sarcasmEnabled: true,
            dailyRitualsEnabled: true,
            morningCheckInTime: '09:00',
            eveningGratitudeTime: '21:00',
            notificationsEnabled: true,
          },
          onboarding_completed: true,
          created_at: new Date().toISOString(),
          last_seen_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to complete onboarding',
        });
      }

      return data;
    }),

  // Delete account
  deleteAccount: protectedProcedure.mutation(async ({ ctx }) => {
    const { supabase, user } = ctx;

    // Delete all user data
    await supabase.from('users').delete().eq('id', user.id);

    // Note: Cascading deletes will handle related data if foreign keys are set up properly

    return { success: true };
  }),
});
