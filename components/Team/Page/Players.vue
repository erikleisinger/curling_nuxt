<template>
    <div class="player-tile__container">
        <TeamPagePlayerTile
            v-for="(player, index) in team.players"
            :key="player.id"
            :playerId="player.id"
            :teamId="teamId"
            :style="getStyle(index)"
            :index="index"
            :columns="columns"
            @click="onClick(index)"
            :selected="selected === index"
            @deselect="onDeselect"
        />
        <TeamPagePlayerTile
            v-for="(emptySlot, index) in Array.from(Array(emptySlots)).keys()"
            :key="index"
            :teamId="teamId"
            :style="getStyle(team?.players?.length + index)"
            :canEdit="canEdit"
        />

        <div class="rings row justify-center items-center" @click.stop>
            <Rings
                :size="$q.screen.xs ? '35px' : '40px'"
                :twelveft="getColor('slate')"
                :fourft="getColor('slate')"
                v-show="selected === null"
                id="players-rings"
                data-flip-id="players-menu"
            />
            <div
                v-show="selected !== null"
                class="edit-menu"
                id="player-edit-menu"
                data-flip-id="players-menu"
                ref="editMenu"
            >
                <div class="row menu-inner">
                    <q-btn flat round icon="visibility" @click="navigateTo(`/player/${team.players[selected].id}`)"/>
                    <q-btn flat round icon="edit" v-if="canEdit" />
                    <q-btn flat round icon="person_remove" v-if="canEdit" />
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="scss" scoped>
.player-tile__container {
    display: grid;
    position: relative;
    grid-template-columns: v-bind(columnStyle);
    @include chunky-border(8px);
    background-color: rgb(203, 203, 203);
    border-radius: 83px;
    @include sm {
        border-radius: 85px;
    }
    padding: 0px;
    &:before {
        content: "";
        top: -10px;
        bottom: -10px;
        left: -10px;
        right: -10px;
        border: 1px solid rgba(0, 0, 0, 0.02);
        position: absolute;
        border-radius: inherit;
        pointer-events: none;
    }
    &:after {
        pointer-events: none;
    }
    
    .rings {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        top: 0;
        margin: auto;
pointer-events: none;
       
        z-index: 6;
        &.left {
            right: unset;
            left: 29%;
        }
        &.right {
            left: unset;
            right: 37%;
        }

        #players-rings {
            pointer-events: all;
        }
       

        .edit-menu {
            background-color: white;
            border-radius: 24px;
            padding: 4px;
            z-index: 1;
            pointer-events: all;
            color: $app-slate;
        }
    }
}
</style>

<script setup>
import Team from "@/store/models/team";
import gsap from "gsap";
import { Flip } from "gsap/Flip";
gsap.registerPlugin(Flip);

const props = defineProps({
    teamId: Number,
});

const doAnimation = (state) => {
    Flip.from(state, {
        nested: true,
        duration: 0.2,
        fade: true,
        scale: true,
    });
};

const selected = ref(null);

const onClick = (index) => {
    const state = Flip.getState("#players-rings,#player-edit-menu");
    const shouldDoAnimation =
        selected.value === null || selected.value === index;
    if (selected.value === index) {
        selected.value = null;
    } else {
        selected.value = index;
    }
    if (!shouldDoAnimation) return;
    nextTick(() => {
        doAnimation(state);
    });
};

const { isOnTeam } = useTeam();

const canEdit = computed(() => isOnTeam(props.teamId));

const { getColor } = useColor();
const $q = useQuasar();
const team = computed(() =>
    useRepo(Team).with("players").where("id", props.teamId).first()
);

const columns = computed(() => (team.value?.players?.length < 5 ? 2 : 3));

const emptySlots = computed(() => {
    if (columns.value === 2) {
        return 4 - team.value?.players?.length ?? 4;
    }
    return 6 - team.value?.players?.length ?? 4;
});
// const columns = computed(() => 3)
const columnStyle = computed(() => `repeat(${columns.value}, 1fr)`);

const getStyle = (index) => {
    let directions;

    // if (false) {
    if (columns.value === 2) {
        directions = {
            0: "top-left",
            1: "top-right",
            2: "bottom-left",
            3: "bottom-right",
        };
    } else {
        directions = {
            0: "top-left",
            1: null,
            2: "top-right",
            3: "bottom-left",
            4: null,
            5: "bottom-right",
        };
    }
    if (!directions[index]) return null;
    return `border-${directions[index]}-radius: 50%`;
};

const editMenu = ref(null)

const onDeselect = (e) => {
    if (e.composedPath().includes(editMenu.value)) return;
    onClick(null)
}
</script>
