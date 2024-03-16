import { createClient } from '@supabase/supabase-js';


export function supabaseClient() {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
    const supabaseClient = createClient(supabaseUrl, supabaseKey)
    return supabaseClient
}