import client from '@/service/client';
import runQuery from '@/service/api/query/runQuery';
export const createSheet = async (rink_id: number, sheet_number: number) => {

    const sheet = await runQuery(async () => 
        await client.client
    .from("sheets")
    .upsert(
        { rink_id, number: sheet_number },
        { onConflict: "rink_id, number" }
    )
    .select("id").single()

    )
    return sheet;
}