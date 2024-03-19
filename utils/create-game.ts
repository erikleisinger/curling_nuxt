
import { TABLE_NAMES } from "@/presentation/constants/tables";
import { ValidationError, ErrorName } from "@/types/error";


export const createGame = async (newGame) => {
    const client = useSupabaseClient();
    const { data, error } = await client
        .from(TABLE_NAMES.GAMES)
        .insert(newGame)
        .select("id");
    if (error) throw new Error(`Error creating game: (code ${error.code})`);
    const [game] = data || [];
    const { id } = game;
    if (!id)
        throw new ValidationError({
            name: ErrorName.VALIDATION_FAILED,
            message: "Error creating game: no return value",
            fatal: true,
        });
    return id;
};


export const generateEnds = (ends, hammerFirstEnd, homeId, awayId, gameId) => {
    console.log(ends, hammerFirstEnd, homeId, awayId, gameId)
    const e = Object.entries(ends).reduce((all, [endNo, score], index) => {
        if (score.home === 'X') return all;

        const end = {
            game_id: gameId,
            end_number: index + 1,
            points_scored:
                score.home === "X" ? null : Math.max(score.home, score.away),
        };

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
    return e;
};

export const createSheet = async (rink_id: number, sheet_number: number) => {
    const client = useSupabaseClient();
    const { data } = await client
        .from("sheets")
        .upsert(
            { rink_id, number: sheet_number },
            { onConflict: "rink_id, number" }
        )
        .select("id");
    const [sheetFromDb] = data || [];
    return sheetFromDb?.id;
};
