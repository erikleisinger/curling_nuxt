<template>
    <div class="banner__wrap" v-if="!!bannerText">
      <transition
        appear
        enter-active-class="animated slideInUp"
        leave-active-class="animated slideOutDown"
      >
        <q-banner class="text-white" :class="`bg-${bannerColor}`">
          {{ bannerText }}
          <template v-slot:action>
            <q-btn flat color="white" label="Dismiss" @click="clear"></q-btn>
          </template>
        </q-banner>
      </transition>
    </div>

</template>
<style lang="scss">
.banner__wrap {
  position: fixed;
  bottom: 0;
  width: 100vw;
  z-index: 10000;
}
</style>
<script setup lang="ts">
import {computed} from "vue";
import {useBannerStore} from "@/store/banner";

const store = useBannerStore();
const {clear} = store;
const bannerText = computed(() => store.text);
const bannerColor = computed(() => store.color)
</script>