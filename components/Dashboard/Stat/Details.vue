<template>
    <div class="details__container">
        <!-- GAMES PLAYED -->
       <DashboardStatDetailsItemTemplate v-if="type === STAT_TYPES.WINS">
        <template v-slot:title>Games played</template>
        <template v-slot:value>{{ statsByGame?.length ?? 0 }}</template>
       </DashboardStatDetailsItemTemplate>
       
        <section
            v-for="(section, index) in STAT_SUBSECTIONS[type]"
            :key="index"
        >
            <q-separator class="separator" />
            <div
                v-for="[key, subsection] in Object.entries(section)"
                :key="key"
            >
                <DashboardStatDetailsItem
                    :statType="type"
                    :statField="key"
                    :stats="statsByGame"
                    :filters="filters"
                    :average="average"
                    v-bind="subsection"
                >
                    <template v-slot:more v-if="subsection.subitems">
                        <DashboardStatDetailsItem
                            v-for="[key, subitem] in Object.entries(
                                subsection.subitems
                            )"
                            :key="key"
                            :statType="props.type"
                            :statField="key"
                            :stats="statsByGame"
                            :filters="filters"
                            :average="average"
                            subitem
                            v-bind="subitem"
                        />
                    </template>
                </DashboardStatDetailsItem>
            </div>
        </section>

        <!-- SEASON HIGH/LOW -->

        <section
            name="season high and low"
            v-if="!DISABLE_HIGHEST_LOWEST.includes(props.type)"
        >
            <q-separator class="separator" />

            <DashboardStatDetailsItemHighestLowest
                :type="type"
                :stats="statsByGame"
                :average="average"
            />
        </section>

        <!-- RINK (and later) WORLD STATS -->

        <section name="global stats">
            <q-separator class="separator" />
            <DashboardStatDetailsItemRink
                :rinkId="homeRink"
                :teamId="props.filters.teams[0]"
                :type="type"
                :average="average"
                v-if="homeRink"
            />
        </section>

        <div class="q-pa-sm full-width row justify-center text-caption">
            *does not include games that finish early (handshakes, bell, etc.)
        </div>
    </div>
</template>
<style lang="scss" scoped>
.details__container {
    margin-top: var(--space-lg);
    .separator {
        background-color: v-bind(color);
        margin-bottom: var(--space-md);
        margin-top: calc(var(--space-md) - 4px);
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
    STAT_SUBSECTIONS,
} from "@/constants/stats";
import TeamStatsTotal from "@/store/models/team-stats-total";
import TeamStats from "@/store/models/team-stats";
import Team from "@/store/models/team";
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

const color = getColor(STAT_COLORS[props.type]);

const { userTeamIds } = useTeam();

const { user: userId } = useUser();

const filteredTeamIds = computed(() => {
    if (!props.filters?.teams?.length) return userTeamIds.value;
    return [...userTeamIds.value].filter((id) =>
        props.filters.teams.includes(id)
    );
});
const homeRink = computed(() => {
    if (!props.filters?.teams?.length)
        return useRepo(Player).with("rink").where("id", userId.value).first()
            ?.rink_id;
    return useRepo(Team)
        .with("rink")
        .where("id", props.filters.teams[0])
        .first()?.rink_id;
});

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

const DISABLE_HIGHEST_LOWEST = [STAT_TYPES.WINS];
</script>
<script>
export default {
    name: "StatDetails",
};
</script>
