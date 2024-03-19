<template>
    <DialogPopup
        :open="notificationsOpen"
        :bottom="!$q.screen.sm"
        :maxHeight="$q.screen.gt.xs ? '600px' : null"
        :maxWidth="$q.screen.xs ? null : '400px'"
        right
        :hideOverlay="!$q.screen.xs"
        @hide="toggleNotifications({ open: false })"
    >
        <template v-slot:header v-if="$q.screen.gt.sm">
            <div class="row justify-between items-center">
                <h1 class="text-md text-bold row justify-between items-center">
                    Notifications
                </h1>
                <q-btn
                    flat
                    round
                    icon="close"
                    @click="toggleNotifications({ open: false })"
                />
            </div>
        </template>
        <AchievementHistory
            :open="notificationsOpen"
            v-model="unreadNotificationCount"
        />
    </DialogPopup>
</template>
<script setup>
import { useDialogStore } from "@/store/dialog";
const dialogStore = useDialogStore();

const { toggleNotifications } = dialogStore;

const $q = useQuasar();

const unreadNotificationCount = ref(0);
const notificationsOpen = computed(() => dialogStore.notifications.open);

const route = useRoute();
const hash = computed(() => route.hash);

watch(
    notificationsOpen,
    (val) => {
        return navigateTo({ ...route, hash: val ? "#notifications"  : null });
    },
    { immediate: true }
);

onMounted(() => {
    if (hash.value === '#notifications') {
        setTimeout(() => {
            dialogStore.toggleNotifications({open: true})
        }, 2000)
    } 
})

watch(hash, () => {
    const open = hash.value === '#notifications';
    dialogStore.toggleNotifications({open})
})
</script>
