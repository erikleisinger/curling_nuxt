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
            <div style="font-weight: bold">{{ width }}%</div>
        </div>
        <div class="row justify-end" :class="{ reverse }">
            <div class="percent-wrapper"  />
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
 
    box-shadow: rgba(0, 0, 0, 0.05) 0px 0px 0px 1px;
    &:after {
        content: "";
        height: 100%;
        border-radius: 8px;
        background-color: v-bind(bg);
        position: absolute;
        left: v-bind(left);
        right: v-bind(right);
        animation: 0.8s grow forwards;
        animation-delay: 0.2s;
        width: v-bind(widthComputed);
        box-shadow: rgba(17, 17, 26, 0.1) 0px 4px 16px, rgba(17, 17, 26, 0.1) 0px 8px 24px, rgba(17, 17, 26, 0.1) 0px 16px 56px;
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
    static: {
        type: Boolean,
        default() {
            return true;
        }
    }
});
const width = ref(0)
const widthComputed = computed(() => `${width.value}%`);
const left = computed(() => (props.reverse ? 0 : "unset"));
const right = computed(() => (props.reverse ? "unset" : 0));
const el = ref(null)
const targetVisible = useElementVisibility(el)
 const {upTick} = useAnimate();
     const {getColor} = useColor();

const rendered = ref(false)


watch(targetVisible, (val) => {
    if (!val || (props.static && rendered.value)) return;
    width.value = 0;
    rendered.value = true;
    upTick(width, props.percent);
}, {immediate:true})



const bg = computed(() => {
    return getColor(props.color)
})
</script>
