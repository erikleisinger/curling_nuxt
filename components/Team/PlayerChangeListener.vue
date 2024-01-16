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

const {userTeamIds} = useTeam();
   const {user: userId} = useUser();


const onChange = useDebounceFn((e) => {
    const {new:newData, old: oldData} = e ?? {};
    const {team_id} = newData ?? oldData ?? {};
    if (team_id) {
queryClient.invalidateQueries({
        queryKey: ["team", "players", team_id],
    });
    } else {
        userTeamIds.value.forEach((teamId) => {
            queryClient.invalidateQueries({
        queryKey: ["team", "players", teamId],
    });
        })
    }
    
}, 1000);


const onJunctionChange = (e) => {
    onChange(e);
    const {new:newData, old: oldData} = e;
    const {profile_id} = newData ?? oldData ?? {};
    if (profile_id !== userId.value) return;
    useUserTeamStore().fetchUserTeams(true)
}

const watchForChanges = () => {
    const client = useSupabaseClient();
    client
        .channel("team_changes")
        .on(
            "postgres_changes",
            {
                event: "INSERT",
                schema: "public",
                table: "team_requests",
                filter: `team_id=in.(${userTeamIds.value})`,
            },
            onChange
        )
        // .on(
        //     "postgres_changes",
        //     {
        //         event: "UPDATE",
        //         schema: "public",
        //         table: "team_requests",
        //         filter: `team_id=in.(${userTeamIds.value})`,
        //     },
        //     onChange
        // )
        // .on(
        //     "postgres_changes",
        //     {
        //         event: "DELETE",
        //         schema: "public",
        //         table: "team_requests",
        //         filter: `team_id=in.(${userTeamIds.value})`,
        //     },
        //     onChange
        // )
        .on(
            "postgres_changes",
            {
                event: "INSERT",
                schema: "public",
                table: "team_profile_junction",
                filter: `team_id=in.(${userTeamIds.value})`,
            },
            onJunctionChange
        )
        .on(
            "postgres_changes",
            {
                event: "UPDATE",
                schema: "public",
                table: "team_profile_junction",
                filter: `team_id=in.(${userTeamIds.value})`,
            },
            onJunctionChange
        )
        .on(
            "postgres_changes",
            {
                event: "DELETE",
                schema: "public",
                table: "team_profile_junction",
                filter: `team_id=in.(${userTeamIds.value})`,
            },
            onJunctionChange
        )
        .subscribe();
};

watch(userId, (val) => {
    if (!val) return;
    watchForChanges();
}, {immediate: true})

watch(userTeamIds, (val) => {
    watchForChanges()
}, {deep: true, immediate: true})
</script>
