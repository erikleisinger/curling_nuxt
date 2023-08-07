<template>
    <div class="q-mt-xs team-player__container--test" 
    :style="{gridTemplateColumns: active ? 'max(70px, 15vw) 1fr' : 'max(5vw, 30px)', width: active ? '100%' : 'fit-content'}"
    >
        <TeamAvatar
           :parsedAvatar="parsedAvatar"
           :team="team"
        >
     
        </TeamAvatar>
        <!-- <div
            class="avatar__blank row justify-center items-center"
            v-else-if="
                !readOnly || !['fifth', 'sixth', 'seventh'].includes(position)
            "
            @click="emit('add', position)"
        >
            <q-icon
                :name="readOnly ? 'person' : 'person_add'"
                color="grey-8"
                class="text-md"
            />
        </div> -->
        <div class="truncate-text col-auto q-pl-xs q-ml-xs column justify-center" v-if="active" :class="{'text-lg text-bold': active}">
            <q-item-label overline>Team</q-item-label>
            <q-item-label class="truncate-text">
                <span >
                    {{ name }}
                </span>
          
            </q-item-label>
            <!-- <q-item-label caption v-if="player.id && !active" >{{ position }}</q-item-label> -->
        </div>
    </div>
</template>
<style lang="scss">
    .team-player__container--test {
        display: grid;
        // width: 100%;
    }
</style>
<script setup>
const props = defineProps({
    active: Boolean,
    parsedAvatar: Object,
    name: String,
    team: Object,
    position: String,
    readOnly: Boolean,
});
const emit = defineEmits(["add", "remove"]);
const remove = (closeMenu) => {
    closeMenu();
    emit("remove");
};

onUpdated(() => {
    console.log('TEAM SKIP UPDATED for team: ', props.team?.name, props.team?.id)
})
</script>
