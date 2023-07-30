<template>
    <q-layout class="column main__wrap pattern-diagonal-stripes-sm slategray h-5">
        <slot name="header"/>
        <q-page-container
            class="col-grow wrapper "
            style="overflow: hidden"
            role="main"
        >
            <slot />
        </q-page-container>
        <Banner />
    </q-layout>
</template>
<style lang="scss" scoped>
.main__wrap {
    background-color: rgba(246, 247, 252, 0.1);
    color: rgba(246, 247, 252, 1);
}
.wrapper {
    position: relative;
    display: grid;
    grid-template-rows: 1fr;
    grid-column-gap: 0px;
    grid-row-gap: 0px;
    background-color: unset;
    color: black;
    section {
        grid-area: 1 / 1 / 2 / 2;
    }
    .curling-rings__wrap {
        position: relative;
        width: 100%;
        background-color: white;
    }
}


@media all and (min-width: 1000px) {
    .wrapper {
        grid-template-columns: 1fr 2fr;
        section:nth-child(2) {
            grid-area: 1 / 2 / 2 / 3;
        }
    }
}
@media all and (max-width: 1000px) {
    .wrapper {
        grid-template-columns: 1fr;
        section:nth-child(1) {
            grid-area: 1 / 1 / 2 / 2;
        }
    }
}
</style>
<script setup>
import { useSessionStore } from "@/store/session";
const $q = useQuasar();
const sessionStore = useSessionStore();
const gameSelected = computed(() => sessionStore.game?.id);
</script>
