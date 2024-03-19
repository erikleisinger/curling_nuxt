import client from '@/service/client'
import type {End} from '@/service/types/end/End'
import runQuery from '@/service/api/query/runQuery';
export const upsertGameEnds = async (ends: Partial<End>[]): Promise<void> => {
    await runQuery(async () => client.client
    .from('ends')
    .upsert(ends, {
        onConflict: "game_id, end_number",
        ignoreDuplicates: false,
    }))
    
}