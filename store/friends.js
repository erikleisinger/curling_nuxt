import { defineStore } from "pinia";
import { useUserStore } from "@/store/user";
import {useStorage} from '@vueuse/core'
export const useFriendStore = defineStore("friends", {
    state: () => {
        return {
            friends: useStorage('friends', {}),
        };
    },
    getters: {
        getFriend: (state) => {
            return (id) => state.friends[id];
        },
        getFriendAvatar() {
            return (id) => this.friends[id]?.avatar;
        },
        getFriendUsername: (state) => {
            return (id) => state.friends[id]?.username;
        }
    },
    actions: {
        async getFriends(force = false) {
            if (Object.keys(this.friends)?.length && !force) return;

            const userStore = useUserStore();
            const { id } = userStore;
            const {client, fetchHandler} = useSupabaseFetch();
            const { data } = await fetchHandler(() => client.from("friends").select(`
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
            `), {onError: 'Error deleting game'})
         
            if (data) {
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
