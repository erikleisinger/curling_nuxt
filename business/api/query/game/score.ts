import { useRepo } from "pinia-orm";
import Game from "@/store/models/game";
import Team from "@/store/models/team";
import GameTeam from "@/store/models/game-team";
import generateLineScore from '@/business/utils/game/generateLineScore'
import client from "@/service/client";
import {
    getGameEndCount,
    getGameScoreDetails,
    getGameTeams,
} from "@/service/api/query/game";
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
            const scoreDetails = await client.fetch({
                queryFunc: () => getGameScoreDetails(gameId),
                queryKey: `game-${gameId}-scoreDetails`,
                onChange: (val) => {
                    const hammer_first_end =
                        val?.find(({ end_number }) => end_number === 1)
                            .hammer_team_id ?? 0;
    
                    useRepo(Game).save({ id: gameId, hammer_first_end });
                },
            });
    
            const end_count = await client.fetch({
                queryFunc: () => getGameEndCount(gameId),
                queryKey: `game-${gameId}-endCount`,
                onChange: (val) => {
                    useRepo(Game).save({ id: gameId, end_count: val });
                },
            });
    
            const [home, away] = await client.fetch({
                queryFunc: () => getGameTeams(gameId),
                queryKey: `game-${gameId}-teams`,
                onChange: (val) => {
                    val?.forEach((item) => {
                        const { team, color, placeholder, pending } = item;
                        useRepo(Team).save(team);
                        useRepo(GameTeam).save({
                            game_id: gameId,
                            team_id: team.id,
                            pending,
                            color,
                            placeholder,
                        });
                    });
                },
            });

            const score = generateLineScore(scoreDetails, end_count,{...home, team_id: home.team.id}, {...away, team_id: away.team.id})

    
            return score;
        } catch {
           
            return defaultScore;
        }
       
    };
};
