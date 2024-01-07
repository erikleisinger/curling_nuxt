<template>
    <div class="player-tile__container">
        <TeamPagePlayerTile
            v-for="(player, index) in teamPlayers"
            :key="player.id"
            :playerId="player.id"
            :teamId="teamId"
            :style="getStyle(index)"
            :index="index"
            :columns="columns"
            @click="selectPlayer(index)"
            :selected="selected === index"
            @deselect="onDeselect"
            :id="`player-tile-${index}`"
            data-flip-id="editedTile"
            v-show="editedPlayer?.id !== player.id"

        />
        <TeamPagePlayerTile
            v-for="(emptySlot, index) in Array.from(Array(emptySlots)).keys()"
            :key="index"
            :teamId="teamId"
            :style="getStyle(teamPlayers.length + index)"
            :canEdit="canEdit"
            @click="onAddPlayer"
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
                    <q-btn flat round icon="person_remove" v-if="canEdit" @click="onRemove(team.players[selected].id)"/>
                </div>
        
            </div>
        
        </div>
    <div class="tile-edit__container--floating row items-center justify-center" v-if="editedPlayer" >
        <div class="edited-tile" v-on-click-outside="endEdit" v-if="editedPlayer">
            <TeamPagePlayerTile :teamId="team.id" :playerId="editedPlayer?.id" v-model="editedPlayer.position" :columns="2" :index="1" editing id="edited-player-tile"   data-flip-id="editedTile"/>
        </div>
        </div>
    </div>
  
</template>
<style lang="scss">

</style>
<style lang="scss" scoped>
.tile-edit__container--floating {
    position: fixed;
    z-index: 10;
    top: 0;
    height: fit-content;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    z-index: 100;
    .edited-tile {
        transform: scale(2)
    }
}
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
              position: relative;
           
            #position-select-menu {
    position: absolute;
    bottom: -100%;
    left: 0;
    right: 0;
    margin: auto;
    width: fit-content;
    z-index: 8;
    background-color: white;
}
        }
    }
}
</style>

<script setup>
import Team from "@/store/models/team";
import TeamPlayer from '@/store/models/team-player'
import {useDialogStore} from '@/store/dialog';
import {useTeamRequestStore} from '@/store/team-requests'
import {useUserTeamStore} from '@/store/user-teams'
import {vOnClickOutside} from '@vueuse/components'
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

const selectPlayer = (index) => {
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

const teamPlayers = computed(() => team.value.players?.filter(({pivot}) => !pivot.status));

const columns = computed(() => (team.value?.players?.length < 5 ? 2 : 3));

const emptySlots = computed(() => {
    if (columns.value === 2) {
        return 4 - teamPlayers.value?.length ?? 4;
    }
    return 6 - teamPlayers.value?.length ?? 4;
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
    selectPlayer(null)
}


const inviteUser = async (e) => {
    await useTeamRequestStore().sendTeamInvitation({
        requestee_profile_id: e.profile_id,
        team_id: props.teamId,
    });
    queryClient.invalidateQueries({
        queryKey: ["team", "players", props.teamId],
    });
};

const {toggleGlobalSearch} = useDialogStore();

const onAddPlayer = () => {
    if (!canEdit.value) return;
    toggleGlobalSearch({
        open: true,
        options: {
            resourceTypes: ['profile'],
            inputLabel: 'Invite a player',
            callback: inviteUser,
            filterIds: team.value.players.map(({id}) => id)
        }
    })
}
const removePlayer = async (playerId) => {
    const client = useSupabaseClient();
    const { errors } = await client
        .from("team_profile_junction")
        .delete()
        .eq("profile_id", playerId)
        .eq("team_id", props.teamId);
    if (errors) console.error(errors);
};

const onRemove = async (playerId) => {
    // removing.value = true;
    selectPlayer(null)
    useRepo(TeamPlayer).where("team_id", props.teamId).where("player_id", playerId).delete();
    // if (requestStatus.value) {
    //     if (requestStatus.value === "requested") {
    //         await useTeamRequestStore().deleteTeamRequest({
    //             teamId: props.teamId,
    //             profileId: props.playerId,
    //         });
    //     } else if (requestStatus.value === "invited") {
    //         await useTeamRequestStore().deleteTeamInvitation({
    //             teamId: props.teamId,
    //             profileId: props.playerId,
    //         });
    //     }
    // } else {
        const {user:userId} = useUser();
        await removePlayer(playerId);
        if (userId.value === playerId) {
            useUserTeamStore().fetchUserTeams(true)
        }
    // }

    queryClient.invalidateQueries({
        queryKey: ["team", "players", props.teamId],
    });

    // removing.value = false;
    // confirmOpen.value = false;
};


const animateEdit = (state) => {
    Flip.from(state, {
        duration: 0.2,
        scale: true,
        fade: true,
        nested: true,
    })
}

const editedPlayer = ref(null)
const selectingPosition = ref(false);

const beginSelectPosition = () => {
    console.log(`#edited-player-tile,#player-tile-${selected.value}`)
    const state = Flip.getState(`#edited-player-tile , #player-tile-${selected.value}`);
    editedPlayer.value = [...team.value.players][selected.value];
    nextTick(() => {
        animateEdit(state)
    })
}

const endEdit = () => {
    const state = Flip.getState(`#edited-player-tile , #player-tile-${selected.value}`);
    editedPlayer.value = null;
     nextTick(() => {
        animateEdit(state)
    })
}


</script>
