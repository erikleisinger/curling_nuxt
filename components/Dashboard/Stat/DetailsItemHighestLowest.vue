<template>
    <DashboardStatDetailsItemTemplate>
        <template v-slot:icon>
            <q-icon
                name="trending_up"
                size="1em"
                :style="{ color: getColor(STAT_COLORS[type]) }"
                class="q-mr-sm"
            />
        </template>
        <template v-slot:title> Season high </template>
        <template v-slot:diff>
            <q-icon
                v-if="values.highestDiff"
                :name="
                    values.highestDiff > 0 ? 'arrow_drop_up' : 'arrow_drop_down'
                "
                :style="{
                    color:
                        values.highestDiff > 0
                            ? getColor('mint')
                            : getColor('red'),
                }"
            />

            <span v-if="values.highestDiff">
                {{ values.highestDiff }}{{ isPercent ? "%" : "" }}</span
            >
            <span v-else>-</span>
        </template>
        <template v-slot:value>
            {{ cleanNumber(values.highest) }}{{ isPercent ? "%" : "" }}
        </template>
    </DashboardStatDetailsItemTemplate>

    <DashboardStatDetailsItemTemplate>
        <template v-slot:icon>
            <q-icon
                name="trending_down"
                size="1em"
                :style="{ color: getColor('red') }"
                class="q-mr-sm"
            />
        </template>
        <template v-slot:title> Season low </template>
        <template v-slot:diff>
            <q-icon
                v-if="values.lowestDiff"
                :name="
                    values.lowestDiff > 0 ? 'arrow_drop_up' : 'arrow_drop_down'
                "
                :style="{
                    color:
                        values.lowestDiff > 0
                            ? getColor('mint')
                            : getColor('red'),
                }"
            />

            <span v-if="values.lowestDiff">
                {{ values.lowestDiff }}{{ isPercent ? "%" : "" }}</span
            >
            <span v-else>-</span>
        </template>
        <template v-slot:value>
            {{ cleanNumber(values.lowest) }}{{ isPercent ? "%" : "" }}
        </template>
    </DashboardStatDetailsItemTemplate>
</template>
<script setup>
import {
    INVERTED_STATS,
    NON_PERCENT_STATS,
    STAT_FIELDS_TOTAL,
    STAT_COLORS,
} from "@/constants/stats";

const props = defineProps({
    average: Number,
    stats: Array,
    type: String,
});

const { getColor } = useColor();

const isPercent = !NON_PERCENT_STATS.includes(props.type);

const { cleanStatValue, getHighestLowest } = useStats();

const cleanNumber = (num) => {
    return cleanStatValue(num, props.type, 0);
};

const values = computed(() =>
    getHighestLowest(props.type, props.stats, props.average)
);
</script>
