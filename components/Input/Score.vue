<template>
    <section class="score-container__wrap" >
        <section class="row justify-start items-center score__container">
            <div class="column col-12 no-wrap input__section">
                <label class="type__label">Turn</label>
                <SelectTurn class="justify-around" v-model="editedShot.turn" />
            </div>
            <div class="column col-12 no-wrap input__section">
                <label class="type__label">Type</label>
                <div class="row justify-around items-center">
                    <SelectShotType v-model="editedShot.type_id" />
                </div>
            </div>

            <div class="column col-12 no-wrap input__section score" >
                <label class="type__label">Score </label>
                <InputShotScore v-model="editedShot.score" class="justify-around" />
            </div>
        </section>
        <section class="row justify-start items-start line">
            <div class="column col-12 no-wrap input__section">
                <label class="type__label">Line</label>
                <div class="row justify-around col-grow items-center">
                    <SelectLine v-model="editedShot.line" />
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
@import url("https://fonts.googleapis.com/css2?family=Hind:wght@300;400;500;600;700&family=Montserrat:ital,wght@0,100;0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500&display=swap");
.score-container__wrap {
    height: 100%;
    overflow: auto;
    background-color: rgba(255, 255, 255, 0.9);
    font-family: "Montserrat", sans-serif;
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
import { useShotTypeStore } from "@/store/shotTypes";
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

// Shot types
const shotTypeStore = useShotTypeStore();


const shotTypeOptions = computed(() => {
    const { formatShotTypeForSelection } = useFormat();
    return [...shotTypeStore.shotTypes].map((st) =>
        formatShotTypeForSelection(st)
    );
});


// Disabled/loading state

const { globalLoading } = useLoading();

// Save shot

const sessionStore = useSessionStore();
const save = () => {
    sessionStore.saveShot(editedShot.value);
};

/**
 * FILTER PLAYERS BY THOSE ON THE CURRENTLY THROWING TEAM
 * IF: props.onlyThrowing = true;
 */

const throwingTeam: any = computed(() =>
    sessionStore.getThrowingTeamId(sessionStore.shot)
);

const teamStore = useTeamStore();
const isPlayerOnCurrentTeam = (player: any) => {
    const { id } = player;
    const currentThrowingTeam: any = teamStore.teams.find(
        (t: any) => t.id === throwingTeam.value
    );
    const {
        lead_player_id,
        second_player_id,
        third_player_id,
        fourth_player_id,
        fifth_player_id,
        sixth_player_id,
        seventh_player_id,
    } = currentThrowingTeam;
    return [
        lead_player_id,
        second_player_id,
        third_player_id,
        fourth_player_id,
        fifth_player_id,
        sixth_player_id,
        seventh_player_id,
    ].some((p) => p?.id === id);
};


</script>
