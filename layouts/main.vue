<template>
     <q-layout class="column">
      <q-header elevated class="bg-primary text-white" height-hint="98">
         <slot name="header"/>
      </q-header>
    <q-page-container class="col-grow wrapper" style="overflow:hidden" role="main">
        <slot/>
    </q-page-container>
    <q-footer elevated  v-if="$q.screen.lt.md">
        <slot name="footer"/>
                <q-toolbar class="bg-primary text-white q-px-none" v-if="$q.screen.lt.md">
        <q-btn-group spread flat class="col-grow">
            <q-btn flat  to="/"><q-icon name="adjust"/></q-btn>
             <q-btn flat to="/select"><q-icon name="table_view" /></q-btn>
        </q-btn-group>
    </q-toolbar>
    </q-footer>
    </q-layout>
</template>
<style lang="scss">
.wrapper {
  position: relative;
  display: grid;
  grid-template-rows: 1fr;
  grid-column-gap: 0px;
  grid-row-gap: 0px;
  grid-template-columns: 1fr;
  &:has(> section:nth-child(2)) {
  grid-template-columns: 1fr 2fr;
  }
  section {
    grid-area: 1 / 1 / 2 / 2;
    &:nth-child(2) {
        grid-area: 1 / 2 / 2 / 3;
    }
  }
  .curling-rings__wrap {
    position: relative;
    width: 100%;
    height: 100%;
    background-color: white;
  }
}
</style>
<script setup>
  const $q = useQuasar();
  const route = useRoute();
  
</script>

