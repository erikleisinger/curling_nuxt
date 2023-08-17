import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";
import type Team from "@/types/team";
import { TABLE_NAMES } from "@/constants/tables";
import { useNotificationStore } from "@/store/notification";
import { useUserStore } from "@/store/user";
import { DatabaseError } from "@/types/error";
import { ErrorName } from "@/types/error";
import GET_TEAMS from '@/queries/get_teams'

export const useTeamStore = defineStore("team", {
    state: () => {
        return {
            teams: useStorage("teams", [] as Team[]),
        };
    },
    getters: {
        indexById: (state) => {
            return state.teams.reduce((map, item, index) => {
                map[item.id] = index;
                return map;
            }, {});
        },
        getTeamById(state) {
            return (id) => state.teams[this.indexById[id]];
        },
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
            const team = await this.refreshTeam(teamId);
            if (team) this.insertTeamIntoStore(team);
        },
        async cancelTeamRequest({
            requestee_profile_id,
            team_id,
        }: {
            requestee_profile_id: string;
            team_id: number;
        }) {
            const requester_profile_id = useUserStore().id;
            const { client, fetchHandler } = useSupabaseFetch();
            const { error } = await fetchHandler(() =>
                client
                    .from(TABLE_NAMES.TEAM_REQUESTS)
                    .delete()
                    .eq("requestee_profile_id", requestee_profile_id)
                    .eq("requester_profile_id", requester_profile_id)
                    .eq("team_id", team_id)
            );

            if (error) {
                throw new DatabaseError({
                    name: ErrorName.DELETE_ERROR,
                    message: "Error canceling request",
                    cause: error,
                    fatal: true,
                    table: TABLE_NAMES.TEAM_REQUESTS,
                });
            }
            const team = await this.refreshTeam(team_id);
            if (team) this.insertTeamIntoStore(team);
        },
        async confirmTeamRequest({
            requester_profile_id,
            team_id,
        }: {
            requester_profile_id: string;
            team_id: number;
        }) {
            const requestee_profile_id = useUserStore().id;
            const { client, fetchHandler } = useSupabaseFetch();
            const { error } = await fetchHandler(() =>
                client
                    .from(TABLE_NAMES.TEAM_REQUESTS)
                    .update({ status: "accepted" })
                    .eq("requestee_profile_id", requestee_profile_id)
                    .eq("requester_profile_id", requester_profile_id)
                    .eq("team_id", team_id)
                    .select("status")
            );

            if (error) {
                throw new DatabaseError({
                    name: ErrorName.UPDATE_ERROR,
                    message: "Error confirming request",
                    cause: error,
                    fatal: true,
                    table: TABLE_NAMES.TEAM_REQUESTS,
                });
            }
            const team = await this.refreshTeam(team_id);
            if (team) this.insertTeamIntoStore(team);
        },
        async createBlankTeam() {
            const notStore = useNotificationStore();
            const notId = notStore.addNotification({
                text: "Creating new team...",
                state: "pending",
            });
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
                notStore.updateNotification(notId, {
                    state: "failed",
                    text: "error creating new team: no id returned",
                });
                return;
            }
            const refreshedTeam = await this.refreshTeam(id);
            if (refreshedTeam) this.insertTeamIntoStore(refreshedTeam);
            this.sortTeams();
            notStore.updateNotification(notId, {
                state: "completed",
                text: "Team created!",
                timeout: 5000,
            });
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
        async denyTeamRequest({
            requester_profile_id,
            team_id,
        }: {
            requester_profile_id: string;
            team_id: number;
        }) {
            const requestee_profile_id = useUserStore().id;
            const { client, fetchHandler } = useSupabaseFetch();
            const { error } = await fetchHandler(() =>
                client
                    .from(TABLE_NAMES.TEAM_REQUESTS)
                    .update({ status: "rejected" })
                    .eq("requestee_profile_id", requestee_profile_id)
                    .eq("requester_profile_id", requester_profile_id)
                    .eq("team_id", team_id)
            );

            if (error) {
                throw new DatabaseError({
                    name: ErrorName.UPDATE_ERROR,
                    message: "Error denying request",
                    cause: error,
                    fatal: true,
                    table: TABLE_NAMES.TEAM_REQUESTS,
                });
            }
            const team = await this.refreshTeam(team_id);
            if (team) this.insertTeamIntoStore(team);
        },
        async fetchTeams(force = false) {
            if (this.teams.length && !force) return;
            const userStore = useUserStore();
            let userId = userStore.id;

            if (!userId) {
                const client = useSupabaseAuthClient();
                const sesh = await client.auth.getUser();

                const { id } = sesh.data.user || {};
                userId = id;
            }

            const { client, fetchHandler } = useSupabaseFetch();
            const { data } = await fetchHandler(
                () =>
                    client
                        .from(TABLE_NAMES.TEAMS)
                        .select(GET_TEAMS)
                        .eq("profile_id", userStore.id),
                { onError: "Error fetching teams" }
            );
            if (!data) return;
            this.teams = data;
            this.sortTeams();
        },
        async insertTeam(team: Team) {
            const { client, fetchHandler } = useSupabaseFetch();
            const { getQuery } = useDatabase();
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
        insertTeamIntoStore(team: Team) {
            const index = this.teams.findIndex((g) => g.id === team.id);
            if (index === -1) {
                this.teams.push(team);
            } else {
                this.teams.splice(index, 1, team);
            }
        },
        async refreshTeam(teamId: number, shouldSort = false) {
            const { client, fetchHandler } = useSupabaseFetch();
            const { data } = await fetchHandler(
                () => client.from(TABLE_NAMES.TEAMS).select(GET_TEAMS).eq("id", teamId),
                { onError: "Error fetching teams" }
            );
            const [refreshedTeam] = data || [];

            if (refreshedTeam) return refreshedTeam;
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
            const team = await this.refreshTeam(teamId);
            if (team) this.insertTeamIntoStore(team);
        },
        resetTeams() {
            this.teams = [];
        },
        async sendTeamRequest({
            requestee_profile_id,
            team_id,
        }: {
            requestee_profile_id: string;
            team_id: number;
        }) {
            const requester_profile_id = useUserStore().id;
            const { client, fetchHandler } = useSupabaseFetch();
            const { error } = await fetchHandler(() =>
                client.from(TABLE_NAMES.TEAM_REQUESTS).insert({
                    requester_profile_id,
                    requestee_profile_id,
                    team_id,
                })
            );

            if (error) {
                throw new DatabaseError({
                    name: ErrorName.INSERT_ERROR,
                    message: "Error sending request",
                    cause: error,
                    fatal: true,
                    table: TABLE_NAMES.TEAM_REQUESTS,
                });
            }
            const team = await this.refreshTeam(team_id);
            if (team) this.insertTeamIntoStore(team);
        },
        sortTeams() {
            if (!this.teams?.length) return;
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
            const team = await this.refreshTeam(teamId);
            if (team) this.insertTeamIntoStore(team);
        },
    },
});
