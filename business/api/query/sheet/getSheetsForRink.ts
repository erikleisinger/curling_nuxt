import { useRepo } from "pinia-orm";
import Rink from "@/store/models/rink";
import Team from "@/store/models/team";
import client from "@/service/client";
import { getSheetsForRink } from "@/service/api/query/sheet";
export default (rinkId: Number) => {
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
