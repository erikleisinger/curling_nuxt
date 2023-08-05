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
                <div class="content__container" v-cloak>
                    <slot @close="close" />
                </div>
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
    z-index: 100000;
    position: absolute;
    top: 0;
    // transform-origin:0% 50%;
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

const {reverse} = useAnimate(container, keyframes, {duration: 300, fill: 'both'});

const close = async () => {
const timeout = () => {
        return new Promise((resolve) => setTimeout(resolve, 500));
      };
    reverse();
    await timeout();
    emit('close')
}


</script>
