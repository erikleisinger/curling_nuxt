import SupabaseService from '@/business/api/client'
import GatewayService from "@/business/api/gateway";
export default defineNuxtPlugin(() => {
    const config = useRuntimeConfig();
    const {
        SUPABASE_KEY,
        SUPABASE_URL
    } = config.public;
    const supabaseClient = new SupabaseService(SUPABASE_URL, SUPABASE_KEY);
    return {
        provide: {
            api: new GatewayService(supabaseClient)
        }
    }
});
