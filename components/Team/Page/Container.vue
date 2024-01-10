<template>
<div class="team-info-container">
    <slot/>
</div>
    <!-- <div class="container" ref="container">
        <div class="header" ref="header">
            <div class="header-content--wrap">
                <div class="header-content">
                    <slot name="header" />
                </div>
            </div>
        </div>
        <div class="content__wrap" ref="content">
            <div class="content">
            <slot />
            </div>
        </div>

    </div> -->
</template>
<style lang="scss" scoped>
$overflow: 20px;
.team-info-container {
    width: 100%;
    background-color:rgba(40, 48, 68, 0.95);
    border-top-left-radius: 64px;
    border-top-right-radius: 64px;
    // @include chunky-border(8px);
    position: relative;
    color: white;
    // border-color: $app-yellow;
}
.container {
    width: 100%;
    position: relative;
    height: v-bind(containerHeight);
    //  margin-top: v-bind(containerMarginTop);

    .header {
        position: absolute;
        width: calc(100% + $overflow);
        left: calc(-1 * ($overflow/2));
        border-top-left-radius: 50%;
        border-top-right-radius: 50%;
        @include chunky-border(10px);
        background-color: $app-slate;
        aspect-ratio: 5/4;
        top: 0;
        height: v-bind(headerHeightPx);
        pointer-events:none;

        .header-content--wrap {
            min-height: 100%;
            border-top-left-radius: 50%;
            border-top-right-radius: 50%;
            max-height: 100%;
            height: 100%;
            overflow-x: hidden;
            .header-content {
                min-height: 50%;
                max-height: min(100%, 300px);
                width: v-bind(headerWidth);
                position: fixed;
                top: v-bind(headerTop);
            }
        }
    }
    .content__wrap {
        background-color: $app-slate;
        position: absolute;
        top: v-bind(contentMarginTop);
        height: v-bind(contentHeight);

        .content {

        }

    }


}
</style>
<script setup>
import { useElementBounding, useWindowSize } from "@vueuse/core";

const container = ref(null);
const { width } = useElementBounding(container);

const headerHeightPx = computed(() => `${width.value * 0.8}px`);

const content = ref(null);
const { height } = useElementBounding(content);

const { width: windowWidth, height: windowHeight } = useWindowSize();
const containerHeight = computed(() => `${windowHeight.value - headerY.value}px`);
const innerWidth = computed(() => `${height.value}px`);

const innerLeft = computed(
    () => `-${(height.value - windowWidth.value) / 2}px`
);
const innerPadding = computed(
    () => `0px ${(height.value - windowWidth.value) / 2}px`
);

const header = ref(null);
const { height: headerHeight, y: headerY } = useElementBounding(header);

const headerTop = computed(() => `${headerY.value}px`)

const contentMarginTop = computed(() => `${(headerHeight.value / 2)}px`);
const containerMarginTop = computed(() => `-${headerHeight.value / 2}px`);

const headerWidth = computed(() => `${width.value}px`)

const contentHeight = computed(() => `calc(${containerHeight.value} - ${contentMarginTop.value})`)
</script>
<script>
export default {
    name: 'RoundContainer'
}
</script>
