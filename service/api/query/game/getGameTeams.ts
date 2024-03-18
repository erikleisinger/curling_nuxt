import client from "@/service/client";
import runQuery from '@/service/api/query/runQuery';
export const getGameTeams = async (gameId: number) => {
    return runQuery(async () => await client.client
    .from("game_team_junction")
    .select(
        `
        team:team_id (
            id,
            name,
            avatar_url
        ),
        color,
        placeholder,
        pending
`
    )
    .eq("game_id", gameId))
};
