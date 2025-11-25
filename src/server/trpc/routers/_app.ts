// ============================================
// tRPC App Router - Main Entry Point
// ============================================

import { router } from '../init';
import { chatRouter } from './chat';
import { memoryRouter } from './memory';
import { emotionRouter } from './emotion';
import { ritualsRouter } from './rituals';
import { userRouter } from './user';

export const appRouter = router({
  chat: chatRouter,
  memory: memoryRouter,
  emotion: emotionRouter,
  rituals: ritualsRouter,
  user: userRouter,
});

export type AppRouter = typeof appRouter;
