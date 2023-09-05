export const useTeam = () => {
    const getTeamPlayers = async (teamId: number, andRequests: boolean) => {
        if (!teamId) return [];
        const client = useSupabaseClient();

        const { data } = await client
            .from("team_profile_junction")
            .select(
                `
            id,
            position,
            is_admin,
            user:profile_id (
                id,
                username,
                first_name,
                last_name,
                avatar
            )
        `
            )
            .eq("team_id", teamId);

        if (andRequests) {
            const { data: requests } = await client
                .from("team_requests")
                .select(
                    `
                user:requestee_profile_id (
                    id,
                    username,
                    first_name,
                    last_name,
                    avatar
                ),
                status,
                id
            `
                )
                .eq("team_id", teamId)
                .eq("status", "pending");
            return [...data, ...requests].map((p) => ({
                rowId: p.id,
                ...p.user,
                status: p.status ?? null,
                avatar: p.user?.avatar ? JSON.parse(p.user.avatar) : {},
            }));
        } else {
            return data.map((p) => ({
                rowId: p.id,
                ...p,
                ...p.user,
                status: null,
                avatar: p.user.avatar ? JSON.parse(p.user.avatar) : {},
            }));
        }
    };
    return { getTeamPlayers };
};
