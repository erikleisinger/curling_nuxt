<template>
    <div>
        <percentage
            :percent="stats.total ? getPercent(stats.total) : 0"
            :color="color"
            label="Total"
             :reverse="reverse"
        />
        <percentage
            :percent="stats.fourth ? getPercent(stats.fourth) : 0"
            :color="color"
            label="Fourth"
             :reverse="reverse"
        />
        <percentage
            :percent="stats.third ? getPercent(stats.third) : 0"
            :color="color"
            label="Third"
             :reverse="reverse"
        />
        <percentage
            :percent="stats.second ? getPercent(stats.second) : 0"
            :color="color"
            label="Second"
            :reverse="reverse"
        />

        <percentage
            :percent="stats.lead ? getPercent(stats.lead) : 0"
            :color="color"
            label="Lead"
             :reverse="reverse"
        />
    </div>
</template>
<script setup lang="ts">
interface Stats {
    total: number;
    fourth: number;
    third: number;
    second: number;
    lead: number;
}
const props = defineProps<{
    color: string;
    reverse?: boolean;
    stats: Stats;
}>();

const {getPercent} = useConvert();
</script>
