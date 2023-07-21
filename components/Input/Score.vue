<template>
<div class="score__container blue--background">
<div class="header ">
</div>
<main class="pretty-shadow">

</main>
</div>
    
        <!-- <section class="row q-px-lg">
            <SelectPlayer
                v-model="editedShot.player_id"
                class="col-12 q-pt-lg"
                :filter="isPlayerOnCurrentTeam"
            />
            <SelectShotType
                v-model="editedShot.type_id"
                class="col-12 q-mt-lg"
            />
            <SelectTurn class="col-12 q-mt-lg" />
            <SelectLine class="col-12 q-mt-lg" />

            <InputShotScore class="col-12 q-pt-lg" />

            <q-input
                class="col-12 q-pt-lg"
                type="textarea"
                outlined
                rounded
                label="Notes"
                :disable="globalLoading"
                v-model="editedShot.notes"
            />
             </section>
            <section class="row justify-center col-12 q-pt-lg">
                <q-btn @click="save" color="primary">Save changes</q-btn>
            </section> -->
       


</template>
<style lang="scss" scoped>
.score__container {
height: 100%;
    .header {
    height: 30%;
    }
    main {
        border-radius: 50px;
        border-bottom-left-radius: 0px;
        border-bottom-right-radius: 0px;
    background-color:white;
    padding: 32px;
    height:70%
    }
}
.score-inputs__wrap {
    overflow: auto;
    overflow-x: hidden;


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

// Selection options

// Enums

const { enumToSelectionOptions } = useDatabase();
const lineOptions = enumToSelectionOptions(Line);
const turnOptions = enumToSelectionOptions(Turn);

// Shot types
const shotTypeStore = useShotTypeStore();
const loadingShotTypes = ref(false);
const getShotTypes = async (force: any) => {
    loadingShotTypes.value = true;
    await shotTypeStore.fetchShotTypes(force);
    loadingShotTypes.value = false;
};
const shotTypeOptions = computed(() => {
    const { formatShotTypeForSelection } = useFormat();
    return [...shotTypeStore.shotTypes].map((st) =>
        formatShotTypeForSelection(st)
    );
});

onMounted(() => {
    shotTypeStore.fetchShotTypes(true);
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
