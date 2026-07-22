import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

// If env vars aren't set (e.g. local dev without a .env yet), the app still
// runs fully offline on localStorage — sync just won't be available.
export const supabaseEnabled = Boolean(url && anonKey);

export const supabase = supabaseEnabled ? createClient(url as string, anonKey as string) : null;
