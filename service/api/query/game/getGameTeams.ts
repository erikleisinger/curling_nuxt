import client from "@/service/client";
import runQuery from '@/service/api/query/runQuery';
export const getGameTeams = async (gameId: number) => {
    return runQuery(async () => await client.client
    .from("game_scores")
    .select(
        `
        team:team_id(
            id,
            name,
            avatar_url
        ),
        pending,
        game_id,
        color,
        placeholder,
        points_scored
`
    )
    .eq("game_id", gameId))
};
