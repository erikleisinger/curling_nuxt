<template>
    <section class="score-container__wrap" >
        <section class="row justify-start items-center score__container">
            <div class="column col-12 no-wrap input__section">
                <label class="type__label">Turn</label>
                <ShotByShotSelectTurn class="justify-around" v-model="editedShot.turn" />
            </div>
            <div class="column col-12 no-wrap input__section">
                <label class="type__label">Type</label>
                <div class="row justify-around items-center">
                    <ShotByShotSelectShotType v-model="editedShot.type_id" />
                </div>
            </div>

            <div class="column col-12 no-wrap input__section score" >
                <label class="type__label">Score </label>
                <ShotByShotInputShotScore v-model="editedShot.score" class="justify-around" />
            </div>
        </section>
        <section class="row justify-start items-start line">
            <div class="column col-12 no-wrap input__section">
                <label class="type__label">Line</label>
                <div class="row justify-around col-grow items-center">
                    <ShotByShotSelectLine v-model="editedShot.line" />
                </div>
            </div>
             <div class="column col-12 no-wrap input__section">
                <label class="type__label">Notes</label>
                 <q-input
                class="col-12"
                type="textarea"
                outlined
                rounded
                label="Notes"
                :disable="globalLoading"
                v-model="editedShot.notes"
            />
            </div>
           
        </section>
    </section>
</template>
<style lang="scss" scoped>
.score-container__wrap {
    height: 100%;
    overflow: auto;
    background-color: rgba(255, 255, 255, 0.9);
    font-family: $font-family-main;
    display: grid;
    grid-template-rows: minmax(100% ,100%) auto;
    padding-bottom: var(--space-lg);
    .input__section {
        padding: 0px var(--space-lg);
        margin-top: var(--space-lg);
        &.score {
            margin-bottom: var(--space-md);
        }
        .type__label {
            font-weight: bold;
            font-size: var(--text-lg);
            margin-bottom: var(--space-sm);
        }
    }
    h1 {
        font-size: 1.5em;
    }
    .line {
        margin-top: var(--space-xl);
    }
    .score__container {
        height: 100%;
        background-color: unset !important;

        .header {
            height: 30%;
        }
        main {
            border-radius: 50px;
            border-bottom-left-radius: 0px;
            border-bottom-right-radius: 0px;

            padding: 32px;
            height: 70%;
        }
    }
    .score-inputs__wrap {
        overflow: auto;
        overflow-x: hidden;
    }
}
</style>
<script setup lang="ts">
import { computed, inject, onMounted, ref, watch } from "vue";
import Line from "@/types/line";
import Turn from "@/types/turn";
import { useSessionStore } from "@/store/session";
import { useTeamStore } from "@/store/teams";
import { TABLE_NAMES } from "@/constants/tables";
import { toValue } from "@vueuse/core";

const editedShot = inject<Ref>("editedShot")!;

const active = ref(0);

// Selection options

// Enums

const { enumToSelectionOptions } = useDatabase();
const lineOptions = enumToSelectionOptions(Line);
const turnOptions = enumToSelectionOptions(Turn);

// Disabled/loading state

const { globalLoading } = useLoading();

// Save shot

const sessionStore = useSessionStore();
const save = () => {
    sessionStore.saveShot(editedShot.value);
};
</script>
