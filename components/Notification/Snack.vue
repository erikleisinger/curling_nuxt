<template>
    <div class="notification"></div>
</template>
<style lang="scss" scoped></style>
<script setup lang="ts">
import { Notification } from "@/types/notification";
const props = defineProps<{
    notification: Notification;
}>();
const $q = useQuasar();
let activeNotification;

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
        position: "top-right",
        icon,
        timeout:
            props.notification.state === "pending"
                ? 0
                : props.notification.timeout,
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
