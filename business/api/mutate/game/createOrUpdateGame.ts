import type {Game} from '@/service/types/game/Game'
import type {EndScores} from '@/business/types/end'
import type {GameTeam} from '@/service/types/game/GameTeam'
import { createSheet } from '@/service/api/mutate/sheet';
import { upsertGame, upsertGameEnds, upsertGameTeams } from '@/service/api/mutate/game';
import { generateGameEnds } from '@/business/utils/game/generateGameEnds';

type GameTeamInput = Omit<GameTeam, 'game_id'> & { game_id?: number };

export default (
    {
        game,
        sheet_number,
        score,
        teams
    }: {
        game: Game,
        sheet_number: number,
        score: EndScores,
        teams: GameTeamInput[]
    }
) => {
    return async () => {
        const {rink_id} = game;
        const sheet = await createSheet(rink_id, sheet_number);
        const {id: sheet_id} = sheet;
        console.log('GOT SHEET ID: ', sheet_id)

        const {hammer_first_end, ...gameToInsert} = game;

        const game_id = await upsertGame({
            ...gameToInsert,
            sheet_id
        })

        const [{team_id: homeId}, {team_id: awayId}] = teams;

        const ends = generateGameEnds(score, hammer_first_end, homeId, awayId, game_id)

        await upsertGameEnds(ends);

        await upsertGameTeams(teams.map((team) => ({
            ...team,
            game_id
        })), game_id)

        return game_id;

        // await createTeamGameJunction(
        //     { ...gameToCreate, home: params?.home?.id, away: !params?.away?.id ? {
        //         id: 0,
        //         name: params?.away?.name
        //     } : params?.away, home_color: params.homeColor, away_color: params.awayColor, id: gameId },
        //     shouldSendInvitation
        // );


    }
    
};
