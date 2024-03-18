import { useRepo } from "pinia-orm";
import Team from "@/store/models/team";
import GameTeam from "@/store/models/game-team";
import client from "@/service/client";
import { getGameTeams } from "@/service/api/query/game";
export default (gameId: number) => {
    return async (onChange?: Function) =>
    {
        const saveGameTeams = (val) => {
            val?.forEach((item) => {
                const { team, color, placeholder, pending, points_scored } = item;
                useRepo(Team).save(team);
                useRepo(GameTeam).save({
                    game_id: gameId,
                    team_id: team.id,
                    pending,
                    color,
                    placeholder,
                    points_scored
                });
            });
            return val
        }
        
        const data = await client.fetch({
            queryFunc: () => getGameTeams(gameId),
            queryKey: `game-${gameId}-teams`,
            onChange: saveGameTeams,
        }).then(saveGameTeams)

        return data
    }
       
};




