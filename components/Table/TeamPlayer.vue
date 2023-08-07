<template>
<div     style="margin-top: -1em" @click="onAvatarClick">
        <PlayerAvatar
            :parsedAvatar="parsedAvatar"
            :player="player"
        
        >
            <template v-slot:deleteButton="{ closeMenu }">
                <q-btn
                    color="deep-purple"
                    size="sm"
                    round
                    @click="remove(closeMenu)"
                    ><q-icon color="white" name="person_remove" size="xs"
                /></q-btn>
            </template> 
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
<style lang="scss">
 .avatar__blank {
            margin-top: 0.4em;
            margin-bottom: 0.4em;
            width: 93%;
            border-radius: 50%;
            border: 1px solid #ddd;
            background: #eee;
            margin-left: 0.15em;
            aspect-ratio: 1/1;
            font-size: var(--text-md);
            @include sm {
                font-size: var(--text-md);
            }
        }
</style>
<script setup>
const props = defineProps({
    parsedAvatar: Object,
    player: Object,
    position: String,
});
const emit = defineEmits(["add", "remove"]);
const remove = (closeMenu) => {
    closeMenu();
    emit("remove");
};
const onAvatarClick = () => {
    if (!player?.id) emit('add', props.position)
  
}
</script>
