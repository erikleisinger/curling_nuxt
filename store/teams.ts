import {defineStore} from "pinia";
import {useStorage} from "@vueuse/core";
import type Team from "@/types/team";
import type {SupabaseTeamReturn} from "types/fetch";
import {TABLE_NAMES} from "@/constants/tables";
import type {Database} from '@/types/supabase'

export const useTeamStore = defineStore("team", {
  state: () => {
    return {
      teams: useStorage("teams", [] as Team[]),
    };
  },
  actions: {
    async deleteTeam(id: number | null) {
        const client = useSupabaseAuthClient();
        const {error} = await client
          .from(TABLE_NAMES.TEAMS)
          .delete()
          .eq("id", id);
        if (error) {
          const {code} = error || {};
          const {setBanner} = useBanner();
          setBanner(`Error deleting team (code ${code})`, "negative");
        } else {
          const index = this.teams.findIndex((g) => g.id === id);
          if (index === -1) return;
          this.teams.splice(index, 1);
        }
      },
    async fetchTeams(force = false) {
      if (this.teams.length && !force) return;

      const client = useSupabaseAuthClient<Database>();
      const {getUser, getQuery} = useDatabase();
      const {id} = getUser() ?? {};
      const {data, error} = await client
        .from(TABLE_NAMES.TEAMS)
        .select(getQuery(TABLE_NAMES.TEAMS))
        .eq("profile_id", id) as SupabaseTeamReturn
        if (!data || error) return;
      this.teams = data
      this.sortTeams();
    },
    async insertTeam(team: Team) {
      const client = useSupabaseAuthClient<Database>();
      const {getUser, getQuery} = useDatabase();
      const {id} = getUser() ?? {};
      const {data, error} = await client
        .from(TABLE_NAMES.TEAMS)
        .upsert({
          ...team,
          profile_id: id,
        })
        .select(getQuery(TABLE_NAMES.TEAMS)) as SupabaseTeamReturn
      const [newTeam] = data || [];
      if (error || !newTeam) {
        const {code} = error || {};
        const {setBanner} = useBanner();
        setBanner(`Error creating team (code ${code})`, "negative");
      } else {
        const index = this.teams.findIndex((g) => g.id === newTeam.id);
        if (index === -1) {
          this.teams.push(newTeam);
        } else {
          this.teams.splice(index, 1, newTeam);
        }
        this.sortTeams();
      }
    },
    sortTeams() {
      const {sortNameAlphabetically} = useSort();
      this.teams.sort(sortNameAlphabetically);
    }
  },
});