<template>
    <DashboardStatDetailsItemTemplate
        :subitem="subitem"
        v-model="expanded"
        :color="backgroundColor && getColor(backgroundColor)"
    >
        <template v-slot:icon v-if="props.icon">
            <q-icon
            v-if="icon !== 'ends'"
                :name="props.icon"
                size="0.7em"
                :style="{ color: getColor(props.iconColor ?? 'white') }"
                class="q-mr-xs"
            />
            <IconEnd v-else :num="props.iconParams"/>
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
                    color: avgDiff > 0 ? (backgroundColor === 'mint' ? 'white' : getColor('mint')) : (backgroundColor === 'red' ? 'white' : getColor('red')),
                }"
            />

            <span v-if="avgDiff"> {{ avgDiff }}{{ isPercent ? "%" : "" }}</span>
            <span v-else>-</span>
        </template>
        <template v-slot:value>
            {{ cleanNumber(value) }}<span v-if="isPercent" style="font-size: 0.8rem">%</span>
        </template>
        <template v-slot:more v-if="slots.more">
            <slot name="more" />
        </template>
    </DashboardStatDetailsItemTemplate>
</template>
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

const expanded = ref(true);
</script>
