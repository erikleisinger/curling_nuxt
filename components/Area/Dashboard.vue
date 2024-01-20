<template>
    <div class="dashboard__container" id="dashboard">
        <main class="main-content" ref="mainContent">
            <section class="filter__container row justify-center">
                <DashboardFilters v-model="filters" />
            </section>
            <!-- <div class="row no-wrap">
       <DashboardStat
                    
                    :type="STAT_TYPES.WINS"
                    @click="setSelected(STAT_TYPES.WINS)"
                    :expanded="expanded === STAT_TYPES.WINS"
                   
                    :filters="filters"
                    @close="endView"
                    @scroll="scrollUp"
                    style="margin-bottom: 2px; flex-grow: 1"
                    
                >
                <template v-slot:tileAppend>
                      <div style="max-width: 50%;margin-left: 2px">
 <div  v-for="stat in [...values.color].splice(0, 1)" :key="stat.name">
                    <h4>{{STAT_FIELD_TITLES_FULL[stat.name]}}</h4>
                </div>
             
                  <div  v-for="stat in [...values.hammer].splice(0, 1)" :key="stat.name">   
                    <h4>{{STAT_FIELD_TITLES_FULL[stat.name]}}</h4>
                    </div>
                    
                </div>
                </template>
                </DashboardStat> 
              
               

             
            </div> -->
            <section
                class="tile__container"
                :class="{ expanded }"
                ref="tileContainer"
            >
                <DashboardStat
                    v-for="statType in stats"
                    :key="statType"
                    :type="statType"
                    @click="setSelected(statType)"
                    :expanded="expanded === statType"
                    :style="{ order: expanded === statType ? 0 : 1 }"
                    :filters="filters"
                    @close="endView"
                    @scroll="scrollUp"
                    
                >
                </DashboardStat>
            </section>
        </main>
    </div>
</template>
<style lang="scss" scoped>
.dashboard__container {
    @include bg-blue-side;
    .main-content {
        @include hide-scroll;
        position: absolute;
        top: 0;
        width: 100%;
        height: 100%;
        overflow: auto;
    }
    @include lines;
    min-height: 100%;
    color: rgb(250, 250, 250);
    position: relative;
    width: 100%;
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
}
</style>
<script setup>
import {
    NON_PERCENT_STATS,
    STAT_FIELDS_TOTAL,
    STAT_TYPES,
    STAT_FIELDS,
    STAT_FIELD_TITLES,
    STAT_FIELD_TITLES_FULL,
    STAT_FIELD_FILTER_FUNCTIONS
} from "@/constants/stats";
import { useQuery } from "@tanstack/vue-query";
import { useUserTeamStore } from "@/store/user-teams";
import { useTeamRequestStore } from "@/store/team-requests";
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
    opposition: null,
    rink: null,
    sheet: null,
});

const teamIds = computed(() => [
    ...useUserTeamStore().userTeams.map(({ id }) => id),
    ...useTeamRequestStore().requests.map(({ team_id }) => team_id),
]);

