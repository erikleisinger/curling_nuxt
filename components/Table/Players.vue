<template>
<NuxtLayout>
  <DialogPlayerEditor />
  <q-scroll-area class="col-grow bg-white" ref="tableArea">
    <q-inner-loading
      :showing="loading"
      label="Please wait..."
      color="primary"
    />
    <q-list bordered separator>
      <q-item clickable @click="togglePlayerDialog(null)">
        <q-item-section>
          <div class="row items-center">
            <q-icon name="add" size="sm" class="q-mr-xs" />
            <div>Add new player</div>
          </div>
        </q-item-section>
      </q-item>
      <q-item  :to="`/stats/player/${player.id}`" v-ripple v-for="player in players" :key="player.id" class="items-center row">
        <q-item-section>
          <q-item-label class=" row items-center">{{ player.name }}</q-item-label>
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
              @click.stop.prevent="edit(player)"
              v-if="player.profile_id === userId"
            ></q-btn>
            <q-btn
              size="12px"
              flat
              dense
              round
              icon="delete"
              @click.stop.prevent="itemToDelete = player"
              v-if="player.profile_id === userId"
            ></q-btn>
            <ProfileAvatar v-if="player.profile_id !== userId" :path="getFriendAvatar(player.profile_id)" size="2">
             <q-tooltip :hide-delay="5000" anchor="center left" self="center right" :offset="[10, 10]">Player belongs to <span class="text-bold">{{friendStore.getFriendUsername(player.profile_id)}}</span></q-tooltip>
          </ProfileAvatar>
          </div>
          
       
              
        </q-item-section>
      </q-item>
    </q-list>
  </q-scroll-area>
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
onBeforeMount(async () => {
    const {setLoading} = useLoading();
    setLoading(true)
    await friendStore.getFriends();
  await loadPlayers();
  setLoading(false)
});

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
