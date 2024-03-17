import client from "@/service/client";
export const getGameTeams = async (gameId: number) => {
    const { data } = await client.client
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
        .eq("game_id", gameId);

    return data;
};
