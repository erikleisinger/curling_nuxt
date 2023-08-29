import { defineStore } from "pinia";
import { BasicTeamRequest, RequestStatus } from "@/types/request";
import { TABLE_NAMES } from "@/constants/tables";
import { useTeamStore } from "@/store/teams";
import { DatabaseError, ErrorName } from "@/types/error";
import { useNotificationStore } from "@/store/notification";
import Team from '@/types/team'

export const useGameRequestStore = defineStore("game-requests", {
    state: () => {
        return {
            requestsToRespond: 0,
        } as {
            requestsToRespond: number;
        };
    },
    actions: {
        async cancelGameRequest({team_id, game_id} : {team_id: number, game_id: number}) {
            const notStore = useNotificationStore();
            const notId = notStore.addNotification({
                state: 'pending',
                text: `Cancelling invitation...`,
            })
            const client = useSupabaseClient();
            const {error} = await client.from('game_requests').delete().eq('game_id', game_id).eq('team_id', team_id).eq('status', 'pending');
            if (error) {
                notStore.updateNotification(notId, {
                    state: 'failed',
                    text: `Error cancelling invitation (code: ${error.code})`,
                })
                return false;
            } else {
                notStore.updateNotification(notId, {
                    state: 'completed',
                    text: `Invitation cancelled.`
                })
                return true
            }
        },
        async sendGameRequest(team: Team, game_id: number) {
            const {id, name} = team;
            const notStore = useNotificationStore();
            const notId = notStore.addNotification({
                state: 'pending',
                text: `Inviting ${name} to be opposition...`,
            })
            const client = useSupabaseClient();
            const {error} = await client.from('game_requests').insert({
                team_id: id,
                game_id
            })
            if (error) {
                notStore.updateNotification(notId, {
                    state: 'failed',
                    text: `Error inviting ${team} (code: ${error.code})`,
                })
            } else {
                notStore.updateNotification(notId, {
                    state: 'completed',
                    text: `Invitation sent to ${name}.`
                })
            }
        },
        async updateGameRequestStatus({team_id, game_id, status} : {team_id: number, game_id: number, status: string}) {
            const notStore = useNotificationStore();
            const notId = notStore.addNotification({
                state: 'pending',
                text: `${status === 'accepted' ? 'Accepting' : status === 'rejected' ? 'Rejecting' : 'Responding to'} invitation..`,
            })
            const client = useSupabaseClient();
            const {error} = await client.from('game_requests').update({status}).eq('game_id', game_id).eq('team_id', team_id)
            if (error) {
                notStore.updateNotification(notId, {
                    state: 'failed',
                    text: `Error ${status === 'accepted' ? 'Accepting' : status === 'rejected' ? 'Rejecting' : 'Responding to'} invitation (code: ${error.code})`,
                })
                return false;
            } else {
                notStore.updateNotification(notId, {
                    state: 'completed',
                    text: `Invitation ${status === 'accepted' ? 'accepted!' : status === 'rejected' ? 'rejected.' : 'response sent.'}`
                })
                return true
            }
        },
    }
})
