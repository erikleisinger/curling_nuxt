<template>
    <q-btn rounded :style="{backgroundColor: getColor(color), color: 'white'}" :round="round" :icon="icon" :size="size" class="app-button">
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
        },
        round: Boolean,
        icon: String,
        size: String,
    })

    const {getColor} = useColor()
</script>
