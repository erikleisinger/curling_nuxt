<template>
    <q-menu auto-close>
        <q-list>
            <q-item clickable v-ripple>
                <q-item-section avatar>
                    <q-icon name="visibility" />
                </q-item-section>
                <q-item-section> View team </q-item-section>
            </q-item>
            <q-item
                clickable
                v-ripple
                @click="leaveLeague"
                v-if="isOnTeam(teamId)"
            >
                <q-item-section avatar>
                    <q-icon name="group_remove" />
                </q-item-section>
                <q-item-section> Leave league </q-item-section>
            </q-item>
        </q-list>
    </q-menu>
</template>
<script setup>
import { useQueryClient } from "@tanstack/vue-query";
const queryClient = useQueryClient();
const props = defineProps({
    leagueId: Number,
    teamId: Number,
});

const leaveLeague = async () => {
    const client = useSupabaseClient();
    await client
        .from("league_teams")
        .delete()
        .eq("league_id", props.leagueId)
        .eq("team_id", props.teamId);

    queryClient.invalidateQueries({
        queryKey: ["league", props.leagueId],
    });
    setTimeout(() => {
        queryClient.invalidateQueries({
            queryKey: ["league", "standings", props.leagueId],
        });
    }, 3000);
};

const { isOnTeam } = useTeam();
</script>
