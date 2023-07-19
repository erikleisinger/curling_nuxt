import {defineStore} from "pinia";
import type {Database} from '@/types/supabase'
export const useUserStore = defineStore("user", {
  state: () => {
    return {
      timezone: 'America/Toronto',
    };
  },

  actions: {
    async getCurrentUser() {
        const client = useSupabaseAuthClient<Database>();
        const {data} = await client.from('profiles').select()
        const [user] = data || [];
        const {timezone} = user;
        this.setTimezone(timezone)
    },
    setTimezone(timezone: string | null | undefined) {
        if (!timezone) return;
      this.timezone = timezone;
    },
  },
});
