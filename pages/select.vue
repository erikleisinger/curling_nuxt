<template>
  <NuxtLayout name="main">
    <template v-slot:header>
      <q-toolbar
        class="bg-primary text-white q-px-none"
        v-if="$q.screen.lt.md"
        role="navigation"
      >
        <q-tabs
          v-model="tab"
          inline-label
          outside-arrows
          mobile-arrows
          class="col-grow"
        >
        <q-tab v-for="tab in TABS" :key="tab.value" :name="tab.value" tabindex="0" :aria-controls="tab.value" :label="tab.label"/>
        </q-tabs>
      </q-toolbar>
    </template>
    <transition-group
      appear
      :enter-active-class="`animated ${
        enterAnimation
      }`"
      :leave-active-class="`animated ${
        leaveAnimation
      }`"
    >
      <section class="column" v-if="tab === TAB_VALUES.GAMES" key="games">
        <TableGame />
      </section>
      <section class="column" v-else-if="tab === TAB_VALUES.TEAMS" key="teams">
             <TableTeams />
      </section>
      <section class="column" v-else-if="tab === TAB_VALUES.PLAYERS" key="players">

           <TablePlayers />
      </section>
       <section class="column" v-else-if="tab === TAB_VALUES.SHOT_TYPES" key="shotTypes">

           <TableShotTypes />
      </section>
        <section class="column" v-else-if="tab === TAB_VALUES.RINKS" key="rinks">

           <TableRinks />
      </section>
       <section class="column" v-else-if="tab === TAB_VALUES.SHEETS" key="sheets">

           <TableSheets />
      </section>
    </transition-group>
  </NuxtLayout>
</template>
<script setup>
import {useRefHistory} from '@vueuse/core'

const TABS = [
  {
    label: 'Games',
    value: 0
  },
  {
    label: 'Teams',
    value: 1
  },
  {
    label: 'Players',
    value: 2
  },
  {
    label: 'Shot types',
    value: 3
  },
    {
    label: 'Rinks',
    value: 4
  },
     {
    label: 'Sheets',
    value: 5
  },

]

const TAB_VALUES = {
  GAMES: 0,
  TEAMS: 1,
  PLAYERS: 2,
  SHOT_TYPES: 3,
  RINKS: 4,
  SHEETS: 5,
}

const tab = ref(0);
const {history: tabHistory} = useRefHistory(tab);

const enterAnimation = ref('slideInLeft')
const leaveAnimation = ref('slideOutRight')

watch(tab, (newTab) => {
  const {snapshot: lastTab} = tabHistory.value[1] || {}
  const goingRight = lastTab - newTab < 1;
  if (goingRight) {
    enterAnimation.value = 'slideInRight'
    leaveAnimation.value = 'slideOutLeft'
  } else {

    enterAnimation.value = 'slideInLeft'
    leaveAnimation.value = 'slideOutRight'
  }
})
</script>
