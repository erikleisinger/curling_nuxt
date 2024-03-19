<template>
    <DashboardTile
        :type="STAT_TYPES.POINTS_PER_END"
        :percent="average"
        :color="color"
        :stats="stats"
        :isPercent="false"
    >
        <template v-slot:expanded> 
                 <DashboardStatDetailsItemTemplate>
                    <template v-slot:icon>
                        <q-icon
                            name="o_hardware"
                            size="0.8em"
                            color="white"
                            class="q-mr-sm"
                        />
                    </template>
                    <template v-slot:title>With hammer</template>
                   
                    <template v-slot:value>
                        <DashboardStatValue
                           
                            :value="withHammer"
                            :diff="withHammer - average"
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
                    <template v-slot:title>Without hammer</template>
                   
                    <template v-slot:value>
                        <DashboardStatValue
                           
                            :value="withoutHammer"
                            :diff="withoutHammer - average"
                        />
                    </template>
                </DashboardStatDetailsItemTemplate>

                <q-separator class="separator"/>
                

                 <DashboardStatDetailsItemTemplate>
                    <template v-slot:icon>
                        <q-icon
                            name="trending_up"
                            size="1em"
                            :style="{ color: getColor(STAT_COLORS[STAT_TYPES.POINTS_PER_END]) }"
                            class="q-mr-sm"
                        />
                    </template>
                    <template v-slot:title>Season high</template>
                    <template v-slot:value>
                        <DashboardStatValue
                     
                            :value="seasonHigh"
                            :diff="seasonHigh - average"
                        />
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
                    <template v-slot:title>Season low</template>
                    <template v-slot:value>
                        <DashboardStatValue
                          
                            :value="seasonLow"
                            :diff="seasonLow - average"
                        />
                    </template>
                </DashboardStatDetailsItemTemplate>
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
import { STAT_COLORS, STAT_TYPES } from "@/presentation/constants/stats";

const props = defineProps({
    stats: Object,
});

const { getColor } = useColor();
const color = getColor(STAT_COLORS[STAT_TYPES.POINTS_PER_END]);

const average = computed(() => props.stats[STAT_TYPES.POINTS_PER_END].percent);
const seasonHigh = computed(
    () => props.stats[STAT_TYPES.POINTS_PER_END].seasonHigh
);
const seasonLow = computed(
    () => props.stats[STAT_TYPES.POINTS_PER_END].seasonLow
);

const withHammer = computed(() => props.stats[STAT_TYPES.POINTS_PER_END].withHammer);
const withoutHammer = computed(() => props.stats[STAT_TYPES.POINTS_PER_END].withoutHammer)
</script>
<script>
export default {
    name: "HammerEfficiency",
};
</script>
