<template>
    <div class="error__container column justify-center items-center">
        <q-icon name="sentiment_dissatisfied" size="6em" :style="{color: getColor('red')}"/>
        <slot/>
    </div>
</template>
<style lang="scss" scoped>
    .error__container {
        position: absolute;
        top: $app-header-height-xs;
        @include sm {
            top: $app-header-height-sm;
        }
        bottom: 0;
        left: 0;
        right: 0;
    }
</style>
<script setup>
    const {getColor} = useColor();
</script>