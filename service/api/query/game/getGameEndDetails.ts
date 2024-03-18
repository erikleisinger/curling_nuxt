import client from "@/service/client";
import runQuery from '@/service/api/query/runQuery';
export const getGameEndDetails = async (gameId: number) => {
    return runQuery(async () => await client.client
    .from("ends")
    .select(
        `
    id,
    end_number,
    scoring_team_id,
    hammer_team_id,
    points_scored
`
    )
    .eq("game_id", gameId))
};