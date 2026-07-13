import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ralgfajytuxzjnbtoijj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJhbGdmYWp5dHV4empuYnRvaWpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM5NjQwODcsImV4cCI6MjA5OTU0MDA4N30.jQU-8dUFCRy470GcPHEHjG7FPoAPeRMLYJ3OprMOpH0';

// Initialize the client directly with embedded keys
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false
  }
});
