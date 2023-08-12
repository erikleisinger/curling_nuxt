<template>
   <section
        v-if="$q.screen.gt.sm || tab === 'rings'"
        id="rings"
        key="rings"
        class="column justify-center no-wrap pattern-diagonal-stripes-sm slategray"
        style="
            background-color: rgba(246, 247, 252, 0.1);
            color: rgba(246, 247, 252, 1);
            height: 100%;
        "
    >
    <q-inner-loading :showing="globalLoading"/>
        <div
            :style="`position:relative; width: 100%; margin-bottom: 7em`"
            class="col-grow curling-rings__wrap"
        >
            <RockController>
                <template v-slot:buttons>
                    <q-btn round  color="white" @click="endOfEndDialog = true">

                        <q-icon name="scoreboard" color="primary"/>
                    </q-btn>
                    <q-btn round  color="white" @click="gameStatsDialog = true">

                        <q-icon name="leaderboard" color="primary"/>
                    </q-btn>
                </template>
            </RockController>
        </div>
        <GameScoreSlider
            :onNext="() => goNext(false)"
            :onBack="() => goPrev(false)"
            @navigate="dialogNavigationOpen = true"
        />
    </section>
        <DialogConfirmation
            v-if="!!confirmUnsaved"
            confirmButtonText="Save"
            :cancelButtonText="'Discard'"
            @close="onDiscardChanges"
            @confirm="confirmUnsaved"
            cancelColor="negative"
            confirmColor="primary"
        >
            Save changes?
        </DialogConfirmation>
    <DialogGameStats v-if="gameStatsDialog" @close="gameStatsDialog = false" :gameId="store.game.id"/>
    <DialogEnd v-if="endOfEndDialog" @close="endOfEndDialog = false" @save="goNext(true)"/>
    <DialogNavigation
        v-model="dialogNavigationOpen"
        @go="goToCustomShot"
        @cancel="dialogNavigationOpen = false"
    />

</template>
<style lang="scss">

#rings {
    overscroll-behavior-y: v-bind("overscroll");
}
.show {
    animation: show 0.5s forwards;
}
.hide {
    animation: hide 0.5s forwards;
    overflow: hidden;
}

@keyframes show {
    0% {
        height: 0px;
    }
    100% {
        height: 81px;
    }
}
@keyframes hide {
    0% {
        height: 81px;
    }
    100% {
        height: 0px;
    }
}
</style>
<script setup lang="ts">
import { inject, ref } from "vue";

import { useUserStore } from "@/store/user";
import { useSessionStore } from "@/store/session";
import { usePlayerStore } from "@/store/players";
import type Shot from "@/types/shot";
const $q = useQuasar();
const tab = inject("tab");
const overscroll = "contain";

const editedShot = inject<Ref>("editedShot")!;

const showScoreInput = ref(false);
const store = useSessionStore()!;
const save = async () => {
    await store.saveShot(editedShot.value);
};



const shot = computed<number>(() => store.shot);
const end = computed<number>(() => store.end);

const { prevShot, nextShot, goToShot } = store;

const { globalLoading } = useLoading();

const { objTheSame } = useValidation();
const currentShot = computed(() => store.currentShot);

const cleanShotForCheck = (shot: Shot | null) => {
    if (!shot) return;
    const cleaned: Partial<Shot> = {};
    Object.keys({
        id: null,
        end_id: null,
        // TODO: fix this
        // player_id: null,
        shot_no: null,
        turn: null,
        line: null,
        score: null,
        type_id: null,
        notes: null,
        rock_positions: {},
    } as Partial<Shot>).forEach((key) => {
        if (key === "rock_positions") {
            cleaned.rock_positions = shot.rock_positions || {};
        } else {
            cleaned[key as keyof Shot] = shot[key as keyof Shot];
        }
    });
    return cleaned;
};

const unsavedChanges = computed(
    () => {
        return  !objTheSame(
            cleanShotForCheck(editedShot.value),
            cleanShotForCheck(store.currentShot)
        )
    }
       
);

const endOfEndDialog = ref(false)
const gameStatsDialog = ref(false)

// Null if confirm dialog is not present
// When truthy, this ref is a function that will be executed on dialog @confirm event
// Either 'goNext' or 'goPrev'
const confirmUnsaved = ref<null | Function>(null);
const onDiscardChanges = ref<null | Function>(null);
const goNext = async (force = false) => {
    if (unsavedChanges.value && !force) {
        confirmUnsaved.value = async () => {
        
            await save();
            goNext(true);
        };
        onDiscardChanges.value = () => goNext(true);
        return;
    }
    confirmUnsaved.value = null;
    //  && !store.currentEnd?.scoring_team_id
    if (shot.value === 16 && !force) {
        endOfEndDialog.value = true;
        return;
    }
    // TODO: blank ends??
    nextShot();
};
const goPrev = async (force = false) => {
    if (unsavedChanges.value && !force) {
        confirmUnsaved.value = async () => {
            await save();
            goPrev(true);
        };
        onDiscardChanges.value = () => goPrev(true);
        return;
    }
    confirmUnsaved.value = null;
    prevShot();
};

// Manually go to shot/end
const dialogNavigationOpen = ref(false);

const goToCustomShot = async (data: { shot: number; end: number }, force = false) => {
    dialogNavigationOpen.value = false;
    if (unsavedChanges.value && !force) {
        confirmUnsaved.value = async () => {
             await save();
            goToCustomShot(data, true);
        }
        onDiscardChanges.value = () => goToCustomShot(data, true);
        return;
    }
    const { shot: shotNo, end: endNo } = data;
    await goToShot(shotNo, endNo);
};

/**
 * Show/unshow rock numbers
 */
const userStore = useUserStore();

const { toggleShowNumbers } = userStore;

</script>
