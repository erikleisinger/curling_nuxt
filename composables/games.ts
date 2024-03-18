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
                league_id: g.league?.id,
                ends_played: g.ends_played,
                end_early: g.end_early,
                conceded: g.conceded
            });
            
            useRepo(GameTeam).save({ 
                team_id: g.team_id ?? g.game_id + 100000000,
                game_id: g.game_id,
                // id: g.id,
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

    const getGame = async (gameId) => {
        const dayjs = useDayjs();
        const client = useSupabaseClient();
        const {data, error } = await client.from('games_full').select(`
            id,
            start_time,
            rink:rink_id(
                id,
                name,
                city,
                province,
                sheet_count
            ),
            conceded,
            sheet:sheet_id(
                id,
                number
            ),
            hammer_first_end,
            end_early,
            ends_played,
            end_count
        `).eq('id', gameId).single()

        if (error) throw new Error('Game does not exist')
        const {rink, sheet, start_time, ...rest} = data;
        if(rink) useRepo(Rink).save(rink);
        if (sheet) useRepo(Sheet).save(sheet);
        useRepo(Game).save({
            ...rest,
            start_time: dayjs(start_time).unix(),
            rink_id: rink?.id,
            sheet_id: sheet?.id
        })
    
         const {data: gameScoreData, error: gameScoreError} = await client.from('game_scores').select(`
            team:team_id(
                id,
                name,
                avatar_url
            ),
            pending,
            game_id,
            color,
            placeholder,
            points_scored
    
        `).eq('game_id', gameId);
        if (error) throw new Error('Game does not exist')

        useRepo(GameTeam).where('game_id', gameId).delete();
        gameScoreData.forEach((gameScore) => {
             const {team, game_id, points_scored, color, placeholder, pending} = gameScore;
            useRepo(Team).save(team);
           
            useRepo(GameTeam).save({
                team_id: team?.id,
                game_id,
                points_scored,
                color,
                placeholder,
                pending
    
            })
        })
    
    
       
    
    
    return {...data, ...gameScoreData};
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

    const getScoreDetails = async (gameId) => {
        const client = useSupabaseClient();
        const { data } = await client
            .from("ends")
            .select(
                `
            id,
            end_number,
            scoring_team_id,
            hammer_team_id,
            points_scored
        `
            )
            .eq("game_id", gameId);
        return data;
    };
    
    const generateScore = async (gameId) => {
        const details = await getScoreDetails(gameId);
        const endCount = useRepo(Game).where('id', gameId).first()?.end_count;
        const home =  useRepo(GameTeam).where('game_id', gameId).offset(0).first()
        const away = useRepo(GameTeam).where('game_id', gameId).offset(1).first()
        const s = Array.from(
            {
                length: Math.max(endCount, details?.length),
            },
            (_, i) => i + 1
        ).reduce((all, current, index) => {
            if (!details[index]) {
                return {
                    ...all,
                    [index + 1]: {
                        home: "X",
                        away: "X",
                    },
                };
            } else {
                return {
                    ...all,
                    [index + 1]: {
                        home:
                            details[index]?.points_scored === null
                                ? "X"
                                : details[index]?.scoring_team_id ===
                                      home?.team_id ||
                                  (home?.pending &&
                                      !details[index]?.scoring_team_id)
                                ? details[index]?.points_scored
                                : 0,
                        away:
                            details[index]?.points_scored === null
                                ? "X"
                                : details[index]?.scoring_team_id ===
                                      away?.team_id ||
                                  (away?.pending &&
                                      !details[index]?.scoring_team_id)
                                ? details[index]?.points_scored
                                : 0,
                        ...details[index],
                    },
                };
            }
        }, {});
        return s;
    };

    return { getGameResult, getHeadToHead, getTeamGames, getGames, getLeagueGames, getGame, generateScore };
};
