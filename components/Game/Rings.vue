<template>
<div id="rinkWrapper">
  <div class="rink" id="rink">
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
  </div>
</template>

<style lang="scss" >
.rink {
  background-color: white;
  margin: auto;
  max-width: 100%;
  max-height: 100%;
  left:0;
margin:0;
  aspect-ratio: v-bind(aspectRatio);
  box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px,
    rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;
  overscroll-behavior: contain;
//   border-top: 2px solid rgba(0 0 0 / 20%);
  transform: v-bind(rotation);
  transition: transform 0.3s;
//   transform: v-bind(computedScale);
  width: max-content;
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
      fill: var(--q-primary);
    }
    .ring__inner {
      fill: $rings-red;
    }
  }
}
</style>
<script setup lang="ts">
import {useEventStore} from "@/store/event";
import {PLAYING_AREA_DIMENSIONS, RINGS_HEIGHT_PERCENT, RINGS_WIDTH_PERCENT, RINK_ASPECT_RATIO, TEE_LINE_PERCENT_FROM_TOP} from '@/constants/dimensions'

const props = defineProps({
    rotated: Boolean,
})

const rotation = computed(() => props.rotated ? 'rotate(180deg)' : 'rotate(0deg)')

const emit = defineEmits(['update:modelValue'])

const eventStore = useEventStore();
const isRockSelected = computed(() => eventStore.rockSelected);

/**
 * RINK DIMENSIONS
 */

// Calculate aspect ratio
const aspectRatio = ref(
  `${RINK_ASPECT_RATIO}`
);

// rings dimensions & location from top of total rink

const ringsHeightPercent = ref(`${RINGS_HEIGHT_PERCENT}%`);
const ringsWidthPercent = ref(`${RINGS_WIDTH_PERCENT}%`);

// tee-line location relative to top of rink
const teeLinePercentFromTop = ref(
  `calc(${TEE_LINE_PERCENT_FROM_TOP}% - 0.75px)`
);
</script>
