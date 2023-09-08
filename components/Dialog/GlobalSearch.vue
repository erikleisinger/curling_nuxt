<template>
    <q-dialog v-model="isOpen" persistent maximized>
        <div
            class="global-search__container row justify-center full-width full-height"
        >
            <div class="global-search__inner">
                <AreaSearch
                    :inputLabel="options.inputLabel"
                    @select="onSelect"
                    :resourceTypes="options.resourceTypes ?? []"
                    :filterIds="options.filterIds"
                    :restrictIds="options.restrictIds"
                >
                    <template v-slot:before>
                        <q-btn
                            flat
                            round
                            icon="close"
                            color="white"
                            @click="close"
                        />
                    </template>
                    <template
                        v-slot:append="{ result: selection }"
                        v-if="options.append && options.appendCallback"
                    >
                        <div
                            class="full-height row justify-center items-center"
                        >
                            <q-btn
                                flat
                                @click.stop.prevent="
                                    options.appendCallback(selection)
                                "
                                >{{ options.append }}</q-btn
                            >
                        </div>
                    </template>
                </AreaSearch>
                <div class="close--hidden" @click="close" />
            </div>
        </div>
    </q-dialog>
</template>
<style lang="scss" scoped>
.global-search__container {
    margin: calc(-1 * var(--space-md));
    .global-search__inner {
        width: min(100vw, 800px);
        @include sm {
            margin-top: 15vh;
        }
        @include md {
            margin-top: 25vh;
        }
    }
    .close--hidden {
        position: absolute;
        bottom: 0;
        height: 50%;
        width: 100%;
    }
}
:deep(.q-dialog) {
    background-color: red !important;
}

.backdrop {
    height: 100%;
    width: 100%;
    background-color: red;
}
</style>
<script setup lang="ts">
import { useDialogStore } from "@/store/dialog";
const { toggleGlobalSearch, globalSearch } = useDialogStore();
const { options } = globalSearch;

const isOpen = ref(true);

const close = () => {
    isOpen.value = false;
    setTimeout(() => {
        toggleGlobalSearch({ open: false });
    }, 500);
};

const onSelect = ({result: selection, event}) => {
    if (options?.callback) options.callback(selection, event);
    if (!options.persistent) close();
};
</script>
