import { defineStore } from "pinia";
import { BasicTeamRequest, RequestStatus } from "@/types/request";
import { TABLE_NAMES } from "@/constants/tables";
import { useNotificationStore } from "@/store/notification";

export const useTeamRequestStore = defineStore("team-requests", {
    state: () => {
        return {
            requestsToRespond: 0,
        } as {
            requestsToRespond: number;
        };
    },
    actions: {
        async deleteTeamRequest(id: number) {
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
                .eq("id", id);


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
                return true;
            }
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

        async sendTeamRequest({
            requestee_profile_id,
            requester_profile_id,
            team_id,
        }: {
            requestee_profile_id?: string;
            requester_profile_id?: string;
            team_id: number;
        }) {
            console.log(
                "send team request: ",
                requestee_profile_id,
                requester_profile_id,
                team_id
            );

            const { client, fetchHandler } = useSupabaseFetch();

            const notStore = useNotificationStore();
            const notId = notStore.addNotification({
                state: "pending",
                text: `Sending ${
                    requester_profile_id ? "request" : "invitation"
                }...`,
                timeout: 10000,
            });

            const { error } = await fetchHandler(() =>
                client.from(TABLE_NAMES.TEAM_REQUESTS).upsert({
                    team_id,
                    requestee_profile_id,
                    requester_profile_id,
                })
            );

            if (error) {
                // const duplicate = new RegExp("unique_team_request");

                notStore.updateNotification(notId, {
                    state: "failed",
                    text: `Error sending  ${
                        requester_profile_id ? "request" : "invitation"
                    }: ${error.message} (code ${error?.code ?? "X"})`,
                    timeout: 10000,
                });

                return false;
            } else {
                notStore.updateNotification(notId, {
                    state: "completed",
                    text: ` ${
                        requester_profile_id ? "Request" : "Invitation"
                    } sent!`,
                    timeout: 4000,
                });
                return true;
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
        },
    },
});
