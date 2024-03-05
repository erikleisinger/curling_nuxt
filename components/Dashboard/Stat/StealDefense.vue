<template>
    <DashboardTile
        :type="STAT_TYPES.STEAL_DEFENSE"
        :percent="average"
        :color="color"
        :stats="stats"
    >

       <template v-slot:expanded>
                <!-- GAMES PLAYED -->

                <DashboardStatDetailsItemTemplate>
                    <template v-slot:icon>
                        <q-icon
                            name="o_hardware"
                            size="0.8em"
                            color="white"
                            class="q-mr-sm"
                        />
                    </template>
                    <template v-slot:title>Winning average</template>
                    <template v-slot:subtitle>
                        Median steal defense when winning
                    </template>
                    <template v-slot:value>
                        <DashboardStatValue
                            isPercent
                            :value="stats[STAT_TYPES.STEAL_DEFENSE].winAverage"
                        />
                    </template>
                </DashboardStatDetailsItemTemplate>
                <DashboardStatDetailsItemTemplate>
                    <template v-slot:icon>
                        <q-icon
                            name="o_hardware"
                            size="0.8em"
                            color="white"
                            class="q-mr-sm"
                        />
                    </template>
                    <template v-slot:title>Losing Average</template>
                    <template v-slot:subtitle>
                        Median steal defense when losing
                    </template>

                    <template v-slot:value>
                        <DashboardStatValue
                            isPercent
                            :value="stats[STAT_TYPES.STEAL_DEFENSE].lossAverage"
                        />
                    </template>
                </DashboardStatDetailsItemTemplate>

                <q-separator class="separator" />

       <DashboardStatGroupSeasonHighLow :type="STAT_TYPES.STEAL_DEFENSE" :stats="stats" isPercent/>
       </template>
    </DashboardTile>
</template>
<style lang="scss" scoped>
.separator {
    background-color: v-bind(color);
    margin-bottom: var(--space-md);
    margin-top: calc(var(--space-md) - 4px);
}

</style>
<script setup>
import {
    STAT_COLORS,
    STAT_TYPES,
} from "@/constants/stats";

const props = defineProps({
    stats: Object,
});

const { getColor } = useColor();
const color = getColor(STAT_COLORS[STAT_TYPES.STEAL_DEFENSE]);

const average = computed(
    () => props.stats[STAT_TYPES.STEAL_DEFENSE].percent
);
const seasonHigh = computed(
    () => props.stats[STAT_TYPES.STEAL_DEFENSE].seasonHigh
);
const seasonLow = computed(
    () => props.stats[STAT_TYPES.STEAL_DEFENSE].seasonLow
);






</script>
<script>
export default {
    name: "StealDefense",
};
</script>
