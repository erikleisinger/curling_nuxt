import TeamModel from "@/store/models/team";
import Rink from '@/store/models/rink'
import TeamRink from '@/store/models/team-rink'

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

        const { avatar_url, id: team_id, name,rink_id,rink, facebook, instagram, twitter, featured_badge_id, text_color, ...stats } = t


       

        const obj = {
            avatar_url,
            id: team_id,
            facebook,
            instagram,
            twitter,
            featured_badge_id,
            name,
            text_color,
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
            
            
        };
        if (rink_id) obj.rink_id = rink_id
        if(rink)useRepo(Rink).save(rink);

        useRepo(TeamModel).save(obj);
        
        
        return obj;
    } catch (e) {
        throw new Error(e);
    }
};
