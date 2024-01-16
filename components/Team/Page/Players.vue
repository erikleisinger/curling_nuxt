<template>
    <div class="player-tile__container--outer">
        <!-- <div class="player-tiles__header full-width row justify-center">
        <div class="player-tiles__header--inner">
            Players
        </div>

    </div> -->
        <div class="player-tile__container">
            <TeamPagePlayerTile
                v-for="(player, index) in teamPlayers"
                :key="player.id"
                :playerId="player.id"
                :teamId="teamId"
                :style="{
                    ...getStyle(index),
                    order: PLAYER_SORT_ORDER.indexOf(player.pivot.position),
                }"
                :index="index"
                :columns="columns"
                @click="selectPlayer(player.id)"
                :selected="selectedPlayer?.id === player.id"
                @deselect="onDeselect"
                class="player-tile"
                :class="{
                    'player-tile--edited': selectedPlayer?.id === player.id,
                }"
                :id="`${uniqueId}-${player.id}`"
            />

            <TeamPagePlayerTile
                v-for="(emptySlot, index) in Array.from(
                    Array(emptySlots)
                ).keys()"
                :key="index"
                :teamId="teamId"
                :style="{ ...getStyle(teamPlayers.length + index), order: 10 }"
                :canEdit="canEdit"
                @click="onAddPlayer"
            />

            <div class="rings row justify-center items-center" @click.stop>
                <Rings
                    :size="$q.screen.xs ? '35px' : '40px'"
                    :twelveft="getColor('slate')"
                    :fourft="getColor('slate')"
                    v-show="!selectedPlayer?.id"
                    id="players-rings"
                    data-flip-id="players-menu"
                />
                <div
                    v-show="!!selectedPlayer?.id"
                    class="edit-menu"
                    id="player-edit-menu"
                    data-flip-id="players-menu"
                    ref="editMenu"
                >
                    <div class="row menu-inner">
                        <q-btn
                            flat
                            round
                            icon="visibility"
                            v-if="selectedPlayer?.id"
                            @click="navigateTo(`/player/${selectedPlayer?.id}`)"
                        />
                        <q-btn
                            flat
                            round
                            icon="edit"
                            v-if="canEdit && selectedPlayer?.id"
                            @click="beginSelectPosition"
                        >
                        </q-btn>
                        <q-btn
                            flat
                            round
                            icon="person_remove"
                            v-if="canEdit && selectedPlayer?.id"
                            @click="showConfirmDelete = true"
                        />
                        <q-btn
                            flat
                            round
                            icon="add"
                            v-if="!selectedPlayer?.id"
                        />
                    </div>
                </div>
            </div>

            <GlobalMenu v-model="showMenu">
                <TeamPagePlayerPositionSelect
                    v-model="editedPlayer.position"
                    :playerId="editedPlayer?.id"
                    ref="positionSelectMenu"
                    class="player-position-select"
                />
            </GlobalMenu>
            <GlobalMenu v-model="showConfirmDelete">
                <DialogCard ref="confirmDelete">
                    <template v-slot:title>
                        Remove {{ selectedPlayer?.first_name }}?
                    </template>

                    <template v-slot:content>
                        {{ selectedPlayer?.first_name }}
                        {{ selectedPlayer?.last_name }} will be
                        <strong>removed</strong> from {{ team.name }}'s team
                        roster.
                    </template>
                    <template v-slot:footer>
                        <div class="row justify-between q-my-sm full-width">
                        <Button
                            rounded
                            class="confirm-btn "
                            color="white"
                            text-color="slate"
                            @click="showConfirmDelete = false"
                            >Cancel</Button
                        >
                        <Button rounded class="confirm-btn red" @click="onRemove" color="red"
                            >Confirm</Button
                        >
                        </div>
                    </template>
                </DialogCard>
            </GlobalMenu>
        </div>
    </div>
</template>
<style lang="scss"></style>
<style lang="scss" scoped>




