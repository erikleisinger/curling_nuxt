<template>

        <RockIcon
            ref="rock"
         class="rock row justify-center draggable"
         :style="{position, top: positionY, left: positionX}"
         style="width:15px"
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
import {useEventStore} from '@/store/event'

const emit = defineEmits(['deselect', 'dragging', 'dragUp', 'select'])
const props = defineProps({
    color: String,
    disabled: Boolean,
    selected: Boolean,
    showNumbers: Boolean,
    shotNo: Number,
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
    startDragEvents();

}
 const { x, y } = useMouseInElement()
const onDrag = () => {
    if (props.disabled || !props.selected) return;
    emit('dragging')
    position.value = 'fixed'
    positionX.value = `${x.value}px`
    positionY.value = `${y.value}px`
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