<template>
    <div class="dashboard__container" id="dashboard">
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
            <DashboardFilters v-model="filters" />
            <!-- <div>
                <div
                    class="full-width row justify-center text-caption text-black q-mt-sm"
                >
                    <div
                        class="row clickable"
                        @click="filterBySheet = !filterBySheet"
                    >
                        <Rings
                            :twelveft="
                                filterBySheet
                                    ? getColor('mint')
                                    : getColor('slate')
                            "
                            :fourft="
                                filterBySheet
                                    ? getColor('mint')
                                    : getColor('slate')
                            "
                            size="1.5em"
                            class="q-mr-xs"
                        />Filter by sheet
                    </div>
                </div>
                <div v-if="filterBySheet">Filter</div>
            </div> -->
        </div>
        <main class="tile__container" :class="{ expanded }" ref="tileContainer">
            <DashboardStat
                v-for="statType in stats"
                :key="statType"
                :type="statType"
                @click="setSelected(statType)"
                :expanded="expanded === statType"
                :style="{ order: expanded === statType ? 0 : 1 }"
                :filters="filters"
                @close="endView"
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

    .filter__container {
        margin: var(--space-lg) 0px;
    }
}
</style>
<script setup>
import {
    NON_PERCENT_STATS,
    STAT_FIELDS_TOTAL,
    STAT_TYPES,
} from "@/constants/stats";
import { useQuery } from "@tanstack/vue-query";
import { useUserTeamStore } from "@/store/user-teams";
import { useEventListener, useSwipe } from "@vueuse/core";
import TeamStatsTotal from "@/store/models/team-stats-total";
import TeamStats from "@/store/models/team-stats";
import Team from "@/store/models/team";
import Rink from "@/store/models/rink";
import Sheet from "@/store/models/sheet";
import { useDialogStore } from "@/store/dialog";

const { getColor } = useColor();

const filters = ref({
    teams: [],
    sheet: null,
});

const teamIds = computed(() =>
    useUserTeamStore().userTeams.map(({ id }) => id)
);

const getTeamStatsTotal = async () => {
    const client = useSupabaseClient();
    const { data } = await client.from("team_stats_total").select(`*`);
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

    //       sheet_id (
    //     id,
    //     number,
    //     rink_id
    // ),
    data.forEach((stat) => {
        if (stat.rink) useRepo(Rink).save(stat.rink);
        if (stat.sheet) useRepo(Sheet).save(stat.sheet);
        console.log(stat);
        useRepo(TeamStats).save({
            ...stat,
            rink_id: stat.rink?.id,
            sheet_id: stat.sheet?.id,
        });
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
            STAT_TYPES.HAMMER_LAST_END,
            STAT_TYPES.POINTS_FOR_PER_GAME,
            STAT_TYPES.POINTS_AGAINST_PER_GAME,
            STAT_TYPES.ENDS_FOR_PER_GAME,
            STAT_TYPES.ENDS_AGAINST_PER_GAME,

            STAT_TYPES.HAMMER_EFFICIENCY,
            STAT_TYPES.STEAL_EFFICIENCY,
            STAT_TYPES.FORCE_EFFICIENCY,
            STAT_TYPES.STEAL_DEFENSE,
            STAT_TYPES.BLANK_ENDS,
        ];

    return [
        STAT_TYPES.WINS,
        STAT_TYPES.HAMMER_LAST_END,
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

const tileContainer = ref(null);

const expanded = ref(null);
const preventExpand = ref(false);

const setSelected = (type) => {
    if (preventExpand.value) {
        preventExpand.value = false;
        return;
    }
    if (expanded.value === type) {
        // expanded.value = null;
    } else {
        expanded.value = type;
        const scroller = document.getElementById("global-container");
        if (scroller.scrollTop < tileContainer.value.offsetTop) return;
        scroller.scrollTop = tileContainer.value.offsetTop;
    }
};

const endView = (e) => {
    preventExpand.value = true;
    expanded.value = null;
};

onBeforeRouteLeave(() => {
    if (expanded.value) {
        expanded.value = null;
        return false;
    }
    return true;
});

const dashboard = ref(null);

const { direction } = useSwipe(tileContainer, {
    onSwipe: () => {
        if (!expanded.value) return;
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

const filterBySheet = ref(false);
</script>