const getTeamStatsTotal = async () => {
    const client = useSupabaseClient();
    const { data } = await client.from("team_stats_total").select(`*`);

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
        .from("team_stats")
        .select('*')
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

const $q = useQuasar();

const stats = computed(() => {
    if ($q.screen.xs)
        return [
            // STAT_TYPES.WINS,
            STAT_TYPES.POINTS_PER_END,
            // STAT_TYPES.HAMMER_LAST_END,
            STAT_TYPES.POINTS_FOR_PER_GAME,
            
            STAT_TYPES.ENDS_FOR_PER_GAME,
            STAT_TYPES.POINTS_AGAINST_PER_GAME,
            STAT_TYPES.ENDS_AGAINST_PER_GAME,

            STAT_TYPES.HAMMER_EFFICIENCY,
            STAT_TYPES.STEAL_EFFICIENCY,
            STAT_TYPES.FORCE_EFFICIENCY,
            STAT_TYPES.STEAL_DEFENSE,
            STAT_TYPES.BLANK_ENDS,
        ];

    return [
        // STAT_TYPES.WINS,
        STAT_TYPES.POINTS_PER_END,
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

const tileContainer = ref(null);

const expanded = ref(null);
const preventExpand = ref(false);

const mainContent = ref(null);

const setSelected = (type) => {
    if (preventExpand.value) {
        preventExpand.value = false;
        return;
    }
    if (expanded.value === type) {
        // expanded.value = null;
    } else {
        expanded.value = type;
        scrollUp();
    }
};

const scrollUp = () => {
    nextTick(() => {
        if (mainContent.value.scrollTop < tileContainer.value.offsetTop) return;
        mainContent.value.scrollTop = tileContainer.value.offsetTop;
    });
};

const endView = (e) => {
    preventExpand.value = true;
    expanded.value = null;
};

onBeforeRouteLeave((to) => {
    const {query} = to;
    const {force} = query ?? {};
    if (force)  return true;
       
    
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

// const {userTeamIds} = useTeam();

// const { getCumulativeStat } = useStats();

//   const values = computed(() => {
//     const teams = filters.value?.teams?.length ? filters.value.teams : userTeamIds.value;
//     // const teams = filters.value.teams;
//     const teamStats = useRepo(TeamStats).query().whereIn('team_id', teams).get()
//     console.log('teams changed: ', teams)
//     console.log('team stats: ', teamStats)
//     return [
//             STAT_FIELDS.YELLOW,
//             STAT_FIELDS.RED,
//             STAT_FIELDS.BLUE,
//             STAT_FIELDS.WITH_HAMMER_LE,
//             STAT_FIELDS.WITH_HAMMER_LE_TIE,
//             STAT_FIELDS.WITH_HAMMER_LE_D1,
//             STAT_FIELDS.WITH_HAMMER_LE_D2,
//             STAT_FIELDS.WITHOUT_HAMMER_LE,
//             STAT_FIELDS.WITHOUT_HAMMER_LE_TIE,
//             STAT_FIELDS.WITHOUT_HAMMER_LE_D1,
//             STAT_FIELDS.WITHOUT_HAMMER_LE_D2,
//             STAT_FIELDS.WITHOUT_HAMMER_EE,
//             STAT_FIELDS.WITH_HAMMER_2LE,
//             STAT_FIELDS.WITH_HAMMER_2LE_U1,
//             STAT_FIELDS.WITH_HAMMER_2LE_U2,
//             STAT_FIELDS.WITH_HAMMER_2LE_TIE,
//             STAT_FIELDS.WITH_HAMMER_2LE_D1,
//             STAT_FIELDS.WITH_HAMMER_2LE_D2,
//             STAT_FIELDS.WITH_HAMMER_3LE,
//             STAT_FIELDS.WITH_HAMMER_3LE_TIE,
//             STAT_FIELDS.WITH_HAMMER_3LE_D1,
//             STAT_FIELDS.WITH_HAMMER_3LE_D2,
            
//         ].map((field) => ({
//             name: field,
//             value: getCumulativeStat(
//         teamStats.filter(STAT_FIELD_FILTER_FUNCTIONS[field]),
//         STAT_FIELDS_TOTAL['wins']
//     ) 
//         })).sort((a,b) => (Number.isNaN(b.value) ? 0 : b.value) - (Number.isNaN(a.value) ? 0 : a.value)).reduce((all, current) => {
//             // STAT_FIELD_TITLES_FULL[field]('')
//             console.log([STAT_FIELDS.YELLOW, STAT_FIELDS.RED, STAT_FIELDS.BLUE].includes(current.name))
//             if ([STAT_FIELDS.YELLOW, STAT_FIELDS.RED, STAT_FIELDS.BLUE].includes(current.name)) {
//                 console.log(current.name)
//                 return {
//                 ...all, 
//                 color: [...all.color, current]
//             }
//             }
//             return {
//                 ...all,
//                 hammer: [...all.hammer, current]
//             }
//         }, {
//             color: [],
//             hammer: [],
//         })   
//         }
//   ); 
</script>
