// ============================================
// Supabase Client-Side Configuration
// ============================================

import { createBrowserClient } from '@supabase/ssr';

export const createClient = () => {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
};

// Singleton instance for client-side
let clientInstance: ReturnType<typeof createBrowserClient> | null = null;

export const getSupabaseClient = () => {
  if (!clientInstance) {
    clientInstance = createClient();
  }
  return clientInstance;
};
