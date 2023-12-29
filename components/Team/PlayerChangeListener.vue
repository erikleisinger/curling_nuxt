<template>
    <div />
</template>
<script setup>
import { useQueryClient } from "@tanstack/vue-query";
import {useUserTeamStore} from '@/store/user-teams'
import {useDebounceFn} from '@vueuse/core'
const queryClient = useQueryClient();
const props = defineProps({
    teamId: Number,
});
const onChange = useDebounceFn((e) => {
    queryClient.invalidateQueries({
        queryKey: ["team", "players", props.teamId],
    });
}, 1000);
   const {user: userId} = useUser()
const onJunctionChange = (e) => {
    onChange();
    const {new:newData, old: oldData} = e;
    const {profile_id} = newData ?? oldData ?? {};
    if (profile_id !== userId.value) return;
    useUserTeamStore().fetchUserTeams(true)
}

const watchForChanges = () => {
    const client = useSupabaseClient();
    client
        .channel("team_requests")
        .on(
            "postgres_changes",
            {
                event: "INSERT",
                schema: "public",
                table: "team_requests",
                filter: `team_id=eq.${props.teamId}`,
            },
            onChange
        )
        .on(
            "postgres_changes",
            {
                event: "UPDATE",
                schema: "public",
                table: "team_requests",
                filter: `team_id=eq.${props.teamId}`,
            },
            onChange
        )
        .on(
            "postgres_changes",
            {
                event: "DELETE",
                schema: "public",
                table: "team_requests",
                filter: `team_id=eq.${props.teamId}`,
            },
            onChange
        )
        .on(
            "postgres_changes",
            {
                event: "INSERT",
                schema: "public",
                table: "team_profile_junction",
                filter: `team_id=eq.${props.teamId}`,
            },
            onJunctionChange
        )
        .on(
            "postgres_changes",
            {
                event: "UPDATE",
                schema: "public",
                table: "team_profile_junction",
                filter: `team_id=eq.${props.teamId}`,
            },
            onJunctionChange
        )
        .on(
            "postgres_changes",
            {
                event: "DELETE",
                schema: "public",
                table: "team_profile_junction",
                filter: `team_id=eq.${props.teamId}`,
            },
            onJunctionChange
        )
        .subscribe();
};

onMounted(() => {
    watchForChanges();
});
</script>
