<template>
    <transition
        appear
        enter-active-class="animated fadeIn"
    >
        <div class="badge-container row" v-if="badges">
            <ProfileBadge
                badge="showoff"
                v-if="showoff"
                :raw="showoff"
                :height="height"
            />
            <ProfileBadge
                badge="bandit"
                v-if="bandit"
                :raw="bandit"
                :height="height"
            />
            <ProfileBadge
                badge="bulwark"
                v-if="bulwark"
                :raw="bulwark"
                :height="height"
            />
            <ProfileBadge
                badge="minimalist"
                v-if="minimalist"   
                :raw="minimalist"
                :height="height"
            />
            <ProfileBadge
                badge="survivalist"
                v-if="survivor"
                :raw="survivor"
                :height="height"
            />
             <ProfileBadge
                badge="strategist"
                v-if="strategist"
                :raw="strategist"
                :height="height"
            />
        </div>
    </transition>
</template>
<style lang="scss" scoped>
.badge__container {
    height: 2em;
    margin-top: calc(-1 * var(--space-xs));
}
</style>
<script setup>
const props = defineProps({
    height: {
        type: String,
        default: "2em",
    },
    teamId: Number,
});

const badges = computed(() => {
    return (
        !!bandit.value ||
        !!bulwark.value ||
        !!control_freak.value ||
        !!minimalist.value ||
        !!strategist.value ||
        !!survivor.value
    );
});

const bandit = ref(null);
const bulwark = ref(null);
const control_freak = ref(null);
const minimalist = ref(null);
const showoff = ref(null);
const strategist = ref(null);
const survivor = ref(null);
const getBadges = async () => {
    bandit.value = null;
    bulwark.value = null;
    control_freak.value = null;
    minimalist.value = null;
    showoff.value = null;
    strategist.value = null;
    survivor.value = null;
    strategist.value = null;
    const { client, fetchHandler } = useSupabaseFetch();
    const { data } = await fetchHandler(
        () => client.rpc("get_team_statistics").eq("id", props.teamId),
        { onError: "Error fetching game stats." }
    );
    const [stats] = data;

    bandit.value = stats.bandit;
    bulwark.value = stats.bulwark;
    control_freak.value = stats.control_freak;
    minimalist.value = stats.minimalist;
    showoff.value = stats.showoff;
    strategist.value = stats.strategist;
    survivor.value = stats.survivor;
    strategist.value = stats.strategist;
};

onMounted(() => {
    if (!props.teamId) return;
});

watch(
    () => props.teamId,
    (id) => {
        if (!id) return;
        getBadges();
    },
    { immediate: true }
);
</script>
