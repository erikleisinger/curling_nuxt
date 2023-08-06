<template>
    <div class="row items-center q-mt-xs no-wrap" v-if="player.id">
        <div class="q-mr-sm avatar__container">
            <PlayerAvatar :parsedAvatar="parsedAvatar" :player="player">
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
        <div class="text-md truncate-text">{{ player.name }}</div>
    </div>
    <div class="row items-center q-mt-sm" v-else-if="!readOnly">
        <q-badge
            outline
            rounded
            click
            color="grey"
            :label="`+ Add ${position}`"
            @click="emit('add', position)"
        ></q-badge>
    </div>
     <div class="row items-center q-mt-sm" v-else-if="!['fifth', 'sixth', 'seventh'].includes(position)">
        <q-badge
            outline
            rounded
            color="grey"
            :label="`This team has no ${position}!`"
        ></q-badge>
    </div>

</template>
<style lang="scss" scoped>
.avatar__container {
    width: 2.5em;
    position: relative;
    height: 2.5em;
    max-height: 3em;
}
</style>
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
