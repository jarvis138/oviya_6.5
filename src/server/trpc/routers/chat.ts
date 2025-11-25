// ============================================
// Chat Router - tRPC Endpoints
// ============================================

import { z } from 'zod';
import { router, publicProcedure, protectedProcedure } from '../init';
import { TRPCError } from '@trpc/server';
import { v4 as uuidv4 } from 'uuid';

export const chatRouter = router({
  // Get conversation history
  getHistory: protectedProcedure
    .input(
      z.object({
        conversationId: z.string().uuid(),
        limit: z.number().min(1).max(100).default(50),
        before: z.date().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { supabase, user } = ctx;

      let query = supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', input.conversationId)
        .order('created_at', { ascending: false })
        .limit(input.limit);

      if (input.before) {
        query = query.lt('created_at', input.before.toISOString());
      }

      const { data, error } = await query;

      if (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch messages',
        });
      }

      return data.reverse();
    }),

  // Get all conversations
  getConversations: protectedProcedure.query(async ({ ctx }) => {
    const { supabase, user } = ctx;

    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .eq('user_id', user.id)
      .order('last_message_at', { ascending: false });

    if (error) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch conversations',
      });
    }

    return data;
  }),

  // Create new conversation
  createConversation: protectedProcedure.mutation(async ({ ctx }) => {
    const { supabase, user } = ctx;

    const { data, error } = await supabase
      .from('conversations')
      .insert({
        id: uuidv4(),
        user_id: user.id,
        created_at: new Date().toISOString(),
        last_message_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to create conversation',
      });
    }

    return data;
  }),

  // Delete conversation
  deleteConversation: protectedProcedure
    .input(
      z.object({
        conversationId: z.string().uuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { supabase, user } = ctx;

      const { error } = await supabase
        .from('conversations')
        .delete()
        .eq('id', input.conversationId)
        .eq('user_id', user.id);

      if (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to delete conversation',
        });
      }

      return { success: true };
    }),

  // Save message (used after streaming completes)
  saveMessage: protectedProcedure
    .input(
      z.object({
        conversationId: z.string().uuid(),
        role: z.enum(['user', 'oviya', 'system']),
        content: z.string(),
        emotion: z.string().optional(),
        oviyaMood: z.string().optional(),
        tokensUsed: z.number().optional(),
        modelUsed: z.string().optional(),
        latencyMs: z.number().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { supabase, user } = ctx;

      const { data, error } = await supabase
        .from('messages')
        .insert({
          id: uuidv4(),
          conversation_id: input.conversationId,
          role: input.role,
          content: input.content,
          emotion: input.emotion,
          oviya_mood: input.oviyaMood,
          tokens_used: input.tokensUsed,
          model_used: input.modelUsed,
          latency_ms: input.latencyMs,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to save message',
        });
      }

      // Update conversation last_message_at
      await supabase
        .from('conversations')
        .update({ last_message_at: new Date().toISOString() })
        .eq('id', input.conversationId);

      return data;
    }),
});
