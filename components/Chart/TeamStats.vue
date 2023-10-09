<template>
     <div class="col-12 col-sm-6 attributes__container" >
            <div class="row items-center justify-between q-my-sm b-white">
                <h2 class="text-md text-italic">Stats</h2>
                <q-btn flat @click="onFilterClick">{{showFilters ? 'Clear' : 'Filter'}}</q-btn>
            </div>
            <transition appear enter-active-class="animated slideInDown" leave-active-class="animated slideOutUp">
            <div class="filter-menu" v-if="showFilters">
                <TeamGameFilterOpponent v-model="opponentFilter" :teamId="teamId" />

            </div>
            </transition>

            <q-separator class="q-mb-md" />

            <TeamAttributes :teamId="teamId" :opponentId="opponentFilter?.value" :loading="loading" />
       

            <div class="chart__container">
                <ChartTeamStatsTime
                v-if="showChart"
                :opponentId="opponentFilter?.value"
                    :teamId="teamId"
                    :visibleStats="['Hammer efficiency']"
                    :loading="loading"
                />
            </div>
                 <TeamColorStats :teamId="teamId" :opponentId="opponentFilter?.value" :loading="loading"/>
                 <TeamHammerStats :teamId="teamId" :opponentId="opponentFilter?.value" v-if="!loading" :loading="loading"/>
        </div>
     
</template>
<style lang="scss">
    .attributes__container {
    background-color: white;
    padding: 0px var(--space-md);
    width: 100%;
    border-top-left-radius: 24px;
    border-top-right-radius: 24px;
    
.chart__container {
    width: calc(100% + 16px);
    box-sizing: border-box;
    margin: 0px -8px;
    margin-top: var(--space-sm);
}
}
</style>
<script setup>
import TeamStats from "@/store/models/team-stats";
    const props = defineProps({
        teamId: Number,
    })

    const opponentFilter = ref(null)
    const showFilters = ref(false)
    const loading = ref(true)

const showChart = ref(false)

watch(opponentFilter, () => {
    showChart.value = false;
    nextTick(() => {
        showChart.value = true;
    })
}, {immediate: true})

    const getTeamStats = async () => {
        loading.value = true;
    const { data } = await useSupabaseClient().rpc("get_team_stats", {
        team_id_param: props.teamId,
        range_start_param: null,
        range_end_param: null,
        limit_param: null
    });

    data.forEach((stat) => {
        useRepo(TeamStats).save({
            ...stat,
            team_id: props.teamId,
        });
    });
    loading.value = false;

};

onMounted(() => {
    getTeamStats();
})



const onFilterClick = () => {
    if (!showFilters.value) {
        showFilters.value = true;
    } else {
        showFilters.value = false;
        opponentFilter.value = null;
    }
}
</script>