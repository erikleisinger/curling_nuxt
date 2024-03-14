<template>

        <RockIcon
            ref="rock"
         class="row justify-center draggable"
         :style="{position, top: positionY, left: positionX, width, height}"
         :selected="props.selected"
         :color="color"
         :disabled="disabled"
         :overlay="showNumbers"
      >
    <span v-if="showNumbers">{{props.shotNo}}</span>
        </RockIcon>



</template>
<script setup lang="ts">
import {
onClickOutside,
  useEventListener,
  useMouseInElement,
  useElementBounding

} from "@vueuse/core";

const emit = defineEmits(['deselect', 'dragging', 'dragUp', 'select'])
const props = defineProps({
    color: String,
    disabled: Boolean,
    selected: Boolean,
    showNumbers: Boolean,
    shotNo: Number,
    width: String,
    height: String,
})
const rock = ref(null);
const isDraggable = ref(false)
const positionX = ref('1px')
const positionY = ref('1px')
const position = ref('relative')

const {x:conX, y: conY} = useElementBounding(document.querySelector('#curlingRockWrapper'))


const onClick = () => {
    if (props.disabled) return;
    emit('select')
}
const startDrag = () => {
    if (props.disabled || !props.selected) return;
    startDragEvents();

}
 const { x, y } = useMouseInElement()
const onDrag = () => {
    if (props.disabled || !props.selected) return;
    emit('dragging')
    position.value = 'fixed'
    positionX.value = `calc(${x.value}px - ${props.width} / 2)`
    positionY.value =  `calc(${y.value}px - ${props.width} / 2)`
}
const endDrag = () => {
    endDragEvents();
    position.value = 'relative'
     positionX.value = `1px`
    positionY.value = `1px`
    nextTick(() => {
  emit('dragUp')
    })
  

}
const startDragEvents = () => {
    document.addEventListener("mousemove", onDrag);
document.addEventListener("touchmove", onDrag);
document.addEventListener("mouseup", endDrag);
document.addEventListener("touchend", endDrag);
}
const endDragEvents = () => {
        document.removeEventListener("mousemove", onDrag);
document.removeEventListener("touchmove", onDrag);
document.removeEventListener("mouseup", endDrag);
document.removeEventListener("touchend", endDrag);
}
useEventListener(rock, 'click', onClick)
useEventListener(rock, "mousedown", startDrag);
useEventListener(rock, "touchstart", startDrag);

onClickOutside(rock, () => emit('deselect'));
</script>