<template>
    <div ref="historyContainer">

        <div v-for="(a, index) in achievementsPaginated" :key="a.id">
            <LazyAchievementHistoryItem
                :item="a"
                :unread="index < unreadCountVisible"
            />

            <q-separator />
        </div>
        <div class="row justify-center show-more__container" v-if="achievementsPaginated?.length < achievementCount">
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
import {useParentElement, useScroll} from '@vueuse/core'

const queryClient = useQueryClient();

const props = defineProps({
    modelValue: Number,
    open: Boolean,
});

const emit = defineEmits(["update:modelValue"]);

const unreadCount = computed({
    get() {
        return props.modelValue;
    },
    set(val) {
        emit("update:modelValue", val);
    },
});

const unreadCountVisible = ref(0);

const { user: userId } = useUser();

const initialized = ref(false);

const getAchievements = async () => {
    initialized.value = true;
    const teamList = useUserTeamStore().userTeams.map(({ id }) => id);
    const client = useSupabaseClient();

    const { data } = await client
        .from("achievements")
        .select(
            `
        id,
        created_at,
        team:team_id (
            id,
            name,
            avatar_url
        ),
        profile:profile_id (
            id,
            first_name,
            last_name,
            avatar
        ),
        name,
        type,
        info,
        game_id
        `
        )
        .or(`team_id.in.(${teamList}),profile_id.eq.${userId.value}`)
        .order("created_at", { ascending: false });

    getAchievementReads(true);

    return [...(data ?? [])].filter(({ type, team, profile }) => {
        if (type !== "team_request") return true;
        // ensure we don't see team requests sent to another person
        return profile.id === userId.value;
    });
};

const getAchievementReads = async (setVisible = false) => {
    const { user: userId } = useUser();
    const client = useSupabaseClient();

    const { data } = await client
        .from("profile_achievement_junction")
        .select("id")

        .eq("profile_id", userId.value);

    const count = (data ?? [])?.length ?? 0;
    const diff = achievements.value?.length - count;

    unreadCount.value = diff < 0 ? 0 : diff;

    if (setVisible) unreadCountVisible.value = diff < 0 ? 0 : diff;

    return (data ?? []).length;
};

const { isLoading, data: achievements } = useQuery({
    queryKey: ["achievements", userId.value],
    queryFn: getAchievements,
    refetchOnWindowFocus: false,
    enabled: !initialized.value || props.open,
});

const CURSOR_INCREMENT = 10;
const cursor = ref(CURSOR_INCREMENT)

const achievementsPaginated = computed(() => [...(achievements.value ?? [])].splice(0, cursor.value))
const achievementCount = computed(() => achievements.value?.length)

const showMore = () => {
    if (achievementsPaginated.length + CURSOR_INCREMENT > achievementCount.length) {
        cursor.value = achievementCount.length
    } else {
        cursor.value += CURSOR_INCREMENT
    }
}

const markUnread = async () => {
    if (unreadCount.value === 0) return;
    const { user: userId } = useUser();
    const client = useSupabaseClient();
    await client.from("profile_achievement_junction").upsert(
        [...achievements.value].splice(0, unreadCount.value).map((a) => ({
            achievement_id: a.id,
            profile_id: userId.value,
        })),
        { onConflict: ["profile_id", "achievement_id"] }
    );
    getAchievementReads(false);
};

const startWebsockets = () => {
    const teamList = useUserTeamStore()
        .userTeams.map(({ id }) => id)
        .join(", ");
    const client = useSupabaseClient();
    client
        .channel("achievements")
        .on(
            "postgres_changes",
            {
                event: "INSERT",
                schema: "public",
                table: "achievements",
                filter: `profile_id=eq.${userId.value}`,
            },
            () => {
                queryClient.invalidateQueries({
                    queryKey: ["achievements", userId.value],
                });
            }
        )
        .on(
            "postgres_changes",
            {
                event: "INSERT",
                schema: "public",
                table: "achievements",
                filter: `team_id=in.(${teamList})`,
            },
            () => {
                queryClient.invalidateQueries({
                    queryKey: ["achievements", userId.value],
                });
            }
        )
        .subscribe();
};

onMounted(() => {
    getAchievements();
    startWebsockets();
});

watch(
    () => props.open,
    (val) => {
        if (!val) {
            unreadCountVisible.value = 0;
            unreadCount.value = 0;
            cursor.value = CURSOR_INCREMENT
        } else {
            markUnread();
        }
    }
);

const historyContainer = ref(null);

const scrollContainer = useParentElement(historyContainer)

const {arrivedState} = useScroll(scrollContainer)

watch(() => arrivedState.bottom, (val) => {
    if (!val) return;
    showMore();
})

</script>
<script>
export default {
    name: "AchievementHistory",
};
</script>
