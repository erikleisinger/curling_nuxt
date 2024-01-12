<template>
    <div class="details__container">
       
        <div   v-if="shouldShowHammerStats">
         <DashboardStatDetailsItem :statType="props.type" :statField="STAT_FIELDS.WITH_HAMMER_FE" :filters="filters"/>
          <DashboardStatDetailsItem :statType="props.type" :statField="STAT_FIELDS.WITHOUT_HAMMER_FE" :filters="filters"/>
           <DashboardStatDetailsItem :statType="props.type" :statField="STAT_FIELDS.WITH_HAMMER_LE" :filters="filters"/>
            <DashboardStatDetailsItem :statType="props.type" :statField="STAT_FIELDS.WITHOUT_HAMMER_LE" :filters="filters"/>
         

         <q-separator class="separator" />
        </div>

        <DashboardStatDetailsItem :statType="props.type" :statField="STAT_FIELDS.YELLOW" :filters="filters"/>
        <DashboardStatDetailsItem :statType="props.type" :statField="STAT_FIELDS.BLUE" :filters="filters"/>
         <DashboardStatDetailsItem :statType="props.type" :statField="STAT_FIELDS.RED" :filters="filters"/>
       
        <q-separator class="separator"/>

        <div class="row__container row justify-between " v-if="!DISABLE_HIGHEST_LOWEST.includes(props.type)">
            <div>
                <h4>Season high</h4>
           
            </div>
            <h5 >{{cleanNumber(highest)}}</h5>
        </div>
        <div class="row__container row justify-between " v-if="!DISABLE_HIGHEST_LOWEST.includes(props.type)">
            <div>
                <h4>Season low</h4>
               
            </div>
            <h5>{{cleanNumber(lowest)}}</h5>
        </div>
        <div
            class="row__container row justify-between upcoming"
            v-if="homeRink?.id"
        >
            <div>
                <h4>
                    {{ homeRink.name }}
                </h4>
                <caption class="text-caption">
                    Coming soon
                </caption>
            </div>
            <h5>-</h5>
        </div>
        <div class="row__container row justify-between upcoming">
            <div>
                <h4>Worldwide</h4>
                <caption class="text-caption">
                    Coming soon
                </caption>
            </div>
            <h5>-</h5>
        </div>
    </div>
</template>
<style lang="scss" scoped>
$upcoming-color: rgba(255, 255, 255, 0.7);
.details__container {
    margin-top: var(--space-xl);
    .row__container {
        margin-bottom: var(--space-sm);
        h5 {
            color: v-bind(color);
            @include md-text;
        }
        &.upcoming {
            h4 {
                color: $upcoming-color;
            }
        }
        caption {
            line-height: 1;
            white-space: nowrap;
            font-style: italic;
            color: $upcoming-color;
        }
        .plus-minus__text {
            @include text-caption;
            font-family: $font-family-secondary;
            color: white;
        }
    }
    .separator {
        background-color: v-bind(color);
        margin-bottom: var(--space-lg);
        margin-top: calc(var(--space-lg) - 4px);
    }

}
</style>
<script setup>
import { NON_PERCENT_STATS, STAT_COLORS, STAT_FIELDS, STAT_FIELDS_TOTAL, STAT_TYPES } from "@/constants/stats";
import TeamStatsTotal from "@/store/models/team-stats-total";
import TeamStats from "@/store/models/team-stats";
import Player from "@/store/models/player";
const props = defineProps({
    filters: Object,
    total: Number,
    type: String,
});
const { getColor } = useColor();
const color = getColor(STAT_COLORS[props.type]);

const { userTeamIds } = useTeam();

const { user: userId } = useUser();

const homeRink = computed(
    () => useRepo(Player).with("rink").where("id", userId.value).first()?.rink
);

const stats = computed(() => {
    return useRepo(TeamStatsTotal)
        .query()
        .whereIn("team_id", userTeamIds.value)
        .get();
});

const filteredTeamIds = computed(() => {
    if (!props.filters?.teams?.length) return userTeamIds.value
    return [...userTeamIds.value].filter((id) => props.filters.teams.includes(id))
})

const statsByGame = computed(() => {
    return (
        useRepo(TeamStats)
            .query()
            .whereIn("team_id", filteredTeamIds.value)
            .get()
    );
});

const getPlusMinus = (stat) => {
    if (isPercent) {
        return stat * 100;
    }
};

const { getCumulativeStat } = useStats();

const cleanNumber = (num) => {
    if (Number.isNaN(num)) return '-'

    if (isPercent) {
        return `${Number((num * 100).toFixed())}%`;
    }
    return `${num > 0 ? "+" : ""}${num.toFixed(1)}`;
};

const SHOW_HAMMER_STATS = [STAT_TYPES.WINS];
const shouldShowHammerStats = SHOW_HAMMER_STATS.includes(props.type);

const isPercent = !NON_PERCENT_STATS.includes(props.type);

const DISABLE_HIGHEST_LOWEST = [
    STAT_TYPES.WINS
]

const highest = computed(() => Math.max(...[...statsByGame.value].map(STAT_FIELDS_TOTAL[props.type])));
const lowest = computed(() => Math.min(...[...statsByGame.value].map(STAT_FIELDS_TOTAL[props.type])))
</script>
