<template>
    <div
        class="tutorial__highlight"
        :style="{
            top: `${y}px`,
            left: `${x}px`,
            height: `${height}px`,
            width: `${width}px`,
        }"
        ref="element"
        :class="{ square, rounded }"
    />
    <div
        class="tutorial__underlay"
        :style="{
            top: `${y}px`,
            left: `${x}px`,
            height: `${height}px`,
            width: `${width}px`,
        }"
        :class="{ darken, square, rounded }"
    />
    <div
        class="helper__floating"
        :style="{ top: `${positionY}px`, left: `${positionX}px` }"
        v-if="tutorialText && targetVisible"
        ref="text"
    >
        {{ tutorialText }}
    </div>
</template>
<style lang="scss" scoped>
.tutorial__highlight,
.tutorial__underlay {
    border-radius: 50%;
    pointer-events: none;
    &.square {
        border-radius: 8px;
    }
    &.rounded {
        border-radius: 32px;
    }
}
.tutorial__highlight {
    position: fixed;
    z-index: 10000;
    box-shadow: rgb(255, 231, 93) 0px 0px 10px 4px;
}
.tutorial__underlay {
    z-index: 9999;
    position: absolute;
    transition: box-shadow 0.5s;
    &.darken {
        box-shadow: 0 0 0 99999px rgba(0, 0, 0, 0.4);
    }
}
.helper__floating {
    position: fixed;

    background-color: white;
    color: $app-slate;
    z-index: 10000;
    overflow: hidden;
    border-radius: 8px;
    margin: 0px var(--space-sm);
    box-shadow: $pretty-shadow;
    padding: var(--space-sm);
}
</style>
<script setup>
import {
    onClickOutside,
    useElementBounding,
    useElementSize,
    useWindowSize,
    useElementVisibility,
} from "@vueuse/core";
const props = defineProps({
    bottom: Boolean,
    darken: Boolean,
    elementId: String,
    rounded: Boolean,
    square: Boolean,
    target: String,
    tutorialText: String,
});

const { x, y } = useElementBounding(document.getElementById(props.elementId));
const { height, width } = useElementBounding(
    document.getElementById(props.elementId)
);

const text = ref(null);
const { height: textHeight, width: textWidth } = useElementBounding(text);

const element = ref(null);
const { height: elementHeight, width: elementWidth } = useElementSize(element);

const { height: windowHeight, width: windowWidth } = useWindowSize();

const positionX = computed(() => {
    if (x.value + textWidth.value > windowWidth.value) {
        const newX = x.value - textWidth.value - elementWidth.value;
        return newX >= 0 ? newX : 0;
    }
    return x.value + (props.bottom ? 0 : elementWidth.value);
});

const positionY = computed(() => {
    const newPosY = y.value + (props.bottom ? elementHeight.value : 0);
    if (newPosY + textHeight.value > windowHeight.value)
        return y.value - textHeight.value;
    return newPosY;
});

const targetVisible = useElementVisibility(
    document.getElementById(props.target ?? props.elementId)
);
</script>
