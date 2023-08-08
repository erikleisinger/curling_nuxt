import { useTeamStore } from "@/store/teams";
import Team from "@/types/team";

const getSkip = (team: Team) => {
    if (!team) return;
    if (team.skip?.id) return team.skip;

    const closestPosition = [
        "fourth",
        "third",
        "second",
        "lead",
        "fifth",
        "sixth",
        "seventh",
    ].find((position) => !!team[`${position}_player_id`]?.id);

    return closestPosition
        ? team[`${closestPosition}_player_id`]
        : team.fourth_player_id;
};

export const useTeam = () => {
    const getRealtimeTeam = async ({
        teamId,
        realtime = false,
    }: {
        teamId: number;
        realtime: boolean;
    }) => {
        const store = useTeamStore();
        const team = ref<Team | null>(null);

        team.value = store.getTeamById(teamId);
        if (!team.value) {
            team.value = await store.refreshTeam(teamId);
        }

        const id = team.value?.id;

        const skip = ref(null);
        skip.value = getSkip(team.value);

        const name = ref<string | null | undefined>(null);
        name.value = team.value?.name;

        if (realtime) {
            const client = useSupabaseClient();
            client
                .channel("table-db-changes")
                .on(
                    "postgres_changes",
                    {
                        event: "*",
                        schema: "public",
                        table: "teams",
                        filter: `id=eq.${teamId}`,
                    },
                    async ({ eventType, new: newItem, old }) => {
                        if (eventType === "DELETE") {
                            team.value = null;
                        } else if (eventType === "UPDATE") {
                            console.log("UPDATE: ", newItem);
                            const { name } = newItem;
                            console.log("UPDATE: ", newItem, name);
                            if (name !== team?.value?.name && team?.value)
                                team.value.name = name;
                        }
                    }
                )
                .subscribe();
        }

        return { team, skip, name };
    };

    const useTempTeamStore = async ({
        useStore = true,
        filter = null,
        realtime = true,
    }: {
        filter: string | null;
        useStore: boolean;
        realtime: boolean;
    }) => {
        const store = ref<any>(null);
        let teams = ref<Team[]>([]);
        if (useStore) {
            const teamStore = useTeamStore();
            store.value = teamStore;
            teams.value = teamStore.teams;
        }

        if (realtime) {
            const { user: userId } = useUser();
            const client = useSupabaseClient();
            client
                .channel("table-db-changes")
                .on(
                    "postgres_changes",
                    {
                        event: "*",
                        schema: "public",
                        table: "teams",
                        filter: `profile_id=eq.${userId.value}`,
                    },
                    async (data) => {
                        const { eventType, new: newItem, old } = data;
                        if (eventType === "DELETE") {
                            const id = newItem?.id || old?.id;
                            const index = teams.value.findIndex(
                                (t) => t.id === id
                            );
                            if (id === -1) return;
                            teams.value.splice(index, 1);
                        } else if (eventType === "UPDATE") {
                            const team = teams.value.find(
                                (t) => t.id === newItem?.id
                            );
                            if (team.name !== newItem.name) {
                                const index = teams.value.findIndex(
                                    (t) => t.id === newItem?.id
                                );
                                if (index === -1) return;
                                teams.value.splice(index, 1, {
                                    ...team,
                                    name: newItem.name,
                                });s
                            }
                        }
                    }
                )
                .subscribe();
        }

        const useStoreTeam = (teamId: number, element: any) => {
            return teams?.value.find((t) => t.id === teamId);
        };

        return { useStoreTeam, teams };
    };

    return { getRealtimeTeam, useTempTeamStore };
};
