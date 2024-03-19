import {updateTeam, updateTeamAvatar} from '@/service/api/mutate/team'
import cache from '@/service/cache'


export default ({
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
    return async () => {
        await updateTeam({id, name, rink})

        if (avatar.file) {
            await updateTeamAvatar({
                fileName: avatar.path,
                file: avatar.file,
                teamId: id
            });    
            cache.delete(`team-${id}-avatar`)
        } 
        cache.delete(`team-${id}-full`)
    }
    
}