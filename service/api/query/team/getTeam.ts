import client from '@/service/client';
import runQuery from '@/service/api/query/runQuery';
export const getTeam = async (teamId: number) => {
    return runQuery(async () => await client.client.from('teams').select(`
    id,
    name,
    avatar_url,
    rink_id
    `).eq('id', teamId).single())
}