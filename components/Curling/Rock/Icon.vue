<template>
   <div>
    <slot/>
   </div>
</template>

<script setup>
    const props = defineProps({
        color: String,
    })
</script>
<style lang="scss">
.rock__icon {
        position: relative;
        &:after {
                content: "";
    height: 50%;
    width: 50%;
    background-color: rgba(0,0,0,0.6);
    position: absolute;
    z-index: -1;
    border-radius: 50%;
        }
    }
</style>
