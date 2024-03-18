import client from '@/service/client';
import runQuery from '@/service/api/query/runQuery';
export const getUser = async (userId: string) => {
    return runQuery(async () => client.client.from("profiles").select(`
    id, 
    timezone,
    username,
    first_name,
    last_name,
    avatar,
    is_new,
    rink_id,
    has_completed_tutorial
`).eq('id', userId).single())
    
}