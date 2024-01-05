<template>
    <div style="position: relative full-width" ref="gameResult">
        <div class="result__container--wrap">
            <div class="row no-wrap">
                <div class="result__header">
                    <slot name="before" />
                    <div class="result-container__outer">
                        <div class="result__container" @click="emit('expand')">
                            <div
                                class="row full-width justify-center verified--wrap" v-if="!isUpcoming"
                            >
                                <TeamGameResultVerification
                                    :gameId="props.gameId"
                                    @refresh="refreshQuery"
                                />
                            </div>
                            <div class="backdrop--behind" />
                            <div class="backdrop" />
                            <div
                                class="team__profile--container row no-wrap justify-end"
                            >
                                <div class="team-name__container q-mr-sm">
                                    <h2
                                        class="reg-text text-right col-grow full-width highlightable"
                                        v-html="truncateWords(home.name)"
                                        
                                    ></h2>
                                    <div
                                        class="placeholder--floating right"
                                        v-if="home.isPlaceholder"
                                    >
                                        <q-icon
                                            color="grey-6"
                                            name="o_smart_toy"
                                        />
                                    </div>
                                </div>
                                <div class="team-avatar__container q-mr-md">
                                    <div class="team-avatar--wrap">
                                        <TeamAvatar
                                            :teamId="home.id"
                                            :color="home.color ?? ''"
                                            :viewable="viewHome && !!home.id"
                                            :animateRing="home.points_scored > away.points_scored"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div class="row no-wrap justify-center">
                     
                                <div class="column game-info__container">
                                    <div
                                    v-if="!isUpcoming"
                                        class="row justify-center full-width no-wrap clickable"
                                        
                                    >
                                        <div
                                            class="column no-wrap"
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
                                    <div v-else>
                                         <div
                            class="row justify-center full-width game-info__text highlightable"
                            v-if="game.start_time"
                        >
                            {{ toTimezone(game.start_time, "MMM D, YYYY") }}
                        </div>
                         <div
                            class="row justify-center full-width game-info__text highlightable"
                            v-if="game.start_time"
                        >
                            {{ toTimezone(game.start_time, "h:mm a") }}
                        </div>
                                    </div>
                                </div>
                      
                            </div>

                            <div
                                class="team__profile--container row no-wrap justify-start"
                            >
                                <div class="team-avatar__container q-ml-md">
                                    <div class="team-avatar--wrap">
                                        <TeamAvatar
                                            :teamId="away.id"
                                            :color="away.color"
                                            :viewable="
                                                viewAway && !away.isPlaceholder
                                            "
                                             :animateRing="away.points_scored > home.points_scored"
                                        />
                                    </div>
                                </div>
                                <div
                                    class="team-name__container row no-wrap q-ml-sm"
                                  
                                >
                                    <!-- <q-icon
                                    v-if="away.isPlaceholder"
                                    color="grey-6"
                                    name="o_smart_toy"
                                /> -->
                                    <h2
                                        class="reg-text text-left highlightable"
                                        style="
                                            width: fit-content;
                                            position: relative;
                                        "
                                   
                                        v-html="truncateWords(away.name)"
                                    ></h2>
                                </div>
                            </div>
                        </div>
                        <div
                            class="row justify-center full-width game-info__text highlightable"
                            v-if="game.start_time && !isUpcoming"
                        >
                            {{ toTimezone(game.start_time, "MMM D, YYYY") }}
                        </div>
                        <div
                                    class="row justify-center full-width game-info__text highlightable"
                                    v-if="rink && showRink"
                                    :class="{'q-mt-xs': isUpcoming}"
                                >
                                    {{ rink.name }}
                                </div>
                                <!-- <div
                                    class="row justify-center full-width game-info__text highlightable"
                                    v-if="sheet && sheet.number"
                                >
                                    Sheet {{ sheet.number }}/{{
                                        numberToLetter(sheet.number)
                                    }}
                                </div> -->
                       <div class="view-game clickable" v-if="!isUpcoming" @click="
                                            navigateTo(`/games/view/${game.id}`)
                                        ">
                       <q-icon name="visibility" size="1.2em"/>
                       </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="scss" scoped>
$result-height: 90px;
$columns: 1fr auto 1fr;
$max-container-width: 500px;
$container-padding-top: 10px;

