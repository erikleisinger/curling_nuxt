<template>
    <Teleport to="body">
        <div
            class="outer__container"
            :class="{ 'z-top': priority }"
            ref="container"
        >
            <div class="pretty-shadow inner__container">
                <q-inner-loading
                    :showing="loading"
                    color="primary"
                    size="3em"
                    class="z-top"
                />

                <div
                    class="row bg-deep-purple text-white pretty-shadow justify-between items-center q-px-xs top-bar"
                >
                   
                        
                        <!-- <slot name="buttonLeft" v-bind:close="close">
                            <q-btn
                                flat
                                round
                                icon="arrow_back"
                                @click="close"
                            />
                        </slot> -->
                      
                             <div class="row items-center text-md text-bold" >
  <slot name="title" />
                             </div>
            

                        <slot name="buttonRight" v-bind:close="close">
                            <q-btn flat round icon="close" @click="close" />
                        </slot>
                 
                </div>
                <header
                    class="pretty-shadow"
                    style="position: relative; z-index: 1; height: fit-content"
                    ref="header"
                >
                    <slot name="header"> </slot>
                </header>
                <div class="content__container" v-if="!transitioning">
                    <slot @close="close" />
                </div>
                <slot name="prependButton" />

                <footer ref="footer" class="dialog-footer" v-if="slots.footer">
                    <slot name="footer" />
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
    height: min(calc(100 * var(--vh, 1vh)), 1000px);
    width: min(100vw, 700px);
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

        box-sizing: content-box;
        margin: var(--space-xs);
        overflow: hidden;
        position: relative;
        .content__container {
            height: v-bind(contentHeight);
            overflow: auto;
            position: relative;
            width: 100%;
        }
        .top-bar {
            height: 3em;
            border-top-right-radius: inherit;
            border-top-left-radius: inherit;
            @include sm {
                height: 4em;
            }
            padding-left: var(--space-md);
        }
        .dialog-footer {
            position: absolute;
            width: 100%;
            bottom: 0;
            // padding: var(--space-sm);
            background-color: white;
            border-top: 1px solid $grey-4;
            height: max-content;
            box-sizing: border-box;
        }
    }
}
</style>
<script setup>
import { useAnimate, useElementSize, useElementBounding } from "@vueuse/core";

const props = defineProps({
    backable: {
        type: Boolean,
        default: true,
    },
    loading: Boolean,
    priority: Boolean,
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


let headerHeight = ref(0)
let footerHeight = ref(0)
const header = ref(null);

const mounted = ref(null)


const footer = ref(null);
onMounted(async () => {
    await timeout();
    transitioning.value = false;
    nextTick(() => {
const { height } = useElementSize(header);
headerHeight = height;
const { height: footerH } = useElementBounding(footer);
footerHeight = footerH;
mounted.value = true;
    })
   
});



const $q = useQuasar();

const contentHeight = computed(
    () => {
        if (!mounted.value) return '0px'
        const topBarHeight = $q.screen.sm ? '4em' : '3em'
        return `calc(100% - ${topBarHeight} - ${headerHeight.value}px - ${footerHeight.value}px)`
    }
);

const slots = useSlots();

</script>
