<template>
    <Avataaar v-bind="props.parsedAvatar" @click.stop.prevent="openMenu">
        <div class="user-link__badge--floating">
            <q-badge
                color="green"
                floating
                bottom
                rounded
                class="user-link__badge"
                v-if="isCurrentUserPlayer && !hidePlayerIcon"
            >
                <q-icon size="1em" name="person" />
            </q-badge>
            <q-badge
                color="red"
                floating
                bottom
                rounded
                style="
                    padding-left: 2px;
                    padding-right: 2px;
                    top: unset;
                    bottom: 0px;
                "
                v-if="!!isOtherUserPlayer && !hidePlayerIcon"
            >
                <q-icon size="1em" name="person" />
            </q-badge>
        </div>
          <div ref="avatarElement" style="position: absolute; height: 100%; width: 100%"/>
    </Avataaar>
  
    <q-menu
            v-if="avatarElement && props.player?.id"
        :model-value="menuOpen"
            :target="avatarElement"
        class="q-pa-sm q-pb-sm player-avatar__menu"
        ref="menu"
        auto-close
        @hide="menuOpen = false"
        transition-show="scale"
        anchor="center right"
        
        :cover="false"

        :fit="false"
    >
      <div class="column" >
               <q-btn color="deep-purple" rounded icon="visibility" :stretch="false" @click="openPlayerEditor" class="q-mb-sm" large>View</q-btn>
        </div>
    </q-menu>

    <DialogConfirmation
        v-if="deleteConfirmationOpen"
        @close="deleteConfirmationOpen = false"
        @confirm="deletePlayer"
    >
        Are you sure you want to delete player "{{ player.name ?? "N/A" }}"
    </DialogConfirmation>
</template>
<style lang="scss">
.player__container {
    display: grid;
    grid-template-columns: 30% 70%;
    grid-template-rows: 1fr;
    width: min(90vw, 400px);
     font-size: var(--text-md)!important;
    // font-size: var(--text-sm)!important;
    @include sm {
        font-size: var(--text-md)!important;
    }
    @include md {
          font-size: var(--text-lg)!important;
    }

}
.player-avatar__menu {
    background-color: unset!important;
    z-index: 1000000;
    box-shadow: unset!important;
    border-radius: 8px;
    padding-bottom: 8px;
    min-height: unset !important;
    height: fit-content;
    min-width: unset!important;
}
.avatar-editor__container {
    height: calc(100 * var(--vh, 1vh));
    width: 100vw;
    z-index: 100002;
    position: absolute;
    top: 0;
}
.user-link__badge--floating {
    position: absolute;
    right: 0;
    bottom: 0;
    
}
.user-link__badge {
    padding: 4px;
    top: unset;
    bottom: 0px;
    position: relative;
    aspect-ratio: 1/1;
    height: 1.5em;
    width: 1.5em;
    .q-icon {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        margin: auto;
    }
}
</style>
<script setup>
import { usePlayerStore } from "@/store/players";
import { useEditorStore } from "@/store/editor";
import { onClickOutside } from "@vueuse/core";
import { useUserStore } from "@/store/user";
import { useFriendStore } from "@/store/friends";
const props = defineProps({
    hidePlayerIcon: Boolean,
    player: Object,
    parsedAvatar: Object,
    showFullMenu: {
        type: Boolean,
        default: true,
    },
    showStats: {
        type: Boolean,
        default() {
            return false;
        },
    },
});

const menuOpen = ref(false);
const deleteConfirmationOpen = ref(false);
const loading = ref(false);

const deletePlayer = async () => {
    loading.value = true;
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
    });
};

const openDeleteDialog = () => {
    deleteConfirmationOpen.value = true;
    menuOpen.value = false;
};

const openPlayerEditor = () => {
    const editorStore = useEditorStore();
    editorStore.togglePlayerEditor({ open: true, editedPlayer: props.player });
    menuOpen.value = false;
};

const closeMenu = () => {
    menuOpen.value = false;
};

const goToStats = () => {
    menuOpen.value = false;
    return navigateTo(`/stats/player/${props.player.id}`);
};
const userStore = useUserStore();
const canEdit = computed(() => userStore.id === props.player.profile_id);
const canDelete = computed(() => !props.player.profile_id_for_player);
const isCurrentUserPlayer = computed(
    () => userStore.id === props.player.profile_id_for_player
);

// const friendStore
const isOtherUserPlayer = computed(() => {
    if (
        !props.player.profile_id_for_player ||
        props.player.profile_id_for_player === userStore.id
    )
        return false;
    return `@${props.player.profile_username}`;
});

const avatarElement = ref(null);
</script>
