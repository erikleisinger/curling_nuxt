<template>
    <div
        class="column"
            :class="{ 'column-reverse': reverse }"
        style="width: inherit"
        ref="el"
    >

        <div
            class="row justify-between no-wrap"
            :class="{ reverse }"
            style=" width: 100%;"
        >
            <div  class="truncate-text col-shrink label text-bold" :class="{reverse}" ><div v-if="showLabel">{{ label }}</div></div>
            <div style="font-weight: bold" ><div v-if="showPercent">{{ width }}%</div></div>
        </div>
        <div class="row justify-end no-wrap items-center" style="position: relative" :class="{ reverse }" :style="{height}">
           
                <div class="full-width" style="position:relative">
                         <slot/>
            <div class="percent-wrapper">
            </div>

            </div>
            <slot name="append"/>
        </div>
    </div>
</template>
<style lang="scss" scoped>
.percent-wrapper {
    position: relative;
    border-radius: 8px;
    overflow: hidden;
    width: 100%;
    height: v-bind(height);
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
             background-image: linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, rgba(255, 255, 255, 0) 25%, rgba(255, 255, 255, 0) 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, rgba(255, 255, 255, 0) 75%, rgba(255, 255, 255, 0)) !important;
    background-size: 40px 40px !important;
    }
    
}
.label {
        margin-right: var(--space-xs);
        &:not(.reverse) {
            
        }
        &.reverse {
            margin-left: var(--space-xs);
        }
    }
</style>
<script setup>
// import {useElementVisibility} from '@vueuse/core'
const props = defineProps({
    color: String,
    height: {
        type: String,
        default: '8px'
    },
    percent: Number,
    label: String,
    reverse: Boolean,
    showLabel: Boolean,
    showPercent: Boolean,
    static: {
        type: Boolean,
        default() {
            return true;
        }
    }
});
const width = ref(0)
const widthComputed = computed(() => `${width.value}%`);
const left = computed(() => (props.reverse ? "unset" : 0));
const right = computed(() => (props.reverse ? 0 : "unset"));
// const el = ref(null)
// const targetVisible = useElementVisibility(el)
 const {upTick} = useAnimate();
     const {getColor} = useColor();

const rendered = ref(false)
onMounted(() => {
    upTick(width, props.percent);
})


// watch(targetVisible, (val) => {
//     if (!val || (props.static && rendered.value)) return;
//     width.value = 0;
//     rendered.value = true;
//     upTick(width, props.percent);
// }, {immediate:true})



const bg = computed(() => {
    return getColor(props.color)
})
</script>
