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

                <!-- SEASON HIGH/LOW -->
        <section
            name="season high and low"
            v-if="!DISABLE_HIGHEST_LOWEST.includes(props.type)"
        >
            <q-separator class="separator" />
            <div class="row__container row justify-between items-center">
                <div>
                    <div class="row items-center">
                        <q-icon
                            name="trending_up"
                            size="1em"
                            :style="{ color: getColor(STAT_COLORS[type]) }"
                            class="q-mr-sm"
                        />
                        <h4>Season high</h4>
                    </div>
                    <div
                        class="item-caption row"
                        style="margin-top: -5px; margin-left: 1.8em"
                        v-if="!!lowestGame"
                    >
                        {{ toTimezone(highestGame.start_time, "MMMM D, YYYY") }}
                    </div>
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

                        {{ highestDiff }}{{isPercent ? '%' : ''}}
                    </div>
                    <h5>{{ cleanNumber(highest) }}{{isPercent ? '%' : ''}}</h5>
                </div>
            </div>
            <div class="row__container row justify-between items-center">
                <div>
                    <div class="row items-center">
                        <q-icon
                            name="trending_down"
                            size="1em"
                            :style="{ color: getColor('red') }"
                            class="q-mr-sm"
                        />
                        <h4>Season low</h4>
                    </div>
                    <div
                        class="item-caption row"
                        style="margin-top: -5px; margin-left: 1.8em"
                        v-if="!!lowestGame"
                    >
                        {{ toTimezone(lowestGame.start_time, "MMMM D, YYYY") }}

                    </div>
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

                        {{ lowestDiff }}{{isPercent ? '%' : ''}}
                    </div>
                    <h5>{{ cleanNumber(lowest) }}{{isPercent ? '%' : ''}}</h5>
                </div>
            </div>
        </section>

                        <!-- RINK (and later) WORLD STATS -->

         <section name="global stats">
            <q-separator class="separator" />
            <DashboardStatDetailsItemRink :rinkId="homeRink" :teamId="props.filters.teams[0]" :type="type" :average="average" v-if="homeRink"/>
        </section>

        <!-- HAMMER -->

        <section v-if="shouldShowHammerStats" name="hammer stats">
            <q-separator class="separator" />
            <div class="stat-section__header">
                <h4 class="row items-center justify-center">
                    <q-icon name="o_hardware" color="white" class="q-mr-xs" />
                    last end*
                </h4>
            </div>
            <DashboardStatDetailsItem
                :statType="props.type"
                :statField="STAT_FIELDS.WITH_HAMMER_LE"
                :filters="filters"
                :average="average"
            >
                <template v-slot:more>
                    <DashboardStatDetailsItem
                        :statType="props.type"
                        :statField="STAT_FIELDS.WITH_HAMMER_LE_U2"
                        :filters="filters"
                        :average="average"
                        subitem
                    />
                    <DashboardStatDetailsItem
                        :statType="props.type"
                        :statField="STAT_FIELDS.WITH_HAMMER_LE_U1"
                        :filters="filters"
                        :average="average"
                        subitem
                    />
                    <DashboardStatDetailsItem
                        :statType="props.type"
                        :statField="STAT_FIELDS.WITH_HAMMER_LE_TIE"
                        :filters="filters"
                        :average="average"
                        subitem
                    />
                    <DashboardStatDetailsItem
                        :statType="props.type"
                        :statField="STAT_FIELDS.WITH_HAMMER_LE_D1"
                        :filters="filters"
                        :average="average"
                        subitem
                    />
                    <DashboardStatDetailsItem
                        :statType="props.type"
                        :statField="STAT_FIELDS.WITH_HAMMER_LE_D2"
                        :filters="filters"
                        :average="average"
                        subitem
                    />
                </template>
            </DashboardStatDetailsItem>

            

            <DashboardStatDetailsItem
                :statType="props.type"
                :statField="STAT_FIELDS.WITHOUT_HAMMER_LE"
                :filters="filters"
                :average="average"
            >
                <template v-slot:more>
                    <DashboardStatDetailsItem
                        :statType="props.type"
                        :statField="STAT_FIELDS.WITHOUT_HAMMER_LE_U2"
                        :filters="filters"
                        :average="average"
                        subitem
                    />
                    <DashboardStatDetailsItem
                        :statType="props.type"
                        :statField="STAT_FIELDS.WITHOUT_HAMMER_LE_U1"
                        :filters="filters"
                        :average="average"
                        subitem
                    />
                    <DashboardStatDetailsItem
                        :statType="props.type"
                        :statField="STAT_FIELDS.WITHOUT_HAMMER_LE_TIE"
                        :filters="filters"
                        :average="average"
                        subitem
                    />
                    <DashboardStatDetailsItem
                        :statType="props.type"
                        :statField="STAT_FIELDS.WITHOUT_HAMMER_LE_D1"
                        :filters="filters"
                        :average="average"
                        subitem
                    />
                    <DashboardStatDetailsItem
                        :statType="props.type"
                        :statField="STAT_FIELDS.WITHOUT_HAMMER_LE_D2"
                        :filters="filters"
                        :average="average"
                        subitem
                    />
                </template>
            </DashboardStatDetailsItem>

                        <q-separator class="separator" />
            <div class="stat-section__header">
                <h4 class="row items-center justify-center">
                    <q-icon name="o_hardware" color="white" class="q-mr-xs" />
                    extra end
                </h4>
            </div>

            <DashboardStatDetailsItem
                :statType="props.type"
                :statField="STAT_FIELDS.WITH_HAMMER_EE"
                :filters="filters"
                :average="average"
            />
            <DashboardStatDetailsItem
                :statType="props.type"
                :statField="STAT_FIELDS.WITHOUT_HAMMER_EE"
                :filters="filters"
                :average="average"
            />

            <q-separator class="separator" />
            <div class="stat-section__header">
                <h4 class="row items-center justify-center">
                    <q-icon name="o_hardware" color="white" class="q-mr-xs" />
                    2nd-last end*
                </h4>
            </div>

            <DashboardStatDetailsItem
                :statType="props.type"
                :statField="STAT_FIELDS.WITH_HAMMER_2LE"
                :filters="filters"
                :average="average"
            >
                <template v-slot:more>
                    <DashboardStatDetailsItem
                        :statType="props.type"
                        :statField="STAT_FIELDS.WITH_HAMMER_2LE_U2"
                        :filters="filters"
                        :average="average"
                        subitem
                    />
                    <DashboardStatDetailsItem
                        :statType="props.type"
                        :statField="STAT_FIELDS.WITH_HAMMER_2LE_U1"
                        :filters="filters"
                        :average="average"
                        subitem
                    />
                    <DashboardStatDetailsItem
                        :statType="props.type"
                        :statField="STAT_FIELDS.WITH_HAMMER_2LE_TIE"
                        :filters="filters"
                        :average="average"
                        subitem
                    />
                    <DashboardStatDetailsItem
                        :statType="props.type"
                        :statField="STAT_FIELDS.WITH_HAMMER_2LE_D1"
                        :filters="filters"
                        :average="average"
                        subitem
                    />
                    <DashboardStatDetailsItem
                        :statType="props.type"
                        :statField="STAT_FIELDS.WITH_HAMMER_2LE_D2"
                        :filters="filters"
                        :average="average"
                        subitem
                    />
                </template>
            </DashboardStatDetailsItem>

            <DashboardStatDetailsItem
                :statType="props.type"
                :statField="STAT_FIELDS.WITHOUT_HAMMER_2LE"
                :filters="filters"
                :average="average"
            >
                <template v-slot:more>
                    <DashboardStatDetailsItem
                        :statType="props.type"
                        :statField="STAT_FIELDS.WITHOUT_HAMMER_2LE_U2"
                        :filters="filters"
                        :average="average"
                        subitem
                    />
                    <DashboardStatDetailsItem
                        :statType="props.type"
                        :statField="STAT_FIELDS.WITHOUT_HAMMER_2LE_U1"
                        :filters="filters"
                        :average="average"
                        subitem
                    />
                    <DashboardStatDetailsItem
                        :statType="props.type"
                        :statField="STAT_FIELDS.WITHOUT_HAMMER_2LE_TIE"
                        :filters="filters"
                        :average="average"
                        subitem
                    />
                    <DashboardStatDetailsItem
                        :statType="props.type"
                        :statField="STAT_FIELDS.WITHOUT_HAMMER_2LE_D1"
                        :filters="filters"
                        :average="average"
                        subitem
                    />
                    <DashboardStatDetailsItem
                        :statType="props.type"
                        :statField="STAT_FIELDS.WITHOUT_HAMMER_2LE_D2"
                        :filters="filters"
                        :average="average"
                        subitem
                    />
                </template>
            </DashboardStatDetailsItem>

            <q-separator class="separator" />

            <div class="stat-section__header">
                <h4 class="row items-center justify-center">
                    <q-icon name="o_hardware" color="white" class="q-mr-xs" />
                    3rd-last end*
                </h4>
                <h5
                    class="text-caption font-secondary text-italic text-center"
                    style="margin-top: -0.1em; margin-bottom: -0.4em"
                >
                    "The all important"
                </h5>
            </div>

            <DashboardStatDetailsItem
                :statType="props.type"
                :statField="STAT_FIELDS.WITH_HAMMER_3LE"
                :filters="filters"
                :average="average"
            >
                <template v-slot:more>
                    <DashboardStatDetailsItem
                        :statType="props.type"
                        :statField="STAT_FIELDS.WITH_HAMMER_3LE_U2"
                        :filters="filters"
                        :average="average"
                        subitem
                    />
                    <DashboardStatDetailsItem
                        :statType="props.type"
                        :statField="STAT_FIELDS.WITH_HAMMER_3LE_U1"
                        :filters="filters"
                        :average="average"
                        subitem
                    />
                    <DashboardStatDetailsItem
                        :statType="props.type"
                        :statField="STAT_FIELDS.WITH_HAMMER_3LE_TIE"
                        :filters="filters"
                        :average="average"
                        subitem
                    />
                    <DashboardStatDetailsItem
                        :statType="props.type"
                        :statField="STAT_FIELDS.WITH_HAMMER_3LE_D1"
                        :filters="filters"
                        :average="average"
                        subitem
                    />
                    <DashboardStatDetailsItem
                        :statType="props.type"
                        :statField="STAT_FIELDS.WITH_HAMMER_3LE_D2"
                        :filters="filters"
                        :average="average"
                        subitem
                    />
                </template>
            </DashboardStatDetailsItem>

            <DashboardStatDetailsItem
                :statType="props.type"
                :statField="STAT_FIELDS.WITHOUT_HAMMER_3LE"
                :filters="filters"
                :average="average"
            >
                <template v-slot:more>
                    <DashboardStatDetailsItem
                        :statType="props.type"
                        :statField="STAT_FIELDS.WITHOUT_HAMMER_3LE_U2"
                        :filters="filters"
                        :average="average"
                        subitem
                    />
                    <DashboardStatDetailsItem
                        :statType="props.type"
                        :statField="STAT_FIELDS.WITHOUT_HAMMER_3LE_U1"
                        :filters="filters"
                        :average="average"
                        subitem
                    />
                    <DashboardStatDetailsItem
                        :statType="props.type"
                        :statField="STAT_FIELDS.WITHOUT_HAMMER_3LE_TIE"
                        :filters="filters"
                        :average="average"
                        subitem
                    />
                    <DashboardStatDetailsItem
                        :statType="props.type"
                        :statField="STAT_FIELDS.WITHOUT_HAMMER_3LE_D1"
                        :filters="filters"
                        :average="average"
                        subitem
                    />
                    <DashboardStatDetailsItem
                        :statType="props.type"
                        :statField="STAT_FIELDS.WITHOUT_HAMMER_3LE_D2"
                        :filters="filters"
                        :average="average"
                        subitem
                    />
                </template>
            </DashboardStatDetailsItem>



            <div class="q-pa-sm full-width row justify-center text-caption">
                *does not include games that finish early (handshakes, bell, etc.)
            </div>
        </section>
        <!--  -->





       
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
        background-color: v-bind(color);
        margin-bottom: var(--space-md);
        margin-top: calc(var(--space-md) - 4px);
    }
    .item-caption {
        @include text-caption;
        font-style: italic;
        color: rgba(255, 255, 255, 0.8);
    }

    .stat-section__header {
        display: none;
        h4 {
            @include smmd-text;
        }

        margin-bottom: var(--space-md);
        margin-top: calc(-1 * var(--space-md));
        
        background-color: rgba(0, 0, 0, 0.3);
        border-radius: 4px;
        padding: var(--space-xs) 0px;
    }
}
</style>
<script setup>
import {
    INVERTED_STATS,
    NON_PERCENT_STATS,
    STAT_COLORS,
    STAT_FIELDS,
    STAT_FIELDS_TOTAL,
    STAT_TYPES,
} from "@/constants/stats";
import TeamStatsTotal from "@/store/models/team-stats-total";
import TeamStats from "@/store/models/team-stats";
import Team from '@/store/models/team'
import Player from "@/store/models/player";
const props = defineProps({
    average: Number,
    chart: Object,
    filters: Object,
    type: String,
});

