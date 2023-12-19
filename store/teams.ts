import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";
import type Team from "@/types/team";
import { TABLE_NAMES } from "@/constants/tables";
import { useNotificationStore } from "@/store/notification";
import { useUserStore } from "@/store/user";
import {useTeamRequestStore} from '@/store/team-requests'
import { DatabaseError } from "@/types/error";
import { ErrorName } from "@/types/error";
import GET_TEAMS from "@/queries/get_teams";

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
                const client = useSupabaseClient();
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
        async insertTeam(team: Team, newPlayerIds: string[], updatedPlayers: {id: number, [key: string]:string | number}[]) {
            const notStore = useNotificationStore();
            const notId = notStore.addNotification({
                text: team.id ? "Updating team..." : "Creating team...",
                state: "pending",
            });
            const { client, fetchHandler } = useSupabaseFetch();
            const { getQuery } = useDatabase();
            const { data, errors } = await fetchHandler(
                () =>
                    client
                        .from(TABLE_NAMES.TEAMS)
                        .upsert(team)
                        .select(getQuery(TABLE_NAMES.TEAMS)),
                { onError: "Error creating team" }
            );
            const [newTeam] = data || [];
            if (!newTeam || errors) {
                notStore.updateNotification(notId, {
                    state: "failed",
                    text: `Failed to ${team.id ? "update" : "create"} team. ${
                        errors ? `(code: ${errors.code})` : ""
                    }`,
                });
                return false;
            }

            const { id: teamId } = newTeam;

            const index = this.teams.findIndex((g) => g.id === newTeam.id);
            if (index === -1) {
                this.teams.push(newTeam);
            } else {
                this.teams.splice(index, 1, newTeam);
            }
            this.sortTeams();
            if (newPlayerIds?.length) {
                const teamRequestStore = useTeamRequestStore();
                await Promise.all(
                    newPlayerIds.map(
                        (id) => teamRequestStore.sendTeamRequest({requestee_profile_id: id, team_id: teamId})
                    )
                );
            }

            if (updatedPlayers?.length) {
                await Promise.all(
                    updatedPlayers.map(
                        (player) => this.updateTeamPlayer(player)
                    )
                );
            }
            notStore.updateNotification(notId, {
                state: "completed",
                text: `Team ${team.id ? "updated" : "created"}!`,
            });
            return newTeam;
        },
        async insertTeamProfileJunction(team_id: number, profile_id: string) {
            const client = useSupabaseClient();

            await client.from("team_profile_junction").insert({
                profile_id,
                team_id,
                is_admin: false,
                type: "member",
            });
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
                () =>
                    client
                        .from(TABLE_NAMES.TEAMS)
                        .select(GET_TEAMS)
                        .eq("id", teamId),
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
        async updateTeam(updates: object, teamId: number) {
            const { client, fetchHandler } = useSupabaseFetch();
            const { error } = await fetchHandler(() =>
                client
                    .from(TABLE_NAMES.TEAMS)
                    .update(updates)
                    .eq("id", teamId)
            );

            if (error) {
                console.error(error);
                return;
            }
            
        },
        async updateTeamPlayer(updatedPlayer: {id: number, [key: string]: string | number}) {
            const notStore = useNotificationStore();
            const notId = notStore.addNotification({
                text: "Updating player...",
                state: "pending",
            });
            const {id, ...rest} = updatedPlayer;

            const client = useSupabaseClient();

            const { errors } = await client.from('team_profile_junction').update(rest).eq('profile_id', id);

            if (errors) {
                notStore.updateNotification(notId, {
                    state: "failed",
                    text: `Error updating player (code: ${errors.code})`,
                });
                return false;
            } else {
                notStore.updateNotification(notId, {
                    state: "completed",
                    text: `Player updated!`,
                });
                return true;
            }

        },
        async uploadAvatarToTeam(fileName: string, file: File, teamId: number) {
            const notStore = useNotificationStore();
            const notId = notStore.addNotification({
                text: "Uploading avatar...",
                state: "pending",
            });
            const client = useSupabaseClient();

            const { errors } = await client.storage
                .from("Avatars")
                .upload(fileName, file);
            if (errors) {
                notStore.updateNotification(notId, {
                    state: "failed",
                    text: `error uploading avatar (code: ${errors.code})`,
                });
                return false;
            }

            const { data, errors: errors2 } = await client
                .from("teams")
                .update({ avatar_type: "upload", avatar_url: fileName })
                .eq("id", teamId)
                .select('avatar_url')

            if (errors2) {
                notStore.updateNotification(notId, {
                    state: "failed",
                    text: `error uploading avatar (code: ${errors2.code})`,
                });
                return false;
            } else {
                notStore.updateNotification(notId, {
                    state: "completed",
                    text: `Avatar uploaded!`,
                });
    
                const [updates] = data;
                console.log('store upload done')
                return updates;
            }
        },
    },
});
