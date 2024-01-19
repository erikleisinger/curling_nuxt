<template>
    <div class="full-height relative-position">
        <NotificationListener v-if="userId" @refresh="refresh"/>
        <q-toolbar class="row justify-between items-center header">
            <slot name="menu" />
            <div
                style="
                    position: absolute;
                    left: 0;
                    right: 0;
                    margin: auto;
                    width: fit-content;
                "
                class="row items-center"
            >
                <LogoFull
                    :width="$q.screen.xs ? '75px' : '75px'"
                    class="clickable"
                    @click="navigateTo('/')"
                    id="global-logo"
                />
            </div>
            <div class="row items-center">

                <Button
                    icon="notifications"
                    :flat="!notificationsOpen"
                    round
                    color="mint"
                    :text-color="notificationsOpen ? null : 'white'"
                    @click="toggleNotifications({ open: !notificationsOpen })"
                    :size="$q.screen.xs ? '14px' : '16px'"
                    dense
                    class="q-mr-sm"
                    v-if="hasCompletedTutorial"
                >
                    <transition
                        appear
                        enter-active-class="animated zoomIn"
                        leave-active-class="animated zoomOut"
                    >
                        <q-badge
                            color="red"
                            floating
                            rounded
                            v-if="!!unreadNotificationCount"
                        >
                            {{ unreadNotificationCount }}
                        </q-badge>
                    </transition>
                </Button>
                <div
                    class="relative-position"
                    :style="{
                        width: $q.screen.xs ? '30px' : '35px',
                        height: $q.screen.xs ? '30px' : '35px',
                    }"
                    id="global-rings-menu"
                >
                    <RingsMenu
                        :size="$q.screen.xs ? '30px' : '35px'"
                        class="clickable rings-button"
                        @openFeedback="emit('openFeedback')"
                    />
                </div>
            </div>
        </q-toolbar>
    </div>
</template>
<style lang="scss" scoped>
.header {
    padding: 0px var(--space-xxs);
    padding-right: var(--space-sm);
    @include sm {
        padding-left: var(--space-md);
    }
    background-color: $app-royal-blue;
    &.q-toolbar {
        height: $app-header-height-xs;
        @include sm {
            height: $app-header-height-sm;
        }
    }
}
</style>
<script setup>
import { useDialogStore } from "@/store/dialog";
import {useUserStore} from '@/store/user'
import { useQuery, useQueryClient } from "@tanstack/vue-query";
import { useDebounceFn } from "@vueuse/core";


const emit = defineEmits(['openFeedback'])

const queryClient = useQueryClient();

const { toggleNotifications } = useDialogStore();
const notificationsOpen = computed(() => useDialogStore().notifications.open);

const {user:userId} = useUser()

const getNotificationCount = async () => {
    const client = useSupabaseClient();
    const { count } = await client
        .from("notifications")
        .select("*", { count: "exact", head: true })
        .eq("read", false)
        .eq('profile_id', userId.value)
    return count;
};

const { isLoading, data: unreadNotificationCount } = useQuery({
    queryKey: ["notificationCount"],
    queryFn: getNotificationCount,
});

const refresh = useDebounceFn(() => {
    queryClient.invalidateQueries({
        queryKey: ["notificationCount"],
    });
}, 1000);

const hasCompletedTutorial = computed(() => useUserStore()?.has_completed_tutorial)
</script>
