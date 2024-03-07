import { updateTeamAvatar } from "@/business/api/mutate";

export default async (
    client: any,
    {
        id,
        name,
        rink,
        avatar,
    }: {
        id: number;
        name: string;
        rink: number | object;
        avatar: object;
    }
) => {
    const rink_id = typeof rink === "string" ? rink : rink?.id;
    const { data } = await client
        .from("teams")
        .insert({
            name: name,
            rink_id: rink_id,
        })
        .select("id")
        .single();

    const { id: teamId } = data;

    if (avatar?.file) {
        try {
            await updateTeamAvatar(client, {
                fileName: avatar.path,
                file: avatar.file,
                teamId,
            });
        } catch(e) {
            console.log('ERROR UPDATING AVATAR: ', e)
            // await client.from("teams").delete().eq("id", teamId);
        }
    }

    return teamId
};
