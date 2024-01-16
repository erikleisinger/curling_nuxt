import { useUserTeamStore } from "@/store/user-teams";
export const useNotification = () => {


    const getAchievements = async () => {
        const { user: userId } = useUser();
        const teamList = useUserTeamStore().userTeams.map(({ id }) => id);
        const client = useSupabaseClient();

        const { data } = await client
            .from("achievements")
            .select(
                `
        id,
        created_at,
        team:team_id (
            id,
            name,
            avatar_url
        ),
        profile:profile_id (
            id,
            first_name,
            last_name,
            avatar
        ),
        name,
        type,
        info,
        game_id
        `
            )
            .or(`team_id.in.(${teamList}),profile_id.eq.${userId.value}`)
            .order("created_at", { ascending: false });

        return data.filter(({ type, team, profile }) => {
            if (type !== "team_request") return true;
            // ensure we don't see team requests sent to another person
            return profile.id === userId.value;
        });
    };


    return { getAchievements};
};
