<template>
<div  class="column items-center justify-center no-wrap" style="border-radius: 50%; padding: 4px; width: fit-content; position: relative"  @click="onClick">
    <q-icon :name="icon" :color="selected ? 'deep-purple' : 'grey-8'" size="1.5em">
    <slot/> 
    </q-icon>

    <div v-if="label" style="font-size: 0.7em; font-family: 'Montserrat', sans-serif; position:relative" :class="selected ? 'text-deep-purple' : 'text-black'">{{label}}    </div>

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