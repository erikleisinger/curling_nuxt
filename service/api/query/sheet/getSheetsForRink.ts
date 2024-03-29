import client from '@/service/client'
import runQuery from '@/service/api/query/runQuery';
export const getSheetsForRink = async (rinkId: number) => {
    return runQuery(async () => await client.client
        .from("sheets")
        .select("*")
        .eq("rink_id", rinkId))
};