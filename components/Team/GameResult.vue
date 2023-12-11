<template>
    <div style="position: relative full-width" ref="gameResult">
     
        <div class="result__container--wrap">
            <div class="row no-wrap">
                <div class="result__header">
                    <slot name="before" />

                    <div class="result__container" @click="emit('expand')">
                           
                        <div class="backdrop--behind" />
                        <div class="backdrop" />
                        <div
                            class="team__profile--container column no-wrap "
                        >
                            <div class="team-avatar__container">
                                <div class="team-avatar--wrap">
                                    <TeamAvatar
                                        :teamId="home.id"
                                        :color="home.color"
                                        :viewable="viewHome && !!home.id"
                                    />
                                </div>
                            </div>
                            <div class="team-name__container">
                                <h2
                                    class="text-sm  text-center col-grow full-width highlightable"
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
                            class="column full-width game-info__container"
                            ref="gameInfoContainer"
                            @click="reveal"
                        >
                            <div
                                class="game-showmore__container row justify-center items-center"
                                :style="{ opacity: isRevealed ? 1 : 0 }"
                            >
                                <div class="game-showmore__button">
                                    <q-btn flat @click="onViewMore">
                                        View game</q-btn
                                    >
                                </div>
                            </div>

                            <div class="row justify-center full-width no-wrap ">
                                <div
                                    class="column no-wrap "
                                    style="height: min-content"
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

                                   
                                </div>
                                <div class="score q-mx-xs">:</div>
                                <div
                                    class="column no-wrap relative-position"
                                    style="height: min-content"
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
                                   
                                </div>
                            </div>
                            <div
                                class="row justify-center full-width game-info__text highlightable"
                                v-if="rink"
                            >
                                {{ rink.name }}
                            </div>
                            <div
                                class="row justify-center full-width game-info__text highlightable"
                                v-if="game.sheet && game.sheet.number"
                            >
                                Sheet {{ game.sheet.number }}/{{
                                    numberToLetter(game.sheet.number)
                                }}
                            </div>
                            <div
                                class="row justify-center full-width game-info__text highlightable"
                                v-if="game.start_time"
                            >
                                {{
                                    toTimezone(game.start_time, "MMMM D, YYYY")
                                }}
                            </div>
                            <!-- <div v-if="isVerified" class="row full-width justify-center">
                                <q-badge v-if="isVerified">Verified</q-badge>
                            </div> -->
                        </div>

                        <div class="team__profile--container column no-wrap">
                            <div class="team-avatar__container">
                                <div class="team-avatar--wrap">
                                    <TeamAvatar
                                        :teamId="away.id"
                                        :color="away.color"
                                        :viewable="viewAway && !away.isPlaceholder"
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
                          
                                <div class="team-name__container">
                                    <h2
                                        class="text-sm  text-center highlightable"
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
            </div>
        </div>
    </div>
</template>
<style lang="scss" scoped>
$result-height: 90px;
$columns: 30% 40% 30%;
$max-container-width: 500px;
$container-padding-top: 10px;

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

            .team-avatar__container {
                .team-avatar--wrap {
                    position: relative;
                    max-width: $result-height;
                    margin: auto;
                }
            }
            .team-name__container {
                margin-top: var(--space-xxs);
                width: fit-content;
                max-width: 100%;
                position: relative;
                margin-right: auto;
                margin-left: auto;
                text-transform: uppercase;
            }
        }

        .backdrop,
        .backdrop--behind {
            position: absolute;
            height: $result-height;
            width: 80%;
            top: $container-padding-top;
            margin: auto;
            left: 0;
            right: 0;
        }

        .backdrop {
            background: linear-gradient(
                180deg,
                rgba(255, 255, 255, 0.65) 0%,
                rgba(255, 255, 255, 1) 100%
            );
        }
        .backdrop--behind {
            background: v-bind(gradient);
        }
       
    }
    .game-details {
        position: relative;
    }

    .game-info__container {
        margin-top: calc($container-padding-top + var(--space-xs));
        z-index: 1;
        position: relative;
        .score {
            line-height: 40px;
            font-size: 50px;
            transition: all 0.2s;
            position: relative;
            &.winning {
                font-weight: bold;
            }
        }
      
        .game-info__text {
            font-size: 0.7em;
            text-align: center;
        }
        .game-showmore__container {
            transition: all 0.4s;
            position: absolute;
            height: $result-height;
            width: 100%;

            margin-top: -12px;
            z-index: 2;
            color: white;

            font-weight: bold;
            .game-showmore__button {
                border-radius: 8px;
                background-color: rgba(0, 0, 0, 0.7);
                padding: var(--space-sm);
            }
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
            margin-right: var(--space-xs);
        }
        &.right {
            right: -1em;
            margin-left: var(--space-xs);
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
import Rink from '@/store/models/rink'
import { useConfirmDialog, onClickOutside } from "@vueuse/core";

const gameResult = ref(null);

const highlightColor = ref("#B4FFEB");

const highlight = (val) => {
    const highlightables = gameResult.value.querySelectorAll(".highlightable");
    let regex;
    if (!!val) {
        regex = new RegExp(val.toLowerCase(), "i");
    }

    Array.from(highlightables).forEach((el) => {
        el.innerHTML = el.innerText.replaceAll("\n", "");
        if (!val) return;

        el.innerText.match(regex)?.forEach((match) => {
            const newhtml = el.innerHTML.replace(
                match,
                `<span style="background-color: ${highlightColor.value}">${match}</span>`
            );

            el.innerHTML = newhtml;
        });
    });
};

watch(
    () => props.search,
    (val) => {
        highlight(val);
    }
);

const $q = useQuasar();

const dialogStore = useDialogStore();

const { toggleGlobalSearch } = dialogStore;
const { getColor } = useColor();

const gradient = computed(
    () =>
        `linear-gradient(90deg, ${getColor(home.value.color)} 0%, ${getColor(
            away.value.color
        )} 100%)`
);

const props = defineProps({
    authorized: Boolean,
    home: Number,
    notify: {
        type: Boolean,
        default: true,
    },
    gameId: Number,
    search: String,
    viewHome: {
        type: Boolean,
        default: true
    },
    viewAway: {
        type: Boolean,
        default: true
    }
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

const game = computed(() =>
    useRepo(Game).withAll().where("id", props.gameId).first()
);

const rink = computed(() => !game.value.rink_id ? null : useRepo(Rink).where('id', game.value.rink_id).first())

const isVerified = computed(() => game.value.isVerified);

const emit = defineEmits(["expand", "invite"]);

const { format, toTimezone } = useTime();

const gameInfoContainer = ref(null);

const { isRevealed, reveal, confirm, cancel, onConfirm, onCancel } =
    useConfirmDialog();

onClickOutside(gameInfoContainer, cancel);

const onViewMore = () => {
    if (!isRevealed.value) return;
    navigateTo(`/games/view/${game.value.id}`);
};
</script>
