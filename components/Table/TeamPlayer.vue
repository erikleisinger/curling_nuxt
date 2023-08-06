<template>
    <div class="row items-center q-mt-xs no-wrap team-player__container">
            <PlayerAvatar
                :parsedAvatar="parsedAvatar"
                :player="player"
                :position="position"
                v-if="player.id"
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
            <div class="avatar__blank row justify-center items-center" v-else-if="!readOnly || !['fifth', 'sixth', 'seventh'].includes(position)" @click="emit('add', position)">
                <q-icon :name="readOnly ? 'person' : 'person_add'" color="grey-8" class="text-md" />
            </div>
        <div class=" truncate-text col-auto q-pl-xs">
      
                <q-item-label class="truncate-text">
                    <span  v-if="player.id">
                    {{ player.name }}

                    </span>
                    <span v-else-if="!readOnly" class="text-italic"  @click="emit('add', position)">
                        Add a {{position}}
                    </span>
                        <span v-else-if="readOnly && !['fifth', 'sixth', 'seventh'].includes(position)" class="text-italic" >Missing {{position}}</span>
                    </q-item-label>
                <q-item-label caption v-if="player.id">{{position}}</q-item-label>
    
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    parsedAvatar: Object,
    player: Object,
    position: String,
    readOnly: Boolean,
});
const emit = defineEmits(["add", "remove"]);
const remove = (closeMenu) => {
    closeMenu();
    emit("remove");
};
</script>