.view-game {
    position: absolute;
    bottom: var(--space-md);
    right: 12px;
    @include text-caption;
    // text-decoration: underline;
    color: rgba(0,0,0,0.7)
}
.result__container--wrap {
    max-height: fit-content;
    box-sizing: border-box;
    transition: all 1s;
    position: relative;
    overflow: visible;
    margin: auto;
    max-width: $max-container-width;
    .verified--wrap {
        position: absolute;
        top: -8px;
    }
    .result__header {
        padding-bottom: var(--space-xs);
        padding-top: var(--space-xs);
        border-radius: inherit;
        width: 100%;
        box-sizing: border-box;
    }

    .result-container__outer {
        background-color: rgb(251, 251, 251, 0.3);
        // color: white;
        border-radius: 16px;
        box-shadow: $pretty-shadow;
        // border-width: 3px;
        // border-style: solid;
        // border-color: $primary;
        border: 1px solid rgba(0, 0, 0, 0.08);

        .game-info__text {
            @include text-caption;
            @include line-snug;
            text-align: center;
        }
        padding: 0px var(--space-xs);
        padding-bottom: var(--space-sm);
    }

    .result__container {
        display: grid;
        grid-template-rows: 100%;
        grid-template-columns: $columns;
        max-width: $max-container-width;
        margin: auto;
        position: relative;
        // border: 1px solid rgba(0, 0, 0, 0.2);

        .team__profile--container {
            margin-top: 15px;
            height: fit-content;
            align-items: center;
            .team-avatar__container {
                .team-avatar--wrap {
                    position: relative;
                    width: calc($result-height - 50px);

                    // margin-top: 15px;
                }
            }
            .team-name__container {
                // margin-top: calc(5px + calc(($result-height - 50px) / 2));
                display: -webkit-box;
                max-width: calc(100% - 40px);
                position: relative;
                flex-shrink: 1;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                overflow: hidden;
                min-width: 0;
                text-overflow: ellipsis;
            }
        }

        .backdrop,
        .backdrop--behind {
            position: absolute;
            height: calc($result-height - 15px);
            width: 80%;
            top: $container-padding-top;
            margin: auto;
            left: 0;
            right: 0;
        }

        .backdrop {
            // background: linear-gradient(
            //     180deg,
            //     rgba(255, 255, 255, 0.65) 0%,
            //     rgba(255, 255, 255, 1) 100%
            // );
            // background: linear-gradient(transparent, gray);
        }
        // .backdrop--behind {
        //     background: v-bind(gradient);
        // }
    }
    .game-details {
        position: relative;
    }

    .game-info__container {
        margin-top: calc($container-padding-top + var(--space-xs));
        z-index: 1;
        position: relative;
        .score {
            @include lg-text;
            transition: all 0.2s;
            position: relative;
            &.winning {
                font-weight: bold;
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
import Rink from "@/store/models/rink";
import Sheet from "@/store/models/sheet";

import { useQueryClient } from "@tanstack/vue-query";

const props = defineProps({
    home: Number,
    gameId: Number,
    search: String,
    showRink: {
        type: Boolean,
        default: true,
    },
    viewHome: {
        type: Boolean,
        default: true,
    },
    viewAway: {
        type: Boolean,
        default: true,
    },
});

const queryClient = useQueryClient();

const refreshQuery = () => {
    queryClient.invalidateQueries({
        queryKey: ["team", "games", home.value?.id],
    });
};

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
        if (!val) return;
        nextTick(() => {
            highlight(val);
        });
    },
    { immediate: true }
);

const { truncateWords } = useText();

const $q = useQuasar();

const dialogStore = useDialogStore();

const { toggleGlobalSearch } = dialogStore;

const away = computed(() => {
    const t = useRepo(GameTeam)
        .with("team")
        .where("team_id", (val) => val !== props.home)
        .where("game_id", props.gameId)
        .orderBy("team_id", "asc")
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

const { getColor, getEventColor } = useColor();

const gradient = computed(
    () =>
        `linear-gradient(90deg, rgba(${getEventColor(
            home.value.color
        )}, 0.8) 0%, rgba(${getEventColor(away.value.color)}, 0.8) 100%)`
);

const game = computed(() =>
    useRepo(Game).withAll().where("id", props.gameId).first()
);

const isUpcoming = computed(() => game.value?.id >= 1000000000)

const rink = computed(() =>
    !game.value?.rink_id
        ? null
        : useRepo(Rink).where("id", game.value.rink_id).first()
);

const sheet = computed(() =>
    !game.value?.sheet_id
        ? null
        : useRepo(Sheet).where("id", game.value.sheet_id).first()
);

const emit = defineEmits(["expand"]);

const { format, toTimezone } = useTime();

const { isOnTeam } = useTeam();
</script>
