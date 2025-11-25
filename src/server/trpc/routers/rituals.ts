// ============================================
// Rituals Router - tRPC Endpoints
// ============================================

import { z } from 'zod';
import { router, protectedProcedure } from '../init';
import { TRPCError } from '@trpc/server';
import { v4 as uuidv4 } from 'uuid';

export const ritualsRouter = router({
  // Get all rituals for user
  list: protectedProcedure.query(async ({ ctx }) => {
    const { supabase, user } = ctx;

    const { data, error } = await supabase
      .from('rituals')
      .select('*')
      .eq('user_id', user.id)
      .order('type');

    if (error) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch rituals',
      });
    }

    return data;
  }),

  // Get single ritual
  get: protectedProcedure
    .input(z.object({ ritualId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const { supabase, user } = ctx;

      const { data, error } = await supabase
        .from('rituals')
        .select('*')
        .eq('id', input.ritualId)
        .eq('user_id', user.id)
        .single();

      if (error) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Ritual not found',
        });
      }

      return data;
    }),

  // Initialize rituals for new user
  initialize: protectedProcedure.mutation(async ({ ctx }) => {
    const { supabase, user } = ctx;

    const defaultRituals = [
      { type: 'morning', scheduled_time: '09:00', enabled: true },
      { type: 'afternoon', scheduled_time: '15:00', enabled: false },
      { type: 'evening', scheduled_time: '21:00', enabled: true },
    ];

    const rituals = defaultRituals.map(r => ({
      id: uuidv4(),
      user_id: user.id,
      ...r,
      streak: 0,
      total_completions: 0,
      created_at: new Date().toISOString(),
    }));

    const { data, error } = await supabase
      .from('rituals')
      .upsert(rituals, { onConflict: 'user_id,type' })
      .select();

    if (error) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to initialize rituals',
      });
    }

    return data;
  }),

  // Update ritual settings
  update: protectedProcedure
    .input(
      z.object({
        ritualId: z.string().uuid(),
        enabled: z.boolean().optional(),
        scheduledTime: z
          .string()
          .regex(/^\d{2}:\d{2}$/)
          .optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { supabase, user } = ctx;

      const updateData: Record<string, unknown> = {};
      if (input.enabled !== undefined) updateData.enabled = input.enabled;
      if (input.scheduledTime) updateData.scheduled_time = input.scheduledTime;

      const { data, error } = await supabase
        .from('rituals')
        .update(updateData)
        .eq('id', input.ritualId)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update ritual',
        });
      }

      return data;
    }),

  // Complete a ritual
  complete: protectedProcedure
    .input(
      z.object({
        ritualId: z.string().uuid(),
        responseText: z.string().optional(),
        gratitudeItems: z.array(z.string()).optional(),
        mood: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { supabase, user } = ctx;

      // Get current ritual data
      const { data: ritual, error: ritualError } = await supabase
        .from('rituals')
        .select('*')
        .eq('id', input.ritualId)
        .eq('user_id', user.id)
        .single();

      if (ritualError || !ritual) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Ritual not found',
        });
      }

      // Calculate streak
      const now = new Date();
      const lastCompleted = ritual.last_completed
        ? new Date(ritual.last_completed)
        : null;

      let newStreak = 1;
      if (lastCompleted) {
        const daysSinceLastCompletion = Math.floor(
          (now.getTime() - lastCompleted.getTime()) / (1000 * 60 * 60 * 24)
        );
        if (daysSinceLastCompletion === 1) {
          newStreak = ritual.streak + 1;
        } else if (daysSinceLastCompletion === 0) {
          // Already completed today
          newStreak = ritual.streak;
        }
      }

      // Save ritual response
      const { error: responseError } = await supabase
        .from('ritual_responses')
        .insert({
          id: uuidv4(),
          ritual_id: input.ritualId,
          user_id: user.id,
          response_text: input.responseText,
          gratitude_items: input.gratitudeItems,
          mood: input.mood,
          completed_at: now.toISOString(),
        });

      if (responseError) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to save ritual response',
        });
      }

      // Update ritual
      const { data: updatedRitual, error: updateError } = await supabase
        .from('rituals')
        .update({
          last_completed: now.toISOString(),
          streak: newStreak,
          total_completions: ritual.total_completions + 1,
        })
        .eq('id', input.ritualId)
        .select()
        .single();

      if (updateError) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update ritual',
        });
      }

      // Generate celebration message
      let message = 'Great job!';
      if (newStreak === 7) message = '🎉 One week streak! Amazing!';
      else if (newStreak === 30) message = '🏆 30-day streak! You\'re incredible!';
      else if (newStreak === 100) message = '👑 100-day streak! Legendary!';
      else if (newStreak > 1) message = `🔥 ${newStreak}-day streak!`;

      return {
        ...updatedRitual,
        message,
      };
    }),

  // Get ritual history
  getHistory: protectedProcedure
    .input(
      z.object({
        ritualType: z.enum(['morning', 'afternoon', 'evening']).optional(),
        limit: z.number().min(1).max(100).default(30),
      })
    )
    .query(async ({ ctx, input }) => {
      const { supabase, user } = ctx;

      let query = supabase
        .from('ritual_responses')
        .select('*, rituals!inner(type)')
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false })
        .limit(input.limit);

      if (input.ritualType) {
        query = query.eq('rituals.type', input.ritualType);
      }

      const { data, error } = await query;

      if (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch ritual history',
        });
      }

      return data;
    }),
});
