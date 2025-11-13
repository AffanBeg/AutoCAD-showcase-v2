import { createClient } from "@supabase/supabase-js";

/**
 * Server-side Supabase client for Next.js server components and API routes
 * Uses environment variables that are only available on the server
 */
export const createServerClient = () => {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
    {
      auth: {
        persistSession: false,
      },
    }
  );
};
