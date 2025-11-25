// ============================================
// Emotion Router - tRPC Endpoints
// ============================================

import { z } from 'zod';
import { router, protectedProcedure } from '../init';
import { analyzeEmotion } from '@/server/modules/emotion';
import { detectCrisis } from '@/server/modules/crisis';
import { getHelplinesByCountry } from '@/server/modules/crisis/helplines';

export const emotionRouter = router({
  // Analyze emotion from messages
  analyze: protectedProcedure
    .input(
      z.object({
        messages: z.array(
          z.object({
            role: z.string(),
            content: z.string(),
          })
        ),
        conversationId: z.string().uuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;

      // Get the last message for crisis detection
      const lastUserMessage = input.messages
        .filter(m => m.role === 'user')
        .pop();

      // Check for crisis first
      const crisisAnalysis = lastUserMessage
        ? detectCrisis(lastUserMessage.content)
        : { isCrisis: false };

      if (crisisAnalysis.isCrisis) {
        // Get helplines based on user's country (default to US)
        const userCountry = 'US'; // Would come from user profile
        const helplines = getHelplinesByCountry(userCountry);

        return {
          emotion: 'anxious' as const,
          intensity: 0.9,
          isCrisis: true,
          crisisType: crisisAnalysis.type,
          confidence: crisisAnalysis.confidence,
          helplines,
        };
      }

      // Analyze emotion from conversation
      const analysis = await analyzeEmotion(input.messages);

      return {
        ...analysis,
        isCrisis: false,
        helplines: [],
      };
    }),

  // Get helplines for a country
  getHelplines: protectedProcedure
    .input(z.object({ countryCode: z.string().length(2) }))
    .query(({ input }) => {
      return getHelplinesByCountry(input.countryCode);
    }),
});
