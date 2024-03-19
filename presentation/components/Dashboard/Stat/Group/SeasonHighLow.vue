<template>
     <DashboardStatDetailsItemTemplate>
                    <template v-slot:icon>
                         <q-icon
                            name="trending_up"
                            size="1em"
                            :style="{ color: getColor('mint') }"
                            class="q-mr-sm"
                        />
                    </template>
                    <template v-slot:title>Season high</template>
                    <template v-slot:value>
                        <DashboardStatValue :isPercent="isPercent" :diff="stats[type].seasonHigh - average" :value="stats[type].seasonHigh"/>
                    </template>
                </DashboardStatDetailsItemTemplate>
                <DashboardStatDetailsItemTemplate>
                    <template v-slot:icon>
                          <q-icon
                            name="trending_up"
                            size="1em"
                            :style="{ color: getColor('red') }"
                            class="q-mr-sm"
                        />
                    </template>
                    <template v-slot:title>Season low</template>
                    <template v-slot:value>
                        <DashboardStatValue :isPercent="isPercent" :diff="stats[type].seasonLow - average" :value="stats[type].seasonLow"/>
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