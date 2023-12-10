import Player from "@/store/models/player";
import TeamPlayer from "@/store/models/team-player";
import Team from "@/store/models/team";
export const useTeam = () => {
    const getTeamPlayers = async (teamId: number, andRequests: boolean = false) => {
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

            useRepo(TeamPlayer).where('team_id', teamId).delete();

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
            const playerRepo = useRepo(Player);
            const teamPlayerRepo = useRepo(TeamPlayer);
            [...data, ...requests].forEach((p) => {
                const status = p.status ?? null;
                playerRepo.save(p.user);
                teamPlayerRepo.save({
                    id: p.id,
                    player_id: p.user.id,
                    team_id: teamId,
                    status,
                    position: p.position,
                });
            });
        } else {
            const playerRepo = useRepo(Player);
            const teamPlayerRepo = useRepo(TeamPlayer);

            data?.forEach((p) => {
                playerRepo.save(p.user);
                teamPlayerRepo.save({
                    id: p.id,
                    player_id: p.user.id,
                    team_id: teamId,
                    status: null,
                    position: p.position,
                });
            });
            
        }
        return true;
    };

    const isOnTeam = (teamId: number) => {
        const { user: userId } = useUser();
        const team = useRepo(Team).with("players").where("id", teamId).first();
        if (!team) return false;
        return [...(team.players ?? [])].some(({ id }) => id === userId.value);
    };
    return { getTeamPlayers, isOnTeam };
};
