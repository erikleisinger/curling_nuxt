
import Team from '@/store/models/team'
import Rink from '@/store/models/rink'
import useQuery from '@/business/api/query'

const getTeamQuery = async (teamId: number, client: any) => {
    const {data} = await client.from('teams').select(`
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

    data.forEach((team) => {
        const {rink} = team;
        useRepo(Team).save(team);
        if (rink) useRepo(Rink).save(rink)
    })
    
    return data;
}

export default (client: any, teamId: number | string, options: object) => {
    if (typeof teamId == 'string' && teamId !== 'create') teamId = Number(teamId);
    if (teamId !== 'create' && isNaN(teamId)) throw new Error('teamId must be a number')
    return useQuery({
        queryKey: ['team', 'full', teamId],
        queryFn: () => getTeamQuery(teamId, client),
        refetchOnWindowFocus: false,
        ...options
    })
}

