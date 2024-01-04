<template>
    <div class="row items-center global-loading__wrap">
        <div
            style="width: 100vw; position: relative"
            class="column items-center"
        >
            <main v-if="!error" class="column items-center full-width global-loading__container justify-start">
                
                    <LogoFull :width="$q.screen.xs ? '150px' : '200px'" />
               
            </main>
            <main v-else class="column items-center full-width global-loading__container">
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
    position: fixed;
    top: 0;
    z-index: 100000;
    background-color: $app-slate;
    left: 0;
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
       opacity: 0
    }
    100% {
        opacity: 1
    }
}
</style>
<script setup>
import { useElementSize } from "@vueuse/core";
import gsap from 'gsap'
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
const margin = computed(() => `${-1 * logoHeight.value}px`)
onMounted(() => {
    // gsap.to('.logo-container', 
    // {
    //     rotateZ: 360,
    //     delay: 0.5,
    //     duration: 0.4,
    //     repeat: -1,
    //     repeatDelay: 1.5,
    // })
})
</script>
<script>
export default {
    name: "GlobalLoading",
};
</script>
