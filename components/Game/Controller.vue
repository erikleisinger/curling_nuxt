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
          <!-- height:calc(100% - ${scoreBoardHeight}px) -->
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
.wrapper {
  position: relative;
  display: grid;
  grid-template-rows: 1fr;
  grid-column-gap: 0px;
  grid-row-gap: 0px;
  section {
      grid-area: 1 / 1 / 2 / 2;
    }
  .curling-rings__wrap {
    position: relative;
    width: 100%;
    // height: 100%;
    background-color: white;
  }
}
.show {
  height: 81px;
  animation: show 0.5s;
}
.hide {
  height: 0px;
  animation: hide 0.5s;
}

@keyframes show {
  0% {
    height: 0px
  }
  100% {
    height: 81px
  }
}
@keyframes hide {
  0% {
    height: 81px
  }
  100% {
    height: 0px
  }
}


@media all and (min-width: 1000px) {
  .wrapper {
    grid-template-columns: 1fr 2fr;
    section:nth-child(2) {
      grid-area: 1 / 2 / 2 / 3;
    }
  }
}
@media all and (max-width: 1000px) {
  .wrapper {
    grid-template-columns: 1fr;
    section:nth-child(1) {
      grid-area: 1 / 1 / 2 / 2;
    }
  }
}
</style>
<script setup>
import {inject, ref} from "vue";
import {useElementSize, useResizeObserver} from '@vueuse/core'
const $q = useQuasar();
const tab = inject('tab')

const scoreBoard = ref(null)
const scoreBoardHeight = ref(useElementSize(scoreBoard).height)
const showScoreBoard = ref(false)

useResizeObserver(scoreBoard, (entries) => {
      const [entry] = entries;
      const {height} = entry.contentRect;
      scoreBoardHeight.value = height;
      
    })
</script>