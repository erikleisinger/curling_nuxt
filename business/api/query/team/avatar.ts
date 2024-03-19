import { useRepo } from "pinia-orm";
import Team from '@/store/models/team'
import client from "@/service/client";
import { getAvatar } from "@/service/api/query/team";
export const getTeamAvatar = (teamId: Number) => {
    const handler = (data) => {
        useRepo(Team).where('id', teamId).update({'avatar_blob': data})
        return data;
    }
    return async (onChange: Function = (val) => val) =>  await client.fetch({
                queryFunc: () => getAvatar(teamId),
                queryKey: `team-${teamId}-avatar`,
                onChange: (data) => {
                    const formatted = handler(data)
                    onChange(formatted)
                }
            }).then((data) => handler(data))
};