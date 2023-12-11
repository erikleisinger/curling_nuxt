import { defineStore } from "pinia";
import { useNotificationStore } from "@/store/notification";
import Team from '@/types/team'
import { useUserTeamStore } from "@/store/user-teams";

export const useGameRequestStore = defineStore("game-requests", {
    state: () => {
        return {
            requestsToRespond: 0,
            requests: [],
        } as {
            requestsToRespond: number;
            requests: any[];
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
        async getGameRequestsByUser(userId: string) {
            const teams = useUserTeamStore().userTeams;
            const client = useSupabaseClient();
            const {data} = await client.from('game_requests').select(`
            id,
            game_id,
            team_id,
            status
            `).in('team_id', teams.map(({id}) => id)).eq('status', 'pending');
            console.log('got game requests: ', data)
            if (!data?.length) {
                this.requests = [];
                return;
            }
            const gameIds = data.map(({game_id}) => game_id)

            const {data:gamesData} = await client.from('games').select(`
            id,
         
            home (
                id,
                name,
                avatar_url
            ),
            start_time
            `)
            .in('id', gameIds)
            this.requests = data.map((req) => ({
                ...req,
                game: gamesData?.find(({id}) => id === req.game_id)
            }))

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
