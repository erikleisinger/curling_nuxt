import {updateTeamAvatar} from '@/business/api/mutate'




export default async (client: any, {
    id,
    name,
    rink,
    avatar
}: {
    id: number,
    name: string,
    rink: number | object,
    avatar: object
}) => {

    const rink_id = typeof rink === 'string' ? rink : rink?.id;
        await client
            .from("teams")
            .update({
                name,
                rink_id,
            })
            .eq("id", id);

        if (avatar.file) {
            await updateTeamAvatar(client, {
                fileName: avatar.path,
                file: avatar.file,
                teamId: id
            });    
        } 
}