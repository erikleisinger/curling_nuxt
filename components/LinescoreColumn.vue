<template>
    <div class="scoreboard__end-row justify-center items-center" ref="el">
        <div class="inner row items-center justify-center q-pt-sm">
            <div class="inner-scorecard" @click="setTop">{{score.home}}</div>
        </div>
    </div>
    <div class="scoreboard__end-row justify-center items-center">
        <div class="inner row items-center justify-center q-pt-sm">
            <div @click="setBottom" class="inner-scorecard">{{score.away}}</div>
        </div>
    </div>
</template>
<style lang="scss" scoped>
.scoreboard__end-row {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    opacity: v-bind(opacity);
    transform: v-bind(scale);
    transform-origin: bottom;
    &:nth-child(2) {
        transform-origin: top;
    }
    padding: var(--space-xxxxs);
    .inner {
        border: 1px solid $grey-5;
        aspect-ratio: 1/1;
        text-align: center;
        border-radius: 32px;
        font-size: calc(50%);
        line-height: 15vh;
        width: 100%;
        font-size: 10em;
        padding-top: 0.1em;
    }
}
</style>
<script setup>
import { useElementBounding, useWindowSize, useIntersectionObserver, useParentElement } from "@vueuse/core";

const el = ref(null);
const { left, right, x, y, width } = useElementBounding(el);
const { width: windowWidth } = useWindowSize();

const midpoint = computed(() => windowWidth.value / 2 - width.value / 2);
const beginning = computed(() => 0 - width.value);
const end = computed(() => windowWidth.value + width.value);
const opacity = computed(() =>
    (
        1.2 +
        (Math.abs(midpoint.value - x.value) * -1) / (windowWidth.value / 2)
    ).toFixed(1)
);
const scale = computed(
    () =>
        `scale(${1 + (Math.abs(midpoint.value - x.value) * -1) / 1000 + 0.01})`
);


const setTop = () => {
    console.log('set top: ', score.value)
    score.value.home += 1;
    if (score.value.away) score.value.away = 0;
       emit('update:model-value', score.value)

}
const setBottom = () => {
      score.value.away +=1;
    if (score.value.home) score.value.home = 0;
}

const emit = defineEmits(['update:model-value', 'visible'])
const intersectionParent = document.getElementById('#linescore-container')

const targetIsVisible = ref(false)
const { stop } = useIntersectionObserver(
      el,
      ([{ isIntersecting }], observerElement) => {
        targetIsVisible.value = isIntersecting
        if (isIntersecting) emit('visible')
        
      },
      {root: intersectionParent, rootMargin: `0px -45%`, threshold: 0.1}
    )

onBeforeUnmount(() => {
    stop();
})

const props = defineProps({
    modelValue: Object
})

const score = computed({
    get() {
        return props.modelValue
    },
    set(val) {
        console.log('set val: ', val)
        emit('update:model-value', val)
    }
})

const scoreTop = computed(() => props.modelValue.home)
const scoreBottom = computed(() => props.modelValue.away)

</script>
