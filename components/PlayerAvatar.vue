<template>
    <Avataaar v-bind="props.parsedAvatar" @click.stop.prevent="openMenu"/>
    <q-menu :model-value="menuOpen" style="background-color: unset; box-shadow: unset; z-index: 100000" class="q-pa-xs" ref="menu" auto-close  @hide="menuOpen = false">
        <div class="row">
               <q-btn color="deep-purple"  round size="sm" class="q-mr-sm" @click="goToStats" > <q-icon color="white" name="equalizer" size="xs" /></q-btn>
            <q-btn color="deep-purple"  round size="sm" class="q-mr-sm" @click="openPlayerEditor"> <q-icon color="white" name="edit" size="xs" /></q-btn>
            <slot name="deleteButton" v-bind:closeMenu="() => menuOpen = false">
             <q-btn color="deep-purple"  size="sm" round @click="openDeleteDialog"><q-icon color="white" name="delete"  size="xs"/></q-btn>
            </slot>
        </div>
    </q-menu>  

     <DialogConfirmation
            v-if="deleteConfirmationOpen"
            @close="deleteConfirmationOpen = false"
            @confirm="deletePlayer"
        >
            Are you sure you want to delete player "{{
                player.name ?? "N/A"
            }}"
        </DialogConfirmation> 
                <Teleport to="body">
    <div class="avatar__container" v-if="showPlayerEditor">
                        <div  class="pretty-shadow" style="background-color: white; pointer-events: all; border-radius: 16px; height: calc(100% - 32px); margin: 16px">
                <AvatarGenerator style="height: 100%" :player="player" @close="() => showPlayerEditor = false" />
             
        </div>
    </div>
</Teleport>

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
<script setup>
import {usePlayerStore} from '@/store/players'
import {onClickOutside} from '@vueuse/core'
    const props = defineProps({
        player: Object,
        parsedAvatar: Object,
    })

    const menuOpen = ref(false)
    const deleteConfirmationOpen = ref(false)
    const loading = ref(false)

    const deletePlayer = async () => {
    loading.value = true
    const store = usePlayerStore();
    const { id = null } = props.player;
    await store.deletePlayer(id);
    loading.value = false;
};

const menu = ref(null);
const openMenu = () => {
    if (loading.value) return;
    nextTick(() => {
   menu.value.show();
    })
 
}

const openDeleteDialog = () => {
    deleteConfirmationOpen.value = true;
    menuOpen.value = false;
}

const showPlayerEditor = ref(false);

const openPlayerEditor = () => {
    showPlayerEditor.value = true;
    menuOpen.value = false;
}

const closeMenu = () => {
    menuOpen.value = false;
}

const goToStats = () => {
    menuOpen.value = false;
    return navigateTo(`/stats/player/${props.player.id}`)
}



</script>