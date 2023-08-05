<template>
    <div class="row items-center q-mt-xs" v-if="player.id">
        <div style="max-height: 40px; height: 2em; width: 2em" class="q-mr-sm">
            <PlayerAvatar :parsedAvatar="parsedAvatar" :player="player">
            <template v-slot:deleteButton="{closeMenu}">
     <q-btn color="deep-purple"  size="sm" round @click="remove(closeMenu)"><q-icon color="white" name="person_remove"  size="xs"/></q-btn>
                </template>
            </PlayerAvatar>
        </div>
        <div>{{ player.name }}</div>
    </div>
      <div class="row items-center q-mt-sm" v-else>
        <q-badge
                        outline
                        rounded
                        color="grey"
                        :label="`+ Add ${position}`"
                 @click="emit('add', position)"
                    ></q-badge>
    </div>
</template>
<script setup>
const props = defineProps({
     parsedAvatar: Object,
    player: Object,
    position: String,
   
});
const emit = defineEmits(['add', 'remove'])
const remove = (closeMenu) => {
    closeMenu()
    emit('remove')
}
</script>
