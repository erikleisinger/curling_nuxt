import type {EndScores} from '@/business/types/end'
import type {End} from '@/service/types/end/End'
export const generateGameEnds = (ends: EndScores, hammerFirstEnd: number, homeId: number, awayId: number, gameId: number) => {
    const e = Object.entries(ends).reduce((all, [_, score], index) => {
        if (score.home === 'X') return all;

        const end = {
            game_id: gameId,
            end_number: index + 1,
            points_scored:
                score.home === "X" ? null : Math.max(score.home, score.away)
        } as  Partial<End>

        if (index === 0) {
            end.hammer_team_id = hammerFirstEnd;
        } else {
            const { scoring_team_id, points_scored, hammer_team_id } =
                all[index - 1];
            if (scoring_team_id === homeId && points_scored > 0) {
                end.hammer_team_id = awayId;
            } else if (scoring_team_id === awayId && points_scored > 0) {
                end.hammer_team_id = homeId;
            } else {
                end.hammer_team_id = hammer_team_id;
            }
        }
        end.scoring_team_id = score.home === "X"
                    ? null
                    : score.home
                    ? homeId
                    : score.away
                    ? awayId
                    : end.hammer_team_id;
        

        
        return [...all, end];
    }, []);
    console.log(e)
    return e;
};