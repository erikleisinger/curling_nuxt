export const useGame = () => {
    const getTeamGames = async (team_ids_param: number[], start: number = 0, end: number = 5) => {
        const client = useSupabaseClient();
        const { data } = await client.rpc("get_team_record", { team_ids_param }).range(start, end).order('start_time', {ascending: false});
        if (data) return data?.map((d) => ({
            ...d,
            end_count: d.end_count,
            id: d.id,
            is_home_team: d.is_home_team,
            event_color: d.event_color,
            event_name: d.event_name,
            rink_name: d.rink_name,
            sheet_name: d.sheet_name,
            start_time: d.start_time
        }));
        return []
    }
    const getGameResult = async (team_ids_param: number[], game_id: number) => {
        const client = useSupabaseClient();
        const { data } = await client.rpc("get_team_record", { team_ids_param }).eq('id', game_id);
        if (data) return data?.map((d) => ({
            ...d,
            end_count: d.end_count,
            id: d.id,
            is_home_team: d.is_home_team,
            event_color: d.event_color,
            event_name: d.event_name,
            rink_name: d.rink_name,
            sheet_name: d.sheet_name,
            start_time: d.start_time
        }));
        return []
    }

    const getHeadToHead = async (homeTeamId: number, awayTeamId: number) => {
        const { data } = await useSupabaseClient()
            .from("games")
            .select("id")
            .or(`home.eq.${homeTeamId},away.eq.${homeTeamId}`)
            .or(`home.eq.${awayTeamId},away.eq.${awayTeamId}`);
        const games = data?.map(({ id }) => id) || [];
        //TODO inform user there have been no games
        if (!games?.length) return null;
    
        const { data: stats } = await useSupabaseClient()
            .from("team_stats")
            .select(
                `
            *,
            team:team_id (
                name,
                team_avatar,
                avatar_url,
                avatar_type
            )
            `
            )
            .in("game_id", games);
    
        const [reference] = stats;
    
        const EXCLUDE_STATS_FROM_COMPARISON = [
            "id",
            "created_at",
            "game_id",
            "team_id",
            "team",
        ];
    
        const keys = Object.keys(reference).filter(
            (key) => !EXCLUDE_STATS_FROM_COMPARISON.includes(key)
        );
    
        console.log(stats)
        const myTeam = {};
        const oppTeam = {};
    
        keys.forEach((key) => {
            myTeam[key] = stats.reduce((all, current) => {
                if (current.team_id !== homeTeamId) return all;
                return all + current[key];
            }, 0);
    
            oppTeam[key] = stats.reduce((all, current) => {
                if (current.team_id !== awayTeamId) return all;
                return all + current[key];
            }, 0);
        });
    
        const oneOppositionEntry = stats.find(
            ({ team_id }) => {
                console.log(team_id)
                return team_id === awayTeamId
            }
        );

        console.log('one opp entry: ', oneOppositionEntry, awayTeamId)
        const oneHomeEntry = stats?.find( ({ team_id }) => team_id === homeTeamId)

        console.log('one home entry: ', oneHomeEntry)
    
        const { avatar_type, avatar_url, team_avatar, name } = { ...(oneHomeEntry?.team ?? {}) };
    
        const team1 = {
            ...myTeam,
            games_played: stats?.length / 2,
            avatar_type,
            avatar_url,
            team_avatar,
            name,
        };
        const team2 = {
            ...oppTeam,
            games_played: stats?.length / 2,
            ...oneOppositionEntry.team,
        };

        return {team1, team2, allGames: stats}
    };

    return { getGameResult, getHeadToHead, getTeamGames };
};
