<template>
    <div class="window-height window-width row items-center">
        <div style="width: 100vw; position:relative" class="q-mx-lg column items-center">
        <div class="q-pb-md">Loading... </div>
        <q-linear-progress rounded  stripe size="10px" :value="value" :indeterminate="infinite"></q-linear-progress>
        </div>
 
    </div>  
</template>
<script setup>
    const props = defineProps({
        infinite: Boolean,
        value: Number
    })
</script>