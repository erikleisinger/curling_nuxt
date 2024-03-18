import Player from "@/store/models/player";
import TeamPlayer from "@/store/models/team-player";
import {useUserTeamStore} from '@/store/user-teams'
import { useTeamRequestStore } from "@/store/team-requests";


export const useTeam = () => {
    const getTeamPlayers = async (
        teamId: number,
    ) => {
        if (!teamId) return [];
        const client = useSupabaseClient();

        const { data } = await client
            .from("team_profile_junction")
            .select(
                `
            id,
            position,
            is_admin,
            user:profile_id (
                id,
                username,
                first_name,
                last_name,
                avatar
            )
        `
            )
            .eq("team_id", teamId);

        const { data: requests } = await client
            .from("team_requests")
            .select(
                `
                requestee:requestee_profile_id (
                    id,
                    username,
                    first_name,
                    last_name,
                    avatar
                ),
                requester:requester_profile_id (
                    id,
                    username,
                    first_name,
                    last_name,
                    avatar
                ),
                status,
                id
            `
            )
            .eq("team_id", teamId)
            .eq('status', 'pending')

            const requestPlayers = [...(requests ?? [])]?.map((p) => {
                const {status} = p;

                return {
                    id: p.id,
                    player_id: p.requester?.id || p.requestee?.id,
                    team_id: teamId,
                    status: status === 'pending' ? (p.requester?.id ? 'requested' : 'invited') : status,
                    position: p.position,
                    player: p.requester || p.requestee,
                    request_id: p.id,
                }
            })


        const teamPlayers = [...(data ?? [])].map((p) => {
          
               

            return {
                id: Number(p.id),
                player_id: p.user?.id,
                team_id: teamId,
                position: p.position,
                player: p.user,
            };
        });

        const allPlayers = [...teamPlayers, ...requestPlayers];
        useRepo(TeamPlayer).where("team_id", teamId).delete();
        allPlayers.forEach((p) => {
                const { player, id, team_id, status, position, request_id } = p;

                useRepo(Player).save(player);
                useRepo(TeamPlayer).save({
                    id,
                    team_id,
                    status,
                    position,
                    player_id: player?.id,
                    request_id
                });
        })

        return allPlayers;
    };

    const isOnTeam = (teamId: number) => {
        const { user: userId } = useUser();
        return useUserTeamStore().userTeams.some(({id}) => teamId === id)
    };

    const userTeamIds = computed(() =>  [...useUserTeamStore().userTeams.map(({ id }) => id), ...useTeamRequestStore().requests.map(({team_id}) => team_id)])
    return { getTeamPlayers, isOnTeam,  userTeamIds };
};
