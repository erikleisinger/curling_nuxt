import { useRepo } from "pinia-orm";
import Game from "@/store/models/game";
import client from "@/service/client";
import { getGameEndDetails } from "@/service/api/query/game";
export default (gameId: number) => {
    return async (onChange?: Function) =>
    {
        const saveGameEndDetails = (data) => {
            const hammer_first_end =
                data?.find(({ end_number }) => end_number === 1)
                    .hammer_team_id ?? 0;

            useRepo(Game).save({ id: gameId, hammer_first_end });
            return data;
        }
        const scoreDetails = await client.fetch({
            queryFunc: () => getGameEndDetails(gameId),
            queryKey: `game-${gameId}-scoreDetails`,
            onChange: saveGameEndDetails,
        }).then(saveGameEndDetails)

        return scoreDetails;
    }
       
};
