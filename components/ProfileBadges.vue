<template>
    <transition
        appear
        enter-active-class="animated fadeIn"
    >
        <div class="badge-container row" v-if="false">
            <!-- <ProfileBadge
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
            /> -->
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

</script>
