<template>
    <div
        class="column"
        :class="{ 'column-reverse': reverse }"
        style="width: 100%; padding-bottom: 16px"
        ref="el"
    >
        <div
            class="row justify-between"
            :class="{ reverse }"
            style="padding-bottom: 8px"
        >
            <div style="font-weight: bold">{{ label }}</div>
            <div style="font-weight: bold">{{ percent }}%</div>
        </div>
        <div class="row justify-end" :class="{ reverse }">
            <div class="percent-wrapper" v-if="targetVisible" />
        </div>
    </div>
</template>
<style lang="scss">
.percent-wrapper {
    position: relative;
    border-radius: 8px;
    overflow: hidden;
    width: 100%;
    height: 8px;
    background-color: rgba(213, 213, 213, 0.3);
    &:after {
        content: "";
        height: 100%;
        border-radius: 8px;
        background-color: v-bind(color);
        position: absolute;
        left: v-bind(left);
        right: v-bind(right);
        animation: 0.8s grow forwards;
        animation-delay: 0.2s;
    }
}

@keyframes grow {
    0% {
        width: 0%;
    }
    100% {
        width: v-bind(width)
    }
}
</style>
<script setup>
import {useElementVisibility} from '@vueuse/core'
const props = defineProps({
    color: String,
    percent: Number,
    label: String,
    reverse: Boolean,
});
const width = computed(() => `${props.percent}%`);
const left = computed(() => (props.reverse ? 0 : "unset"));
const right = computed(() => (props.reverse ? "unset" : 0));
const el = ref(null)
const targetVisible = useElementVisibility(el)
</script>
