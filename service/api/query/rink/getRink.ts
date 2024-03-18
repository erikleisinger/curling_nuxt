import client from '@/service/client'
import runQuery from '@/service/api/query/runQuery';
export const getRink = async (rinkId: number) => {
    return runQuery(async () => await client.client
    .from("rinks")
    .select("*")
    .eq("id", rinkId).single());
};