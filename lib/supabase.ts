import { createClient } from '@supabase/supabase-js';

// Environment variable validation
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

// If you have generated types from Supabase, pass them as a generic argument to createClient
// const supabase = createClient<Database>(supabaseUrl, supabaseKey);
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
