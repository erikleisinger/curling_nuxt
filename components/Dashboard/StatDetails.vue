<template>
    <div class="details__container">
        <!-- GAMES PLAYED -->
        <q-separator class="separator" />
        <div class="row__container row justify-between items-center">
            <div class="row items-center">
                <!-- <q-icon
                name="format_list_numbered"
                size="1em"
                :style="{ color: getColor(STAT_COLORS[type]) }"
                class="q-mr-sm"
            
            /> -->
                <h4>Games played</h4>
            </div>
            <h5>{{ statsByGame?.length ?? 0 }}</h5>
        </div>

        <!-- END SPECIFIC -->

        <section v-if="shouldShowEndStats" name="end stats">
            <q-separator class="separator" />
            <DashboardStatDetailsItem
                :statType="type"
                :statField="STAT_FIELDS.WITH_HAMMER"
                :filters="filters"
                :average="average"
                v-if="shouldShowWithHammerStats"
                alwaysNumber
            />
            <DashboardStatDetailsItem
                :statType="type"
                :statField="STAT_FIELDS.WITHOUT_HAMMER"
                :filters="filters"
                :average="average"
                v-if="shouldShowWithoutHammerStats"
                alwaysNumber
            />
        </section>

        <!-- COLORS -->

        <section name="color stats">
            <q-separator class="separator" />

            <DashboardStatDetailsItem
                :statType="props.type"
                :statField="STAT_FIELDS.YELLOW"
                :filters="filters"
                :average="average"
            />
            <DashboardStatDetailsItem
                :statType="props.type"
                :statField="STAT_FIELDS.BLUE"
                :filters="filters"
                :average="average"
            />
            <DashboardStatDetailsItem
                :statType="props.type"
                :statField="STAT_FIELDS.RED"
                :filters="filters"
                :average="average"
            />
        </section>

        <!-- HAMMER -->

        <section v-if="shouldShowHammerStats" name="hammer stats">
            <q-separator class="separator" />
            <DashboardStatDetailsItem
                :statType="props.type"
                :statField="STAT_FIELDS.WITH_HAMMER_FE"
                :filters="filters"
                :average="average"
            />
            <DashboardStatDetailsItem
                :statType="props.type"
                :statField="STAT_FIELDS.WITHOUT_HAMMER_FE"
                :filters="filters"
                :average="average"
            />
            <DashboardStatDetailsItem
                :statType="props.type"
                :statField="STAT_FIELDS.WITH_HAMMER_LE"
                :filters="filters"
                :average="average"
            />
            <DashboardStatDetailsItem
                :statType="props.type"
                :statField="STAT_FIELDS.WITHOUT_HAMMER_LE"
                :filters="filters"
                :average="average"
            />
        </section>
        <!--  -->

        <!-- SEASON HIGH/LOW -->
        <section
            name="season high and low"
            v-if="!DISABLE_HIGHEST_LOWEST.includes(props.type)"
        >
            <q-separator class="separator" />
            <div class="row__container row justify-between items-center">
                <div class="row items-center">
                    <q-icon
                        name="trending_up"
                        size="1em"
                        :style="{ color: getColor(STAT_COLORS[type]) }"
                        class="q-mr-sm"
                    />
                    <h4>Season high</h4>
                </div>
                <div class="row items-end">
                    <div class="text-caption q-mr-sm">
                        <q-icon
                            :name="
                                highestDiff > 0
                                    ? 'arrow_drop_up'
                                    : 'arrow_drop_down'
                            "
                            :style="{
                                color:
                                    highestDiff > 0
                                        ? getColor('mint')
                                        : getColor('red'),
                            }"
                        />

                        {{ highestDiff }}{{ isPercent ? "%" : "" }}
                    </div>
                    <h5>{{ cleanNumber(highest) }}</h5>
                </div>
            </div>
            <div class="row__container row justify-between items-center">
                <div class="row items-center">
                    <q-icon
                        name="trending_down"
                        size="1em"
                        :style="{ color: getColor('red') }"
                        class="q-mr-sm"
                    />
                    <h4>Season low</h4>
                </div>
                <div class="row items-end">
                    <div class="text-caption q-mr-sm">
                        <q-icon
                            :name="
                                lowestDiff > 0
                                    ? 'arrow_drop_up'
                                    : 'arrow_drop_down'
                            "
                            :style="{
                                color:
                                    lowestDiff > 0
                                        ? getColor('mint')
                                        : getColor('red'),
                            }"
                        />

                        {{ lowestDiff }}{{ isPercent ? "%" : "" }}
                    </div>
                    <h5>{{ cleanNumber(lowest) }}</h5>
                </div>
            </div>
        </section>

        <!-- WORLD STATS -->

        <section name="global stats">
            <q-separator class="separator" />
            <div class="row__container row justify-between items-center">
                <div>
                    <h4>Worldwide</h4>
                    <caption class="text-caption">
                        Average among all teams
                    </caption>
                </div>
                <div class="row items-end">
                    <div class="text-caption q-mr-sm">
                        <q-icon
                            :name="
                                worldwideDiff > 0
                                    ? 'arrow_drop_up'
                                    : 'arrow_drop_down'
                            "
                            :style="{
                                color:
                                    worldwideDiff > 0
                                        ? getColor('mint')
                                        : getColor('red'),
                            }"
                        />

                        {{ worldwideDiff }}{{ isPercent ? "%" : "" }}
                    </div>
                    <h5>{{ cleanNumber(worldwide) }}</h5>
                </div>
            </div>
            <div
                class="row__container row justify-between upcoming items-center"
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
        </section>
    </div>
