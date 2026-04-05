import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const isConfigured = () => {
  return supabaseUrl !== 'https://your-project.supabase.co' && 
         supabaseAnonKey !== 'your-anon-key';
};

export const auth = {
  signUp: async (email, password) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    return { data, error };
  },
  
  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    return { data, error };
  },
  
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  },
  
  getSession: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  },
  
  onAuthStateChange: (callback) => {
    return supabase.auth.onAuthStateChange(callback);
  }
};

export default supabase;
