<template>
    <div>
        
        <slot/>
    <div class="banner__wrap" v-if="bannerText">
       <transition
  appear
  enter-active-class="animated slideInUp"
  leave-active-class="animated slideInDown"
>
    <q-banner class="bg-primary text-white">
        {{bannerText}}
        <template v-slot:action>
        <q-btn flat color="white" label="Dismiss" @click="clear"></q-btn>
      </template>
    </q-banner>
       </transition>
    </div>
    </div>
</template>
<style lang="scss">
    .banner__wrap {
        position: fixed;
        bottom: 0;
        width: 100vw;
        z-index: 1;
    }
</style>
<script setup>
import {computed} from 'vue'
    import {useBannerStore} from '@/store/banner';
    const store = useBannerStore();
    const {clear} = store;
    const bannerText = computed(() => store.text)
</script>