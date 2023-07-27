import { defineStore } from "pinia";
import { useUserStore } from "@/store/user";
export const useFriendStore = defineStore("friends", {
    state: () => {
        return {
            friends: {},
        };
    },
    getters: {
        getFriend: (state) => {
            return (id) => state.friends[id];
        },
        getFriendAvatar: (state) => {
            return (id) => state.friends[id]?.avatar;
        },
        getFriendUsername: (state) => {
            return (id) => state.friends[id]?.username;
        }
    },
    actions: {
        async getFriends() {
            const userStore = useUserStore();
            const { id } = userStore;
            const client = useSupabaseClient();
            const { data, error } = await client.from("friends").select(`
                profile_id_1 (
                    id,
                    avatar_url,
                    username
                ),
                profile_id_2 (
                    id,
                    avatar_url,
                    username
                )
            `);
         
            if (error) {
                const { code } = error;
                const { setBanner } = useBanner();
                setBanner(`Error deleting game (code ${code})`, "negative");
            } else {
                data.forEach((relation) => {
                    const {profile_id_1: profile1, profile_id_2: profile2} = relation;
                    if (profile1.id !== id) {
                        this.friends[profile1.id] = {
                            avatar: profile1.avatar_url,
                            username: profile1.username
                        }
                    } else if (profile2.id !== id) {
                        this.friends[profile2.id] = {
                            avatar: profile2.avatar_url,
                            username: profile2.username
                        }
                    } 
                })
            }
        },
    },
});
