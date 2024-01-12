<template>
    <div class="row__container row justify-between items-center">
        <h4 >
            <q-icon
                name="circle"
                size="0.7em"
                :style="{ color: getColor(statField) }"
                class="q-mr-xs"
                v-if="COLOR_STATS.includes(statField)"
            />

            {{STAT_FIELD_TITLES[statField]}}

        </h4>
        <h5     :style="{ color }">{{ cleanNumber(value) }}</h5>
    </div>
    <!-- <div
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
    </div> -->
</template>
<style lang="scss" scoped>
$upcoming-color: rgba(255, 255, 255, 0.7);
.row__container {
    margin-bottom: var(--space-sm);
    h5 {

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
</style>
<script setup>
import {STAT_FIELDS_TOTAL, STAT_FIELDS, STAT_FIELD_FILTER_FUNCTIONS, STAT_COLORS, NON_PERCENT_STATS, STAT_FIELD_TITLES} from '@/constants/stats'
import TeamStats from "@/store/models/team-stats";
const props = defineProps({
    average: Number,
    filters: Object,
    statField: String,
    statType: String,
});

const { getColor } = useColor();


const COLOR_STATS = [
    STAT_FIELDS.YELLOW,
    STAT_FIELDS.RED,
    STAT_FIELDS.BLUE,
]



const { userTeamIds } = useTeam();

const filteredTeamIds = computed(() => {
    if (!props.filters?.teams?.length) return userTeamIds.value
    return [...userTeamIds.value].filter((id) => props.filters.teams.includes(id))
})

const stats = computed(() => {
    return (
        useRepo(TeamStats)
            .query()
            .whereIn("team_id", filteredTeamIds.value)
            .get()
    );
});

const {getCumulativeStat} = useStats()

const value = computed(() => getCumulativeStat(stats.value.filter(STAT_FIELD_FILTER_FUNCTIONS[props.statField]), STAT_FIELDS_TOTAL[props.statType]))
const color = computed(() => Number.isNaN(value.value) ? getColor('slate') : value.value > props.average ? getColor('slate') : getColor('slate'));

const isPercent = !NON_PERCENT_STATS.includes(props.statType);

const cleanNumber = (num) => {
    if (Number.isNaN(num)) return '-'
    if (isPercent) {
        return `${Number((num * 100).toFixed())}%`;
    }

    return `${num > 0 ? "+" : ""}${num.toFixed(1)}`;
};
</script>
