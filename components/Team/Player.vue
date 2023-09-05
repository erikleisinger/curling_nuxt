<template>
    <div class="player__container column" :class="{ editing }" ref="container" @click="onClick">
        <slot>
        <div class="full-width row text-grey-8 justify-between items-center">
            <div style="width: 25px" class="member-avatar__wrap">
                <div style="width: inherit" class="member-avatar__container">
                    <div class="avatar-highlight--helper" />
                    <Avataaar v-bind="player.avatar" class="player-avatar" />
                </div>
            </div>
            <div class="text-sm">
                <span v-if="!player.status">
                {{ positions[player.position]?.name ?? "Member" }}
                </span>
                <span v-else>
                    Invitation sent
                </span>
            </div>
        </div>
        <div class="row no-wrap full-width" style="overflow: hidden">
            <div style="min-width: 0">
                <div class="truncate-text text-center q-pt-xs">
                    {{ player.first_name }} {{ player.last_name }}
                </div>
                <div class="text-xs">@{{ player.username }}</div>
            </div>
        </div>
        <transition appear enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
        <div class="edit-overlay" v-if="editing && ((!$q.screen.xs && hovered) || ($q.screen.xs && showEdit))">
            <div class="inner full-height" :style="{'grid-template-columns': player.status ? '100%' : 'repeat(2, 50%)'}">
                <div class="row justify-center items-center full-height full-width" v-if="!player.status">
                    <q-btn flat color="red" stretch class="full-width" @click="emit('removePlayer', player)">Remove from team</q-btn>
                </div>
                <div class="row justify-center items-center full-height full-width">
                    <q-btn flat color="white" stretch class="full-width" v-if="!player.status">Edit position</q-btn>
                      <q-btn flat color="red" stretch class="full-width" v-if="!!player.status" @click="emit('cancelInvitation', player.rowId)">Cancel invitation</q-btn>
                </div>
            </div>
        </div>
        </transition>
        </slot>
    </div>
</template>
<style lang="scss" scoped>
.player__container {
    width: min(calc(50% - var(--space-xs) * 2), 250px);
    padding: var(--space-xxs);
    border: 1px solid $grey-4;
    border-radius: 8px;
    margin: var(--space-xs);
    transition: all 0.2s;
    position: relative;
    overflow: hidden;
    &.editing {
        border: 2px solid $blue-5;
        transform: scale(1.05);
    }
    .edit-overlay {
        $overlay-color: rgba(0, 0, 0, 0.85);
        height: 100%;
        width: 100%;
        top: 0;
        left: 0;

        position: absolute;
        box-sizing: border-box;
        transition: all 0.2s;
         background-color: $overlay-color;

        .inner {
            opacity: 0;
            display: grid;
            z-index: 1;
             opacity: 1;
        }
       
    }
}
.member-avatar__wrap {
    position: relative;
    aspect-ratio: 1/1;
    overflow: visible;
    .member-avatar__container {
        overflow: visible;
        transition: all 0.2s;
        cursor: pointer;
    }
}
</style>
<script setup>
import {useElementHover, onClickOutside} from '@vueuse/core'
const props = defineProps({
    editing: Boolean,
    player: Object,
});

const $q = useQuasar();
const emit = defineEmits(["cancelInvitation", "edit", "removePlayer"]);

const positions = {
    lead: {
        name: "Lead",
        icon: "looks_one",
        value: "lead",
    },
    second: {
        name: "Second",
        icon: "looks_two",
        value: "second",
    },
    third: {
        name: "Third",
        icon: "looks_three",
        value: "third",
    },
    fourth: {
        name: "Fourth",
        icon: "looks_four",
        value: "fourth",
    },
    fifth: {
        name: "Fifth",
        icon: "looks_five",
        value: "fifth",
    },
    coach: {
        name: "Coach",
        icon: "assignment",
        value: "coach",
    },
    alternate: {
        name: "Alternate",
        icon: "exposure_zero",
        value: "alternate",
    },
    skip: {
        name: "Skip",
        icon: "psychology",
        value: "skip",
    },
};

const container = ref(null)

const hovered = useElementHover(container)

const showEdit = ref(false)

const onClick = () => {
    if (!$q.screen.xs) return;
    showEdit.value = true;
}

onClickOutside(container, () => {
    if (!$q.screen.xs) return;
     showEdit.value = false;
})

</script>
