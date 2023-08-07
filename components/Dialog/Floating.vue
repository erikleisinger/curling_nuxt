<template>
    <Teleport to="body">
        <div class="outer__container" ref="container">
            <div class="pretty-shadow inner__container">
                <div
                    class="row bg-deep-purple text-white pretty-shadow justify-between items-center q-px-xs"
                    style="
                        height: 3em;
                        border-top-right-radius: inherit;
                        border-top-left-radius: inherit;
                    "
                >
                <slot name="prependButton"/>
                <div class="col-grow row justify-end">
                    <q-btn flat round icon="close" @click="close"/>
                </div>
                </div>
                <div class="content__container"  v-if="!transitioning">
                    <slot @close="close" />
                </div>
                <!-- <div v-else class="content__container">
                    <q-inner-loading :showing="true" color="deep-purple" size="3em"/>
                </div> -->
            </div>
        </div>
    </Teleport>
</template>
<style lang="scss" scoped>
[v-cloak] {
  display: none;
}
.outer__container {
    height: calc(100 * var(--vh, 1vh));
    width: 100vw;
    z-index: 100003;
    position: absolute;
    top: 0;
    transform-origin: bottom left;
    .inner__container {
        background-color: white;
        pointer-events: all;
        border-radius: 16px;
        height: calc(100% - 32px);
        margin: 16px;
        overflow: hidden;
        .content__container {
            height: calc(100% - 3em);
            overflow: auto;
            position:relative;
        }
    }
}
</style>
<script setup>
import { useAnimate } from "@vueuse/core";
const emit = defineEmits(["close"]);
const container = ref(null);

const keyframes = [
    {
		transform: 'scale(0)',
	},
    {
		transform: 'scale(1)',
	}
]

const {reverse} = useAnimate(container, keyframes, {duration: 200, fill: 'both', easing: 'linear'});
const transitioning = ref(true)

const timeout = () => {
        return new Promise((resolve) => setTimeout(resolve, 250));
      };

const close = async () => {
      transitioning.value = true;
    reverse();
    await timeout();
    emit('close')
    transitioning.value = false;
}
onBeforeMount(() => {
    transitioning.value = true;
})

onMounted(async () => {
    await timeout();
    transitioning.value = false;
})


</script>
