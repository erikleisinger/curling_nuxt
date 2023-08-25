import { defineStore } from "pinia";
import { BasicTeamRequest, RequestStatus } from "@/types/request";
import { TABLE_NAMES } from "@/constants/tables";
import { useTeamStore } from "@/store/teams";
import { DatabaseError, ErrorName } from "@/types/error";
import { useNotificationStore } from "@/store/notification";

export const useSocialStore = defineStore("social", {
    state: () => {
        return {
            requestsToRespond: 0,
        } as {
            requestsToRespond: number;
        };
    },
    actions: {
        async cancelTeamRequest({
            requestee_profile_id,
            team_id,
        }: {
            requestee_profile_id: string;
            team_id: number;
        }) {
            const notStore = useNotificationStore();
            const notId = notStore.addNotification({
                state: "pending",
                text: `Cancelling request...`,
                timeout: 10000,
            });
            const { user } = useUser();
            const requester_profile_id = user.value;
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
                
                notStore.updateNotification(
                    notId,
                    {
                        state: "failed",
                        text: `Error cancelling request: ${error.message} (code ${
                            error?.code ?? "X"
                        })`,
                        timeout: 10000,
                    }
            );

            } else {
                this.emitUpdate(team_id, null)
                notStore.updateNotification(
                    notId,
                    {
                        state: "completed",
                        text: `Request cancelled.`,
                        timeout: 10000,
                    }
            );
            }
            await this.fetchTeamRequests();
            const teamStore = useTeamStore();
            const team = await teamStore.refreshTeam(team_id);
            if (team) teamStore.insertTeamIntoStore(team);
            return team;
        },
        emitUpdate(teamId: number, status: string) {
            const event = new CustomEvent(`REQUEST_${teamId}_UPDATED`, {
                detail: {
                    status
                }
            })
            window.dispatchEvent(event)
        },
        async fetchTeamRequests() {
            const { client, fetchHandler } = useSupabaseFetch();

            const { data, error } = await fetchHandler(() =>
                client.rpc("get_team_request_count_to_respond")
            );

            if (error) {
                console.error("ERROR GETTING REQUESTS: ", error);
                return;
            }
            this.requestsToRespond = data ?? 0;
        },
        async getTeamRequestsByTeam(teamId: number) {
            const client = useSupabaseClient();

            const {data, error} = await client.from('team_requests').select(`
                id, 
                requester:requester_profile_id (
                    id,
                    username,
                    first_name,
                    last_name,
                    avatar_url
                ),
                requestee:requestee_profile_id (
                    id,
                    username,
                    first_name,
                    last_name,
                    avatar_url
                ),
                status,
                team_id
            `).eq('team_id', teamId)  

            return data;
        },
        async getTeamRequestsByUser(profileId: string) {
            const client = useSupabaseClient();

            const {data, error} = await client.rpc('get_team_requests').eq('requestee_profile_id', profileId)

            return data;
        },
        async sendTeamRequest({
            requestee_profile_id,
            team_id,
        }: {
            requestee_profile_id: string;
            team_id: number;
        }) {
            const { user: userId } = useUser();
            const requester_profile_id = userId.value;
            const { client, fetchHandler } = useSupabaseFetch();

            const notStore = useNotificationStore();
            const notId = notStore.addNotification({
                state: "pending",
                text: `Sending request...`,
                timeout: 10000,
            });

            const { error } = await fetchHandler(() =>
                client
                    .from(TABLE_NAMES.TEAM_REQUESTS)
                    .upsert({
                        requester_profile_id,
                        requestee_profile_id,
                        team_id,
                        status: 'pending',
                    })
            );

            if (error) {
                // const duplicate = new RegExp("unique_team_request");

                notStore.updateNotification(
                    notId,
                    {
                        state: "failed",
                        text: `Error sending request: ${error.message} (code ${
                            error?.code ?? "X"
                        })`,
                        timeout: 10000,
                    }
            );

                return false;
            } else {    
                this.emitUpdate(team_id, 'pending')
        
                notStore.updateNotification(
                    notId,
                    {
                        state: "completed",
                        text: "Request send!",
                        timeout: 4000,
                    }
                );
                return true;
            }
        },
        async updateTeamRequestStatus({
            requester_profile_id,
            team_id,
            status,
        }: {
            requester_profile_id: string;
            team_id: number;
            status: RequestStatus;
        }) {
            const { user } = useUser();
            const requestee_profile_id = user.value;
            const { client, fetchHandler } = useSupabaseFetch();
            const { error } = await fetchHandler(() =>
                client
                    .from(TABLE_NAMES.TEAM_REQUESTS)
                    .update({ status })
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
        },
    },
});
