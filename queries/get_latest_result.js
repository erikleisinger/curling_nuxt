import { useUserTeamStore } from "@/store/user-teams";
export default async () => {
    console.log('running')
    const { user: userId } = useUser();
    const store = useUserTeamStore()
    const { userTeams } = store;
    console.log(userTeams.length)
    const filter = [...userTeams].reduce((all, current) => {
        const { id: teamId } = current;
        console.log(teamId)
        return [...all, `home.eq.${teamId}`, `away.eq.${teamId}`];
    }, []).join(',');

    console.log('FILTER: ', filter)
    try {
        const client = useSupabaseClient();
        const { data:game, error } = await client
            .from("games")
            .select(`id,start_time,home,away`)
            .or(filter)
            .order('start_time', {ascending: false})
            .limit(1)
            .single()
            
            const {id:gameId, home, away, start_time} = game;
            if (!gameId) return null;
            console.log(game, error)

        if (error) throw new Error(error);

        const teamId = userTeams.some(({id}) => id === home) ? home : away

        const {data: gameScores, error: gameFetchError} = await client.rpc('get_team_record_new', {game_id_param: gameId, team_id_param: teamId})

        console.log('game: ', gameScores)

        const myGameIndex = gameScores.findIndex(({team_id}) => team_id === teamId)
        const oppositionIndex = myGameIndex === 0 ? 1 : 0

        const result = gameScores[myGameIndex].points_scored > gameScores[oppositionIndex].points_scored ? 'win' : gameScores[myGameIndex].points_scored === gameScores[oppositionIndex].points_scored ? 'tie' : 'loss'

        return {
            ...gameScores[myGameIndex],
            start_time,
            result,
            opposition: gameScores[oppositionIndex].team
        }
       
        // return {
        //     ...gameScore,
        //     start_time
        // }

        // const [t] = data;

        // const { avatar_type, avatar_url, team_avatar, id: team_id, name, ...stats } = t;

        // const obj = {
        //     avatar_type,
        //     avatar_url,
        //     team_avatar,
        //     id: team_id,
        //     name,
        //     stats: [
        //         {
        //             ...stats,
        //             team_id,
        //             game_id: 0,
        //         },
        //     ],
        // };
        // useRepo(TeamModel).save(obj);
        // return obj;
    } catch (e) {
        throw new Error(e);
    }
};
