import { useUserTeamStore } from "@/store/user-teams";
export const useNotification = () => {
    const count = ref(0);
    const countComputed = computed(() => count.value)

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

    const listenForNotifications = (attempt = 1) => {
        if (attempt > 9) return countComputed;
        const { user: userId } = useUser();
        if (!userId.value) {
            setTimeout(() => {
                return listenForNotifications(attempt + 1);
            }, 1000)
 
        } else {
            

            const startWebsockets = () => {
                const client = useSupabaseClient();
                client
                    .channel("notifications")
                    .on(
                        "postgres_changes",
                        {
                            event: "INSERT",
                            schema: "public",
                            table: "notifications",
                            filter: `profile_id=eq.${userId.value}`,
                        },
                        (e) => {
                            const { new: newData } = e;
                            const { read } = newData;
                            if (read) count.value -= 1;
                        }
                    )
                    .on(
                        "postgres_changes",
                        {
                            event: "UPDATE",
                            schema: "public",
                            table: "notifications",
                            filter: `profile_id=eq.${userId.value}`,
                        },
                        (e) => {

                            const { new: newData } = e;
                            const { read } = newData;
                            if (!read) {
                                count.value += 1;
                            } else {
                                count.value -= 1;
                            }
                        }
                    )
                    .subscribe();
            };
            const getCount = async () => {
                const { user: userId } = useUser();
                const client = useSupabaseClient();
                const { count: notCount } = await client
                    .from("notifications")
                    .select(`id`, { count: "exact" })
                    .eq('profile_id', userId.value)
                    .eq("read", false)
                    .order("created_at", { ascending: false });
                    
    
                count.value = notCount;
            };
            getCount();
            startWebsockets(); 
            return countComputed;
        }
        
        
    };
    return { getAchievements, listenForNotifications, count };
};
