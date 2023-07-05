<template>
  <div class="window-height window-width column">
    <q-toolbar class="bg-purple text-white">
      <q-space />
      <q-btn flat round dense @click="logout">
        <q-icon name="logout"></q-icon>
      </q-btn>
    </q-toolbar>
    <q-toolbar class="bg-purple text-white" v-if="$q.screen.lt.md">
      <q-tabs v-model="tab">
        <q-tab label="Rings" name="rings" />
        <q-tab label="Score" name="score" />
      </q-tabs>
    </q-toolbar>
    <main class="col-grow wrapper">
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
        <section
          class="bg-blue"
          v-if="$q.screen.gt.sm || tab === 'score'"
          id="scorecard"
          key="scorecard"
        >
          COL 2
        </section>
      </transition-group>
    </main>
  </div>
</template>
<style lang="scss">
body,
html {
  height: 100%;
  width: 100%;
  margin: 0;
}
#__nuxt {
  height: inherit;
}
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
import {ref, computed, watch} from "vue";

definePageMeta({
  middleware: "game",
});

const $q = useQuasar();

const selection = ref(null);
const loading = ref(false);
const tab = ref("rings");

const setLoading = (bool) => {
  loading.value = bool;
};

const updateValue = (table) => {
  selection.value = table;
};

const logout = async () => {
  const client = useSupabaseAuthClient();
  await client.auth.signOut();
  return navigateTo("/login");
};
</script>