const emit = defineEmits(["view"]);
const { getColor } = useColor();
const { toTimezone } = useTime();

const color = getColor(STAT_COLORS[props.type])

const { userTeamIds } = useTeam();

const { user: userId } = useUser();



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
const homeRink = computed(
    () =>  {
        if (!props.filters?.teams?.length) return useRepo(Player).with("rink").where("id", userId.value).first()?.rink_id;
        return useRepo(Team).with('rink').where('id', props.filters.teams[0]).first()?.rink_id
    }
        
);

const statsByGame = computed(() => {
    return useRepo(TeamStats)
        .query()
        .whereIn("team_id", filteredTeamIds.value)
        .where("rink_id", (val) => {
            return props.filters.rink ? val === props.filters.rink : true;
        })
        .where("sheet_id", (val) => {
            return props.filters.sheet ? val === props.filters.sheet : true;
        })
        .orderBy("start_time")
        .get();
});



const cleanNumber = (num) => {
    return cleanStatValue(num, props.type, 0)
};

const SHOW_HAMMER_STATS = [STAT_TYPES.WINS];
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

const { getCumulativeStat, getCumulativeHighestLowest, isPercentStat, cleanStatValue } = useStats();

const isPercent = isPercentStat(props.type);

const DISABLE_HIGHEST_LOWEST = [STAT_TYPES.WINS];

