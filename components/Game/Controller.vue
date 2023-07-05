<template>
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
          <CurlingRings />
        </section>
       
         <InputScore v-if="$q.screen.gt.sm || tab === 'score'"
          id="scorecard"
          key="scorecard"/>
    
      </transition-group>
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
import {computed, inject, provide, watchEffect} from "vue";
import {useGameStore} from '@/store/game'
const $q = useQuasar();
const store = useGameStore();
const tab = inject('tab')
const gamePos = computed(() => {
    const {end, shot} = store;
    return {end, shot}
})
const shot = ref(null)
const {getShot} = store;
watch(gamePos, async (d) => {
    shot.value = await getShot()
}, {deep: true, immediate:true})

provide('editedShot', shot)

const logout = async () => {
  const client = useSupabaseAuthClient();
  await client.auth.signOut();
  return navigateTo("/login");
};
</script>