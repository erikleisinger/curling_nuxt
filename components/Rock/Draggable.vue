<template>

        <RockIcon
            ref="rock"
         class="rock row justify-center draggable"
         :style="{position, top: positionY, left: positionX}"
         :selected="selected"
      />


</template>
<script setup lang="ts">
import {
  useEventListener,
  useMouseInElement,
  useElementBounding

} from "@vueuse/core";
import {useEventStore} from '@/store/event'

const rock = ref(null);
const selected = ref(false)
const isDraggable = ref(false)
const positionX = ref('1px')
const positionY = ref('1px')
const position = ref('relative')

const store = useEventStore();
const {x:conX, y: conY} = useElementBounding(document.querySelector('#curlingRockWrapper'))


const onClick = () => {
    console.log('CLICK')
    selected.value = !selected.value
}
const startDrag = () => {
    isDraggable.value = true;
}
 const { x, y } = useMouseInElement()
const onDrag = () => {
    if (!isDraggable.value) return;
    store.toggleDraggingOOB(true)
    console.log(conX.value, conY.value)
    position.value = 'fixed'
    positionX.value = `${x.value}px`
    positionY.value = `${y.value}px`
}
const endDrag = () => {
     
    position.value = 'relative'
    isDraggable.value = false;
     positionX.value = `1px`
    positionY.value = `1px`
    nextTick(() => {
    store.toggleDraggingOOB(false)
    })

}
useEventListener(rock, 'click', onClick)
useEventListener(rock, "mousedown", startDrag);
useEventListener(rock, "touchstart", startDrag);
useEventListener(document, "mousemove", onDrag);
useEventListener(document, "touchmove", onDrag);
useEventListener(document, "mouseup", endDrag);
useEventListener(document, "touchend", endDrag);
</script>