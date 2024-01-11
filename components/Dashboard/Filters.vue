<template>
<div class="full-width filters__container">
    <div class="full-width row justify-center">
    <Button @click="revealed = !revealed">Filter</Button>
    </div>
    <div v-if="revealed" class="filters__container--inner row justify-between">
        <div class="row">
            <Rings size="1.4em" class="q-mr-sm" :twelveft="color" :fourft="color" :eightft="getColor('royalBlue')" :buttonft="getColor('royalBlue')" />
        <h3>Filter by sheet</h3>
        </div>
        <div class="text-caption">Coming soon</div>
    </div>
</div>
</template>
<style lang="scss" scoped>
    .filters__container {
        // padding: 0px var(--space-md);
        .filters__container--inner {
            margin-top: var(--space-sm);
            background-color: rgba(0,0,0,0.15);
            padding: var(--space-md) var(--space-md);
        }
    }
</style>
<script setup>
import {STAT_COLORS} from '@/constants/stats'
const props = defineProps({
    statType: String,
})
    const revealed = ref(false)

    const {getColor} = useColor();

    const color = getColor('yellow')
</script>