<template>
    <div class="dashboard__container">
          
    <LayoutCircleTitle title="Season Overview 2023-2024" minHeight="225px">
        <template v-slot:underlay>
            <Rings size="100%" />
        </template>
        <template v-slot:append>
            <!-- <h2>2023-2024</h2> -->
          
        </template>
    </LayoutCircleTitle>
        <!-- <header>
            <h1>Dashboard</h1>
            <h2>2023-2024</h2>
        </header> -->
         <div class="filter__container row justify-center">
            <DashboardFilters v-model="filters"/>
        </div>
        <main class="tile__container" :class="{expanded}" ref="tileContainer">
            <DashboardStat
                v-for="statType in stats"
                :key="statType"
                :type="statType"
                @click="setSelected(statType)"
                :expanded="expanded === statType"
                :style="{order: expanded === statType ? 0 : 1}"
                :filters="filters"
 
            >
            </DashboardStat>
        </main>
    </div>
</template>
<style lang="scss" scoped>
.dashboard__container {
    // background-color: $
    // @include bg-blue-side;
    background-color: white;
    @include lines;
    min-height: 100%;
    color: white;
    position: relative;
    // padding-top: var(--space-lg);
    h1 {
        @include lg-text;
        text-align: center;
        z-index: 1;
    }
    h2 {
        @include md-text;
        text-align: center;
        z-index: 1;
    }

    .text {
        z-index: 100;
    }

    .tile__container {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        // margin-top: var(--space-md);
        column-gap: 2px;
        row-gap: 2px;
        // gap: var(--space-sm);
        padding-bottom: var(--space-lg);
        flex-wrap: wrap;
        justify-content: space-around;
        @include sm {
            grid-template-columns: repeat(3, 1fr);
        }
        &.expanded {
            grid-template-columns: 1fr;
            
        }
    }

   
}
</style>
<script setup>
import { NON_PERCENT_STATS, STAT_FIELDS_TOTAL, STAT_TYPES } from "@/constants/stats";
import { useQuery } from "@tanstack/vue-query";
import { useUserTeamStore } from "@/store/user-teams";
import TeamStatsTotal from "@/store/models/team-stats-total";
import TeamStats from "@/store/models/team-stats";
import Team from "@/store/models/team";

const filters = ref({
    teams: [],
    sheet: null,
})

const teamIds = computed(() =>
    useUserTeamStore().userTeams.map(({ id }) => id)
);

const getTeamStatsTotal = async () => {
    const client = useSupabaseClient();
    const { data } = await client
        .from("team_stats_total")
        .select(`*`)
        // .in("id", teamIds.value);
    data.forEach((totalStat) => {
        useRepo(TeamStatsTotal).save({
            ...totalStat,
            team_id: totalStat.id,
        });
    });
    return data;
};

const { user: userId } = useUser();

const { isLoading, data: totalStats } = useQuery({
    queryKey: ["stats", "total", userId.value],
    queryFn: getTeamStatsTotal,
    refetchOnWindowFocus: false,
});

const getAllTeamStats = async () => {
    const client = useSupabaseClient();
    const { data } = await client
        .from("team_stats_with_params")
        .select("*")
        .in("team_id", teamIds.value);
    data.forEach((stat) => {
       
        useRepo(TeamStats).save(stat);
    });
    return data;
};


const { isLoading: isLoadingSingleStats, data: singleStats } = useQuery({
    queryKey: ["stats", "singletotal", userId.value],
    queryFn: getAllTeamStats,
    refetchOnWindowFocus: false,
});

const stats = [
    STAT_TYPES.WINS,
    STAT_TYPES.POINTS_PER_GAME,
    STAT_TYPES.ENDS_PER_GAME,
      STAT_TYPES.HAMMER_LAST_END,
    STAT_TYPES.HAMMER_EFFICIENCY,
    STAT_TYPES.STEAL_EFFICIENCY,
    STAT_TYPES.FORCE_EFFICIENCY,
    STAT_TYPES.STEAL_DEFENSE,
    STAT_TYPES.BLANK_ENDS,
  
]


const tileContainer = ref(null)

const expanded = ref(null);

const setSelected = (type) => {
    if (expanded.value === type) {
        expanded.value = null;
    } else {
        expanded.value = type;
         const scroller = document.getElementById('global-container')
    if (scroller.scrollTop < tileContainer.value.offsetTop) return;
    scroller.scrollTop = tileContainer.value.offsetTop
    }

   
};
</script>
