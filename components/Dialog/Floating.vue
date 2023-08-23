<template>
    <Teleport to="body">
        <div class="outer__container" ref="container">
            <div class="pretty-shadow inner__container">
                <q-inner-loading
                    :showing="loading"
                    color="primary"
                    size="3em"
                    class="z-top"
                />

                <div
                    class="row bg-deep-purple text-white pretty-shadow justify-between items-center q-px-xs"
                    style="
                        height: 3em;
                        border-top-right-radius: inherit;
                        border-top-left-radius: inherit;
                    "
                >
                    <div class="col-grow row justify-between">
                        <slot name="buttonLeft" v-bind:close="close">
                            <q-btn
                                flat
                                round
                                icon="arrow_back"
                                @click="close"
                            />
                        </slot>
                        <slot name="buttonRight" v-bind:close="close">
                            <q-btn flat round icon="close" @click="close" />
                        </slot>
                    </div>
                </div>
                <header
                    class="pretty-shadow"
                    style="position: relative; z-index: 1"
                    ref="header"
                >
                    <slot name="header"> </slot>
                </header>
                <div class="content__container" v-if="!transitioning">
                    <slot @close="close" />
                </div>
                <slot name="prependButton" />

                <footer   ref="footer">
                    <slot name="footer"/>
                </footer>
            </div>
        </div>
    </Teleport>
</template>
<style lang="scss" scoped>
[v-cloak] {
    display: none;
}
.outer__container {
    height: min(calc(100 * var(--vh, 1vh)), 800px);
    width: min(100vw, 500px);
    z-index: $z-dialog;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    margin: auto;
    transform-origin: bottom left;
    .inner__container {
        background-color: white;
        pointer-events: all;
        border-radius: 16px;
        height: calc(100% - var(--space-xs) * 2);
        margin: var(--space-xs);
        overflow: hidden;
        .content__container {
            height: v-bind(contentHeight);
            overflow: auto;
            position: relative;
        }
    }
}
</style>
<script setup>
import { useAnimate, useElementSize } from "@vueuse/core";

const props = defineProps({
    backable: {
        type: Boolean,
        default: true,
    },
    loading: Boolean,
});

const emit = defineEmits(["close"]);
const container = ref(null);

const keyframes = [
    {
        transform: "scale(0)",
    },
    {
        transform: "scale(1)",
    },
];

const { reverse } = useAnimate(container, keyframes, {
    duration: 200,
    fill: "both",
    easing: "linear",
});
const transitioning = ref(true);

const timeout = () => {
    return new Promise((resolve) => setTimeout(resolve, 250));
};

const close = async () => {
    transitioning.value = true;
    reverse();
    await timeout();
    emit("close");
    transitioning.value = false;
};
onBeforeMount(() => {
    transitioning.value = true;
});

onMounted(async () => {
    await timeout();
    transitioning.value = false;
});
const header = ref(null);
const { height: headerHeight } = useElementSize(header);

const footer = ref(null);
const {height: footerHeight} = useElementSize(footer)

const contentHeight = computed(
    () => `calc(100% - 3em - ${headerHeight.value}px - ${footerHeight.value}px)`
);
</script>
