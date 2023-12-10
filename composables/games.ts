import GameTeam from '@/store/models/game-team'
import TeamStats from '@/store/models/team-stats'
import Team from '@/store/models/team'
import Game from '@/store/models/game'

export const useGame = () => {
    const getGames = async ({team_id_param, game_id_param} : {team_id_param: number, game_id_param: number}) => {
        const { data } = await useSupabaseClient().rpc("get_team_record_new", {
            team_id_param,
            game_id_param
        });
        
        if (!data) return;

        const dayjs = useDayjs();
    
        data.forEach((g) => {
            let team;
    
            if (!g.team?.id) {
                team = {
                    id: g.game_id + 100000000,
                    name: g.team?.name,
                };
            } else {
                team = g.team;
            }
    
            useRepo(Team).save(team);
            useRepo(Game).save({
                id: g.game_id,
                rink: g.rink,
                start_time: dayjs(g.start_time).unix(),
                sheet: g.sheet
            });
            useRepo(GameTeam).save({
                team_id: g.team_id ?? g.game_id + 100000000,
                game_id: g.game_id,
                id: g.id,
                color: g.color,
                points_scored: g.points_scored ?? 0,
                pending: g.pending,
            });
        });
    
    };
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
         
        const {data} = await useSupabaseClient().from('game_team_junction').select(`
            id,
            team_id,
            pending,
            game_id,
            game: game_id (
                id,
                end_count,
                name
            ),
            color
        `).in('team_id', [homeTeamId, awayTeamId])
        console.log('games: ', data)
        const games = data?.filter(({game_id}) => data.filter((g) => g.game_id === game_id)?.length > 1);
        useRepo(Game).save(games?.map(({game}) => game))
        useRepo(GameTeam).save(games)
       
        //TODO inform user there have been no games
        // if (!games?.length) return null;
    
        const { data: stats } = await useSupabaseClient()
            .from("team_stats")
            .select(
                `
            *,
            team:team_id (
                id,
                name,
                team_avatar,
                avatar_url,
                avatar_type
            )
            `
            )
            .in("game_id", games?.map(({game_id}) => game_id));
            console.log('stats: ', stats)

        stats?.forEach((stat) => {
            useRepo(GameTeam).where('team_id', stat.team_id).where('game_id', stat.game_id).update({
                points_scored: stat.points_for
            })
            if (stat.team) useRepo(Team).save(stat.team)
           

            
        })
        const filtered = stats.filter(({team_id}) => !!team_id)

        useRepo(TeamStats).save(filtered)
    
        // const [reference] = stats;
    
        // const EXCLUDE_STATS_FROM_COMPARISON = [
        //     "id",
        //     "created_at",
        //     "game_id",
        //     "team_id",
        //     "team",
        // ];
    
        // const keys = Object.keys(reference).filter(
        //     (key) => !EXCLUDE_STATS_FROM_COMPARISON.includes(key)
        // );
    
        // const myTeam = {};
        // const oppTeam = {};
    
        // keys.forEach((key) => {
        //     myTeam[key] = stats.reduce((all, current) => {
        //         if (current.team_id !== homeTeamId) return all;
        //         return all + current[key];
        //     }, 0);
    
        //     oppTeam[key] = stats.reduce((all, current) => {
        //         if (current.team_id !== awayTeamId) return all;
        //         return all + current[key];
        //     }, 0);
        // });
    
        // const oneOppositionEntry = stats.find(
        //     ({ team_id }) => {
        //         return team_id === awayTeamId
        //     }
        // );

        // const oneHomeEntry = stats?.find( ({ team_id }) => team_id === homeTeamId)
    
        // const { avatar_type, avatar_url, team_avatar, name } = { ...(oneHomeEntry?.team ?? {}) };
    
        // const team1 = {
        //     ...myTeam,
        //     games_played: stats?.length / 2,
        //     avatar_type,
        //     avatar_url,
        //     team_avatar,
        //     name,
        // };
        // const team2 = {
        //     ...oppTeam,
        //     games_played: stats?.length / 2,
        //     ...oneOppositionEntry.team,
        // };

        // return {team1, team2, allGames: stats}
        return {}
    };

    return { getGameResult, getHeadToHead, getTeamGames, getGames };
};
