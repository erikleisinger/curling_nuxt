import client from '@/service/client'
export const getGameEndCount = async (gameId: number) => {
    const { data } = await client.client
        .from("games")
        .select(
            `
        end_count
    `
        )
        .eq("id", gameId).single()
    return data?.end_count;
}