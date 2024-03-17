import { useRepo } from "pinia-orm";
import Rink from "@/store/models/rink";
import Team from "@/store/models/team";
import client from "@/service/client";
import { getTeam as getTeamQuery } from "@/service/api/query/team";
export const getTeam = (teamId: Number) => {
    const handler = (team) => {
        if (!!team) {
            const { rink } = team;
            useRepo(Team).save(team);
            if (rink) useRepo(Rink).save(rink);
        }
        

        return team;
    };
    return async (onChange: Function) =>
        await client
            .fetch({
                queryFunc: () => getTeamQuery(teamId),
                queryKey: `team-${teamId}-full`,
                onChange: (data) => {
                    onChange(handler(data));
                },
            })
            .then((data) => handler(data));
};
