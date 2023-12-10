import TeamModel from "@/store/models/team";
import Rink from '@/store/models/rink'

const getTeamStats = async (id) => {
    const client = useSupabaseClient();
        const { data, error } = await client
            .from('team_stats_total')
            .select('*')
            .eq("id", id)
            .limit(1);

            if (error) throw new Error(error);

        const [t] = data;
        return t;
}

const getRink = async (rinkId) => {

    const client = useSupabaseClient();
    const {data} = await client.from('rinks').select(`
    id,
    name,
    province`).eq('id', rinkId).single()
    return data;
}

export default async (id) => {
    try {
        const client = useSupabaseClient();
        const { data, error } = await client    
            .rpc("get_user_teams")
            .eq("id", id)
            .limit(1);

        if (error) throw new Error(error);

        const [t] = data;

        const {name: teamName, ...totalStats} = await getTeamStats(id) ?? {}
       
        const { avatar_type, avatar_url, team_avatar, id: team_id, name, ...stats } = t
        const {rink_id} = t;;
        const rink = await getRink(rink_id)

        useRepo(Rink).save(rink)

        const obj = {
            avatar_type,
            avatar_url,
            team_avatar,
            id: team_id,
            
            name,
            stats: [
                {
                    ...stats,
                    team_id,
                    game_id: 0,
                },
            ],
            totalStats: {
                ...totalStats,
                team_id: totalStats.id
            },
            rink
            
        };
        useRepo(TeamModel).save(obj);
        return obj;
    } catch (e) {
        throw new Error(e);
    }
};
