import { defineStore } from 'pinia';
import {useStorage} from "@vueuse/core";


export const useTeamStore = defineStore('team', {
    state: () => {
        return {
            teams: useStorage("teams", []),
        }
    },
    actions: {
        async fetchTeams(force = false) {
            if (this.teams.length && !force) return;
            const client = useSupabaseAuthClient();
            const {getUser, getQuery} = useDatabase();
            const {id} = getUser() ?? {};
            const {data} = await client
              .from(TABLE_NAMES.TEAMS)
              .select(getQuery(TABLE_NAMES.TEAMS))
              .eq("profile_id", id);
            this.teams = data;
          },
          
    },
    subscribeToTeamChanges() {
            
    }
})