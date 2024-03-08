<template>
    <nav>
        <q-tabs
            class="tabs"
            ref="tabs"
            v-model="tab"
            outside-arrows
            mobile-arrows
            shrink
        >
            <q-tab label="Wins" :name="0" :ripple="false" />

            <q-tab label="Hammer Efficiency" :name="1" :ripple="false" />
            <q-tab label="Force efficiency" :name="2" :ripple="false" />
            <q-tab label="Steal efficiency" :name="3" :ripple="false" />
            <q-tab label="Steal defense" :name="4" :ripple="false" />
        </q-tabs>
    </nav>
    <div v-for="stat in rankings" :key="stat.team_id" class="rank__container">
        <TeamAvatar :teamId="stat.team_id" />
        <div class="q-ml-sm row items-center">{{ stat.name }}</div>
        <div class="row items-center md-text">
            {{stat[rankValue[tab]].toFixed(1)}}
        </div>
    </div>
</template>
<style lang="scss" scoped>
.rank__container {
    margin: var(--space-xs);
    background-color: rgba(0, 0, 0, 0.2);
    padding: var(--space-sm);
    font-family: $font-family-header;
    display: grid;
    grid-template-columns: 40px 1fr auto;
    transition: all 1s;
}

.tabs {
    @include tabs(rgba(0, 0, 0, 0.1), $app-mint);
    :deep(.q-tab) {
        padding: 0px var(--space-sm);
    }
}
</style>
<script setup>
import { useQuery } from "@tanstack/vue-query";
import TeamStatsTotal from "@/store/models/team-stats-total";
import Team from "@/store/models/team";

const getTeamStatsTotal = async () => {
    const client = useSupabaseClient();
    const { data } = await client
        .from("team_stats_total")
        .select("*")
        .neq("id", 0);

    data.forEach((totalStat) => {
        useRepo(TeamStatsTotal).save({
            ...totalStat,
            team_id: totalStat.id,
        });
        useRepo(Team).save({
            id: totalStat?.id,
            name: totalStat.name,
            avatar_url: totalStat.avatar_url,
        });
    });
    return data;
};

const { isLoading, data: totalStats } = useQuery({
    queryKey: ["stats", "total"],
    queryFn: getTeamStatsTotal,
    refetchOnWindowFocus: false,
});

const stats = computed(() =>
    useRepo(TeamStatsTotal)
        .where("team_id", (val) => val !== 0)
        .get()
);

const rankValue = [
    'wins_average',
    'hammer_conversion_average',
    'force_efficiency',
    'steal_efficiency',
    'steal_defense'
]

const tab = ref(0);

const rankings = computed(() => stats.value.sort((a,b) => {
            return b[rankValue[tab.value]] - a[rankValue[tab.value]]
        }))




</script>
<script>
export default {
    name: "Leaderboard",
};
</script>
