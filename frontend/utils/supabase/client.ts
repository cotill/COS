import { createBrowserClient } from "@supabase/ssr";
/**Used when connecting with supabase in a client component.
 * In next js client component, have "use client" at the top 
 */
export const createClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
