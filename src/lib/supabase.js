import { createClient } from '@supabase/supabase-js';

// Get keys from env or localStorage
export function getSupabaseConfig() {
  const url = import.meta.env.VITE_SUPABASE_URL || localStorage.getItem('mika_supabase_url');
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY || localStorage.getItem('mika_supabase_anon_key');
  
  return { 
    url: url?.trim() || '', 
    key: key?.trim() || '',
    isEnv: !!(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY)
  };
}

export function createSupabaseClient() {
  const { url, key } = getSupabaseConfig();
  if (url && key) {
    try {
      return createClient(url, key, {
        auth: {
          persistSession: false
        }
      });
    } catch (e) {
      console.error('Failed to initialize Supabase client:', e);
      return null;
    }
  }
  return null;
}

// Active singleton client
export let supabase = createSupabaseClient();

// Function to rebuild the client if keys change
export function reloadSupabaseClient() {
  supabase = createSupabaseClient();
  return supabase;
}
