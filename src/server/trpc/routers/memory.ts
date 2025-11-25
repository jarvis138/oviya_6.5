// ============================================
// Memory Router - tRPC Endpoints
// ============================================

import { z } from 'zod';
import { router, protectedProcedure } from '../init';
import { TRPCError } from '@trpc/server';
import { v4 as uuidv4 } from 'uuid';

export const memoryRouter = router({
  // List all memories for user
  list: protectedProcedure
    .input(
      z.object({
        category: z
          .enum(['personal_fact', 'preference', 'event', 'pattern'])
          .optional(),
        limit: z.number().min(1).max(100).default(50),
      })
    )
    .query(async ({ ctx, input }) => {
      const { supabase, user } = ctx;

      let query = supabase
        .from('memories')
        .select('*')
        .eq('user_id', user.id)
        .order('importance', { ascending: false })
        .order('last_accessed_at', { ascending: false })
        .limit(input.limit);

      if (input.category) {
        query = query.eq('category', input.category);
      }

      const { data, error } = await query;

      if (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch memories',
        });
      }

      return data;
    }),

  // Get single memory
  get: protectedProcedure
    .input(z.object({ memoryId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const { supabase, user } = ctx;

      const { data, error } = await supabase
        .from('memories')
        .select('*')
        .eq('id', input.memoryId)
        .eq('user_id', user.id)
        .single();

      if (error) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Memory not found',
        });
      }

      return data;
    }),

  // Create memory
  create: protectedProcedure
    .input(
      z.object({
        content: z.string().min(1),
        category: z.enum(['personal_fact', 'preference', 'event', 'pattern']),
        importance: z.number().min(1).max(10),
        metadata: z.record(z.string(), z.unknown()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { supabase, user } = ctx;

      const { data, error } = await supabase
        .from('memories')
        .insert({
          id: uuidv4(),
          user_id: user.id,
          content: input.content,
          category: input.category,
          importance: input.importance,
          metadata: input.metadata || {},
          created_at: new Date().toISOString(),
          last_accessed_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create memory',
        });
      }

      return data;
    }),

  // Update memory
  update: protectedProcedure
    .input(
      z.object({
        memoryId: z.string().uuid(),
        content: z.string().min(1).optional(),
        importance: z.number().min(1).max(10).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { supabase, user } = ctx;

      const updateData: Record<string, unknown> = {
        last_accessed_at: new Date().toISOString(),
      };

      if (input.content) updateData.content = input.content;
      if (input.importance) updateData.importance = input.importance;

      const { data, error } = await supabase
        .from('memories')
        .update(updateData)
        .eq('id', input.memoryId)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update memory',
        });
      }

      return data;
    }),

  // Delete memory
  delete: protectedProcedure
    .input(z.object({ memoryId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const { supabase, user } = ctx;

      const { error } = await supabase
        .from('memories')
        .delete()
        .eq('id', input.memoryId)
        .eq('user_id', user.id);

      if (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to delete memory',
        });
      }

      return { success: true };
    }),

  // Search memories (semantic search - simplified without vector for now)
  search: protectedProcedure
    .input(
      z.object({
        query: z.string().min(1),
        limit: z.number().min(1).max(20).default(5),
      })
    )
    .query(async ({ ctx, input }) => {
      const { supabase, user } = ctx;

      // Simple text search for now (vector search would need embeddings)
      const { data, error } = await supabase
        .from('memories')
        .select('*')
        .eq('user_id', user.id)
        .textSearch('content', input.query)
        .order('importance', { ascending: false })
        .limit(input.limit);

      if (error) {
        // Fallback to ILIKE search if text search fails
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('memories')
          .select('*')
          .eq('user_id', user.id)
          .ilike('content', `%${input.query}%`)
          .order('importance', { ascending: false })
          .limit(input.limit);

        if (fallbackError) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to search memories',
          });
        }

        return fallbackData;
      }

      return data;
    }),
});
