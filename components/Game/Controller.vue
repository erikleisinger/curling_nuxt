<template>
   <KeepAlive>
    <transition-group
        appear
        :enter-active-class="`animated ${tab === 'rings' ? 'slideInLeft' : 'slideInRight'}`"
        :leave-active-class="`animated ${tab === 'rings' ? 'slideOutRight' : 'slideOutLeft'}`"
      >
   
        <section
          v-if="$q.screen.gt.sm || tab === 'rings'"
          id="rings"
          key="rings"
          class="column justify-cente no-wrap"
        >
     
          <ScoreBoard ref="scoreBoard"  :class="showScoreBoard ? 'show' : 'hide'" v-if="$q.screen.lt.md"/>

        <div :style="`position:relative; width: 100%;  `" class=" col-grow curling-rings__wrap "> 
          <CurlingRockController >
            <template v-slot:buttons>
   <button @click="showScoreBoard = !showScoreBoard" v-if="$q.screen.lt.md">SB</button>
            </template>
          </CurlingRockController>  
          </div>
        </section>
        <section v-if="$q.screen.gt.sm || tab === 'score'"
          id="scorecard"
          key="scorecard" class="column">
        <ScoreBoard v-if="$q.screen.gt.sm"/>
         <InputScore />
         </section>

      </transition-group>
            </KeepAlive>
</template>
<style lang="scss">
#rings {
    overscroll-behavior-y: v-bind('overscroll');
}
</style>
<script setup>
import {inject, ref} from "vue";
import {useElementSize, useResizeObserver, useSwipe} from '@vueuse/core'
const $q = useQuasar();
const tab = inject('tab')
const wow = ref(null)

const overscroll = 'contain'

const scoreBoard = ref(null)
const scoreBoardHeight = ref(useElementSize(scoreBoard).height)
const showScoreBoard = ref(false)

useResizeObserver(scoreBoard, (entries) => {
      const [entry] = entries;
      const {height} = entry.contentRect;
      scoreBoardHeight.value = height;
      
    })

const {direction} = useSwipe(document.querySelector('body'), {threshold: 100, onSwipeEnd: (e) => {
 
  if (Array.from(e.target.classList).includes('rock')) return;
  console.log(direction)
   if (direction.value === 'right') {
    console.log('LEFT');
    tab.value = 'rings';
   }
   if (direction.value === 'left') {
    console.log('RIGHT');
    tab.value = 'score'
   }
}})
</script>