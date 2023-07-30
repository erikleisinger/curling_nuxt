<template>
    <div class="stats__card pretty-shadow column justify-center items-center simple-border no-wrap" :style="{height: `${size}em`, width: `${size}em`, padding: `${size / 10}em`}">
        <div class="content">
            <h1 class="value__header" >{{props.value}}</h1>
        </div>
        <div class="label">
            {{props.label}}
        </div>
    </div>
</template>
<style lang="scss" scoped>
    .stats__card {
        border-radius: 16px;

    }
    .value__header {
        font-size: v-bind(headerFont);
    }
</style>
<script setup>
    const props = defineProps({
        label: String,
        size: Number,
        value: [String, Number, null]
    })
    const headerFont = computed(() => `${props.size / 3}em`)
</script>