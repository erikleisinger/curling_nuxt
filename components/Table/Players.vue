<template>
    <NuxtLayout>

        <q-virtual-scroll
            class="col-grow bg-white"
            ref="tableArea"
            :items="players"
            v-slot="{ item }"
            separator
        >
            <q-inner-loading
                :showing="loading"
                label="Please wait..."
                color="primary"
            />
            <!-- :to="`/stats/player/${item.id}`" -->
            <q-item
                
                v-ripple
                :key="item.id"
                class="items-center row"
            >
            <q-item-section avatar>
       
                <Avataaar  v-bind="parseAvatar(item.avatar)"/>
               
            </q-item-section>
                <q-item-section>
                    <q-item-label class="row items-center" style="line-height: 1em!important">{{
                        item.name
                    }}</q-item-label>
                
                </q-item-section>
                <q-item-section side @click.stop.prevent>
                    <div class="text-grey-8 row no-wrap">
                        <q-btn
                            size="12px"
                            flat
                            dense
                            round
                            icon="edit"
                            @click.stop.prevent="togglePlayerEditor(item)"
                            v-if="item.profile_id === userId"
                        ></q-btn>
                        <q-btn
                            size="12px"
                            flat
                            dense
                            round
                            icon="delete"
                            @click.stop.prevent="itemToDelete = item"
                            v-if="item.profile_id === userId"
                        ></q-btn>
                    </div>
                </q-item-section>
            </q-item>
        </q-virtual-scroll>

    <DialogConfirmation
            v-if="itemToDelete"
            @close="itemToDelete = null"
            @confirm="deletePlayer(itemToDelete)"
        >
            Are you sure you want to delete player "{{
                itemToDelete.name ?? "N/A"
            }}"
        </DialogConfirmation>
<Teleport to="body">
    <div class="avatar__container" v-if="showPlayerEditor">
                        <div  class="pretty-shadow" style="background-color: white; pointer-events: all; border-radius: 16px; height: calc(100% - 32px); margin: 16px">
                <AvatarGenerator style="height: 100%" :player="editedPlayer" @close="closePlayerEditor" />
             
        </div>
    </div>
</Teleport>
    </NuxtLayout>
</template>
<style lang="scss" scoped>
    .avatar__container {
        height: calc(100 * var(--vh, 1vh)); 
        width: 100vw; 
        z-index: 100000; 
        position: absolute; 
        top: 0;
    }
</style>
<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useEditorStore } from "@/store/editor";
import { usePlayerStore } from "@/store/players";
import { useSwipe, useDraggable } from "@vueuse/core";
import { TABLE_NAMES } from "@/constants/tables";
import type Player from "@/types/player";
import { useUserStore } from "@/store/user";
import { useFriendStore } from "@/store/friends";
import Json from "@/types/json";
import {parseAvatar} from '@/utils/avatar'

const showPlayerEditor = ref(false)

const editedPlayer = ref<Player | null>(null)

const togglePlayerEditor = (player: Player) => {
    showPlayerEditor.value = true;
    editedPlayer.value = player;
}

const closePlayerEditor = () => {
     showPlayerEditor.value = false;
    editedPlayer.value = null
}


const store = usePlayerStore();
const userStore = useUserStore();

const friendStore = useFriendStore();
const { getFriendAvatar } = friendStore;

const userId = computed(() => userStore.id);

const players = computed<Player[]>(() => store.players);
const loading = ref<boolean>(false);

const loadPlayers = async (force: boolean = false) => {
    loading.value = true;
    await store.fetchPlayers(force);
    loading.value = false;
};

const { togglePlayerDialog } = useEditorStore();

const tableArea = ref(null);
const { direction } = useSwipe(tableArea, {
    threshold: 200,
    onSwipeEnd: (e) => {
        if (direction.value !== "down") return;
        loadPlayers(true);
    },
});

const edit = (player: Player) => {
    togglePlayerDialog(player);
};

const itemToDelete = ref<Player | null>(null);
const deletePlayer = async (player: Player) => {
    const { id = null } = player;

    await store.deletePlayer(id);
    itemToDelete.value = null;
};

</script>
