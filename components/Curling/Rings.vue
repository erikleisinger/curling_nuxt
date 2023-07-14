<template>
  <div class="rink" ref="rink" :style="`transform: scale(${scale})`">
    <slot />
    <div class="rings__wrapper">
      <svg height="100%" width="100%">
        <circle cx="50%" cy="50%" r="50%" class="ring__outer" />
        <circle cx="50%" cy="50%" r="33%" style="fill: white" />
        <circle cx="50%" cy="50%" r="16.67%" class="ring__inner" />
        <circle cx="50%" cy="50%" r="5%" style="fill: white" />
      </svg>
    </div>
  </div>
</template>

<style lang="scss">
.rink {
  background-color: white;
  position: absolute;
  margin: auto;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  max-width: 100%;
  max-height: 100%;
  aspect-ratio: 0.54/1;
  box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;
  overscroll-behavior: contain;
  &:before {
    content: "";
    top: 24%;
    width: 100%;
    height: 2px;
    background-color: rgb(0 0 0 / 20%);
    display: block;
    position: absolute;
  }
  &:after {
    content: "";
    height: 100%;
    width: 2px;
    margin: auto;
    background-color: rgb(0 0 0 / 20%);
    display: block;
    position: absolute;
    left: 0%;
    right: 0%;
    top: 0;
  }
  .rings__wrapper {
    height: 41.62%;
    width: 77%;
    margin: auto;
    margin-top: 6.35%;
    .ring__outer {
      fill: var(--q-primary)
    }
    .ring__inner {
      fill: $rings-red
    }
  }
}
</style>
<script setup>
import {useEventListener} from "@vueuse/core";

const rink = ref(null)

const isPinching = ref(false)
const initialPinch = ref(0)

const scale = ref(1)

const pinchStart = (e) => {
  if (e.touches.length !== 2) return;
  isPinching.value = true;
  initialPinch.value = Math.hypot(
    e.touches[0].pageX - e.touches[1].pageX,
    e.touches[0].pageY - e.touches[1].pageY)
}

const pinchMove = (e) => {
  if (!isPinching.value) return;
  if (e.touches.length !== 2) return;
  const currentTouches =  Math.hypot(
    e.touches[0].pageX - e.touches[1].pageX,
    e.touches[0].pageY - e.touches[1].pageY)
// if (currentTouches - initialPinch.value < 20) return;
const isZoomIn = currentTouches - initialPinch.value > 0;
if (Math.abs(currentTouches - initialPinch.value) < 30) return;
const toAdd = Math.abs(currentTouches - initialPinch.value) / 1000;
if (isZoomIn) {

  scale.value += toAdd
} else {
  if(scale.value - toAdd >= 1) scale.value -= toAdd
 
}

}

const pinchEnd = (e) => {
  isPinching.value = false
}

useEventListener(document, "touchstart", pinchStart);
useEventListener(document, "touchmove", pinchMove);
useEventListener(document, "touchend", pinchEnd);
</script>