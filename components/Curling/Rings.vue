<template>
  <div class="rink">
    <slot v-bind:scale="scale"/>
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
  aspect-ratio: v-bind(aspectRatio);
  box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;
  overscroll-behavior: contain;
  border-top: 2px solid rgba(0 0 0 / 20%);
  transform: v-bind(computedScale);
  &:before {
    content: "";
    top: v-bind(teeLinePercentFromTop);
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
    height: v-bind(ringsHeightPercent);
    width: v-bind(ringsWidthPercent);
    margin: auto;
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
// Mobile pinch to zoom in / zoom out
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

const computedScale = computed(() => `scale(${scale.value})`)
const PLAYING_AREA_DIMENSIONS = {x: 180, y: 324};

// Calculate aspect ratio
const aspectRatio = ref(`${PLAYING_AREA_DIMENSIONS.x}/${PLAYING_AREA_DIMENSIONS.y}`)

// Calculate rings dimensions & location from top of total rink

const ringsHeightPercent = ref(`${144 / PLAYING_AREA_DIMENSIONS.y * 100}%`)
const ringsWidthPercent = ref(`${144 / PLAYING_AREA_DIMENSIONS.x * 100}%`)

// Calculate tee-line location relative to top of rink

const TEE_LINE_LOCATION_FROM_TOP_INCHES = 72;
const teeLinePercentFromTop = ref(`${(TEE_LINE_LOCATION_FROM_TOP_INCHES) / PLAYING_AREA_DIMENSIONS.y * 100}%`)
</script>