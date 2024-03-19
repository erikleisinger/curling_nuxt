<template>

            <section class="filter__container row justify-center">
                <DashboardFilters v-model="filters" />
            </section>
            <section
                class="tile__container"
                :class="{ expanded }"
                ref="tileContainer"
                v-if="statsObj"
                 v-memo="[filters.teams.length, filters.opposition, filters.rink, filters.sheet, filters.start, statsObj.id, expanded, mainContent]"
            >
           
                <DashboardStatWins
                    @click="setSelected(STAT_TYPES.WINS)"
                    :expanded="expanded === STAT_TYPES.WINS"
                    :style="{ order: expanded === STAT_TYPES.WINS ? 0 : 1 }"
                    :filters="filters"
                    @close="closeStat(STAT_TYPES.WINS)"
                    @scroll="scrollUp"
                    :id="`dashboard-stat-${STAT_TYPES.WINS}`"
                    :stats="statsObj"
                >
                </DashboardStatWins>
                <DashboardStatHammerEfficiency
                    @click="setSelected(STAT_TYPES.HAMMER_EFFICIENCY)"
                    :expanded="expanded === STAT_TYPES.HAMMER_EFFICIENCY"
                    :style="{
                        order:
                            expanded === STAT_TYPES.HAMMER_EFFICIENCY ? 0 : 1,
                    }"
                    :filters="filters"
                    @close="closeStat(STAT_TYPES.HAMMER_EFFICIENCY)"
                    @scroll="scrollUp"
                    :id="`dashboard-stat-${STAT_TYPES.HAMMER_EFFICIENCY}`"
                    :stats="statsObj"
                >
                </DashboardStatHammerEfficiency>

                  <DashboardStatStealEfficiency
                    @click="setSelected(STAT_TYPES.STEAL_EFFICIENCY)"
                    :expanded="expanded === STAT_TYPES.STEAL_EFFICIENCY"
                    :style="{
                        order:
                            expanded === STAT_TYPES.STEAL_EFFICIENCY ? 0 : 1,
                    }"
                    :filters="filters"
                    @close="closeStat(STAT_TYPES.STEAL_EFFICIENCY)"
                    @scroll="scrollUp"
                    :id="`dashboard-stat-${STAT_TYPES.STEAL_EFFICIENCY}`"
                    :stats="statsObj"
                >
                </DashboardStatStealEfficiency>

                   <DashboardStatForceEfficiency
                    @click="setSelected(STAT_TYPES.FORCE_EFFICIENCY)"
                    :expanded="expanded === STAT_TYPES.FORCE_EFFICIENCY"
                    :style="{
                        order:
                            expanded === STAT_TYPES.FORCE_EFFICIENCY ? 0 : 1,
                    }"
                    :filters="filters"
                    @close="closeStat(STAT_TYPES.FORCE_EFFICIENCY)"
                    @scroll="scrollUp"
                    :id="`dashboard-stat-${STAT_TYPES.FORCE_EFFICIENCY}`"
                    :stats="statsObj"
                >
                </DashboardStatForceEfficiency>

                      <DashboardStatStealDefense
                    @click="setSelected(STAT_TYPES.STEAL_DEFENSE)"
                    :expanded="expanded === STAT_TYPES.STEAL_DEFENSE"
                    :style="{
                        order:
                            expanded === STAT_TYPES.STEAL_DEFENSE ? 0 : 1,
                    }"
                    :filters="filters"
                    @close="closeStat(STAT_TYPES.STEAL_DEFENSE)"
                    @scroll="scrollUp"
                    :id="`dashboard-stat-${STAT_TYPES.STEAL_DEFENSE}`"
                    :stats="statsObj"
                >
                </DashboardStatStealDefense>

                 <DashboardStatPointsPerEnd
                    @click="setSelected(STAT_TYPES.POINTS_PER_END)"
                    :expanded="expanded === STAT_TYPES.POINTS_PER_END"
                    :style="{
                        order:
                            expanded === STAT_TYPES.POINTS_PER_END ? 0 : 1,
                    }"
                    :filters="filters"
                    @close="closeStat(STAT_TYPES.POINTS_PER_END)"
                    @scroll="scrollUp"
                    :id="`dashboard-stat-${STAT_TYPES.POINTS_PER_END}`"
                    :stats="statsObj"
                >
                </DashboardStatPointsPerEnd>
                <div
                    v-if="!!expanded"
                    class="full-width q-pa-md row justify-center"
                ></div>
            </section>
</template>
<style lang="scss" scoped>
.tabs {
    @include tabs($app-mint);
    
}

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
        @include xxs {
            grid-template-columns: repeat(1, 1fr);
        }
        column-gap: 2px;
        row-gap: 2px;
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

    .filter__container {
        margin: var(--space-lg) 0px;
    }

</style>
<style lang="scss">
.separator {
    background-color: v-bind(color);
    margin-bottom: var(--space-md);
    margin-top: calc(var(--space-md) - 4px);
}
</style>
<script setup>
import {
    STAT_TYPES
} from "@/presentation/constants/stats";
import { useQuery } from "@tanstack/vue-query";
import { useSwipe } from "@vueuse/core";
import TeamStatsTotal from "@/store/models/team-stats-total";
import TeamStats from "@/store/models/team-stats";
import Team from "@/store/models/team";
import Player from "@/store/models/player";
import gsap from "gsap";
import { Flip } from "gsap/Flip";
import {Stats} from '@/store/models/stats/stats'
gsap.registerPlugin(Flip);

