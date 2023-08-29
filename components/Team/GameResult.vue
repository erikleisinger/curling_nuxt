<template>
    <div style="position: relative full-width">
 
        <div class="result__container--wrap" :class="{ expanded }">
       
            <div
                class="result__header"
                :style="{ backgroundImage }"
                ref="container"
            >
                        <div class="game-request-response__container row no-wrap" v-if="isAuthorized(result.pending_away)">
                            <div class="text-bold">Pending game invitation</div>
                            <q-btn color="positive" class="q-mx-sm" @click="respondToRequest(true)">Accept</q-btn>
                            <q-btn color="negative" @click="respondToRequest(false)">Reject</q-btn>
                        </div>
                <div class="result__container" @click="emit('expand')">
                    <div class="team__profile--container column no-wrap">
                        <div
                            class="team-avatar__container"
                            @click.stop.prevent="onAvatarClick(result.home_id)"
                        >
                            <div class="team-avatar--wrap">
                                <TeamAvatar
                                    :team="{
                                        id: result.home_id,
                                        team_avatar: result.home_avatar,
                                        avatar_type: result.home_avatar_type,
                                        avatar_url: result.home_avatar_url,
                                    }"
                                />
                                <RockIcon
                                    :draggable="false"
                                    :color="result.home_color"
                                />
                            </div>
                        </div>

                        <h2
                            class="text-sm truncate-text text-center col-grow row items-center justify-center"
                        >
                            {{ result.home_name }}
                        </h2>
                    </div>

                    <div class="row items-center full-width">
                        <div
                            class="row justify-around items-center text-xxxl full-width"
                        >
                            <div
                                class="column justify-center items-center no-wrap"
                            >
                                <div class="score">
                                    {{ result.home_points ?? 0 }}
                                </div>
                            </div>
                            <div
                                class="column justify-center items-center no-wrap"
                            >
                                <div class="score">
                                    {{ result.away_points ?? 0 }}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="team__profile--container column no-wrap">
                        <div class="team-avatar__container">
                            <div
                                class="team-avatar--wrap"
                                @click.stop.prevent="
                                    onAvatarClick(result.away_id)
                                "
                            >
                                <TeamAvatar
                                    :team="{
                                        id: result.away_id,
                                        team_avatar: result.away_avatar,
                                        avatar_type: result.away_avatar_type,
                                        avatar_url: result.away_avatar_url,
                                    }"
                                />
                                <RockIcon
                                    :draggable="false"
                                    :color="result.away_color"
                                />
                            </div>
                        </div>
                        <div class="text-center" >
                            <h2 class="text-sm truncate-text text-center">
                                <span v-if="result.away_name">{{
                                    result.away_name
                                }}</span>
                            </h2>
                            <q-chip
                                v-if="isAuthorized(result.home_id) && !result.away_id && !result.pending_away"
                                dense
                                color="deep-purple"
                                text-color="white"
                                class="text-bold"
                                clickable
                                icon="add"
                                @click.stop="
                                    toggleGlobalSearch({
                                        open: true,
                                        options: {
                                            resourceTypes: ['team'],
                                            inputLabel:
                                                'Invite an opposition team',
                                            filterIds: [userId],
                                            callback: selectTeam,
                                        },
                                    })
                                "
                                ><span>Invite team</span>
                            </q-chip>
                            <RequestStatus
                                @click.stop.prevent
                                v-else-if="isAuthorized(result.home_id) && 
                                    !result.away_id && result.pending_away
                                "
                                resourceType="game"
                                :resourceId="result.id"
                                :requesteeId="result.pending_away"
                                :status="'pending'"
                                canEdit
                                @cancel="updateResult"
                            />
                        </div>
                    </div>
                </div>

                <!-- League / Location -->
                <div
                    class="column items-center q-pt-sm game-details"
                    v-if="
                        result.rink_name ||
                        result.sheet_name ||
                        result.event_name ||
                        result.start_time
                    "
                >
                    <div class="text-xs">
                        {{ format(toTimezone(result.start_time)) }}
                    </div>
                    <div class="row no-wrap q-mr-xs items-center">
                        <div
                            class="row no-wrap text-xs q-ml-sm"
                            v-if="result.rink_name"
                        >
                            <q-icon name="location_on" color="red" />
                            <div class="truncate-text">
                                {{ result.rink_name }}
                            </div>
                        </div>
                        <div
                            class="row no-wrap text-xs q-ml-sm"
                            v-if="result.sheet_name"
                        >
                            <q-icon name="crop_portrait" />
                            <div class="truncate-text" v-if="result.sheet_name">
                                Sheet {{ result.sheet_name }}/{{
                                    numberToLetter(result.sheet_name)
                                }}
                            </div>
                            <div class="truncate-text" v-else>
                                Unknown sheet
                            </div>
                        </div>
                        <div
                            class="row no-wrap text-xs justify-end q-ml-sm"
                            v-if="result.event_name"
                        >
                            <q-icon name="emoji_events" color="yellow" />
                            <div class="truncate-text">
                                {{ result.event_name }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div style="overflow:hidden">
            <transition
                appear
                enter-active-class="animated slideInDown"
                leave-active-class="animated slideOutUp"
            >
                <TeamGameResultDetails v-if="expanded" :result="props.result" />
            </transition>
            </div>
        </div>
    </div>
</template>
<style lang="scss" scoped>
$result-height: 50px;
$columns: 1fr 120px 1fr;
.result__container--wrap {
    border-radius: 16px;
    max-height: fit-content;
    border: 1px solid $grey-3;
    box-sizing: border-box;
    transition: all 1s;
    position: relative;
    overflow: hidden;
        margin-bottom: var(--space-sm);
    .start-time--floating {
        position: absolute;
        left: 0;
        right: 0;
        margin: auto;
        text-align: center;
        font-size: var(--text-xs);
    }
    .result__header {
        padding-bottom: var(--space-xs);
        padding-top: var(--space-xs);
        border-radius: inherit;
        padding-left: var(--space-sm);
        padding-right: var(--space-sm);
        z-index: 1;
        width: 100%;
        box-sizing: border-box;
        .game-request-response__container {
            margin: 0px var(--space-sm);
            margin-bottom: var(--space-md);
        }
    }
    &.expanded {
        max-height: unset;
        .result__header {
            padding-bottom: var(--space-xs);
            padding-top: var(--space-xs);
            border-bottom-left-radius: 0;
            border-bottom-right-radius: 0;
        }
    }

    .result__container {
        display: grid;
        grid-template-rows: 100%;
        grid-template-columns: $columns;
        border-bottom: 1px solid $grey-3;
        max-width: 600px;
        margin: auto;
        position: relative;

        .team__profile--container {
            justify-content: center;
            .team-avatar__container {
                .team-avatar--wrap {
                    position: relative;
                    max-width: $result-height;
                    margin: auto;
                    .rock__icon {
                        position: absolute !important;
                        bottom: 0;
                        right: 0;
                        padding: 0;
                        background-color: transparent !important;
                        width: calc($result-height / 2.5);
                    }
                }
            }
        }
    }
    .score {
        margin: auto !important;
        font-size: 35px;
    }
}
</style>
<script setup>
import { useDialogStore } from "@/store/dialog";
import { useUserTeamStore } from "@/store/user-teams";
import { useGameRequestStore } from "@/store/game-requests";
import {
    useElementBounding,
    useElementSize,
    useParentElement,
    watchDebounced,
} from "@vueuse/core";
import { numberToLetter } from "@/utils/sheets";

const dialogStore = useDialogStore();

const { toggleGlobalSearch } = dialogStore;

const props = defineProps({
    expanded: Boolean,
    result: Object,
});

const emit = defineEmits(["expand", "update", 'remove']);

const isVisible = (team, { home_points, away_points }) => {
    if (team === "home") {
        return home_points > away_points ? "visible" : "hidden";
    } else if (team === "away") {
        return away_points > home_points ? "visible" : "hidden";
    }

    return "hidden";
};

const editGame = (gameId) => {
    dialogStore.toggleLineScore({ open: true, editedGame: { id: gameId } });
};

const container = ref(null);
const { height: containerHeight, width: containerWidth } =
    useElementBounding(container);

const { getEventBackground } = useColor();

const backgroundImage = ref(null);

watch(containerHeight, () => {
    backgroundImage.value = getEventBackground(
        props.result.event_color,
        containerHeight.value,
        containerWidth.value
    );
});

const onAvatarClick = (id) => {
    if (!id) return;
    
    dialogStore.toggleTeamViewer({ open: true, team: { id } });
};

const { format, toTimezone } = useTime();

const { user: userId } = useUser();

const updateResult = async () => {
    const { getGameResult } = useGame();
    const [result] = await getGameResult(
        [props.result.home_id],
        props.result.id
    );
    emit("update", result);
};

const selectTeam = async (team) => {
    await useGameRequestStore().sendGameRequest(team, props.result.id);
    updateResult();
};

const respondToRequest = async (accepted) => {
    await useGameRequestStore().updateGameRequestStatus({team_id: props.result.pending_away, game_id: props.result.id, status: accepted ? 'accepted' : 'rejected' });
    if (accepted) {
  updateResult();
    } else {
        emit('remove')
    }
  
}

const isAuthorized = (teamId) => {
    return useUserTeamStore().userTeams.some(
        ({ id, type }) => id === teamId && type === "member"
    );
};
</script>
