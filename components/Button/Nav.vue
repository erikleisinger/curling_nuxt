<template>
<div  class="column items-center justify-center no-wrap" style="border-radius: 50%; padding: 4px; aspect-ratio: 1/1; width: fit-content"  @click="onClick">
    <q-icon :name="icon" :color="selected ? 'deep-purple' : 'grey-8'" size="1.5em"/>
    <div v-if="label" style="font-size: 0.7em; font-family: 'Montserrat', sans-serif" :class="selected ? 'text-deep-purple' : 'text-black'">{{label}}</div>
</div>
</template>
<script setup>
    const props = defineProps({
        size: String,
        icon: String,
        color: String,
        label: String,
        selected: Boolean,
        onClick: Function
    })
</script>