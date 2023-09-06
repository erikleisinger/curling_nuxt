<template>
    <div style="position: relative full-width">
        <div class="result__container--wrap" @click="reveal">
            <!-- <div class="more-options__container">
                      
                    </div> -->
            <div class="row no-wrap">
                <div style="visibility: hidden; margin-left: -12px">
                    <q-fab
                        padding="0px"
                        flat
                        icon="more_horiz"
                        color="grey-8"
                    />
                </div>
                <div class="result__header" ref="container">
                    <slot name="before" />
                    <div class="result__container" @click="emit('expand')">
                        <div class="team__profile--container column no-wrap">
                            <div class="team-avatar__container">
                                <div class="team-avatar--wrap">
                                    <TeamAvatar
                                        :team="team1"
                                        :color="team1.color"
                                        :viewable="!!team1.id"
                                    />
                                </div>
                            </div>

                            <h2
                                class="text-sm truncate-text text-center col-grow row items-center justify-center"
                            >
                                {{ team1.name }}
                            </h2>
                        </div>

                        <div class="row items-center full-width">
                            <div
                                class="row justify-around items-center text-xxxl full-width"
                            >
                                <div
                                    class="column justify-center items-center no-wrap"
                                >
                                    <div
                                        class="score"
                                        :class="{
                                            winning:
                                                team1.points_scored >
                                                team2.points_scored,
                                        }"
                                    >
                                        {{ team1.points_scored}}
                                    </div>
                                </div>
                                <div
                                    class="column justify-center items-center no-wrap"
                                >
                                    <div
                                        class="score"
                                        :class="{
                                            winning:
                                                team2.points_scored >
                                                team2.points_scored,
                                        }"
                                    >
                                        {{ team2.points_scored }}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="team__profile--container column no-wrap">
                            <div class="team-avatar__container">
                                <div class="team-avatar--wrap">
                                    <TeamAvatar
                                        :team="team2"
                                        :color="team2.color"
                                        :viewable="!!team2.id"
                                        :invitable="
                                            !!(!team2?.id && authorized)
                                        "
                                        @invite="
                                            toggleGlobalSearch({
                                                open: true,
                                                options: {
                                                    inputLabel:
                                                        'Search for a team to invite',
                                                    resourceTypes: ['team'],
                                                    filterIds: [result.home_id],
                                                    callback: (team) =>
                                                        emit('invite', team),
                                                },
                                            })
                                        "
                                    />
                                </div>
                            </div>
                            <div class="text-center row justify-center">
                                <div
                                    style="
                                        width: fit-content;
                                        position: relative;
                                    "
                                >
                                    <div class="verified__container">
                                        <q-icon
                                            :name="
                                                !!team2?.id
                                                    ? 'verified'
                                                    : 'o_smart_toy'
                                            "
                                            :color="
                                                !team2.pending
                                                    ? 'primary'
                                                    : 'grey-7'
                                            "
                                        />
                                    </div>
                                    <h2
                                        class="text-sm truncate-text text-center"
                                        style="
                                            width: fit-content;
                                            position: relative;
                                        "
                                    >
                                        {{ team2.name}}
                                    </h2>
                                </div>
                                <q-tooltip v-if="$q.platform.is.desktop">
                                    <div v-if="!team2.pending">
                                        {{ team2.name }} has verified that
                                        this score is accurate.
                                    </div>
                                    <div v-else>
                                        Game is unverified by
                                        {{ team2.name }} and may not be
                                        accurate.
                                    </div>
                                </q-tooltip>
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
                                <div
                                    class="truncate-text"
                                    v-if="result.sheet_name"
                                >
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
                <div style="margin-left: -12px">
                    <q-fab
                        padding="0px"
                        flat
                        icon="more_horiz"
                        color="grey-8"
                        direction="down"
                        vertical-actions-align="right"
                    >
                        <q-fab-action
                            icon="visibility"
                            color="primary"
                            label="View game"
                            :to="`/games/${result.id}`"
                        />
                        <slot name="actions" />
                    </q-fab>
                    <q-badge
                        color="deep-purple"
                        rounded
                        floating
                        style="margin-top: 4px"
                        v-if="notify"
                    >
                    </q-badge>
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="scss" scoped>
$result-height: 50px;
$columns: 1fr 80px 1fr;
$max-container-width: 500px;
.result__container--wrap {
    max-height: fit-content;
    box-sizing: border-box;
    transition: all 1s;
    position: relative;
    overflow: visible;
    margin: auto;
    max-width: $max-container-width;
    .more-options__container {
        position: absolute;
        // right: 0;
        left: 0;
        top: 0;
        margin: auto;
        width: fit-content;
        height: 34px;
    }
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

        width: 100%;
        box-sizing: border-box;
        .game-request-response__container {
            margin: 0px var(--space-sm);
            margin-bottom: var(--space-md);
        }
    }

    .result__container {
        display: grid;
        grid-template-rows: 100%;
        grid-template-columns: $columns;
        // border-bottom: 1px solid $grey-3;
        max-width: $max-container-width;
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
        .verified__container {
            position: absolute;
            z-index: 1;
            font-size: 1em;
            bottom: 0;
            left: -1em;
            height: 1.1em;
        }
    }
    .game-details {
        position: relative;
    }

    .score {
        margin: auto !important;
        font-size: 35px;
        transition: all 0.2s;
        &.winning {
            // text-decoration: underline;
            // text-decoration-color: $green;

            font-weight: bold;
        }
    }

    .view__overlay {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        top: 0;
        margin: auto;
        transform-origin: center;
        transition: all 0.3s;
        border-radius: 8px;
        max-width: $max-container-width;
    }
}
</style>
<script setup>
import { useDialogStore } from "@/store/dialog";
import { useUserTeamStore } from "@/store/user-teams";
import { useGameRequestStore } from "@/store/game-requests";
import {
    onClickOutside,
    useElementBounding,
    useElementSize,
    useParentElement,
    watchDebounced,
    useConfirmDialog,
} from "@vueuse/core";
import { numberToLetter } from "@/utils/sheets";
import Team from "@/store/models/team";

const $q = useQuasar();

const dialogStore = useDialogStore();

const { toggleGlobalSearch } = dialogStore;

const props = defineProps({
    authorized: Boolean,
    notify: {
        type: Boolean,
        default: true,
    },
    result: Object,
});

const team1 = computed(() => {
    const {pending, points_scored, color} = props.result.teams[0] || {}
    return {
        ...(useRepo(Team).where("id", props.result.teams[0].team_id).first() ?? {}),
    color,
    points_scored,
    pending,
    }
});
const team2 = computed(() => {
    const {pending, points_scored, color} = props.result.teams[1] || {}
    return {
        ...(useRepo(Team).where("id", props.result.teams[1].team_id).first() ?? {name: 'Unnamed team'}),
    color,
    points_scored,
    pending,
    }
});

const emit = defineEmits(["expand", "update", "remove", "invite"]);

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

const { format, toTimezone } = useTime();

const { user: userId } = useUser();

const { reveal, isRevealed, confirm, cancel, onConfirm, onCancel } =
    useConfirmDialog();

onConfirm(() => {
    return navigateTo(`/games/${props.result?.id}`);
});

const confirmOverlay = ref(null);

onClickOutside(confirmOverlay, cancel);
</script>
