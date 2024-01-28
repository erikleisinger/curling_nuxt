<template>
    <div class="flag-container" :style="{background, height: size, width: size}"/>
</template>
<style lang="scss" scoped>

    .flag-container {
        overflow: hidden;
        border-radius: 50%;
        @include chunky-border(2px);
        position: relative;

    }
</style>
<script setup>
const props = defineProps({
    name: String,
    size: {
        type: String,
        default: '50px'
    }
})
const glob = import.meta.glob("~/assets/flags/*", {
  eager: true,
});
    const backgroundUrl = computed(() => {
        try {
            return glob[`/assets/flags/${props.name}.svg`]['default']
        } catch {
            return ''
        }
    })
    const background = computed(() => `url(${backgroundUrl.value}) center / cover`)
</script>