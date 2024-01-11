<template>
<LinescorePageContainer class="container">
    <template v-slot:title>
        Enter score
    </template>
    <template v-slot:content>
    <div>Score input</div>
    </template>
</LinescorePageContainer>
</template>
<style lang="scss" scoped>
    .container {
        transform: rotate(90deg);
    }
</style>
<script setup>
import {useEventListener} from '@vueuse/core'
    const props = defineProps({
        score: Object
    })
    
    useEventListener(window, 'deviceorientation', (e) => {
        console.log('orientation changed: ', e)
    }, true)
</script>