import {defineStore} from "pinia";
import {useStorage} from "@vueuse/core";
import type Team from "@/types/team";
import type {SupabaseTeamReturn} from "types/fetch";
import {TABLE_NAMES} from "@/constants/tables";
import type {Database} from '@/types/supabase'
import { BannerColors } from "@/types/color";

export const useTeamStore = defineStore("team", {
  state: () => {
    return {
      teams: useStorage("teams", [] as Team[]),
    };
  },
  actions: {
    async deleteTeam(id: number | null) {
        const {client, fetchHandler} = useSupabaseFetch();
        const {data} = await fetchHandler(() => client
          .from(TABLE_NAMES.TEAMS)
          .delete()
          .eq("id", id), {onError: 'Error deleting team'})
        if (data) {
          const index = this.teams.findIndex((g) => g.id === id);
          if (index === -1) return;
          this.teams.splice(index, 1);
        }
      },
    async fetchTeams(force = false) {
      if (this.teams.length && !force) return;

      const {client, fetchHandler} = useSupabaseFetch();
      const { getQuery} = useDatabase();
    
      const {data} = await fetchHandler(() => client
        .rpc('get_teams_detailed'), {onError: 'Error fetching teams'})
        if (!data) return;
      this.teams = data
      this.sortTeams();
    },
    async insertTeam(team: Team) {
        const {client, fetchHandler} = useSupabaseFetch();
      const { getQuery} = useDatabase();
    //   const {id} = getUser() ?? {};
      const {data} = await fetchHandler(() => client
        .from(TABLE_NAMES.TEAMS)
        .upsert(team)
        .select(getQuery(TABLE_NAMES.TEAMS)), {onError: 'Error creating team'})
      const [newTeam] = data || [];
      if (newTeam) {
        const index = this.teams.findIndex((g) => g.id === newTeam.id);
        if (index === -1) {
          this.teams.push(newTeam);
        } else {
          this.teams.splice(index, 1, newTeam);
        }
        this.sortTeams();
      }
    },
    resetTeams() {
        this.teams = []
    },
    sortTeams() {
      const {sortNameAlphabetically} = useSort();
      this.teams.sort(sortNameAlphabetically);
    }
  },
});
