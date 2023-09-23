<template>
    <div
        class="attribute__container column"
        ref="attribute"
        :class="{ highlight: expanded, clickable }"
        :style="styleObj"
        @click="onClick"
       
    >
        <div  >
            <div class="row no-wrap items-center">
                <!-- <q-icon size="1em" :name="icon" :color="color" /> -->
                <h3 class="text-sm truncate-text">{{ title }}</h3>
            </div>
            <div class="row">
                <div class="text-xxxl text-bold value row">
                    <slot />
                    <span v-if="expanded">
                        <slot name="contentExpanded" />
                    </span>
                </div>
                <div class="text-sm row items-center q-ml-sm">
                    <slot name="extra" />
                </div>
            </div>
        </div>
        <div class="bar" v-if="showPercent" />

        <slot name="tooltip" />
    </div>
</template>
<style lang="scss" scoped>
.attribute__container {
    padding: var(--space-xs);
    padding-left: var(--space-sm);
    background-color: rgba(0, 0, 0, 0.015);
    // border: 1px solid $grey-4;
    border-radius: 16px;
    margin-bottom: var(--space-sm);
    height: fit-content;
    transition: width 0.2s;
    min-width: 150px;
    color: #36454f;
    border: 2px solid;
    border-color: rgba(0, 0, 0, 0.015);

    transition: all 0.2s;
    &.clickable {
        &:hover {
            transform: scale(1.05);
            border-color: $amber;
        }
    }

    .q-icon {
        margin-right: var(--space-xxs);
    }
    .value {
    }
    &.highlight {
        border: v-bind(highlightBorder);
    }
    .bar {
        height: 0.4em;
        width: 100%;
        background-color: rgba(0, 0, 0, 0.1);
        border-radius: 4px;
        position: relative;
        &:after {
            content: "";
            height: 100%;
            width: v-bind(statPercent);
            border-radius: inherit;
            position: absolute;
            top: 0;
            left: 0;
            background-color: $amber;
        }
    }
}
</style>

<script setup>
import {onClickOutside} from '@vueuse/core'
const props = defineProps({
    color: String,
    expandable: Boolean,
    icon: String,
    showPercent: Boolean,
    percent: Number,
    title: String,
    clickable: Boolean,
});

const $q = useQuasar();

const expanded = ref(false);

const statPercent = computed(() => `${props.percent}%`);

const styleObj = computed(() => {
    return {
        width: expanded.value ? "90%" : "",
        cursor: props.clickable ? "pointer" : "",
    };
});
const { getColor } = useColor();
const highlightBorder = `2px solid ${getColor(props.color)}`;

const clicked = ref(false);

const onClick = () => {
    if (!props.clickable) return;

    if ($q.platform.is.mobile && !clicked.value) {
        clicked.value = true;
        return;
    }
    clicked.value = false;
    const event = new CustomEvent("teamAttributeClick", {
        detail: {
            name: props.title,
        },
    });

    window.dispatchEvent(event);
};

const attribute = ref(null);
onClickOutside(attribute, () => {
    clicked.value = false;
})
</script>
<script>
export default {
    name: "TeamAttribute",
};
</script>
