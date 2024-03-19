<template>
    <div
        class="badge__container bordered"
        @click="onClick"
        :class="{
            highlight,
            [BADGE_BACKGROUNDS[badge.name]]: highlight,
            'icon-only clickable': iconOnly,
        }"
    >
        <div class="underlay">
            <slot name="underlay" />
        </div>
                <BadgeIcon
                    :height="iconOnly ? iconHeight : $q.screen.xs ? '6em' : '8em'"
                    class="badge-icon"
                    :badge="badge"
                    style="margin: auto"
                />
        <div v-if="!iconOnly" class="q-mt-sm">
                <h2 class="text-md  text-center">{{ BADGE_NAMES[badge.name] }}</h2>
            </div>
        <div class="text-sm badge-description text-center text-italic" v-if="!iconOnly">
            {{ getBadgeDescription(badge) }}
        </div>
        <div class="row no-wrap justify-end" v-if="!iconOnly">
            <div
                v-if="!iconOnly && typeof badge.team_id === 'object'"
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
                v-else-if="!iconOnly && showTeam && !!badge.team_id"
            >
                <TeamAvatar :teamId="badge.team_id" viewable />
            </div>
            <div class="text-xs text-right" v-if="showTime">
                {{ toTimezone(badge.created_at, null, false, true).fromNow() }}
            </div>
        </div>
        <BadgeInfoPopup :badge="badge" v-model="showMore" />
    </div>
</template>
<style lang="scss" scoped>
.badge__container {
    position: relative;
    cursor: pointer;
    padding: var(--space-xs);
    border-radius: 8px;
    height: min-content;
    max-width: v-bind(width);
    min-width: v-bind(width);
    box-sizing: border-box;
    &.icon-only {
        background-color: transparent;
        max-width: unset;
        min-width: unset;
        display: block !important;
        padding: unset;
        
        border-radius: 50%;
       
    }

    &:not(.icon-only) {
        .icon-container {
            margin-bottom: var(--space-sm);
            .badge-icon {
                margin: auto;
            }
        }
    }

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
        letter-spacing: -0.05em;
        font-size: 2em;

        font-weight: bold;
        color: rgba(0, 0, 0, 0.07);
    }
}
</style>

<script setup>
import {
    BADGE_NAMES,
    BADGE_BACKGROUNDS,
    BADGE_COLORS,
} from "@/presentation/constants/badges";

const props = defineProps({
    badge: Object,
    canView: {
        type: Boolean,
        default: true,
    },
    highlight: Boolean,
    iconHeight: {
        type: String,
        default: '2em'
    },
    iconOnly: Boolean,
    showTeam: Boolean,
    showTime: Boolean,
    width: {
        type: String,
        default: "100%",
    },
});
const { toTimezone } = useTime();
const showMore = ref(false);

const {getBadgeDescription} = useBadge();


const gridRows = computed(() =>
    props.showTeam ? "2.5em 3.7em 1em" : "2.5em 3.7em"
);

const onClick = () => {
    if (!props.canView) return;
    showMore.value = true;
};
</script>
<script>
export default {
    name: "Badge",
};
</script>
