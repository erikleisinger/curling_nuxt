<template>
    <div ref="avatarElement">
        <Avataaar v-bind="props.parsedAvatar"> </Avataaar>
    </div>
    <q-menu
        v-if="avatarElement"
        :model-value="menuOpen"
        class="q-pa-sm q-pb-sm team__menu"
        ref="menu"
        :target="avatarElement"
        auto-close
        transition-show="scale"
        anchor="top right"
        :cover="false"
        fit
        style="z-index: 1000000"
    >
        <div class="column">
            <q-btn
                color="deep-purple"
                rounded
                icon="visibility"
                :stretch="false"
                @click="toggleTeamViewer({ open: true, team: { id: team.id } })"
                >View</q-btn
            >
        </div>
    </q-menu>
</template>
<style lang="scss">
.team__menu {
    &.q-menu {
        min-width: unset !important;
        max-width: unset !important;
        background-color: unset !important;
        box-shadow: unset;
    }
}
.player__container {
    display: grid;
    grid-template-columns: 30% 70%;
    grid-template-rows: 1fr;
    width: min(90vw, 400px);
    font-size: var(--text-md) !important;
    // font-size: var(--text-sm)!important;
    @include sm {
        font-size: var(--text-md) !important;
    }
    @include md {
        font-size: var(--text-lg) !important;
    }
}
.player-avatar__menu {
    background-color: unset;
    z-index: 1000000;
    background-color: white;
    border-radius: 8px;
    padding-bottom: 8px;
    min-height: unset !important;
    height: fit-content;
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
import { useEditorStore } from "@/store/editor";

const props = defineProps({
    hidePlayerIcon: Boolean,
    team: Object,
    parsedAvatar: Object,
    showStats: {
        type: Boolean,
        default() {
            return false;
        },
    },
});

const editorStore = useEditorStore();
const { toggleTeamViewer } = editorStore;

const avatarElement = ref(null);

const menuOpen = ref(false);

const closeMenu = () => {
    menuOpen.value = false;
};
</script>
