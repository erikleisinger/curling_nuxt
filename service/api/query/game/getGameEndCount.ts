import client from '@/service/client'
import runQuery from '@/service/api/query/runQuery';
export const getGameEndCount = async (gameId: number) => {
    const data = await runQuery(async () => await client.client
    .from("games")
    .select(
        `
    end_count
`
    )
    .eq("id", gameId).single())
    return data?.end_count;
}