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
            sheets
        )
        `).eq('id', teamId)

    // data.forEach((team) => {
    //     const {rink} = team;
    //     useRepo(Team).save(team);
    //     if (rink) useRepo(Rink).save(rink)
    // })
    
    return data;
}