const CUMULATIVE_HIGHEST_LOWEST = [STAT_TYPES.HAMMER_LAST_END];
const isCumulative = CUMULATIVE_HIGHEST_LOWEST.includes(props.type);

const highestLowest = computed(() => {
    if (isCumulative)
        return getCumulativeHighestLowest(
            statsByGame.value,
            props.type
        );
    return {
        highest: Math.max(
            ...[...statsByGame.value].map(STAT_FIELDS_TOTAL[props.type])
        ),
        lowest: Math.min(
            ...[...statsByGame.value].map(STAT_FIELDS_TOTAL[props.type])
        ),
        highestIndex: [...statsByGame.value]
            .map(STAT_FIELDS_TOTAL[props.type])
            .indexOf(
                Math.max(
                    ...[...statsByGame.value].map(STAT_FIELDS_TOTAL[props.type])
                )
            ),
        lowestIndex: [...statsByGame.value]
            .map(STAT_FIELDS_TOTAL[props.type])
            .indexOf(
                Math.min(
                    ...[...statsByGame.value].map(STAT_FIELDS_TOTAL[props.type])
                )
            ),
    };
});



const highest = computed(() => {
    if(INVERTED_STATS.includes(props.type)) return highestLowest.value?.lowest;
    return highestLowest.value?.highest;
});

const highestDiff = computed(() => (highest.value * (isPercent ? 100 : 1)) - props.average);

const highestGame = computed(() => {
    let index; 
    if(INVERTED_STATS.includes(props.type)) {
        index = highestLowest.value.lowestIndex
    } else {
        index = highestLowest.value.highestIndex
    }

    return statsByGame.value[index];
});

const lowest = computed(() => {
    if(INVERTED_STATS.includes(props.type)) return highestLowest.value?.highest;
    return highestLowest.value?.lowest;
});
const lowestDiff = computed(() => (lowest.value * (isPercent ? 100 : 1)) - props.average);

const lowestGame = computed(() => {
    let index; 
    if(INVERTED_STATS.includes(props.type)) {
        index = highestLowest.value.highestIndex
    } else {
        index = highestLowest.value.lowestIndex
    }

    return statsByGame.value[index];
});
</script>
<script>
export default {
    name: 'StatDetails'
}
</script>
