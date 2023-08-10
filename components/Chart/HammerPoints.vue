<template>
    <ChartContainer @swipe="onSwipe" :index="index">
        <template v-slot:title>{{TITLES[index]}}</template>
        <template v-slot:subtitle>{{DESCRIPTIONS[index]}}</template>
        <template v-slot:card><StatsAggregateCard :score="index * 2" /></template>

           <ChartHammerPointsOverTime v-show="index === 0" :visible="index === 0" :index="0" key="chart-1"/>
             <ChartHammerPointsOverTime v-show="index === 1"  :visible="index === 1" :index="1" key="chart-2"/>
  
    </ChartContainer>
</template>
<style lang="scss">

</style>
<script setup>
const index = ref(0)

const TITLES = [
    'Title 1', 
    'Title 2'
]

const DESCRIPTIONS = [
    'Look at this description!',
    'It changed!'
]
const components = ref([null, null])
    const onSwipe = (direction) => {
        console.log('SWIPING: ', direction)
        const inc = {
            left: 1,
            right: -1,
        }[direction] || null;
        if (index.value + inc < 0 || index.value + inc >= components.value.length) return;
        index.value += inc;
    }
</script>
