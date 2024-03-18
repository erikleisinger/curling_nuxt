import { updateTeamAvatar } from "@/business/api/mutate";
import client from '@/service/client'
export default async (
    {
        id,
        name,
        rink,

    }: {
        id: number;
        name: string;
        rink: number | object;
    }
) => {
    const rink_id = typeof rink === "string" ? rink : rink?.id;
    const { data } = await client.client
        .from("teams")
        .insert({
            name: name,
            rink_id: rink_id,
        })
        .select("id")
        .single();

    const { id: teamId } = data;

    return teamId
};
