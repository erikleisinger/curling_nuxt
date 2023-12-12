<template>
<div>
    <h1
        class="text-md text-bold row justify-between items-center notifications__header"
    >
        Notifications
    </h1>
    <q-separator />
    <div v-for="a in achievements" :key="a.id">
        <AchievementHistoryItem :item="a" />

        <q-separator />
    </div>
</div>
</template>
<style lang="scss" scoped>
.notifications__header {
    padding: var(--space-sm);
}
</style>
<script setup>
import { useUserTeamStore } from "@/store/user-teams";
import { useQuery } from "@tanstack/vue-query";

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

const { user: userId } = useUser();

const initialized = ref(false)

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

        getAchievementReads();



    return data.filter(({ type, team, profile }) => {
        if (type !== "team_request") return true;
        // ensure we don't see team requests sent to another person
        return profile.id === userId.value;
    });
};


const getAchievementReads = async () => {
    const { user: userId } = useUser();
    const client = useSupabaseClient();

    const { data } = await client
        .from("profile_achievement_junction")
        .select("id")

        .eq("profile_id", userId.value)
    
    const count = (data ?? [])?.length ?? 0;
    const diff = achievements.value?.length - count

    unreadCount.value = diff < 0 ? 0 : diff;

    return (data ?? []).length;
};


const { isLoading, data: achievements } = useQuery({
    queryKey: ["achievements", userId.value],
    queryFn: getAchievements,
    enabled: !initialized.value || props.open
});



const markUnread = async () => {
    if (unreadCount.value === 0) return;
    const { user: userId } = useUser();
    const client = useSupabaseClient();
    await client.from('profile_achievement_junction').upsert(achievements.value.map((a) => ({
        achievement_id: a.id,
        profile_id: userId.value
    })))
    getAchievementReads();
}

onMounted(() => {
    getAchievements();
})

watch(() => props.open, (val) => {
    if (!val) return;
    markUnread();
})

</script>
<script>
export default {
    name: "AchievementHistory",
};
</script>
