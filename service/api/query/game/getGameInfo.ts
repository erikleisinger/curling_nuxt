
import client from "@/service/client";
import runQuery from '@/service/api/query/runQuery';
export const getGameInfo = async (gameId: number) => {
    return runQuery(async () => await client.client
    .from('games').select(`
        id,
        start_time,
        rink_id,
        conceded,
        sheet_id,
        end_count
`).eq('id', gameId).single())
};