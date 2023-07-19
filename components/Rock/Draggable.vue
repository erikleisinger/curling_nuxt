<template>

        <RockIcon
            ref="rock"
         class="rock row justify-center draggable"
         :style="{position, top: positionY, left: positionX}"
         style="width:15px"
         :selected="props.selected"
         :color="color"
         :disabled="disabled"
      />



</template>
<script setup lang="ts">
import {
  useEventListener,
  useMouseInElement,
  useElementBounding

} from "@vueuse/core";
import {useEventStore} from '@/store/event'

const emit = defineEmits(['dragging', 'dragUp', 'select'])
const props = defineProps({
    color: String,
    disabled: Boolean,
    selected: Boolean,
})
const rock = ref(null);
const isDraggable = ref(false)
const positionX = ref('1px')
const positionY = ref('1px')
const position = ref('relative')

const store = useEventStore();
const {x:conX, y: conY} = useElementBounding(document.querySelector('#curlingRockWrapper'))


const onClick = () => {
    if (props.disabled) return;
    emit('select')
}
const startDrag = () => {
    if (props.disabled || !props.selected) return;

}
 const { x, y } = useMouseInElement()
const onDrag = () => {
    if (!props.selected) return;
    emit('dragging')
    console.log(conX.value, conY.value)
    position.value = 'fixed'
    positionX.value = `${x.value}px`
    positionY.value = `${y.value}px`
}
const endDrag = () => {
    position.value = 'relative'
     positionX.value = `1px`
    positionY.value = `1px`
    emit('dragUp')

}
useEventListener(rock, 'click', onClick)
useEventListener(rock, "mousedown", startDrag);
useEventListener(rock, "touchstart", startDrag);
useEventListener(document, "mousemove", onDrag);
useEventListener(document, "touchmove", onDrag);
useEventListener(document, "mouseup", endDrag);
useEventListener(document, "touchend", endDrag);
</script>