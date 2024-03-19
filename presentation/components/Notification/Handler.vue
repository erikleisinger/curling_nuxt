<template>
    <div class="notification__handler--wrap">
        <NotificationSnack
            v-for="notification in Object.entries(notifications)"
            :key="notification[0]"
            :notification="notification[1]"
            @delete="clearNotification(notification[0])"
        />
    </div>
</template>
<style lang="scss" >
// .notification__handler--wrap {
//     z-index: $z-notification;
//     position: absolute;

//     left: 0;
// }
.q-notifications__list--top {
    top: $app-header-height-xs !important;
    
    @include sm {
        top: $app-header-height-sm !important;
    }
    .q-notification {
        left: 0!important;
        right: 0!important;
        margin-left: auto!important;
        margin-right: auto!important;
    }
}
</style>
<script setup>
import { useNotificationStore } from "@/store/notification";

const store = useNotificationStore();
const notifications = computed(() => store.notifications);
const { clearNotification } = store;
</script>
