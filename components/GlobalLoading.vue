<template>
    <div class="window-height window-width row items-center">
        <div
            style="width: 100vw; position: relative"
            class="column items-center"
        >
            <main v-if="!error" class="column items-center full-width global-loading__container justify-start">
                <div class="logo-container" ref="logo">
                    <Logo color="#673ab7" />
                </div>
                <h1 class="q-pb-md text-lg">{{ label }}</h1>
                <div class="loading-container">
                    <q-linear-progress
                        rounded
                        stripe
                        :value="value"
                        :indeterminate="infinite"
                        color="deep-purple"
                        :size="$q.screen.xs ? '10px' : '1em'"
                    ></q-linear-progress>
                </div>
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
.global-loading__container {
    margin-top: v-bind(margin);
}
.logo-container {
    width: min(15vw, 100px);
    animation: spin 3s linear infinite;
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

@keyframes spin {
    0% {
        transform: rotate(0deg)
    }
    10% {
        transform: rotate(180deg)
    }
    20% {
         transform: rotate(360deg);
    }
    30% {
        transform: translateY(2px)
    }
    40% {
        transform: translateY(0px)
    }
    100% {
        transform: rotate(360deg);
    }
}
</style>
<script setup>
import { useElementSize } from "@vueuse/core";
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
</script>
<script>
export default {
    name: "GlobalLoading",
};
</script>
