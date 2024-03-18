import client from '@/service/client';
export const getTeam = async (teamId: number) => {
    const {data} = await client.client.from('teams').select(`
        id,
        name,
        avatar_url,
        rink:rink_id (
            id,
            name,
            city,
            province,
            sheet_count
        )
        `).eq('id', teamId)
    
    return data;
}