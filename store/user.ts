import {defineStore} from "pinia";
import type {Database} from '@/types/supabase'
export const useUserStore = defineStore("user", {
  state: () => {
    return {
        avatarUrl: null,
        friendId: null,
      id: null,
      showNumbers: false,
      timezone: 'America/Toronto',
      username: null,
    } as {
        avatarUrl: string | null,
        friendId: string | null,
        id: string | null,
        showNumbers: boolean,
        timezone: string,
        username: string | null
    };
  },

  actions: {
    async getCurrentUser() {
        const client = useSupabaseClient<Database>();
        const sesh = await client.auth.getUser();
        const profileId = sesh.data.user?.id;
        const {data} = await client.from('profiles').select('*').eq('id', profileId)
        const [user] = data || [];
        const {timezone, id, friend_id:friendId, username, avatar_url: avatarUrl} = user || {};
        this.setData({timezone, id, friendId, username, avatarUrl})
    },
    setAvatar(path:string) {
        this.avatarUrl = path;
    },
    setData(data: {timezone: string | null, id: string | null, friendId: string | null, username: string | null, avatar_url: string | null }) {
        Object.assign(this, data)
    },
    setFriendId(id: string) {
        this.friendId = id;
    },
    setId(id: string) {
        this.id = id
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
