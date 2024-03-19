import client from '@/service/client'
import type {GameTeam} from '@/service/types/game/GameTeam'
import runQuery from '@/service/api/query/runQuery';
export const upsertGameTeams = async (teams: GameTeam[], gameId: number): Promise<void> => {
    console.log('upsert teams: ', teams)
    await runQuery(async () => await client.client.from('game_team_junction').delete().eq('game_id', gameId))

    await runQuery(async () => await client.client
    .from("game_team_junction")
    .upsert(teams)) 
}