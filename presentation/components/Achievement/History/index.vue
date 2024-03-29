<template>
    <div ref="historyContainer">
        <div v-if="isLoading || !isOpen">
            <q-item
                style="max-width: 300px"
                v-for="i in Array.from(Array(6).keys())"
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
        
            <div
                v-for="(a, i) in notificationsPaginated"
                :key="a.id"
                :data-index="i"
            >
                <AchievementHistoryItem :item="a" />

                <q-separator />
            </div>
     
        </div>
        <div
            class="row justify-center show-more__container"
            v-if="!isLoading && isSuccess && notificationsPaginated?.length < notificationCount && isOpen"
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
import { useQuery } from "@tanstack/vue-query";
import {  useParentElement, useScroll } from "@vueuse/core";

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
    // initialized.value = true;
    const client = useSupabaseClient();

    const { data } = await client.rpc("get_user_notifications", {
        profile_id_param: userId.value,
    });

    return data;
};

const {open} = toRefs(props)

const { isLoading, data: notifications, isSuccess } = useQuery({
    queryKey: ["notifications", userId.value],
    queryFn: getNotifications,
    refetchOnWindowFocus: false,
    // enabled: !initialized.value || props.open,
    enabled: open,
    select: (val) => {
        setUnread(val);
        setTimeout(() => {
            initialized.value = true;
        }, 1000)
        return val;
    },
});

// PAGINATION

const CURSOR_INCREMENT = 12;
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

const markAsRead = async (nots) => {
    const client = useSupabaseClient();
    await client
        .from("notifications")
        .update({ read: true })
        .in(
            "id",
            [...(nots ?? [])].filter(({read}) => !read).map(({ id }) => id)
        );
};



onMounted(() => {
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
           markAsRead(notificationsPaginated.value);
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
        if (!val || !initialized.value) return;
        showMore();
    }
);
</script>
<script>
export default {
    name: "AchievementHistory",
};
</script>
