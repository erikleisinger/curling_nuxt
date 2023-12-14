<template>
    <div class="badge__container">
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
        <div class="text-xs text-right">
            {{ toTimezone(badge.created_at, null, false, true).fromNow() }}
        </div>
    </div>
</template>
<style lang="scss" scoped>
.badge__container {
    display: grid;
    grid-template-rows: 2.5em 2.5em 1em;
    padding: var(--space-xs);
    border-radius: 8px;
    background-color: rgba(0, 0, 0, 0.015);
    height: min-content;
    max-width: min(50%, 150px);
    min-width: min(50%, 150px);
    .badge-description {
        min-height: 2em;
    }

}
</style>
<script setup>
import { BADGE_NAMES, BADGE_DESCRIPTIONS } from "@/constants/badges";
const props = defineProps({
    badge: Object,
});

const { toTimezone } = useTime();
</script>
<script>
export default {
    name: "Badge",
};
</script>
