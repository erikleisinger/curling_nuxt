<template>
    <Avataaar v-bind="props.parsedAvatar" @click.stop.prevent="openMenu">
        <q-badge
            color="green"
            floating
            bottom
            rounded
            style="
                padding-left: 2px;
                padding-right: 2px;
                top: unset;
                bottom: 0px;
            "
            v-if="isCurrentUserPlayer"
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
            v-if="!!isOtherUserPlayer"
        >
            <q-icon size="1em" name="person" />
        </q-badge>
    </Avataaar>
    <q-menu
        :model-value="menuOpen"
        class="q-pa-sm q-pb-sm player-avatar__menu"
        ref="menu"
        auto-close
        @hide="menuOpen = false"
        transition-show="scale"
        cover
        anchor="center left"
    >
        <div class="row items-center" style="overflow: hidden">
            <div
                :style="{ height, width, marginLeft: `-${width * 0.1}em` }"
                class="q-mr-sm q-mb-sm"
            >
                <Avataaar
                    v-bind="props.parsedAvatar"
                    @click.stop.prevent="openMenu"
                />
            </div>
            <div class="column justify-center q-pa-xs">
                <div class="truncate-text q-mb-xs">
                    {{ player.name ?? "Unnamed player" }}
                </div>
                <div
                    class="truncate-text q-mb-xs text-sm row items-center"
                    v-if="isCurrentUserPlayer"
                      @click.stop.prevent
                >
                    <q-badge
                        color="green"
                        class="q-mr-xs"
                        bottom
                        rounded
                        style="padding-left: 2px; padding-right: 1px"
                    >
                        <q-icon size="1em" name="person" />
                    </q-badge>

                    You
                </div>

                <div
                    class="truncate-text q-mb-xs text-sm row items-center"
                    v-if="!!isOtherUserPlayer"
                    @click.stop.prevent
                >
                    <q-badge
                        color="red"
                        class="q-mr-xs"
                        bottom
                        rounded
                        style="padding-left: 2px; padding-right: 1px"
                    >
                        <q-icon size="1em" name="person" />
                    </q-badge>
                    <div>#{{ isOtherUserPlayer }}</div>
                </div>
                <div class="row items-center">
                    <q-btn
                        color="deep-purple"
                        round
                        size="sm"
                        class="q-mr-sm"
                        @click="goToStats"
                        v-if="showStats"
                    >
                        <q-icon color="white" name="equalizer" size="xs"
                    /></q-btn>
                    <q-btn
                        color="deep-purple"
                        round
                        size="sm"
                        class="q-mr-sm"
                        @click="openPlayerEditor"
                        v-if="canEdit"
                    >
                        <q-icon color="white" name="edit" size="xs"
                    /></q-btn>
                    <slot
                        name="deleteButton"
                        v-bind:closeMenu="() => (menuOpen = false)"
                    >
                        <q-btn
                            color="deep-purple"
                            size="sm"
                            round
                            @click="openDeleteDialog"
                            v-if="canEdit"
                            ><q-icon color="white" name="delete" size="xs"
                        /></q-btn>
                    </slot>
                </div>
            </div>
        </div>
    </q-menu>

    <DialogConfirmation
        v-if="deleteConfirmationOpen"
        @close="deleteConfirmationOpen = false"
        @confirm="deletePlayer"
    >
        Are you sure you want to delete player "{{ player.name ?? "N/A" }}"
    </DialogConfirmation>
    <Teleport to="body">
        <div class="avatar-editor__container" v-if="showPlayerEditor">
            <div
                class="pretty-shadow"
                style="
                    background-color: white;
                    pointer-events: all;
                    border-radius: 16px;
                    height: calc(100% - 32px);
                    margin: 16px;
                "
            >
                <AvatarGenerator
                    style="height: 100%"
                    :player="player"
                    @close="() => (showPlayerEditor = false)"
                />
            </div>
        </div>
    </Teleport>
</template>
<style lang="scss">
.player-avatar__menu {
    background-color: unset;
    z-index: 1000000;
    max-width: unset;
    background-color: white;
    border-radius: 8px;
    padding-bottom: 8px;
}
.avatar-editor__container {
    height: calc(100 * var(--vh, 1vh));
    width: 100vw;
    z-index: 100002;
    position: absolute;
    top: 0;
}
</style>
<script setup>
import { usePlayerStore } from "@/store/players";
import { onClickOutside } from "@vueuse/core";
import { useUserStore } from "@/store/user";
import { useFriendStore } from "@/store/friends";
const props = defineProps({
    height: {
        type: String,
        default: "4em",
    },
    player: Object,
    parsedAvatar: Object,
    showStats: {
        type: Boolean,
        default() {
            return false;
        },
    },
    width: {
        type: String,
        default: "3.5em",
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

const showPlayerEditor = ref(false);

const openPlayerEditor = () => {
    showPlayerEditor.value = true;
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
const isCurrentUserPlayer = computed(
    () => userStore.id === props.player.profile_id_for_player?.id
);

// const friendStore
const isOtherUserPlayer = computed(() => {
    if (
        !props.player.profile_id_for_player?.id ||
        props.player.profile_id_for_player?.id === userStore.id
    )
        return;
    return props.player.profile_id_for_player?.username;
});
</script>
