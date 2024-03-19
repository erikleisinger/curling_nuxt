import { useRepo } from "pinia-orm";
import Rink from "@/store/models/rink";
import Team from "@/store/models/team";
import client from "@/service/client";
import { getTeam as getTeamQuery } from "@/service/api/query/team";
import {getRink} from '@/business/api/query/rink'
export const getTeam = (teamId: Number) => {
    const handler = (team) => {
        if (!!team) {
            useRepo(Team).save(team);
        }
        

        return team;
    };
    return async (onChange: Function) => {

      

            const data = await client
            .fetch({
                queryFunc: () => getTeamQuery(teamId),
                queryKey: `team-${teamId}-full`,
                onChange: (data) => {
                    onChange(handler(data));
                },
            })
            handler(data)
    
            const {rink_id} = data;
    
            if (rink_id) {
                const getRinkQuery = getRink(rink_id);
                await getRinkQuery();
            }

     
 
        
        
    }
        
};
