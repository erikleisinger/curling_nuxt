<template>
<div     style="margin-top: -1em" @click="onAvatarClick">
        <PlayerAvatar
            :parsedAvatar="parseAvatar(player.avatar)"
            :player="player"
        
        >
        </PlayerAvatar>
</div>
        <div class="truncate-text col-auto q-pl-xs q-ml-xs column justify-center text-md " >
            <q-item-label class="truncate-text">
                <span v-if="player.id">
                    {{ player.name }}
                </span>
            </q-item-label>
            <q-item-label caption v-if="player.id">{{ position }}</q-item-label>
        </div>

</template>
<script setup>
import {usePlayerStore} from '@/store/players'
import {parseAvatar} from '@/utils/avatar'
const props = defineProps({
    position: String,
    id: Number,
});

const player = computed(() => usePlayerStore().players.find((p) => p.id === props.id) || {})
</script>
