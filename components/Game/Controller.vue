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
     
          <GameScoreboard ref="scoreBoard"  :class="showScoreBoard ? 'show' : 'hide'" v-if="$q.screen.lt.md" :style="{zIndex: showScoreBoard ? 1 : 0}" />

        <div :style="`position:relative; width: 100%;  `" class=" col-grow curling-rings__wrap "> 
          <RockController >
            <template v-slot:buttons>
   <q-btn size="md" round @click="showScoreBoard = !showScoreBoard" v-if="$q.screen.lt.md"  color="white"><q-icon name="o_scoreboard" size="sm" color="primary"/></q-btn>
            </template>
          </RockController>  
          </div>
        </section>
        <section v-if="$q.screen.gt.sm || tab === 'score'"
          id="scorecard"
          key="scorecard" class="column">
        <GameScoreboard v-if="$q.screen.gt.sm"/>
         <InputScore />
         </section>

      </transition-group>
            </KeepAlive>
</template>
<style lang="scss">
#rings {
    overscroll-behavior-y: v-bind('overscroll');
}
.show {
    height: 81px;
    animation: show 0.5s;
}
.hide {
    height: 0px;
    animation: hide 0.5s;
    overflow:hidden;
}

@keyframes show {
    0% {
        height: 0px;
    }
    100% {
        height: 81px;
    }
}
@keyframes hide {
    0% {
        height: 81px;
    }
    100% {
        height: 0px;
    }
}
</style>
<script setup>
import {inject, ref} from "vue";
import {useElementSize, useResizeObserver} from '@vueuse/core'
const $q = useQuasar();
const tab = inject('tab')
const overscroll = 'contain'
const scoreBoard = ref(null)
const scoreBoardHeight = ref(useElementSize(scoreBoard).height)
const showScoreBoard = ref(false)
useResizeObserver(scoreBoard, (entries) => {
      const [entry] = entries;
      const {height} = entry.contentRect;
      scoreBoardHeight.value = height;
      
    })

</script>