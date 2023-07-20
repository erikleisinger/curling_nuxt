import {defineStore} from "pinia";
import type {Database} from '@/types/supabase'
export const useUserStore = defineStore("user", {
  state: () => {
    return {
      showNumbers: false,
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
    toggleShowNumbers() {
        this.showNumbers = !this.showNumbers
    }
  },
});
