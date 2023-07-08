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
    </q-layout>
</template>
<script setup>
  const $q = useQuasar();
  const route = useRoute();
  
</script>

