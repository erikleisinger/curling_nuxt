<template>
<Teleport to="body" v-if="element">
    <transition appear enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
    <div
    v-if="showing"
        class="z-top overlay__wrap"
        :style="{top: `${y - height - 16}px`, left: `${x - width / 2}px`, maxWidth: '300px'}"
        ref="text"
    >
    <slot/>
    </div>
    </transition>
</Teleport>
</template>
<style lang="scss" scoped>
.overlay__wrap {
    position: absolute;
            background-color: rgba(0, 0, 0, 0.8);
    box-shadow: $pretty-shadow;
    padding: var(--space-xs);
    border-radius: 8px;
    color: white;
    font-weight: bold;
}
</style>
<script setup>
import {useElementBounding} from '@vueuse/core'
const props = defineProps({
      element: Object,
    showing: Boolean,
    tutorialText: String
  
});

let x = reactive();
let y = reactive()
const showing = ref(false)
const setXy = () => {
    showing.value = false;
    setTimeout(() => {
        const {x: eleX,y: eleY} = useElementBounding(props.element)
x = eleX;
y = eleY
nextTick(() => {
showing.value = true;
})

    }, 200)
}

watch(() => props.element, () => {
    console.log(useElementBounding(props.element))
setXy()


    

}, {immediate:true})



const text = ref(null);
const {width, height} = useElementBounding(text);
</script>
