<template>
    <DashboardStatDetailsItemTemplate
        :subitem="subitem"
        v-model="expanded"
        :color="backgroundColor && getColor(backgroundColor)"
    >
        <template v-slot:icon v-if="props.icon">
            <q-icon
                :name="props.icon"
                size="0.7em"
                :style="{ color: getColor(props.iconColor ?? 'white') }"
                class="q-mr-xs"
            />
        </template>
        <template v-slot:title>
            {{ props.title }}
        </template>
        <template v-slot:subtitle v-if="subtitle">
            {{ subtitle }}
        </template>
        <template v-slot:diff>
            <q-icon
                v-if="avgDiff !== 0"
                :name="avgDiff > 0 ? 'arrow_drop_up' : 'arrow_drop_down'"
                :style="{
                    color: avgDiff > 0 ? getColor('mint') : getColor('red'),
                }"
            />

            <span v-if="avgDiff"> {{ avgDiff }}{{ isPercent ? "%" : "" }}</span>
            <span v-else>-</span>
        </template>
        <template v-slot:value>
            <h5>{{ cleanNumber(value) }}{{ isPercent ? "%" : "" }}</h5>
        </template>
        <template v-slot:more v-if="slots.more">
            <slot name="more" />
        </template>
    </DashboardStatDetailsItemTemplate>
</template>
<style lang="scss" scoped>
$upcoming-color: rgba(255, 255, 255, 0.7);
.details-item__container {
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
        &.subitem {
            margin-left: var(--space-xs);

            margin-bottom: var(--space-xxs) !important;
            h4 {
                @include reg-text;
            }
            h5 {
                @include smmd-text;
            }
        }
        transition: all 0.2s;
        &.expanded {
            &.pos {
                background-color: $app-mint;
            }
            &.neg {
                background-color: $app-red;
            }

            padding: var(--space-xs);
            border-radius: 8px;
            .q-icon {
                color: white !important;
            }
            margin-bottom: unset;
            transform: scale(1.04);
        }

        h6 {
            font-family: $font-family-secondary;
            @include text-caption;
            margin-top: -4px;
            font-weight: normal;
            font-style: italic;
        }
    }

    .more__container {
        width: 100%;
        padding: var(--space-sm) var(--space-md);
        position: relative;
        border-radius: 8px;
        border-top-left-radius: 0px;
        border-top-right-radius: 0px;
        overflow: hidden;
        background-color: rgba(0, 0, 0, 0.2);
        margin-bottom: var(--space-sm);
        &:before {
            content: "";

            height: 100%;
            width: 8px;
            top: 0;
            left: 0;
            bottom: 0;
            position: absolute;
        }
        &.pos {
            &:before {
                background-color: $app-mint;
            }
        }
        &.neg {
            &:before {
                background-color: $app-red;
            }
        }
        .row__container {
            &:last-child {
                margin-bottom: unset !important;
            }
        }
    }

    .stat-line {
        flex-grow: 1;
        height: 100%;
        position: relative;
        overflow: hidden;
    }
}
</style>
<script setup>
import {
    NEG_STATS,
    NON_PERCENT_STATS,
    POS_STATS,
    STAT_COLORS,
    STAT_FIELD_FILTER_FUNCTIONS,
    STAT_FIELD_TITLES,
    STAT_FIELDS_TOTAL,
    STAT_FIELDS,
    STAT_TYPE_SUBTITLES,
    STAT_TYPES,
} from "@/constants/stats";
import TeamStats from "@/store/models/team-stats";
const props = defineProps({
    alwaysNumber: Boolean,
    average: Number,
    backgroundColor: String,
    calculator: Function,
    filters: Object,
    icon: String,
    iconColor: String,
    statField: String,
    statType: String,
    stats: Array,
    subitem: Boolean,
    title: String,
});

const { getColor } = useColor();

const slots = useSlots();

const subtitle = computed(() => {
    if (!STAT_TYPE_SUBTITLES[props.statField]) return null;
    return STAT_TYPE_SUBTITLES[props.statField](props.stats);
});

const { isPercentStat, cleanStatValue } = useStats();

const value = computed(() => props.calculator({ stats: props.stats, statType: props.statType }));

const isPercent =
    !props.alwaysNumber && isPercentStat(props.statType, props.statField);

const hasValue = computed(() => !Number.isNaN(value.value));

const showAvgDiff = computed(
    () =>
        props.statType !== STAT_TYPES.HAMMER_EFFICIENCY ||
        props.statField !== STAT_FIELDS.WITH_HAMMER
);

const avgDiff = computed(() =>
    Number(
        (value.value * (isPercent ? 100 : 1) - props.average).toFixed(
            isPercent ? 0 : 1
        )
    )
);

const cleanNumber = (num) => {
    return cleanStatValue(num, props.statType, null, props.statField);
};

const expanded = ref(false);
</script>
