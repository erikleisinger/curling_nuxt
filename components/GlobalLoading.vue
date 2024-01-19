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
    const tl = gsap.timeline();

    tl.add("start");
    tl.from(els, {
        y: (index) => index % 2 === 0 ? 100 : -100,

        opacity: 0,
        stagger: 0.1,
        duration: 1,
    })

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
