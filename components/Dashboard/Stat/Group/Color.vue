<template>
     <DashboardStatDetailsItemTemplate>
                    <template v-slot:icon>
                        <q-icon
                            name="circle"
                            size="0.8em"
                            :style="{ color: getColor('yellow') }"
                            class="q-mr-sm"
                        />
                    </template>
                    <template v-slot:title>Yellow rocks</template>
                    <template v-slot:subtitle>{{stats[type].yellowGameCount}}/{{stats.gamesPlayed}} games</template>
                    <template v-slot:value>
                        <DashboardStatValue :isPercent="isPercent" :diff="stats[type].yellow - average" :value="stats[type].yellow"/>
                    </template>
                </DashboardStatDetailsItemTemplate>
                <DashboardStatDetailsItemTemplate>
                    <template v-slot:icon>
                        <q-icon
                            name="circle"
                            size="0.8em"
                            :style="{ color: getColor('blue') }"
                            class="q-mr-sm"
                        />
                    </template>
                    <template v-slot:title>Blue rocks</template>
                         <template v-slot:subtitle>{{stats[type].blueGameCount}}/{{stats.gamesPlayed}} games</template>
                    <template v-slot:value>
                        <DashboardStatValue :isPercent="isPercent" :diff="stats[type].blue - average" :value="stats[type].blue"/>
                    </template>
                </DashboardStatDetailsItemTemplate>
                <DashboardStatDetailsItemTemplate>
                    <template v-slot:icon>
                        <q-icon
                            name="circle"
                            size="0.8em"
                            :style="{ color: getColor('red') }"
                            class="q-mr-sm"
                        />
                    </template>
                    <template v-slot:title>Red rocks</template>
                         <template v-slot:subtitle>{{stats[type].redGameCount}}/{{stats.gamesPlayed}} games</template>
                    <template v-slot:value>
                        <DashboardStatValue :isPercent="isPercent" :diff="stats[type].red -average" :value="stats[type].red"/>
                    </template>
                </DashboardStatDetailsItemTemplate>
</template>
<script setup>
    const props = defineProps({
        isPercent: Boolean,
        stats: Object,
        type: String,
    })

    const average = computed(() => props.stats[props.type].percent)

</script>