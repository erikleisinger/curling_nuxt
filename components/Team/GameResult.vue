<template>
    <div style="position: relative full-width">
        <div class="result__container--wrap">
            <div class="row no-wrap">
                <div class="result__header">
                    <slot name="before" />

                    <div class="result__container" @click="emit('expand')">
                        <div class="team__profile--container column no-wrap">
                            <div class="team-avatar__container">
                                <div class="team-avatar--wrap">
                                    <TeamAvatar
                                        :teamId="home.id"
                                        :color="home.color"
                                        :viewable="!!home.id"
                                    />
                                </div>
                            </div>
                            <div style="width: fit-content; position: relative">
                                <h2
                                    class="text-sm truncate-text text-center col-grow"
                                >
                                    {{ home.name }}
                                </h2>
                                <div
                                    class="placeholder--floating right"
                                  v-if="home.isPlaceholder"
                                >
                                    <q-icon color="grey-6" name="o_smart_toy" />
                                </div>
                            </div>
                        </div>

                        <div
                            class="row items-center full-width score-container"
                        >
                            <div
                                class="row justify-around items-center text-xxxl full-width"
                            >
                                <div
                                    class="column justify-center items-center no-wrap relative-position"
                                >
                                    <div
                                        class="score"
                                        :class="{
                                            winning:
                                                home.points_scored >
                                                away.points_scored,
                                        }"
                                    >
                                        {{ home.points_scored }}
                                    </div>
                                    <div
                                        class="verified__container"
                                        v-if="
                                            !away.pending &&
                                            !home.pending &&
                                            home.points_scored >
                                                away.points_scored
                                        "
                                    >
                                        <q-icon
                                            name="verified"
                                            color="primary"
                                        />
                                    </div>
                                </div>

                                <div
                                    class="column justify-center items-center no-wrap relative-position"
                                >
                                    <div
                                        class="score"
                                        :class="{
                                            winning:
                                                away.points_scored >
                                                home.points_scored,
                                        }"
                                    >
                                        {{ away.points_scored }}
                                    </div>
                                    <div
                                        class="verified__container"
                                        v-if="
                                            !away.pending &&
                                            !home.pending &&
                                            away.points_scored >
                                                home.points_scored
                                        "
                                    >
                                        <q-icon
                                            name="verified"
                                            color="primary"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="team__profile--container column no-wrap">
                            <div class="team-avatar__container">
                                <div class="team-avatar--wrap">
                                    <TeamAvatar
                                        :teamId="away.id"
                                        :color="away.color"
                                        :viewable="!away.isPlaceholder"
                                        :invitable="
                                            away.isPlaceholder && authorized
                                        "
                                        @invite="
                                            toggleGlobalSearch({
                                                open: true,
                                                options: {
                                                    inputLabel:
                                                        'Search for a team to invite',
                                                    resourceTypes: ['team'],
                                                    filterIds: [home.id],
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
                                    <h2
                                        class="text-sm truncate-text text-center"
                                        style="
                                            width: fit-content;
                                            position: relative;
                                        "
                                    >
                                        {{ away.name }}
                                    </h2>
                                    <div
                                        class="placeholder--floating"
                                        v-if="away.isPlaceholder"
                                    >
                                        <q-icon
                                            color="grey-6"
                                            name="o_smart_toy"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- League / Location -->
                    <div
                        class="column items-center q-pt-sm game-details"
                        v-if="false"
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
                <div style="margin-left: -20px; margin-top: 0px" class="column">
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
                            :to="`/games/view/${gameId}`"
                        />
                        <slot name="actions" />
                    </q-fab>
                    <q-badge color="deep-purple" rounded floating v-if="notify">
                    </q-badge>
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="scss" scoped>
$result-height: 50px;
$columns: 30% 40% 30%;
$max-container-width: 500px;
.result__container--wrap {
    max-height: fit-content;
    box-sizing: border-box;
    transition: all 1s;
    position: relative;
    overflow: visible;
    margin: auto;
    max-width: $max-container-width;
    .result__header {
        padding-bottom: var(--space-xs);
        padding-top: var(--space-xs);
        border-radius: inherit;
        width: 100%;
        box-sizing: border-box;
    }

    .result__container {
        display: grid;
        grid-template-rows: 100%;
        grid-template-columns: $columns;
        max-width: $max-container-width;
        margin: auto;
        position: relative;

        .team__profile--container {
            // max-width: 30%;
            justify-content: center;
            .team-avatar__container {
                .team-avatar--wrap {
                    position: relative;
                    max-width: $result-height;
                    margin: auto;
                }
            }
        }
    }
    .game-details {
        position: relative;
    }

    .score-container {
        .score {
            margin: auto !important;
            font-size: 35px;
            transition: all 0.2s;
            position: relative;
            &.winning {
                font-weight: bold;
            }
        }
        .verified__container {
            position: absolute;
            z-index: 1;
            font-size: 0.4em;
            width: min-content;

            right: -0.6em;

            bottom: 0.2em;
            margin: auto;
            height: 1.1em;
        }
    }

    .notify-badge {
        position: absolute;
    }
    .placeholder--floating {
        position: absolute;
        top: 0;
        &:not(.right) {
            left: -1em;
               margin-right: var(--space-xs)
        }
        &.right {
            right: -1em;
            margin-left: var(--space-xs)
        }
    }
}
</style>
<script setup>
import { useDialogStore } from "@/store/dialog";
import { useGameRequestStore } from "@/store/game-requests";
import { numberToLetter } from "@/utils/sheets";
import GameTeam from "@/store/models/game-team";
import Team from "@/store/models/team";
import Game from "@/store/models/game";

const $q = useQuasar();

const dialogStore = useDialogStore();

const { toggleGlobalSearch } = dialogStore;

const props = defineProps({
    authorized: Boolean,
    home: Number,
    notify: {
        type: Boolean,
        default: true,
    },
    gameId: Number,
});

const away = computed(() => {
    const t = useRepo(GameTeam)
        .with("team")
        .where("team_id", (val) => val !== props.home)
        .where("game_id", props.gameId)
        .first() ?? { name: "Unnamed team" };
    return {
        ...t,
        ...(t.team ?? {}),
        isPlaceholder: t.isPlaceholder,
    };
});
const home = computed(() => {
    const t = useRepo(GameTeam)
        .withAll()
        .where("team_id", (val) => val === props.home)
        .where("game_id", props.gameId)
        .first() ?? { name: "Unnamed team" };
    return {
        ...t,
        ...(t.team ?? {}),
        isPlaceholder: t.isPlaceholder,
    };
});

const isVerified = computed(
    () => useRepo(Game).withAll().where("id", props.gameId).first()?.isVerified
);

const emit = defineEmits(["expand", "invite"]);

const { format, toTimezone } = useTime();
</script>
