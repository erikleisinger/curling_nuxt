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
    @include bg-white-diagonal;
    left: 0;
    right: 0;
    .global-loading__inner {
        width: $app-width;
        position: relative;
        margin: auto;

        background-color: $app-slate;
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
    const rock = logo.value.$el.querySelector("path.logo-rock");
    const i = logo.value.$el.querySelector("path.logo-i");

    const tl = gsap.timeline();
    tl.add("start");
    tl.from(
        els,
        {
            y: (index) => index % 2 === 0 ? 100 : -100,
            opacity: 0,
            stagger: 0.1,
            duration: 0.9,
        },
        "start"
    );
    tl.to(
        i,
        {
            rotateZ: -16,
            transformOrigin: "center",
            duration: 0,
        },
        "start"
    );
    tl.from(i, {
        y: 100,
        duration: 0.4,
        delay: 0.4,
    }, 'start')
    tl.to(
        rock,
        {
            rotateZ: -33,
            duration: 0,
        },
        "start"
    );
    tl.add('fall')
    tl.fromTo(
        rock,
        {
            x: -70,
            opacity: 0,
        },
        {
            opacity: 1,
            x: -7,
            duration: 1,
        }, 'fall'
    );
    
    tl.to(rock, {
        x: 1,
        rotateZ: 4,
        duration: 0.6,
        delay: 0.8,
        ease: 'bounce',
    }, 'fall');
    tl.to(i, {
        rotateZ: -1,
        delay: 0.8,
        duration: 0.6,
        ease: 'bounce',
    }, 'fall')

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
