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
          <q-tab
            label="Games"
            name="games"
            aria-controls="games"
            tabindex="0"
          />
          <q-tab
            label="Teams"
            name="teams"
            aria-controls="teams"
            tabindex="0"
          />
          <q-tab
            label="Players"
            name="players"
            aria-controls="players"
            tabindex="0"
          />
        </q-tabs>
      </q-toolbar>
    </template>
    <transition-group
      appear
      :enter-active-class="`animated ${
        tab === 'games' ? 'slideInLeft' : 'slideInRight'
      }`"
      :leave-active-class="`animated ${
        tab === 'games' ? 'slideOutRight' : 'slideOutLeft'
      }`"
    >
      <section class="column" v-if="tab === 'games'" key="games">
        <TableGame />
      </section>
      <section class="column" v-else-if="tab === 'teams'" key="teams">
             <TableGame />
      </section>
      <section class="column" v-else-if="tab === 'players'" key="players">

           <TablePlayers />
      </section>
    </transition-group>
  </NuxtLayout>
</template>
<style lang="scss">
.rock__icon {
  position: relative;
  &:after {
    content: "";
    height: 50%;
    width: 50%;
    background-color: rgba(0, 0, 0, 0.6);
    position: absolute;
    z-index: -1;
    border-radius: 50%;
  }
}
</style>
<script setup>

const tab = ref("games");
</script>
