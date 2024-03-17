import client from "@/service/client";
export const getGameScoreDetails = async (gameId: number) => {
    const { data } = await client.client
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
        .eq("game_id", gameId);

    return data;
};