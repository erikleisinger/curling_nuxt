import client from '@/service/client'
import runQuery from '@/service/api/query/runQuery';
export const getSheet = async (sheetId: number) => {
    return runQuery(async () => await client.client
        .from("sheets")
        .select("*")
        .eq("id", sheetId))
};