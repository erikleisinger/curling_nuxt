<template>
    <q-scroll-area class="col-grow game-table__container" ref="tableArea"  > 
    <q-list  separator> 
    <q-item clickable to="/creategame" class="bg-amber-7 text-white">
        <q-item-section>
          <div class="row items-center justify-center">
            <h2 class="text-bold">New game</h2>
          </div>
        </q-item-section>
      </q-item> 
    <TableGameItem  v-for="game in games" :key="game.id" :game="game" @select="selectGame" @delete="itemToDelete = $event" @edit="edit" class="q-mt-xl"/>
   </q-list>
    </q-scroll-area>
    <DialogConfirmation
        v-if="itemToDelete"
        @close="itemToDelete = null"
        @confirm="deleteGame(itemToDelete)"
    >
        Are you sure you want to delete the game "{{
            itemToDelete.name ?? "Unnamed game"
        }}"
    </DialogConfirmation>
</template>
<style lang="scss" scoped>
.score-display {
        display: grid;
        grid-template-rows: 1fr auto;
        // grid-template-columns: calc(33% - 32px) 33% calc(33% - 32px);
        grid-template-columns: minmax(0, 1fr) auto 2em auto minmax(0, 1fr);
        row-gap: 16px;

        .percent-container {
            grid-column: span 2;
            transition: all 1s;
            overflow: hidden;
        }
    }
    .score__container {
        padding: var(--space-sm);
        border: 1px solid black;
        border-radius: var(--space-xxs);
    }
.game-table__container {
    height: calc(var(--vh, 1vh) * 100 - 50px);
     
}
</style>
<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useSessionStore } from "@/store/session";
import { useEditorStore } from "@/store/editor";
import { useGameStore } from "@/store/games";
import { TABLE_NAMES } from "@/constants/tables";
import { useSwipe } from "@vueuse/core";
import type Game from "@/types/game";
import { useFriendStore } from "@/store/friends";

const props = defineProps({
    edited: Object,
});
const { toTimezone } = useTime();

const friendStore = useFriendStore();

const loading = ref(false);
const itemToDelete = ref(null);
const store = useSessionStore();
const gameStore = useGameStore();

const games = computed(() => gameStore.games);

const loadGames = async (force: boolean) => {
    loading.value = true;

    await useGameStore().fetchGames(force);
    loading.value = false;
};

const selectGame = async (game: Game) => {
    navigateTo(`/game?id=${game.id}`);
};

const edit = (game: Game) => {
    const editorStore = useEditorStore();
    editorStore.toggleGameDialog({
        ...game,
        home: game.home.id,
        away: game.away.id,
        hammer_first_end: game.hammer_first_end?.id,
        start_time: toTimezone(game.start_time, "YYYY/MM/DD HH:mm"),
    });
};

const deleteGame = async (game: Game) => {
    const { id } = game;
    if (!id) return;
    // TODO: Error handling if no game id
    await gameStore.deleteGame(id);
    itemToDelete.value = null;
};

const { toggleGameDialog } = useEditorStore();

const tableArea = ref(null);
const { direction } = useSwipe(tableArea, {
    threshold: 200,
    onSwipeEnd: (e) => {
        if (direction.value !== "down") return;
        loadGames(true);
    },
});

</script>
