import Player from "@/store/models/player";
import TeamPlayer from "@/store/models/team-player";
import Team from "@/store/models/team";
import TeamStats from '@/store/models/team-stats'
import Rink from "@/store/models/rink";
import Badge from "@/store/models/badge";
import {EPHEMERAL_BADGES} from  '@/constants/badges'
import {useUserTeamStore} from '@/store/user-teams'



const getCumulativeTeamStats = async (id: number) => {
    const client = useSupabaseClient();
    const { data } = await client
        .from("team_stats_total")
        .select("*")
        .eq("id", id)
   

    const [t] = data ?? []
    return t;
};

const getTeamStats = async (teamId: number) => {
    const { data } = await useSupabaseClient().rpc("get_team_stats", {
        team_id_param: teamId,
        range_start_param: null,
        range_end_param: null,
        limit_param: null,
    });

    return data;
};

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

    const getFullTeam = async ({id, withBadges = true, withStats = true}) => {
        try {

        
            if (!id || id > 100000000) return null;
            const client = useSupabaseClient();
            const { data, error } = await client
                .rpc("get_user_teams")
                .eq("id", id)
                .limit(1)

            if (error) throw new Error(error);
            const [t] = data ?? []


            const {getBadgesForTeam} = useBadge()
            const [teamTotalStats, stats, badges] = await Promise.all([
                ...(withStats ? [getCumulativeTeamStats(id), getTeamStats(id)] : []),
                ...(withBadges ? [getBadgesForTeam(id)] : [])
            ]);

            

            const { name: teamName, ...totalStats } = teamTotalStats ?? {};
            const {
                avatar_url,
                id: team_id,
                name,
                rink_id,
                rink,
                facebook,
                instagram,
                twitter,
                featured_badge_id,
                text_color,
                public: isPublic
            } = t;


            
            
            [...(badges ?? [])]?.sort((a,b) => {
                if (EPHEMERAL_BADGES.includes(a.name)) return 1;
                return -1;
            }).forEach((badge) => {
                useRepo(Badge).save({...badge})
            })

            stats?.forEach((stat) => {
                useRepo(TeamStats).save({...stat, team_id: id})
            })

            const obj = {
                avatar_url,
                id: team_id,
                facebook,
                instagram,
                twitter,
                featured_badge_id,
                name,
                text_color,
                public: isPublic,
                totalStats: {
                    ...totalStats,
                    team_id: totalStats.id,
                },
            };
            if (rink_id) obj.rink_id = rink_id;
            if (rink) useRepo(Rink).save(rink);

            useRepo(Team).save(obj);

            return obj;
        }catch(e) {
            throw new Error(e)
        }
      
    };

    const isOnTeam = (teamId: number) => {
        const { user: userId } = useUser();
        return useUserTeamStore().userTeams.some(({id}) => teamId === id)
    };

    const userTeamIds = computed(() => useUserTeamStore().userTeams.map(({id}) => id))
    return { getTeamPlayers, isOnTeam, getFullTeam, userTeamIds };
};
