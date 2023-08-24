<template>
    <div class="event__container">
        <h1 class="text-md text-bold">{{event.name}}</h1>
        <slot name="appendButton"/>
    </div>
</template>
<style lang="scss" scoped>
.event__container {
    height: 100%;
    width: 100%;

   
}
</style>
<script setup>

const props = defineProps({
    event: Object,
});


</script>
