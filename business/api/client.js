import { createClient } from '@supabase/supabase-js';

export default class SupabaseService {
  constructor(apiUrl, apiKey) {
    this.supabase = createClient(apiUrl, apiKey);
  }

}