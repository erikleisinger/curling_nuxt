import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";
import type Team from "@/types/team";
import { TABLE_NAMES } from "@/constants/tables";
import { useNotificationStore } from "@/store/notification";

export const useTeamStore = defineStore("team", {
    state: () => {
        return {
            teams: useStorage("teams", [] as Team[]),
        };
    },
    actions: {
        async addPlayerToTeam(
            playerId: number,
            teamId: number,
            position: string
        ) {
            const { client, fetchHandler } = useSupabaseFetch();
            const { error } = await fetchHandler(() =>
                client
                    .from(TABLE_NAMES.TEAMS)
                    .update({ [`${position}_player_id`]: playerId })
                    .eq("id", teamId)
            );
            if (error) {
                console.error(error);
                return;
            }
            this.refreshTeam(teamId);
        },
        async createBlankTeam() {
            const notStore = useNotificationStore();
            const notId = notStore.addNotification({text: 'Creating new team...', state: 'pending'})
            const { client, fetchHandler } = useSupabaseFetch();
            const { data } = await fetchHandler(() =>
                client
                    .from(TABLE_NAMES.TEAMS)
                    .insert({ name: "New Team" })
                    .select("id")
            );

            const [team] = data || [];
            const { id } = team || {};
            if (!id) {
                console.error("error creating new team: no id returned");
                notStore.updateNotification(notId, {state: 'failed', text: 'error creating new team: no id returned'})
                return;
            }
            await this.refreshTeam(id)
            this.sortTeams();
            notStore.updateNotification(notId, {state: 'completed', text: 'Team created!', timeout: 5000})
            return id;
        },
        async deleteTeam(id: number | null) {
            const { client, fetchHandler } = useSupabaseFetch();
            const { data } = await fetchHandler(
                () => client.from(TABLE_NAMES.TEAMS).delete().eq("id", id),
                { onError: "Error deleting team" }
            );
            if (data) {
                const index = this.teams.findIndex((g) => g.id === id);
                if (index === -1) return;
                this.teams.splice(index, 1);
            }
        },
        async fetchTeams(force = false) {
            //   if (this.teams.length && !force) return;

            //   const {client, fetchHandler} = useSupabaseFetch();
            //   const {data} = await fetchHandler(() => client
            //     .rpc('get_teams_detailed'), {onError: 'Error fetching teams'})
            //     if (!data) return;
            //   this.teams = data
            //   this.sortTeams();
            if (this.teams.length && !force) return;

            const { client, fetchHandler } = useSupabaseFetch();
            const { getQuery } = useDatabase();
            const { data } = await fetchHandler(
                () =>
                    client
                        .from(TABLE_NAMES.TEAMS)
                        .select(getQuery(TABLE_NAMES.TEAMS)),
                { onError: "Error fetching teams" }
            );
            if (!data) return;
            this.teams = data;
            this.sortTeams();
        },
        async insertTeam(team: Team) {
            const { client, fetchHandler } = useSupabaseFetch();
            const { getQuery } = useDatabase();
            //   const {id} = getUser() ?? {};
            const { data } = await fetchHandler(
                () =>
                    client
                        .from(TABLE_NAMES.TEAMS)
                        .upsert(team)
                        .select(getQuery(TABLE_NAMES.TEAMS)),
                { onError: "Error creating team" }
            );
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
        async refreshTeam(teamId: number, shouldSort = false) {
            const { client, fetchHandler } = useSupabaseFetch();
            //   const {data} = await fetchHandler(() => client
            //     .rpc('get_team_detailed', {team_id_param: teamId}), {onError: 'Error refreshing team'})
            const { getQuery } = useDatabase();
            const { data } = await fetchHandler(
                () =>
                    client
                        .from(TABLE_NAMES.TEAMS)
                        .select(getQuery(TABLE_NAMES.TEAMS))
                        .eq("id", teamId),
                { onError: "Error fetching teams" }
            );
            const [refreshedTeam] = data || [];

            if (refreshedTeam) {
                const index = this.teams.findIndex(
                    (g) => g.id === refreshedTeam.id
                );
                if (index === -1) {
                    this.teams.push(refreshedTeam);
                } else {
                    this.teams.splice(index, 1, refreshedTeam);
                }
                if (shouldSort) this.sortTeams();
            }
        },
        async removePlayerFromTeam(teamId: number, position: string) {
            const { client, fetchHandler } = useSupabaseFetch();
            const { error } = await fetchHandler(() =>
                client
                    .from(TABLE_NAMES.TEAMS)
                    .update({ [`${position}_player_id`]: null })
                    .eq("id", teamId)
            );

            if (error) {
                console.error(error);
                return;
            }
            this.refreshTeam(teamId);
        },
        resetTeams() {
            this.teams = [];
        },
        sortTeams() {
            const { sortNameAlphabetically } = useSort();
            this.teams.sort(sortNameAlphabetically);
        },
        async updateTeamName(newName: string, teamId: number) {
            const { client, fetchHandler } = useSupabaseFetch();
            const { error } = await fetchHandler(() =>
                client
                    .from(TABLE_NAMES.TEAMS)
                    .update({ name: newName })
                    .eq("id", teamId)
            );

            if (error) {
                console.error(error);
                return;
            }
            this.refreshTeam(teamId);
        },
    },
});
