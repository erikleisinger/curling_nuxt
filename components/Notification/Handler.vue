<template>
    <div class="notification__handler--wrap">
       <NotificationSnack v-for="notification in Object.entries(notifications)" :key="notification[0]" :notification="notification[1]" />
    </div>
</template>
<style lang="scss" scoped>
    .notification__handler--wrap {
        height: calc(100 * var(--vh, 1vh));
        width: 100%;
        z-index: 10000001;
        position: absolute;
        top: 0;
        left: 0;
        pointer-events: none;
  
    }
</style>
<script setup>
import {useNotificationStore} from '@/store/notification'

const store = useNotificationStore()
const notifications = computed(() => store.notifications)
</script>