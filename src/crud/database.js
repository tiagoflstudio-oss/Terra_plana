import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.SUPABASE_ANON_KEY;

export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

export const isConfigured = () => !!supabase;

export const testConnection = async () => {
  if (!supabase) return { success: false, error: 'Database not configured' };
  
  try {
    const { data, error } = await supabase.from('users').select('id').limit(1);
    if (error) throw error;
    return { success: true, result: data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export default supabase;
