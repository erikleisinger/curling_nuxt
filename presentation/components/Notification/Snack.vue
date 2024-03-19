<template>
    <div class="notification" ref="notification"></div>
</template>
<style lang="scss" scoped>

</style>
<script setup lang="ts">
import type { Notification } from "@/types/notification";
const props = defineProps<{
    notification: Notification;
}>();
const $q = useQuasar();
let activeNotification;

const emit = defineEmits(['delete'])
// const position = $q.screen.xs ? 'top-right' : 'bottom-left'

const setNotification = () => {
    const notificationColor =
        {
            pending: "",
            completed: "positive",
            failed: "negative",
        }[props.notification.state] || "";

        const icon = {
            pending: '',
            completed: 'check',
            failed: 'error_outline'
        }[props.notification.state]


    const notificationToInsert = {
        group: false,
        spinner: props.notification.state === "pending",
        color: notificationColor,
        message: props.notification.text,
        position: 'top-right',
        // icon,
        timeout:
            props.notification.state === "pending"
                ? 0
                : props.notification.timeout,
        progress: true,

        actions:  props.notification.state === 'pending' ? null : [
            { label: 'Dismiss', color: 'white', noDismiss: false }
        ],
        onDismiss: () => {
            emit('delete')
        }

    };
    if (!!activeNotification) {
        activeNotification(notificationToInsert);
    } else {
        activeNotification = $q.notify(notificationToInsert);
    }
};

const notificationParams = computed(() => props.notification);

watch(
    notificationParams,
    () => {
        setNotification();
    },
    { immediate: true, deep: true }
);


</script>
