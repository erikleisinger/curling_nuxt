import { useUserTeamStore } from "@/store/user-teams";
export default async () => {
    const { user: userId } = useUser();
    const store = useUserTeamStore()
    const { userTeams } = store;
    const filter = [...userTeams].reduce((all, current) => {
        const { id: teamId } = current;
        return [...all, `home.eq.${teamId}`, `away.eq.${teamId}`];
    }, []).join(',');

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

        if (error) throw new Error(error);

        const teamId = userTeams.some(({id}) => id === home) ? home : away

        const {data: gameScores, error: gameFetchError} = await client.rpc('get_team_record_new', {game_id_param: gameId, team_id_param: teamId})

        const myGameIndex = gameScores.findIndex(({team_id}) => team_id === teamId)
        const oppositionIndex = myGameIndex === 0 ? 1 : 0

        const result = gameScores[myGameIndex].points_scored > gameScores[oppositionIndex].points_scored ? 'win' : gameScores[myGameIndex].points_scored === gameScores[oppositionIndex].points_scored ? 'tie' : 'loss'

        return {
            ...gameScores[myGameIndex],
            start_time,
            result,
            opposition: gameScores[oppositionIndex].team
        }
       
    } catch (e) {
        throw new Error(e);
    }
};
