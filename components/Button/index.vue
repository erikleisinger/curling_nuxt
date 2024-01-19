<template>
    <q-btn
        rounded
        :style="{
            backgroundColor: flat ? '' : textColor ? 'white' : getColor(color),
            color: getColor(textColor) ?? 'white',
        }"
        :round="round"
        :flat="flat"
        :icon="icon"
        :size="size"
        class="app-button"
    >
        <slot />
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
        default: "yellow",
    },
    flat: Boolean,
    round: Boolean,
    icon: String,
    size: String,
    textColor: String,
});

const { getColor } = useColor();
</script>
<script>
export default {
    name: 'Button'
}
</script>
