<template>
    <div class="rink__container">
        <h1 class="text-md text-bold">{{rink.name}}</h1>
        <slot name="appendButton"/>
    </div>
</template>
<style lang="scss" scoped>
.rink__container {
    height: 100%;
    width: 100%;

   
}
</style>
<script setup>

const props = defineProps({
    rink: Object,
});


</script>
