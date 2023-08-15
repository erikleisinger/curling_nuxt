<template>
    <Badge
        :badge="badge"
        :height="height"
        @click="handleClick"
        ref="badgeContainer"
    />
    <Teleport to="body">
        <div
            class="expanded__wrap row"
            :class="{ expanded, shrunk }"
            ref="expandedBadge"
            v-if="showExpanded"
        >
            <div class="inner-badge__container">
                <Badge
                    :badge="badge"
                    class="inner-badge"
                    :height="expandedHeight"
                    v-if="expanded"
                            @click="handleClick"
                />
            </div>
            <h2 class="title text-xl col-grow">{{BADGE_TITLES[badge]}}</h2>
            <div class="subtitle__container">
                <h3 class="text-sm subtitle">{{ BADGE_FORMULAS[badge](raw) }}</h3>
            </div>
            <p class="description">
                {{ BADGE_DESCRIPTIONS[badge] }}
            </p>
        </div>
    </Teleport>
</template>
<style lang="scss" scoped>
$animation-dur: 0.1s;
$inner-animation-dur: $animation-dur * 3;
body {
    .expanded__wrap {
        box-shadow: $pretty-shadow;
        position: absolute;
        top: v-bind(top);

        left: v-bind(left);
        min-height: 75px;
        width: 200px;
        margin: auto;
        background-color: rgba(255, 255, 255, 0.95);
        border: 1px solid $grey-4;
        width: v-bind(width);
        z-index: $z-tooltip;
        transition: all $animation-dur;
        border-top-left-radius: 20px;
        margin-right: var(--space-md);
        border-radius: 16px;

        .inner-badge__container {
            position: relative;
            height: v-bind(expandedHeight);
            width: v-bind(expandedHeight);
            //   float: left;
            .inner-badge {
                animation: grow $inner-animation-dur forwards;
                left: -1em;
                top:-1em;
                height: v-bind(expandedHeight);
                position: absolute;
                position: absolute;
                transition: all 2s;
            }
        }
        .title {
            margin-top: 0.4em;
            margin-bottom: 0.4em;
            margin-left: var(--space-xs);
            font-weight: bold;

        }
        .description {
            margin-bottom: unset;
            padding: var(--space-md);
            padding-top: var(--space-sm);
            font-style: italic;
        }
        .subtitle__container {
            border: 1px solid rgba(0, 0, 0, 0.2);
            margin-top: var(--space-sm);
            margin-left: var(--space-md);
            margin-right: var(--space-md);
            padding: var(--space-xxs);
            border-radius: 8px;
            background-color: rgba(255, 216, 116, 0.5);
            .subtitle {
                text-align: center;
            }
        }

        &.shrunk {
            animation: shrink 0.2s forwards;
            transform-origin: top left;
        }

        &.expanded {
            .inner-badge {
                left: -0.2em;
                top:-0.2em;
            }
        }
    }
}
@keyframes shrink {
    0% {
        transform: scale(1);
    }

    100% {
        transform: scale(0);

    }
}
</style>
<script setup>
import {
    useElementBounding,
    onClickOutside,
    useConfirmDialog,
} from "@vueuse/core";
import { BADGE_DESCRIPTIONS, BADGE_FORMULAS, BADGE_TITLES } from "@/constants/badges";
const props = defineProps({
    badge: String,
    height: {
        type: String,
        default: "2em",
    },
    raw: Number
});

const description = computed(
    () => (text = BADGE_DESCRIPTIONS[props.badge] ?? LOREM_IPSUM)
);

const badgeTitle = computed(() => `"${props.badge}"`);

const expanded = ref(false);

const expand = () => {
    expanded.value = true;
};

const badgeContainer = ref(null);

const { x, y } = useElementBounding(badgeContainer);

const top = computed(() => `calc(${y.value}px`);

const left = computed(() => (expanded.value ? `calc(${x.value}px)` : `100vw`));

const width = computed(() => `min(calc(100vw - ${x.value}px), 300px)`);

const expandedHeight = computed(() => `calc(${props.height} * 2)`);

const expandedBadge = ref(null);
onClickOutside(expandedBadge, () => {
    if (!isRevealed.value) return;
    confirm();
});

const { reveal, confirm, onConfirm, isRevealed, onReveal } = useConfirmDialog();

onReveal(() => {
    expanded.value = true;
});

const shrunk = ref(false);

onConfirm(() => {
    shrunk.value = true;
    setTimeout(() => {
        showExpanded.value = false;
        
        nextTick(() => {
expanded.value = false;
shrunk.value = false;
        })
        
    }, 200)
   
});

const showExpanded = ref(false)

const handleClick = () => {
    showExpanded.value = true;
    setTimeout(() => {
    if (isRevealed.value) {
        confirm();
    } else {
        reveal();
    }
    }, 1)
    
};
</script>
