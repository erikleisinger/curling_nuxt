import Player from "@/store/models/player";
import TeamPlayer from "@/store/models/team-player";
import Team from "@/store/models/team";
import TeamStats from '@/store/models/team-stats'
import Rink from "@/store/models/rink";
import Badge from "@/store/models/badge";



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
        andRequests: boolean = false
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
                user:requestee_profile_id (
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
            .eq("status", "pending");
        return [...(data ?? []), ...(requests ?? [])].map((p) => {
            const status = p.status ?? null;

            const returnObj = {
                id: Number(p.id),
                player_id: p.user.id,
                team_id: teamId,
                status,
                position: p.position,
                player: p.user,
            };

            return returnObj;
        });
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

            useRepo(TeamPlayer).where("team_id", id).delete();
            const {getBadgesForTeam} = useBadge()
            const [teamTotalStats, stats, players, badges] = await Promise.all([
                ...(withStats ? [getCumulativeTeamStats(id), getTeamStats(id)] : []),
                getTeamPlayers(id),
                ...(withBadges ? [getBadgesForTeam(id)] : [])
            ]);

            

            const { name: teamName, ...totalStats } = teamTotalStats ?? {};
            const {
                avatar_type,
                avatar_url,
                team_avatar,
                id: team_id,
                name,
                rink_id,
                rink,
                facebook,
                instagram,
                twitter,
                featured_badge_id,
            } = t;

            

            players.forEach((p) => {
                const { player, id, team_id, status, position } = p;

                useRepo(Player).save(player);
                useRepo(TeamPlayer).save({
                    id,
                    team_id,
                    status,
                    position,
                    player_id: player?.id,
                });
            });
            
            badges?.forEach((badge) => {
                useRepo(Badge).save(badge)
            })

            stats?.forEach((stat) => {
                useRepo(TeamStats).save({...stat, team_id: id})
            })

            const obj = {
                avatar_type,
                avatar_url,
                team_avatar,
                id: team_id,
                facebook,
                instagram,
                twitter,
                featured_badge_id,
                name,
                // stats: [
                //     {
                //         ...stats,
                //         team_id,
                //         game_id: 0,
                //     },
                // ],
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
        const team = useRepo(Team).with("players").where("id", teamId).first();
        if (!team) return false;
        return [...(team.players ?? [])].some(({ id }) => id === userId.value);
    };
    return { getTeamPlayers, isOnTeam, getFullTeam };
};
