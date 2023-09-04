export const useTeam = () => {
    
    const getTeamPlayers = async (teamId:number) => {
        if (!teamId) return []
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
            ),
            type
        `
                )
                .eq("team_id", teamId);
                console.log(data)
    
            // teamPlayers.value = data.map((p) => ({
            //     rowId: p.id,
            //     ...p,
            //     ...p.user,
            //     status: null,
            //     avatar: p.user.avatar ? JSON.parse(p.user.avatar) : {},
            // }));
        
    }
    return { getTeamPlayers };
};
