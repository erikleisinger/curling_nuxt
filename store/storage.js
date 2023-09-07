import { defineStore } from "pinia";
import {useDebounceFn} from '@vueuse/core'



const processQueue = useDebounceFn(async ({fetchQueue, setFetch, teamAvatars}) => {
    if (fetchQueue.length === 0) {
        setFetch(false)
        return;
    }

    const {teamId, avatarUrl} = fetchQueue.shift();

    if (teamAvatars[teamId]) {
        processQueue({fetchQueue, setFetch, teamAvatars});
        return;
    }
    setFetch(true)
    const client = useSupabaseClient();
    const { data } = await client.storage.from("Avatars").download(avatarUrl);
    const url = URL.createObjectURL(data);
    teamAvatars[teamId] = url;
    processQueue({fetchQueue, setFetch, teamAvatars});

}, 10)

export const useStorageStore = defineStore("storage", {
    state: () => {
        return {
            fetching: false,
            fetchQueue: [],
            teamAvatars: {},
        };
    },
    getters: {
       
    },
    actions: {
        addAvatar(blob, teamId) {
            this.teamAvatars[teamId] = URL.createObjectURL(blob)
        },
        getTeamAvatar(teamId, avatarUrl) {
            this.fetchQueue.push({teamId, avatarUrl})
            if (!this.fetching) {
                processQueue({fetchQueue: this.fetchQueue, teamAvatars: this.teamAvatars, setFetch: this.setFetch})
            }

        },
        removeAvatar(teamId) {
            delete this.teamAvatars[teamId]
        },  
        setFetch(bool) {
            this.fetching = bool;
        }
    },
});
