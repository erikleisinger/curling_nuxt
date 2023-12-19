<template>
    <div class="badge__container bordered" @click="onClick" :class="{highlight, [BADGE_BACKGROUNDS[badge.name]]: highlight}">
        <div class="underlay">
            <slot name="underlay"/>
        </div>
        <div class="row no-wrap items-center q-mb-sm">
            <div class="relative-position">
                <BadgeIcon height="2em" class="q-mr-sm" :badge="badge.name" />
            </div>
            <div>
                <h2 class="text-sm text-bold">{{ BADGE_NAMES[badge.name] }}</h2>
            </div>
        </div>
        <div class="text-sm badge-description">
            {{ BADGE_DESCRIPTIONS[badge.name] }}
        </div>
        <div class="row no-wrap justify-end">
            <div
                v-if="typeof badge.team_id === 'object'"
                class="row flex-grow-1 h-100"
            >
                <div
                    v-for="teamId in badge.team_id"
                    :key="teamId"
                    class="avatar-container"
                >
                    <TeamAvatar :teamId="teamId" viewable />
                </div>
            </div>
            <div
                class="avatar-container"
                v-else-if="showTeam && !!badge.team_id"
            >
                <TeamAvatar :teamId="badge.team_id" viewable />
            </div>
            <div class="text-xs text-right" v-if="showTime">
                {{ toTimezone(badge.created_at, null, false, true).fromNow() }}
            </div>
        </div>
           <BadgeInfoPopup :badge="badge" v-model="showMore"/>
    </div>

</template>
<style lang="scss" scoped>
.badge__container {
    position: relative;
    cursor: pointer;
    display: grid;
    grid-template-rows: v-bind(gridRows);
    padding: var(--space-xs);
    border-radius: 8px;
    background-color: rgba(0, 0, 0, 0.015);
    height: min-content;
    max-width: v-bind(badgeWidth);
    min-width: v-bind(badgeWidth);
    box-sizing: border-box;

    &.highlight {
        border: 4px solid;
        box-shadow: $pretty-shadow;
    }
    @include sm {
        max-width: v-bind(badgeWidth);
        min-width: v-bind(badgeWidth);
    }
    .badge-description {
        min-height: 2em;
    }
    .avatar-container {
        width: 1em;
        margin-right: var(--space-xs);
    }
    .underlay {
        position: absolute;
        z-index: 0;
        text-transform: uppercase;
        top: calc(-1 * var(--space-xxxs)); 
        letter-spacing: 0em;
        font-size: 2em;

        font-weight: bold;
        color: rgba(0,0,0,0.07)
           }
}





</style>

<script setup>
import { BADGE_NAMES, BADGE_DESCRIPTIONS, BADGE_BACKGROUNDS, BADGE_COLORS } from "@/constants/badges";

const props = defineProps({
    badge: Object,
    canView: {
        type: Boolean,
        default: true,
    },
    highlight: Boolean,
    showTeam: Boolean,
    showTime: Boolean,
    width: {
        type: String,
        default: "150px",
    },
});
    const { toTimezone } = useTime();
const showMore = ref(false);

const badgeWidth = computed(() => `min(50%, ${props.width})`);


const gridRows = computed(() => props.showTeam ? '2.5em 3.7em 1em' : '2.5em 3.7em');

const onClick = () => {
    if (!props.canView) return;
    showMore.value = true;
}

</script>
<script>
export default {
    name: "Badge",
};
</script>
