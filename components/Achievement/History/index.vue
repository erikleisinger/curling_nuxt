<template>
    <div ref="historyContainer">
        <div v-if="isLoading || !isOpen">
            <q-item
                style="max-width: 300px"
                v-for="i in Array.from(Array(5).keys())"
                :key="i"
            >
                <q-item-section avatar>
                    <q-skeleton type="QAvatar"></q-skeleton>
                </q-item-section>

                <q-item-section>
                    <q-item-label>
                        <q-skeleton type="text"></q-skeleton>
                    </q-item-label>
                    <q-item-label caption>
                        <q-skeleton type="text" width="65%"></q-skeleton>
                    </q-item-label>
                </q-item-section>
            </q-item>
        </div>
        <div v-else-if="!isLoading && isOpen">
            <transition-group appear tag="div" @enter="onEnter">
            <div
                v-for="(a, i) in notificationsPaginated"
                :key="a.id"
                :data-index="i"
            >
                <!--  -->
                <LazyAchievementHistoryItem :item="a" />

                <q-separator />
            </div>
            </transition-group>
        </div>
        <div
            class="row justify-center show-more__container"
            v-if="!isLoading && notificationsPaginated?.length < notificationCount && isOpen"
        >
            <q-btn flat text color="blue" @click="showMore">Show more</q-btn>
        </div>
        
    </div>
</template>
<style lang="scss" scoped>
.show-more__container {
    padding: var(--space-xs);
}
</style>
<script setup>
import { useUserTeamStore } from "@/store/user-teams";
import { useQuery } from "@tanstack/vue-query";
import { useQueryClient } from "@tanstack/vue-query";
import { useDebounceFn, useParentElement, useScroll } from "@vueuse/core";
import gsap from "gsap";

const queryClient = useQueryClient();

const props = defineProps({
    modelValue: Number,
    open: Boolean,
});

const emit = defineEmits(["update:modelValue"]);

const { user: userId } = useUser();

const initialized = ref(false);

// READ / UNREAD

const unreadCount = computed({
    get() {
        return props.modelValue;
    },
    set(val) {
        emit("update:modelValue", val);
    },
});

const setUnread = (n) => {
    unreadCount.value = [...(n ?? [])]?.filter(({ read }) => !read)?.length;
};

const isOpen = ref(false);

const setOpen = (val) => {
    if (val) {
        setTimeout(() => {
isOpen.value = val;
        }, isSuccess.value ? 0 : 200)
        
    } else {
        isOpen.value = val;
    }
};

// FETCH

const getNotifications = async () => {
    initialized.value = true;
    const client = useSupabaseClient();

    const { data } = await client.rpc("get_user_notifications", {
        profile_id_param: userId.value,
    });

    return data;
};

const { isLoading, data: notifications, isSuccess } = useQuery({
    queryKey: ["notifications", userId.value],
    queryFn: getNotifications,
    refetchOnWindowFocus: false,
    enabled: !initialized.value || props.open,
    select: (val) => {
        setUnread(val);
        return val;
    },
});

// PAGINATION

const CURSOR_INCREMENT = 10;
const cursor = ref(CURSOR_INCREMENT);

const notificationsPaginated = computed(() =>
    [...(notifications.value ?? [])].splice(0, cursor.value)
);
const notificationCount = computed(() => notifications.value?.length);

const showMore = () => {
    if (cursor.value === notificationCount.value) return;
    if (
        notificationsPaginated.value.length + CURSOR_INCREMENT >
        notificationCount.value
    ) {
        cursor.value = notificationCount.value;
    } else {
        cursor.value += CURSOR_INCREMENT;
    }
};

const markUnread = async () => {
    const client = useSupabaseClient();
    await client
        .from("notifications")
        .update({ read: true })
        .in(
            "id",
            [...(notificationsPaginated.value ?? [])].map(({ id }) => id)
        );
};

const onNotificationChange = async (e) => {
    const { new: newData } = e ?? {};
    const { id, read } = newData ?? {};
    if (!id) return;
    const nots = [...notifications.value];
    const index = nots.findIndex(({ id: notId }) => notId === id);
    if (index === -1) return;
    nots.splice(index, 1, {
        ...nots[index],
        read,
    });
    queryClient.setQueryData(["notifications", userId.value], nots);
};

const onNotificationInsert = async (e) => {
    const { new: newData } = e ?? {};
    const { achievement_id, id: notification_id, created_at } = newData ?? {};
    if (!achievement_id) return;
    const client = useSupabaseClient();
    const { data: notification } = await client
        .from("achievements")
        .select(
            `
        name,
        type,
        team:team_id(
            id,
            name,
            avatar_url
        ),
        profile:profile_id(
            id,
            first_name,
            last_name,
            avatar
        ),
        info
    `
        )
        .eq("id", achievement_id)
        .single();
    queryClient.setQueryData(
        ["notifications", userId.value],
        [
            {
                ...notification,
                id: notification_id,
                created_at,
            },
            ...notifications.value,
        ]
    );

    setUnread(notifications.value);
};

const startWebsockets = () => {
    const client = useSupabaseClient();
    client
        .channel("notifications")
        .on(
            "postgres_changes",
            {
                event: "INSERT",
                schema: "public",
                table: "notifications",
                filter: `profile_id=eq.${userId.value}`,
            },
            onNotificationInsert
        )
        .on(
            "postgres_changes",
            {
                event: "UPDATE",
                schema: "public",
                table: "notifications",
                filter: `profile_id=eq.${userId.value}`,
            },
            onNotificationChange
        )
        .subscribe();
};

onMounted(() => {
    startWebsockets();
    setOpen(props.open);
});

const scrollToTop = () => {
    const el = document.querySelector(".popup-container--slot-content");
    el.scrollTop = 0;
};

watch(
    () => props.open,
    (val) => {
        if (!val) {
            // Timeout allows for animation to finish before mutating
            setTimeout(() => {
                markUnread();
                // cursor.value = CURSOR_INCREMENT;
                scrollToTop();
            }, 1000);
        }

        setOpen(val);
    }
);
const historyContainer = ref(null);

const scrollContainer = useParentElement(historyContainer);

const { arrivedState } = useScroll(scrollContainer);

watch(
    () => arrivedState.bottom,
    (val) => {
        if (!val) return;
        showMore();
    }
);

// animate notifications

const onEnter = (el, done) => {
    const toSubtract = CURSOR_INCREMENT;
    gsap.from(el, {
        opacity: 0,
        x: 50,
        duration: 0.2,
        delay:
            (el.dataset.index -
                (el.dataset.index >= CURSOR_INCREMENT ? toSubtract : 0)) *
            0.1,
        onComplete: done,
        ease: "sine",
    });
};
</script>
<script>
export default {
    name: "AchievementHistory",
};
</script>
