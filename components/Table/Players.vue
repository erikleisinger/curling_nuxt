<template>
<NuxtLayout>
  <DialogPlayerEditor />
  <q-virtual-scroll class="col-grow bg-white" ref="tableArea" :items="players"  v-slot="{ item }" separator virtual-scroll-slice-size="10" virtual-scroll-item-size="48">
    <q-inner-loading
      :showing="loading"
      label="Please wait..."
      color="primary"
    />
    <!-- <q-list bordered separator> -->
      <!-- <q-item clickable @click="togglePlayerDialog(null)">
        <q-item-section>
          <div class="row items-center">
            <q-icon name="add" size="sm" class="q-mr-xs" />
            <div>Add new player</div>
          </div>
        </q-item-section>
      </q-item> -->
      <q-item  :to="`/stats/player/${item.id}`" v-ripple :key="item.id" class="items-center row">
        <q-item-section>
          <q-item-label class=" row items-center">{{ item.name }}</q-item-label>
          <q-item-label caption> </q-item-label>
        </q-item-section>
        <q-item-section side @click.stop.prevent>
          <div class="text-grey-8 row no-wrap" >
            <q-btn
              size="12px"
              flat
              dense
              round
              icon="edit"
              @click.stop.prevent="edit(item)"
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
            <LazyProfileAvatar v-if="item.profile_id !== userId" :path="getFriendAvatar(item.profile_id)" size="2" delay>
             <q-tooltip :hide-delay="5000" anchor="center left" self="center right" :offset="[10, 10]">Player belongs to <span class="text-bold">{{friendStore.getFriendUsername(item.profile_id)}}</span></q-tooltip>
          </LazyProfileAvatar>
          </div>
          
       
              
        </q-item-section>
      </q-item>
  </q-virtual-scroll>
  <DialogConfirmation
    v-if="itemToDelete"
    @close="itemToDelete = null"
    @confirm="deletePlayer(itemToDelete)"
  >
    Are you sure you want to delete player "{{ itemToDelete.name ?? "N/A" }}"
  </DialogConfirmation>
</NuxtLayout>
</template>
<script setup lang="ts">
import {ref, onMounted} from "vue";
import {useEditorStore} from "@/store/editor";
import {usePlayerStore} from "@/store/players";
import {useSwipe} from "@vueuse/core";
import {TABLE_NAMES} from "@/constants/tables";
import type Player from "@/types/player";
import {useUserStore} from '@/store/user'
import { useFriendStore } from "@/store/friends";
const store = usePlayerStore();
const userStore = useUserStore();

const friendStore = useFriendStore();
const {getFriendAvatar} = friendStore;

const userId = computed(() => userStore.id)

const players = computed<Player[]>(() => store.players);
const loading = ref<boolean>(false);

const loadPlayers = async (force: boolean = false) => {
  loading.value = true;
  await store.fetchPlayers(force);
  loading.value = false;
};

const {togglePlayerDialog} = useEditorStore();

const tableArea = ref(null);
const {direction} = useSwipe(tableArea, {
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
  const {id = null} = player;
  
  await store.deletePlayer(id);
  itemToDelete.value = null;
};
</script>
