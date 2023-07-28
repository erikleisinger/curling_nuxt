<template>
    <div class="stats__card pretty-shadow column justify-center items-center simple-border no-wrap" :style="{height: size, width: size}">
        <div class="content">
            <h1>{{props.value}}</h1>
        </div>
        <div class="label">
            {{props.label}}
        </div>
    </div>
</template>
<style lang="scss" scoped>
    .stats__card {
        padding: 16px;
        border-radius: 16px;
        .content {

        }

    }
</style>
<script setup>
    const props = defineProps({
        label: String,
        size: String,
        value: [String, Number, null]
    })
</script>