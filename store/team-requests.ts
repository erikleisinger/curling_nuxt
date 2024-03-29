import { defineStore } from "pinia";
import { BasicTeamRequest, RequestStatus } from "@/types/request";
import { TABLE_NAMES } from "@/presentation/constants/tables";
import { useNotificationStore } from "@/store/notification";
import TeamPlayer from '@/store/models/team-player';
import Team from '@/store/models/team'

export const useTeamRequestStore = defineStore("team-requests", {
    state: () => {
        return {
            requests: [],
            requestsToRespond: 0,
        } as {
            requestsToRespond: number;
            requests: any[]
        };
    },
    actions: {
        async deleteTeamInvitation({teamId, profileId} : {teamId: number, profileId: string}) {
            const notStore = useNotificationStore();
            const notId = notStore.addNotification({
                state: "pending",
                text: `Cancelling request...`,
                timeout: 10000,
            });
            const client = useSupabaseClient();
            const { error } = await client
                .from("team_requests")
                .delete()
                .eq("team_id", teamId)
                .eq('requestee_profile_id', profileId)


            if (error) {
                notStore.updateNotification(notId, {
                    state: "failed",
                    text: `Error cancelling request (code ${
                        error?.code ?? "X"
                    })`,
                    timeout: 10000,
                });
                return false;
            } else {
                notStore.updateNotification(notId, {
                    state: "completed",
                    text: `Request cancelled`,
                    timeout: 10000,
                });
                useRepo(TeamPlayer).where('team_id', teamId).where('player_id', profileId).delete();
                return true;
            }
        },
        async deleteTeamRequest({teamId, profileId} : {teamId: number, profileId: string}) {
            const notStore = useNotificationStore();
            const notId = notStore.addNotification({
                state: "pending",
                text: `Cancelling request...`,
                timeout: 10000,
            });
            const client = useSupabaseClient();
            const { error } = await client
                .from("team_requests")
                .delete()
                .eq("team_id", teamId)
                .eq('requester_profile_id', profileId)


            if (error) {
                notStore.updateNotification(notId, {
                    state: "failed",
                    text: `Error cancelling request (code ${
                        error?.code ?? "X"
                    })`,
                    timeout: 10000,
                });
                return false;
            } else {
                notStore.updateNotification(notId, {
                    state: "completed",
                    text: `Request cancelled`,
                    timeout: 10000,
                });
                useRepo(TeamPlayer).where('team_id', teamId).where('player_id', profileId).delete();
                const index = this.requests.findIndex(({team_id}) => team_id === teamId)
                if (index !== -1) {
                    const newRequests = [...this.requests];
                    newRequests.splice(index, 1)
                    this.requests = newRequests;
                }
                return true;
            }
           
        },
        async getTeamRequestsByUser(profile_id: number) {
            const client = useSupabaseClient();

            const { data, error } = await client
                .from("team_requests")
                .select(
                    `
                id, 
                status,
                team: team_id (
                    id,
                    name,
                    avatar_url
                )
            `
                )
                .eq("requester_profile_id", profile_id)
                .eq('status', 'pending')
                data?.forEach((d) => {
                    const {team} = d;
                    if (!team) return;
                    useRepo(Team).save(team)

                })
            this.requests = data?.map((d) => ({
                ...(d.team ?? {}),
                ...d,
                team_id: d.team?.id,
            }))
        },

        async getTeamRequestsByTeam(teamId: number) {
            const client = useSupabaseClient();

            const { data, error } = await client
                .from("team_requests")
                .select(
                    `
                id, 
                requester:requester_profile_id (
                    id,
                    username,
                    first_name,
                    last_name,
                    avatar
                ),
                requestee:requestee_profile_id (
                    id,
                    username,
                    first_name,
                    last_name,
                    avatar
                ),
                status,
                team_id
            `
                )
                .eq("team_id", teamId);

            return data;
        },

        async sendTeamInvitation({
            requestee_profile_id,
            team_id,
        }: {
            requestee_profile_id?: string;
            team_id: number;
        }) {


            const { client, fetchHandler } = useSupabaseFetch();

            const notStore = useNotificationStore();
            const notId = notStore.addNotification({
                state: "pending",
                text: `Sending invitation...`,
                timeout: 10000,
            });

            const { error, data } = await fetchHandler(() =>
                client.from(TABLE_NAMES.TEAM_REQUESTS).upsert({
                    team_id,
                    requestee_profile_id,
                }).select('id')
            );

            if (error) {
                notStore.updateNotification(notId, {
                    state: "failed",
                    text: `Error sending invitation: ${error.message} (code ${error?.code ?? "X"})`,
                    timeout: 10000,
                });

                return false;
            } else {
                const [user] = data || {}
                const {id} = user || {}
                notStore.updateNotification(notId, {
                    state: "completed",
                    text: `Invitation sent!`,
                    timeout: 4000,
                });
                useRepo(TeamPlayer).save({
                    team_id,
                    player_id: requestee_profile_id,
                    status: "invited",
                    position: null,
                });
                return id;
            }
        },
        async sendTeamRequest({
            requester_profile_id,
            team_id,
        }: {
            requester_profile_id?: string;
            team_id: number;
        }) {


            const { client, fetchHandler } = useSupabaseFetch();

            const notStore = useNotificationStore();
            const notId = notStore.addNotification({
                state: "pending",
                text: `Requesting to join team...`,
                timeout: 10000,
            });

            const { error, data } = await fetchHandler(() =>
                client.from(TABLE_NAMES.TEAM_REQUESTS).upsert({
                    team_id,
                    requester_profile_id,
                }).select('id')
            );

            if (error) {
                notStore.updateNotification(notId, {
                    state: "failed",
                    text: `Error sending request: ${error.message} (code ${error?.code ?? "X"})`,
                    timeout: 10000,
                });

                return false;
            } else {
                const [user] = data || {}
                const {id} = user || {}
                notStore.updateNotification(notId, {
                    state: "completed",
                    text: `Request sent!`,
                    timeout: 4000,
                });
                useRepo(TeamPlayer).save({
                    team_id,
                    player_id: requester_profile_id,
                    status: "requested",
                    position: null,
                });
                return id;
            }
        },
        async updateTeamRequestStatus({
            id,
            status,
        }: {
            id: number;
            status: RequestStatus;
        }) {
            const { client, fetchHandler } = useSupabaseFetch();
            const { error } = await fetchHandler(() =>
                client
                    .from(TABLE_NAMES.TEAM_REQUESTS)
                    .update({ status })
                    .eq("id", id)
            );
            return !error
        },
    },
});
