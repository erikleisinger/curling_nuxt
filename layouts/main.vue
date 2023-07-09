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
        <q-btn-group spread flat class="col-grow" role="navigation" aria-label="pages">
            <q-btn flat  to="/"><q-icon name="adjust"/></q-btn>
             <q-btn flat to="/select"><q-icon name="table_view" /></q-btn>
        </q-btn-group>
    </q-toolbar>
    </q-footer>
    <Banner/>
    </q-layout>
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
  const $q = useQuasar();
  const route = useRoute();
  
</script>