</template>
<style lang="scss" scoped>
.details__container {
    margin-top: var(--space-lg);
    .row__container {
        margin-bottom: var(--space-sm);
        h5 {
            // color: v-bind(color);
            // color: white;
            @include md-text;
        }
        &.upcoming {
        }
        caption {
            line-height: 1;
            white-space: nowrap;
            font-style: italic;
            // color: $upcoming-color;
        }
        .plus-minus__text {
            @include text-caption;
            font-family: $font-family-secondary;
        }
    }
    .separator {
        background-color: $app-blue;
        margin-bottom: var(--space-md);
        margin-top: calc(var(--space-md) - 4px);
    }
}
</style>
<script setup>
import {
    NON_PERCENT_STATS,
    STAT_COLORS,
    STAT_FIELDS,
    STAT_FIELDS_TOTAL,
    STAT_TYPES,
} from "@/constants/stats";
import TeamStatsTotal from "@/store/models/team-stats-total";
import TeamStats from "@/store/models/team-stats";
import Player from "@/store/models/player";
const props = defineProps({
    average: Number,
    betterThanAverage: Boolean,
    filters: Object,
    total: Number,
    type: String,
    worldwide: Number,
});
const { getColor } = useColor();
// const color = computed(() =>
//     props.betterThanAverage ? getColor("mint") : getColor("yellow")
// );

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
    if (!props.filters?.teams?.length) return userTeamIds.value;
    return [...userTeamIds.value].filter((id) =>
        props.filters.teams.includes(id)
    );
});

const statsByGame = computed(() => {
    return useRepo(TeamStats)
        .query()
        .whereIn("team_id", filteredTeamIds.value)
        .get();
});

const getPlusMinus = (stat) => {
    if (isPercent) {
        return stat * 100;
    }
};

const { getCumulativeStat } = useStats();

const cleanNumber = (num) => {
    if (Number.isNaN(num)) return "-";

    if (isPercent) {
        return `${Number((num * 100).toFixed())}%`;
    }
    return `${num > 0 ? "" : ""}${num.toFixed(1)}`;
};

const SHOW_HAMMER_STATS = [STAT_TYPES.WINS, STAT_TYPES.POINTS_PER_END];
const shouldShowHammerStats = SHOW_HAMMER_STATS.includes(props.type);

const SHOW_END_STATS = [
    STAT_TYPES.POINTS_PER_END,
    STAT_TYPES.HAMMER_EFFICIENCY,
];
const shouldShowEndStats = SHOW_END_STATS.includes(props.type);

const SHOW_WITH_HAMMER_STATS = [
    STAT_TYPES.POINTS_PER_END,
    STAT_TYPES.HAMMER_EFFICIENCY,
];
const shouldShowWithHammerStats = SHOW_WITH_HAMMER_STATS.includes(props.type);

const SHOW_WITHOUT_HAMMER_STATS = [STAT_TYPES.POINTS_PER_END];
const shouldShowWithoutHammerStats = SHOW_WITHOUT_HAMMER_STATS.includes(
    props.type
);

const isPercent = !NON_PERCENT_STATS.includes(props.type);

const DISABLE_HIGHEST_LOWEST = [STAT_TYPES.WINS];

const highest = computed(() =>
    Math.max(...[...statsByGame.value].map(STAT_FIELDS_TOTAL[props.type]))
);

const highestDiff = computed(() => highest.value - props.average);
const lowest = computed(() =>
    Math.min(...[...statsByGame.value].map(STAT_FIELDS_TOTAL[props.type]))
);
const lowestDiff = computed(() => lowest.value - props.average);

const worldwideDiff = computed(() => (props.average - (props.worldwide * (isPercent ? 100 : 1))).toFixed(1))
</script>
