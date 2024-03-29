import { useRepo } from "pinia-orm";
import Game from "@/store/models/game";
import Team from "@/store/models/team";
import GameTeam from "@/store/models/game-team";
import generateLineScore from '@/business/utils/game/generateLineScore'
import client from "@/service/client";
import {
    getGameEndCount,
} from "@/service/api/query/game";
import {getGameEndDetails, getGameTeams} from '@/business/api/query/game'
export const getGameScore = (gameId: number) => {
    const defaultScore = Array.from(Array(8).keys()).reduce((all, current, index) => {
        return {
            ...all,
            [index + 1]: {
                home: 0,
                away: 0
            }
        }
    }, {})
    return async (onChange: Function) => {
        onChange(defaultScore)
        try {
            
           const scoreDetails = await getGameEndDetails(gameId)();
    
            
            const saveEndCount = (val) => {
                useRepo(Game).save({ id: gameId, end_count: val });
                return val;
            }
            const end_count = await client.fetch({
                queryFunc: () => getGameEndCount(gameId),
                queryKey: `game-${gameId}-endCount`,
                onChange: saveEndCount,
            }).then(saveEndCount);

           
    
            const [home, away] = await getGameTeams(gameId)();

            const score = generateLineScore(scoreDetails, end_count,{...home, team_id: home.team.id}, {...away, team_id: away.team.id})

    
            return score;
        } catch {
            return defaultScore;
        }
       
    };
};