.player-tiles__header--inner {
    @include chunky-border(6px);
    font-family: $font-family-header;
    @include bg-slate-diagonal;
    color: white;
    padding: 0px var(--space-xl);
    padding-top: var(--space-xxxs);
    box-shadow: $pretty-shadow;
    border-bottom: unset;
    border-top-left-radius: 16px;
    border-top-right-radius: 16px;
    position: relative;
    line-height: 1;
    @include text-caption;
}
.player-tile__container {
    display: grid;
    position: relative;
    grid-template-columns: v-bind(columnStyle);
    @include chunky-border(8px);
    background-color: rgb(203, 203, 203);
    border-radius: 83px;
    min-height: 316px;
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
import TeamPlayer from "@/store/models/team-player";
import { useDialogStore } from "@/store/dialog";
import { parseAvatar } from "@/utils/avatar";
import { useTeamRequestStore } from "@/store/team-requests";
import { useUserTeamStore } from "@/store/user-teams";
import { onClickOutside } from "@vueuse/core";
import { useNotificationStore } from "@/store/notification";
import { useQueryClient } from "@tanstack/vue-query";
import { TEAM_POSITIONS } from "@/constants/team";
import gsap from "gsap";
import { Flip } from "gsap/Flip";

gsap.registerPlugin(Flip);

const queryClient = useQueryClient();

const props = defineProps({
    teamId: Number,
});

const showMenu = ref(false);

const doAnimation = (state) => {
    Flip.from(state, {
        nested: true,
        duration: 0.2,
        fade: true,
        scale: true,
    });
};

const selectedPlayer = ref(null);

const selectPlayer = (id) => {
    const state = Flip.getState("#players-rings,#player-edit-menu");
    const shouldDoAnimation = !id || selectedPlayer.value?.id !== id;
    if (selectedPlayer.value?.id === id) {
        selectedPlayer.value = null;
    } else {
        selectedPlayer.value = teamPlayers.value?.find(
            ({ id: playerId }) => playerId === id
        );
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

const PLAYER_SORT_ORDER = [
    TEAM_POSITIONS.skip.value,
    TEAM_POSITIONS.fourth.value,
    TEAM_POSITIONS.third.value,
    TEAM_POSITIONS.second.value,
    TEAM_POSITIONS.lead.value,
    TEAM_POSITIONS.fifth.value,
    TEAM_POSITIONS.alternate.value,
    TEAM_POSITIONS.coach.value,
    null,
];

const teamPlayers = computed(() => {
    return team.value.players
        ?.filter(({ pivot }) => !pivot.status)
        .sort((a, b) => {
            const { pivot: pivotA } = a;
            const { pivot: pivotB } = b;
            const { position: positionA } = pivotA;
            const { position: positionB } = pivotB;
            return (
                PLAYER_SORT_ORDER.indexOf(positionA) -
                PLAYER_SORT_ORDER.indexOf(positionB)
            );
        });
});

const pendingPlayers = computed(() =>
    team.value.players?.filter(({ pivot }) => !!pivot.status)
);
const { user: userId } = useUser();
const hasRequested = computed(
    () =>
        !canEdit.value &&
        pendingPlayers.value.some(({ id }) => id === userId.value)
);

const columns = computed(() => (teamPlayers.value?.length < 4 ? 2 : 3));

const emptySlots = computed(() => {
    if (columns.value === 2) {
        return 4 - teamPlayers.value?.length ?? 4;
    }
    return 6 - teamPlayers.value?.length ?? 4;
});
// const columns = computed(() => 3)
const columnStyle = computed(() => {
    if ($q.screen.xs) {
        return `repeat(2, 1fr)`;
    }
    return `repeat(${columns.value}, 1fr)`;
});

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
    } else if (!$q.screen.xs) {
        directions = {
            0: "top-left",
            1: null,
            2: "top-right",
            3: "bottom-left",
            4: null,
            5: "bottom-right",
        };
    } else {
        directions = {
            0: "top-left",
            1: "top-right",
            2: null,
            3: null,
            4: "bottom-left",
            5: "bottom-right",
        };
    }
    if (!directions[index]) return {};
    return {
        [`border-${directions[index]}-radius`]: "50%",
    };
};

const editMenu = ref(null);
const positionSelectMenu = ref(null);
const confirmDelete = ref(null);

const onDeselect = (e) => {
    if (e.composedPath().includes(positionSelectMenu.value?.$el)) return;
    if (e.composedPath().includes(editMenu.value)) return;
    if (e.composedPath().includes(confirmDelete.value?.$el)) return;
    nextTick(() => {
        if (showMenu.value) {
            endEdit();
        } else {
            selectPlayer(null);
        }
    });
};

const inviteUser = async (e) => {
    await useTeamRequestStore().sendTeamInvitation({
        requestee_profile_id: e.profile_id,
        team_id: props.teamId,
    });
    queryClient.invalidateQueries({
        queryKey: ["team", "players", props.teamId],
    });
};

const { toggleGlobalSearch } = useDialogStore();

const onAddPlayer = () => {
    if (!canEdit.value) return;
    toggleGlobalSearch({
        open: true,
        options: {
            resourceTypes: ["profile"],
            inputLabel: "Invite a player",
            callback: inviteUser,
            filterIds: team.value.players.map(({ id }) => id),
            filterIdMsg: (e) => {
                if (teamPlayers.value.some(({ id }) => e.profile_id === id))
                    return `${e.first_name} is already on ${team.value.name}`;
                return `An invitation has already been sent to ${e.first_name}.`;
            },
        },
    });
};

const showConfirmDelete = ref(false);

const removePlayer = async (playerId) => {
    const client = useSupabaseClient();
    const { errors } = await client
        .from("team_profile_junction")
        .delete()
        .eq("profile_id", playerId)
        .eq("team_id", props.teamId);
    if (errors) console.error(errors);
};

const onRemove = async () => {
    // removing.value = true;
    showConfirmDelete.value = false;
    const { id: playerId } = { ...selectedPlayer.value };
    selectPlayer(null);
    useRepo(TeamPlayer)
        .where("team_id", props.teamId)
        .where("player_id", playerId)
        .delete();
    const { user: userId } = useUser();
    await removePlayer(playerId);
    if (userId.value === playerId) {
        useUserTeamStore().fetchUserTeams(true);
    }
    // }

    queryClient.invalidateQueries({
        queryKey: ["team", "players", props.teamId],
    });

};

const editedPlayer = ref({});
const selectingPosition = ref(false);

const beginSelectPosition = () => {
    const p = { ...(selectedPlayer.value ?? {}) };
    editedPlayer.value = editedPlayer.value = {
        id: p.id,
        position: p.pivot.position,
    };
    showMenu.value = true;
};

const uniqueId = `player-tile-${(Math.random() * 1000000000000).toFixed()}`;

const endEdit = () => {
    const originalPlayer = selectedPlayer.value;
    if (!originalPlayer) return;
    const { position: originalPosition } = originalPlayer.pivot;
    const { position: newPosition, id: playerId } = { ...editedPlayer.value };
    if (newPosition === originalPosition) return;
    selectedPlayer.value = null;

    editedPlayer.value = {};
    showMenu.value = false;

    updatePlayerPosition(newPosition, playerId);
};

const updatePlayerPosition = async (position, playerId) => {
    const notId = useNotificationStore().addNotification({
        status: "pending",
        text: "Updating player...",
    });
    const client = useSupabaseClient();
    useRepo(TeamPlayer)
        .where("team_id", props.teamId)
        .where("player_id", playerId)
        .update({ position });
    const { errors } = await client
        .from("team_profile_junction")
        .update({
            position,
        })
        .eq("team_id", props.teamId)
        .eq("profile_id", playerId);

    if (errors) {
        useNotificationStore().updateNotification(notId, {
            status: "failed",
            text: `Error updating player: ${errors?.message}`,
            timeout: 8000,
        });
    } else {
        useNotificationStore().updateNotification(notId, {
            status: "completed",
            text: `Player updated!`,
            timeout: 1000,
        });
    }

    queryClient.invalidateQueries({
        queryKey: ["team", "players", props.teamId],
    });
};

const tileWidth = computed(() => {
    if (props.columns === 3) {
        return $q.screen.xs ? "120px" : "150px";
    } else {
        return $q.screen.xs ? "150px" : "160px";
    }
});




</script>
