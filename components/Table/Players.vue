<template>
    <q-inner-loading
        :showing="loading"
        label="Please wait..."
        color="primary"
    />
    <RecycleScroller :items="players" :item-size="1" height="100%" :buffer="0" key-field="id" v-slot="{ item }">
    
            <!-- <DynamicScrollerItem :item="item"   :active="active" :size-dependencies="[
          item.message,
        ]"
        :data-index="index"> -->
            <PlayerBasic :player="item" class="list--player">
                <template v-slot:append>
                     <slot name="actions" v-bind:playerId="item.id" />
                </template>
            </PlayerBasic>
            <!-- <q-item class="items-center row" v-memo="[item.avatar, item.name]">

                <q-item-section avatar style="height: 100%; min-height: inherit">
                    <PlayerAvatar
                    
                        :parsedAvatar="parseAvatar(item.avatar)"
                        :player="item"
                    />
                </q-item-section>
                <q-item-section>
                    <q-item-label
                        class="row items-center"
                        style="line-height: 1em !important"
                        >{{ item.name }}</q-item-label
                    >
                </q-item-section>
                <q-item-section side @click.stop.prevent>
                    <div class="text-grey-8 row no-wrap">
                        <slot name="actions" v-bind:playerId="item.id" />
                    </div>
                </q-item-section>
            </q-item> -->
            <!-- </DynamicScrollerItem> -->
    
    </RecycleScroller>
</template>
<style lang="scss">
    .list--player {
        height: 75px;
         @include sm {
          height: 80px!important;
    }
         @include md {
          height: 150px!important;
    }
    }
</style>
<script setup lang="ts">
import { usePlayerStore } from "@/store/players";
import { useSwipe } from "@vueuse/core";
import type Player from "@/types/player";
import Json from "@/types/json";
import { parseAvatar } from "@/utils/avatar";

const store = usePlayerStore();

const players = computed<Player[]>(() => store.players);
const loading = ref<boolean>(false);

const loadPlayers = async (force: boolean = false) => {
    loading.value = true;
    await store.fetchPlayers(force);
    loading.value = false;
};

const tableArea = ref(null);
const { direction } = useSwipe(tableArea, {
    threshold: 200,
    onSwipeEnd: (e) => {
        if (direction.value !== "down") return;
        loadPlayers(true);
    },
});
</script>
