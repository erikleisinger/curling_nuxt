<template>
    <div class="notification__handler--wrap">
       <NotificationSnack v-for="notification in Object.entries(notifications)" :key="notification[0]" :notification="notification[1]" @delete="clearNotification(notification[0])" />
    </div>
</template>
<style lang="scss" scoped>
    .notification__handler--wrap {
        z-index: $z-notification;
        position: absolute;
        top: 0;
        left: 0;
        
  
    }
</style>
<script setup>
import {useNotificationStore} from '@/store/notification'

const store = useNotificationStore()
const notifications = computed(() => store.notifications)
const {clearNotification} = store;
</script>