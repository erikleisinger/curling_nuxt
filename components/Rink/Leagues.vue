<template>
<transition appear enter-active-class="animated slideInLeft" leave-active-class="animated slideOutRight">

    <q-list separator>
        <RinkLeagueListItem v-for="league in leagues" :key="league.id" :league="league" @click="navigateTo(`/leagues/${league.id}`)"/>
        <q-item clickable v-ripple @click="openLeagueEditor">
            <q-item-section avatar>
                <q-btn flat round icon="add"/>
            </q-item-section>
            <q-item-section>Add league</q-item-section>
        </q-item>
    </q-list>


</transition>
</template>
<script setup>
import { useQuery } from "@tanstack/vue-query";
import League from "@/store/models/league";
import { useDialogStore } from "@/store/dialog";



const props = defineProps({
    rinkId: Number,
});
const dialogStore = useDialogStore();
const openLeagueEditor = () => {
    dialogStore.toggleLeagueEditor({ open: true });
};

const { getRinkLeagues } = useLeague();

const { isLoading } = useQuery({
    queryKey: ["rink", "leagues", props.rinkId],
    queryFn: () => getRinkLeagues(props.rinkId),
    refetchOnWindowFocus: false,
});

const leagues = computed(() =>
    useRepo(League).withAllRecursive().where("rink_id", props.rinkId).get()
);
</script>
<script>
export default {
    name: "RinkLeagues",
};
</script>
