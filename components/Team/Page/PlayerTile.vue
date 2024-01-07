<template>
    <div
        class="player-tile clickable"
        ref="playerRef"
        :class="{ empty: !playerId, selected, reverse }"
    >
        <q-chip class="position-chip" dense v-if="playerId">{{
            player.position ?? "Member"
        }}</q-chip>
        <div class="avatar-container full-width row justify-center">
            <div
                class="avatar__control"
                :class="{ empty: !playerId }"
                v-if="playerId"
            >
                <Avataaar v-bind="parseAvatar(player.avatar)" />
            </div>
        </div>
        <h3 class="player-name text-center" style="visibility: hidden">
            {{ player.first_name }}
            <br />
            {{ player.last_name }}
        </h3>

        <div class="player-name__float text-center">
            <div class="player-name__float--underlay" />
            <div class="player-name__text">
                {{ player.first_name }}
                <br />
                {{ player.last_name }}
            </div>
        </div>
        <div v-if="canEdit && !playerId" class="floating--add">
            <q-btn
                round
                icon="add"
                class="add-button"
                flat
                @click="emit('add')"
            />
        </div>
        <!-- <transition appear enter-active-class="animated fadeIn">
            <div class="menu" :class="{ reverse }" v-if="selected">
                <div>

                </div>
            </div>
        </transition> -->
    </div>
</template>
<style lang="scss" scoped>
.player-tile {
    padding: var(--space-sm);
    background-color: $app-slate;

    &.empty {
        transform: scale(0.8);
        @include bg-white-diagonal;
        background-color: rgb(216, 216, 216);
    }

    &:not(.empty) {
        @include chunky-border(6px);
    }

    transition: transform 0.15s;
    &.selected {
        transform: v-bind(transform);
        z-index: 4;
    }
    &.empty {
        &.selected {
            transform: scale(0.85);
        }
    }
    &:before {
        content: "";
        position: absolute;
        top: 0;
        bottom: 0;
        right: 0;
        left: 0;

        border-radius: inherit;
    }

    color: white;

    width: v-bind(width);
    position: relative;

    aspect-ratio: 1/1;
    box-shadow: $pretty-shadow;
    .avatar-container {
        height: 40px;
        margin: auto;
        margin-top: -5%;
        position: relative;
        z-index: 1;
        .avatar__control {
            width: 65px;
            position: absolute;
            bottom: calc(var(--space-lg) * -1);
            &.empty {
                -webkit-filter: grayscale(100%);
                filter: grayscale(100%);
            }
        }
    }
    .player-name {
        overflow: hidden;
        @include text-caption;
        line-height: 1;
        @include md {
            @include reg-text;
        }
        margin-top: var(--space-sm);
        z-index: 2;
        position: relative;
        overflow: hidden;
    }

    .player-name__float {
        position: absolute;
        width: 100%;
        overflow: hidden;

        font-size: 1.2rem;
        line-height: 1;
        @include md {
            @include reg-text;
        }
        font-family: $font-family-header;

        bottom: 0;
        left: 0;
        .player-name__text {
            z-index: 1;
            position: relative;

            padding: 0px var(--space-sm);
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }
        padding: var(--space-sm) 0px;
    }

    .floating--add {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        .add-button {
            color: $app-slate;
            font-size: 1em;
        }
    }

    .position-chip {
        position: absolute;
        top: 0;
        display: none;
        margin: auto;
        width: fit-content;
        top: -0.2em;
        // left: -0.2em;
        font-family: $font-family-header;
        background-color: $app-blue;
        color: white;
        // color: $app-slate;
        z-index: 2;
    }

    .menu {
        position: absolute;
        right: -99%;
        // height: 100%;
        width: 100%;
        background-color: white;
        @include chunky-border(6px);
        border-left-width: 0px;
        top: -6px;
        bottom: -6px;
        z-index: 10;
        background-color: $app-slate;
        &:before {
            border-left-width: 0px;
        }
        &:after {
            border-left-width: 0px;
        }
        &.reverse {
            right: unset;
            left: -99%;
            border-left-width: 6px;
            border-right-width: 0px;
            border-top-left-radius: 32px;
            border-bottom-left-radius: 32px;
            transform-origin: right;
        }
        &:not(.reverse) {
            border-top-right-radius: 32px;
            border-bottom-right-radius: 32px;
            transform-origin: left;
        }
        &.reverse {
            &:before {
                border-right-width: 0px;
            }
            &:after {
                border-right-width: 0px;
            }
        }
        animation: scaleIn 0.1s forwards;
    }
}

@keyframes scaleIn {
    0% {
        transform: scaleX(0);
    }

    100% {
        transform: scaleX(1);
    }
}
</style>
<script setup>
import { parseAvatar } from "@/utils/avatar";
import TeamPlayer from "@/store/models/team-player";
import { onClickOutside } from "@vueuse/core";

const props = defineProps({
    canEdit: Boolean,
    index: Number,
    columns: Number,
    playerId: {
        type: String,
        required: false,
    },
    selected: Boolean,
    teamId: Number,
});

const emit = defineEmits(["deselect"]);

const player = computed(() => {
    const p = useRepo(TeamPlayer)
        .with("player")
        .where("player_id", props.playerId)
        .where("team_id", props.teamId)
        .first();
    return {
        ...p,
        ...(p?.player ?? []),
    };
});

const transform = computed(() => {
    if (!props.playerId) return null;
    let t;
    const amount = 10;
    if (props.columns === 2) {
        t = {
            0: `translate(-${amount}px, -${amount}px)`,
            1: `translate(${amount}px, -${amount}px)`,
            2: `translate(-${amount}px, ${amount}px)`,
            3: `translate(${amount}px, ${amount}px)`,
        };
    }
    return `scale(1.05) ${t[props.index]}`;
});

const reverse = computed(
    () =>
        (props.columns === 2 && (props.index === 1 || props.index === 3)) ||
        (props.columns === 3 && (props.index === 2 || props.index === 5))
);

const onOutsideClick = (e) => {
    if (!props.selected) return;
    emit("deselect", e);
};

const playerRef = ref(null);
onClickOutside(playerRef, onOutsideClick);


const $q = useQuasar();

const width = computed(() => {
    if (props.columns === 3) {
        return $q.screen.xs ? '120px' : '150px'
        
        
    } else {
        return $q.screen.xs ? '150px' : '160px';
    }
})
</script>
