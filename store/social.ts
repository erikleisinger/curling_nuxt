import { defineStore } from "pinia";
import { BasicTeamRequest, RequestStatus } from "@/types/request";
import { TABLE_NAMES } from "@/constants/tables";
import { useTeamStore } from "@/store/teams";
import { DatabaseError, ErrorName } from "@/types/error";

export const useSocialStore = defineStore("social", {
    state: () => {
        return {
            requestsToRespond: 0,
        } as {
            requestsToRespond: number;
        };
    },
    actions: {
        async cancelTeamRequest({requestee_profile_id, team_id}: {requestee_profile_id: string, team_id: number}) {
            const {user} = useUser()
            const requester_profile_id = user.value;
            const { client, fetchHandler } = useSupabaseFetch();
            const { error } = await fetchHandler(() =>
                client
                    .from(TABLE_NAMES.TEAM_REQUESTS)
                    .delete()
                    .eq('requestee_profile_id', requestee_profile_id)
                    .eq('requester_profile_id', requester_profile_id)
                    .eq('team_id', team_id)
            );
 
            if (error) {
            
            
                throw new DatabaseError({
                 name: ErrorName.DELETE_ERROR, 
                 message: 'Error canceling request',
                 cause: error,
                 fatal: true,
                 table: TABLE_NAMES.TEAM_REQUESTS
                })
            }
            await this.fetchTeamRequests();
            const teamStore = useTeamStore();
            const team = await teamStore.refreshTeam(team_id);
            if (team) teamStore.insertTeamIntoStore(team)
            return team;
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
        async sendTeamRequest({
            requestee_profile_id,
            team_id,
        }: {
            requestee_profile_id: string;
            team_id: number;
        }) {
            const { user: requester_profile_id } = useUser();
            const { client, fetchHandler } = useSupabaseFetch();
            const { error } = await fetchHandler(() =>
                client
                    .from(TABLE_NAMES.TEAM_REQUESTS)
                    .insert({ requester_profile_id, requestee_profile_id, team_id })
            );
    
            if (error) {
                const duplicate = new RegExp("unique_team_request");
                if (!duplicate.test(error?.message)) {
                    const notStore = useNotificationStore();
                    notStore.addNotification({
                        state: "failed",
                        text: `Error sending request: ${error.message} (code ${
                            error?.code ?? "X"
                        })`,
                        timeout: 10000,
                    });
                }
            }
            const teamStore = useTeamStore();
            const team = await teamStore.refreshTeam(team_id);
            if (team) teamStore.insertTeamIntoStore(team);
            return team;
        },
        async updateTeamRequestStatus({requester_profile_id, team_id, status}: {requester_profile_id: string, team_id: number, status: RequestStatus}) {
            const {user} = useUser()
            const requestee_profile_id = user.value
            const { client, fetchHandler } = useSupabaseFetch();
            const { error } = await fetchHandler(() =>
                client
                    .from(TABLE_NAMES.TEAM_REQUESTS)
                    .update({status})
                    .eq('requestee_profile_id', requestee_profile_id)
                    .eq('requester_profile_id', requester_profile_id)
                    .eq('team_id', team_id)
            );
 
            if (error) {
                throw new DatabaseError({
                    name: ErrorName.UPDATE_ERROR, 
                    message: 'Error denying request',
                    cause: error,
                    fatal: true,
                    table: TABLE_NAMES.TEAM_REQUESTS
                   })
            }
        
         },
    },
    
});
