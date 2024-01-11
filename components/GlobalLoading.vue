<template>
    <div class="row items-center global-loading__wrap">
        <div class="column items-center justify-center global-loading__inner">
            <main
                v-if="!error"
                class="column items-center full-width global-loading__container justify-start"
            >
                <LogoFull
                    :width="$q.screen.xs ? '150px' : '200px'"
                    ref="logo"
                    style="overflow: visible"
                />
            </main>
            <main
                v-else
                class="column items-center full-width global-loading__container"
            >
                <q-icon size="5em" color="negative" name="mood_bad" />
                <h1 class="q-pt-md text-negative text-lg text-center">
                    {{ errorMessage }}
                </h1>
                <q-btn class="q-mt-md" flat @click="goBack">Go back</q-btn>
            </main>
        </div>
    </div>
</template>
<style lang="scss" scoped>
.global-loading__wrap {
    width: 100vw;
    height: calc(100 * var(--vh, 1vh));
    margin: auto;
    position: fixed;
    top: 0;
    z-index: 100000;
    @include bg-blue-side;
    left: 0;
    right: 0;
    .global-loading__inner {
        width: $app-width;
        position: relative;
        margin: auto;

        @include bg-blue-side;
        height: 100%;
    }
}
.logo-container {
    width: min(15vw, 100px);
    // animation: fade 0.2s linear forwards;
}
:deep(.loading-container) {
    width: 100vw;
    max-width: 500px;
    padding: 0px var(--space-xl);
    @include sm {
        .rounded-borders {
            border-radius: 24px;
        }
    }
}

@keyframes fade {
    0% {
        opacity: 0;
    }
    100% {
        opacity: 1;
    }
}
</style>
<script setup>
import { useElementSize } from "@vueuse/core";
import gsap from "gsap";
const props = defineProps({
    error: Boolean,
    errorMessage: {
        type: String,
        default() {
            return "Error: our curling bots gained sentience and staged an uprising. Awkward!";
        },
    },
    infinite: Boolean,
    label: {
        type: String,
        default() {
            return "Loading...";
        },
    },
    value: Number,
});
const goBack = () => {
    reloadNuxtApp({
        path: "/",
    });
};

const $q = useQuasar();

const logo = ref(null);

const { height: logoHeight } = useElementSize(logo);
const margin = computed(() => `${-1 * logoHeight.value}px`);

const doAnimation = () => {

    const els = logo.value.$el.querySelectorAll(
        "path:not(.logo-i):not(.logo-rock)"
    );
    const rock = logo.value.$el.querySelectorAll("path.logo-rock");
    const i = logo.value.$el.querySelector("path.logo-i");
    const xAmount = 40;
    const tl = gsap.timeline({repeat: -1, repeatDelay: 3});
    // const ringEls = Array.from(els).splice(0, 4)
    // const ringElsRed = Array.from(els).splice(4, 4)
    //   const letterEls = Array.from(els).splice(8, 6)
    //   const dotEl = Array.from(els).splice(14, 1)
    //   console.log(letterEls)
    tl.add("start");
    tl.from(els, {
        y: (index) => index % 2 === 0 ? 100 : -100,
        // x: () => {
        //     const random = Math.random() > 0.5 ? 1 : -1;
        //     return Math.random() * 100 * (random)
        // },
        opacity: 0,
        stagger: 0.1,
        duration: 1,
    })
    // tl.from(
    //     letterEls,
    //     {
    //         y: (index) => {

    //             return index % 2 === 0? xAmount : -1 * xAmount
    //         },
    //         opacity: 0,
    //         stagger: 0.09,
    //         delay: 1,
    //         duration:5,
    //     },
    //     "start"
    // );
    // tl.from(
    //    ringEls,
    //     {
    //         x: (index) => {
    //             return  -1 * xAmount;
    //         },

    //         opacity: 0,
    //         stagger: 1,
    //         delay: 1,
    //         duration:5,
    //     },
    //     "start"
    // );
    //  tl.from(
    //    ringElsRed,
    //     {
    //         x: (index) => {
    //             return xAmount;
    //         },

    //         opacity: 0,
    //         stagger: 1,
    //         delay: 1,
    //         duration:5,
    //     },
    //     "start"
    // );
    //  tl.from(
    //    dotEl,
    //     {
    //         scale: 0,
    //         ease: 'bounce',
    //         opacity: 0,
    //         duration:4,
    //         delay: 1.5,
    //     },
    // );


    tl.duration(2.1);
}

onMounted(() => {
    doAnimation();
})

</script>
<script>
export default {
    name: "GlobalLoading",
};
</script>
