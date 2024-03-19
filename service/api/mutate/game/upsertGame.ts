import client from '@/service/client'
import type {Game} from '@/service/types/game/Game'

import runQuery from '@/service/api/query/runQuery';

export const upsertGame = async (game: Game) => {
    const data = await runQuery(async () =>  await client.client
    .from('games')
    .upsert(game)
    .select('id').single(), 'upsertGame -> updateGame')

    return data?.id
   
}