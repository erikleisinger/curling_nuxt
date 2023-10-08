<template>
    <div class="player__container row no-wrap" :class="{ editing }" ref="container" @click="onClick">
        <slot>
        <div class="row text-grey-8 justify-between">

            <!-- Player avatar -->

            <div  class="member-avatar__wrap row items-center q-mr-sm">
                <div style="width: inherit" class="member-avatar__container">
                    <div class="avatar-highlight--helper" />
                    <Avataaar v-bind="player.avatar" class="player-avatar" />
                </div>
            </div>

            
        </div>



        <div class="row no-wrap  full-width justify-between items-center" style="overflow: hidden">

                    <!-- Player name -->
            <div style="min-width: 0" class="playername" >
                <div class="truncate-text text-sm font-main text-uppercase">
                    {{ player.first_name }} 
                </div>
                <div class="text-lg font-main text-uppercase text-bold lastname truncate-text">
                    {{ player.last_name }}
                </div>
                <!-- <div class="text-xs">@{{ player.username }}</div> -->
            </div>

            <!-- Player position -->

            <div class="text-sm player-position col-auto text-grey-7" >
                <span v-if="!player.status" >
                {{ positions[player.position]?.name ?? "Member" }}
                </span>
                <span v-else-if="player.status === 'pending'">
                {{create ? 'Invitation pending' : 'Invited'}}
                </span>
            </div>
        </div>
        <transition appear enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
        <div class="edit-overlay" v-if="editing && ((!$q.screen.xs && hovered) || ($q.screen.xs && showEdit))">
            <div class="inner full-height" :style="{'grid-template-columns': player.status ? '100%' : 'repeat(2, 50%)'}">
                <div class="row justify-center items-center full-height full-width" v-if="!player.status || create">
                    <q-btn flat color="red" stretch class="full-width" @click="emit('removePlayer', player)">Remove from team</q-btn>
                </div>
                <div class="row justify-center items-center full-height full-width" v-else-if="!create">
                    <q-btn flat color="white" stretch class="full-width" v-if="!player.status" @click="showSelect = true">Edit position</q-btn>
                      <q-btn flat color="red" stretch class="full-width" v-if="!!player.status" @click="emit('cancelInvitation', player.id)">Cancel invitation</q-btn>
                </div>
            </div>
        </div>
        </transition>
        </slot>
            <DialogSelectPosition v-if="showSelect" :playerId="player?.id" @close="showSelect = false" :teamId="teamId"/>
    </div>

</template>
<style lang="scss" scoped>
.player__container {
    // width: min(calc(50% - var(--space-xs) * 2), 250px);
    width: 100%;
    box-sizing: border-box;
    padding: var(--space-xxxs) 0px;
    // border: 1px solid $grey-4;
    border-radius: 16px;
    // margin: var(--space-xs);
    transition: all 0.2s;
    position: relative;
    overflow: hidden;
    &.editing {
        border: 2px solid $blue-5;
        transform: scale(1.01);
        margin: var(--space-xxxs);
        padding: var(--space-xxxs);
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
    .player-position {
        height: 100%;
        // background-color: $blue;
        display: flex;
        align-items: center;
        // color: white;
        font-weight: bold;
        text-transform: uppercase;
        text-align: center;
        justify-content: center;
    }

}
.member-avatar__wrap {
    position: relative;
    aspect-ratio: 1/1;
    overflow: visible;
    width: 35px;
    .member-avatar__container {
        overflow: visible;
        transition: all 0.2s;
        cursor: pointer;
    }

 
}
       .playername {
        color: #36454F;
        .lastname {
            margin-top: -0.3em;
        }
    }
</style>
<script setup>
import {useElementHover, onClickOutside} from '@vueuse/core'
const props = defineProps({
    create: Boolean,
    editing: Boolean,
    player: Object,
    teamId: Number,
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
      console.log('click')
    showEdit.value = true;
}

onClickOutside(container, () => {
    if (!$q.screen.xs) return;
     showEdit.value = false;
})

const showSelect = ref(false)

</script>
