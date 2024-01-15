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
             <q-icon
                name="o_hardware"
                size="0.9em"
                :style="{ color: statField === STAT_FIELDS.WITH_HAMMER ? getColor('blue') : 'inherit', transform: statField === STAT_FIELDS.WITH_HAMMER ? '' : 'rotate(180deg)' }"
                class="q-mr-xs"
                v-if="HAMMER_STATS.includes(statField)"
            />

            {{STAT_FIELD_TITLES[statField](statType)}}

        </h4>
        <div class="row items-end">
            <div class="text-caption q-mr-sm" v-if="hasValue">
                <q-icon :name="avgDiff > 0 ? 'arrow_drop_up' : 'arrow_drop_down'" :style="{color: avgDiff > 0 ? getColor('mint') : getColor('red')}"/>
                
                {{avgDiff}}{{isPercent ? '%' : ''}}</div>
        <h5     :style="{ color }">{{ cleanNumber(value) }}</h5>
        </div>
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
    alwaysNumber: Boolean,
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

const HAMMER_STATS = [
    STAT_FIELDS.WITH_HAMMER,
    STAT_FIELDS.WITHOUT_HAMMER
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
             .where('rink_id', (val) => {
            return props.filters.rink ? val === props.filters.rink : true
        })
        .where('sheet_id', (val) => {
            return props.filters.sheet ? val === props.filters.sheet : true
        })
            .get()
    );
});

const {getCumulativeStat} = useStats()



const value = computed(() => getCumulativeStat(stats.value.filter(STAT_FIELD_FILTER_FUNCTIONS[props.statField]), STAT_FIELDS_TOTAL[props.statField] ?? STAT_FIELDS_TOTAL[props.statType]))
const color = computed(() => Number.isNaN(value.value) ? 'inherit' : value.value > props.average ? 'inherit' : 'inherit');

const isPercent = !props.alwaysNumber && !NON_PERCENT_STATS.includes(props.statType);

const hasValue = computed(() => !Number.isNaN(value.value))

const avgDiff = computed(() => (value.value * (isPercent ? 100 : 1) - props.average).toFixed(1))

const cleanNumber = (num) => {
    if (!hasValue.value) return '-'
    if (isPercent) {
        return `${Number((num * 100).toFixed())}%`;
    }

    return `${num > 0 ? "" : ""}${num.toFixed(1)}`;
};
</script>
