<template>
    <div class="tutorial__highlight" :style="{top: `${y}px`, left: `${x}px`, height:`${height}px`, width: `${width}px`}" ref="element"/>
    <div class="helper__floating"  :style="{top: `${positionY}px`, left: `${positionX}px`}" v-if="tutorialText && targetVisible" ref="text">
        {{tutorialText}}
    </div>
</template>
<style lang="scss" scoped>
    .tutorial__highlight {
        border-radius: 50%;
        position: fixed;
         z-index: 10000;
        box-shadow: rgb(255, 231, 93) 0px 0px 10px 4px;
        pointer-events: none;

    }
    .helper__floating {
        position: fixed;

        background-color: white;
        color: $app-slate;
        z-index: 10000;
        padding: var(--space-sm);
        border-radius: 8px;
        margin: 0px var(--space-sm);
        box-shadow: $pretty-shadow;

    }
</style>
<script setup>
import {useElementBounding, useElementSize, useWindowSize, useElementVisibility} from '@vueuse/core'
    const props = defineProps({
        bottom: Boolean,
        elementId: String,
        tutorialText: String,
    })

    const {x, y} = useElementBounding(document.getElementById(props.elementId))
    const {height, width} = useElementBounding(document.getElementById(props.elementId))
    
    const text = ref(null);
    const {height: textHeight, width: textWidth} = useElementBounding(text)

     const element = ref(null);
    const {height: elementHeight, width: elementWidth} = useElementSize(element)

    const {height: windowHeight, width: windowWidth} = useWindowSize();

    const positionX = computed(() => {
        if (x.value + textWidth.value > windowWidth.value) {
            const newX = x.value - textWidth.value - elementWidth.value
            return newX >=0 ? newX : 0;
        }
        return x.value + (props.bottom ? 0 : elementWidth.value)
    })

    const positionY = computed(() => {
        const newPosY = y.value + (props.bottom ? elementHeight.value : 0);
        if (newPosY + textHeight.value > windowHeight.value) return y.value - textHeight.value;
        return newPosY;
    })

    const targetVisible = useElementVisibility(document.getElementById(props.elementId))

</script>