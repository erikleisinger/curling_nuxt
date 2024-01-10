import GameTeam from '@/store/models/game-team'
import TeamStats from '@/store/models/team-stats'
import Team from '@/store/models/team'
import Game from '@/store/models/game'
import Rink from '@/store/models/rink'
import Sheet from '@/store/models/sheet'
import League from '@/store/models/league'

export const useGame = () => {

    const insertGames = (data) => {
        const dayjs = useDayjs();
        data.forEach((g, index) => {
            if (index === 0) useRepo(GameTeam).where('game_id', g.game_id).delete()
            
            let team;
    
            if (!g.team?.id) {
                team = {
                    id: g.game_id + 100000000,
                    name: g.team?.name,
                };
            } else {
                team = g.team;
            }
            if (g.rink?.id) useRepo(Rink).save(g.rink)
            if (g.sheet?.id) useRepo(Sheet).save(g.sheet)
            if (g.league?.id) useRepo(League).save(g.league)
            useRepo(Team).save(team);
            useRepo(Game).save({
                id: g.game_id,
                rink_id: g.rink?.id,
                start_time: dayjs(g.start_time).unix(),
                sheet_id: g.sheet?.id,
                hammer_first_end: g.hammer_first_end,
                end_count: g.end_count,
                league_id: g.league?.id
            });
            
            useRepo(GameTeam).save({ 
                team_id: g.team_id ?? g.game_id + 100000000,
                game_id: g.game_id,
                id: g.id,
                color: g.color,
                points_scored: g.points_scored ?? 0,
                pending: g.pending,
                home_team: g.team.home_team,
            });
        });
    }
    const getGames = async ({team_id_param, game_id_param} : {team_id_param: number, game_id_param: number}) => {
        const { data } = await useSupabaseClient().rpc("get_team_record_new", {
            team_id_param,
            game_id_param
        });

    
        
        if (!data) return null;


        insertGames(data)
        
        return data;
    
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
                avatar_url
            )
            `
            )
            .in("game_id", games?.map(({game_id}) => game_id));

        stats?.forEach((stat) => {
            useRepo(GameTeam).where('team_id', stat.team_id).where('game_id', stat.game_id).update({
                points_scored: stat.points_for
            })
            if (stat.team) useRepo(Team).save(stat.team)
           

            
        })
        const filtered = stats.filter(({team_id}) => !!team_id)

        useRepo(TeamStats).save(filtered)
    

        return {}
    };

    const getLeagueGames = async (league_ids_param: number[], team_ids_param: number[]) => {
        let data;
        if (!team_ids_param) {
            const { data: games } = await useSupabaseClient().rpc("get_league_games", {
                league_ids_param,
            })

            data = games;
        } else {
            const { data: games } = await useSupabaseClient().rpc("get_league_games", {
                league_ids_param,
            }).in('team_id', team_ids_param)
            data = games;
        }
    
        if (!data) return null;


        insertGames(data)
        
        return data;
    }

    return { getGameResult, getHeadToHead, getTeamGames, getGames, getLeagueGames };
};
