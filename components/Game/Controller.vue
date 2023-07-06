<template>
   <KeepAlive>
    <transition-group
        appear
        enter-active-class="animated slideInLeft"
        leave-active-class="animated slideInRight"
      >
   
        <section
          v-if="$q.screen.gt.sm || tab === 'rings'"
          id="rings"
          key="rings"
          class="curling-rings__wrap"
        >
          <CurlingRockController />
        </section>
       
         <InputScore v-if="$q.screen.gt.sm || tab === 'score'"
          id="scorecard"
          key="scorecard"/>

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
    height: 100%;
    background-color: white;
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
import {inject} from "vue";
const $q = useQuasar();
const tab = inject('tab')
</script>