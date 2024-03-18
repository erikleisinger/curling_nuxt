
import {createTeam, updateTeamAvatar} from '@/service/api/mutate/team'
export default (
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
    return async () => {
        const teamId = await createTeam({id, name, rink})

        if (avatar?.file) {
            try {
                await updateTeamAvatar({
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
    }
    
};
