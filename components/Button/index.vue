<template>
    <q-btn rounded :style="{backgroundColor: getColor(color), color: 'white'}" class="app-button">
        <slot/>
    </q-btn>
</template>
<style lang="scss" scoped>
    .app-button {
        font-family: $font-family-header;
        @include reg-text;
    }
</style>
<script setup>
    const props = defineProps({
        color: {
            type: String,
            default: 'yellow'
        }
    })

    const {getColor} = useColor()
</script>
