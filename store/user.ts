import {defineStore} from "pinia";
export const useUserStore = defineStore("user", {
  state: () => {
    return {
        avatarUrl: null,
        email: null,
        friendId: null,
      id: null,
      player_id: null,
      showNumbers: false,
      timezone: 'America/Toronto',
      username: null,
      userTeams: [],
    } as {
        avatarUrl: string | null,
        email: string | null,
        friendId: string | null,
        id: string | null,
        player_id: number | null,
        showNumbers: boolean,
        timezone: string,
        username: string | null
        userTeams: number[]
    };
  },

  actions: {
    async getCurrentUser() {
        const {client, fetchHandler} = useSupabaseFetch();
        const sesh = await client.auth.getUser();

        const {id: profileId, email = null} = sesh.data.user || {};
        this.setEmail(email)
        const {data} = await fetchHandler(() => client.from('profiles').select('*').eq('id', profileId), {onError: 'Error getting current user'})
        if (!data) return;
        const [user] = data || [];
        const {timezone, id, friend_id:friendId, username, avatar_url: avatarUrl, player_id} = user || {};
        this.setData({timezone, id, friendId, username, avatarUrl, email, player_id})
        await this.getUserTeams();
    },
    async getUserTeams() {
        const {client, fetchHandler} = useSupabaseFetch();
        const {id: profileId} = this;
        const {data} = await fetchHandler(() => client.from('team_profile_junction').select('team_id').eq('profile_id', profileId), {onError: 'Error getting user teams'})
        if (!data) return;
        const teams = data.map(({team_id}) => team_id)
        this.setUserTeams(teams)
        // const [user] = data || [];
        // const {timezone, id, friend_id:friendId, username, avatar_url: avatarUrl} = user || {};
        // this.setData({timezone, id, friendId, username, avatarUrl, email})
    },
    setAvatar(path:string) {
        this.avatarUrl = path;
    },
    setEmail(email:string | null) {
        this.email = email;
    },
    setData(data: {timezone: string | null, id: string | null, friendId: string | null, username: string | null, avatar_url: string | null, email: string | null, player_id: null | number }) {
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
    setUserTeams(teams: number[]) {
        this.userTeams = teams;
    },
    toggleShowNumbers() {
        this.showNumbers = !this.showNumbers
    }
  },
});