const filters = ref({
    teams: [],
    opposition: null,
    rink: null,
    sheet: null,
    start: null,
});

const { userTeamIds } = useTeam();

const getTeamStatsTotal = async () => {
    const client = useSupabaseClient();
    const { data } = await client.from("team_stats_total").select("*");

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

const { user: userId } = useUser();

const currentUser = computed(() =>
    useRepo(Player).withAllRecursive().where("id", userId.value).first()
);

const { isLoading, data: totalStats } = useQuery({
    queryKey: ["stats", "total"],
    queryFn: getTeamStatsTotal,
    refetchOnWindowFocus: false,
});

const dayjs = useDayjs();

const getAllTeamStats = async () => {
    const client = useSupabaseClient();
    const { data } = await client
        .from("team_stats")
        .select(`*`)
        .in("team_id", userTeamIds.value);

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

const $q = useQuasar();

const stats = computed(() => {
    if ($q.screen.xs)
        return [
            STAT_TYPES.WINS,
            STAT_TYPES.POINTS_PER_END,
            // STAT_TYPES.HAMMER_PERFORMANCE,
            // STAT_TYPES.HAMMER_LAST_END,
            STAT_TYPES.HAMMER_EFFICIENCY,
            STAT_TYPES.POINTS_FOR_PER_GAME,

            STAT_TYPES.ENDS_FOR_PER_GAME,
            STAT_TYPES.POINTS_AGAINST_PER_GAME,
            STAT_TYPES.ENDS_AGAINST_PER_GAME,

            STAT_TYPES.STEAL_EFFICIENCY,
            STAT_TYPES.FORCE_EFFICIENCY,
            STAT_TYPES.STEAL_DEFENSE,
            STAT_TYPES.BLANK_ENDS,
        ];

    return [
        STAT_TYPES.WINS,
        STAT_TYPES.POINTS_PER_END,
        //   STAT_TYPES.HAMMER_PERFORMANCE,
        // STAT_TYPES.HAMMER_LAST_END,
        STAT_TYPES.HAMMER_EFFICIENCY,
        STAT_TYPES.POINTS_FOR_PER_GAME,
        STAT_TYPES.ENDS_FOR_PER_GAME,
        STAT_TYPES.STEAL_EFFICIENCY,
        STAT_TYPES.POINTS_AGAINST_PER_GAME,

        STAT_TYPES.ENDS_AGAINST_PER_GAME,

        STAT_TYPES.FORCE_EFFICIENCY,
        STAT_TYPES.STEAL_DEFENSE,
        STAT_TYPES.BLANK_ENDS,
    ];
});

const {toTimezone} = useTime();

const statsObj = computed(() => {
    let stats;
    if (filters.value?.teams?.length) {
        stats =  useRepo(Team)
            .query()
            .with("stats")
            .whereIn("id", filters.value?.teams)
            .first()?.stats || {}
    } else {
 stats = useRepo(Player).withAllRecursive().where("id", userId.value).first()?.teamStats || 0;
    }

   return new Stats(stats.filter((stat) => {

    if (filters.value.rink && stat.rink_id !== filters.value.rink) return false;   
    
    if (filters.value.sheet & stat.sheet_id !== filters.value.sheet) return false;
    
  
    if (filters.value.start && toTimezone(stat.start_time, null, false, true).unix() < filters.value.start) return false;

    return true;
   }))   
});

const tileContainer = ref(null);

const expanded = ref(null);
const preventExpand = ref(false);

const mainContent = ref(null);

const startView = (type) => {
    expanded.value = type;
    scrollUp();
};

const endView = () => {
    preventExpand.value = true;
    expanded.value = null;
};

const flipState = ref(null);

const animateStateChange = (callback, type) => {
    const targets = `.tile-header-${type}, .tile-chart-${type}, #dashboard-stat-${type}, .tile-value-${type}`;
    flipState.value = Flip.getState(targets);
    callback(type);
    nextTick(() => {
        Flip.from(flipState.value, {
            targets,
            duration: 0.2,
            scale: `#dashboard-stat-${type}`,
            prune: true,
        });
    });
};

const closeStat = (type) => {
    animateStateChange(endView, type);
};

const setSelected = (type) => {
    if (preventExpand.value) {
        preventExpand.value = false;
        return;
    }
    if (expanded.value === type) return;

    animateStateChange(startView, type);
};

const scrollUp = () => {
    nextTick(() => {
        if (mainContent.value.scrollTop < tileContainer.value.offsetTop) return;
        mainContent.value.scrollTop = tileContainer.value.offsetTop;
    });
};

onBeforeRouteLeave((to) => {
    const { query } = to;
    const { force } = query ?? {};
    if (force) return true;

    if (expanded.value) {
        expanded.value = null;
        return false;
    }
    return true;
});

const dashboard = ref(null);

const { direction } = useSwipe(tileContainer, {
    onSwipe: (e) => {
        if (!expanded.value) return;
        if (
            Array.from(e.composedPath())
                .map(({ tagName }) => tagName)
                .includes("CANVAS")
        )
            return;
        const index = stats.value.indexOf(expanded.value);
        if (direction.value === "right") {
            if (index === 0) return;
            expanded.value = stats.value[index - 1];
        } else if (direction.value === "left") {
            if (index === stats.value.length - 1) return;
            expanded.value = stats.value[index + 1];
        }
    },
});


</script>
