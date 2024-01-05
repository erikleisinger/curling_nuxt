<template>
    <LayoutSection title="Game Story" id="game-story-container">
        <template v-slot:append-right>
            <q-btn
                flat
                round
                dense
                icon="play_arrow"
                @click="playAnimation"
                v-if="!isPlaying"
            />
            <q-btn
                flat
                round
                dense
                icon="pause"
                v-if="isPlaying"
                @click="pauseAnimation"
            />
            <q-btn
                flat
                round
                dense
                icon="refresh"
                v-if="isPlaying"
                @click="restartAnimation"
            />
        </template>
        <div v-if="ends?.length">
            <div
                class="end__container full-width first"
                :class="{ 'show-score': isPlaying }"
                id="game-story--header"
            >
                <div class="color-bg home">
                    <div
                        class="color-bg__inner home"
                        :style="{ backgroundColor: getColor(homeTeam?.color) }"
                    />
                </div>
                <div class="color-bg away">
                    <div
                        class="color-bg__inner away"
                        :style="{ backgroundColor: getColor(awayTeam?.color) }"
                    />
                </div>
                <div
                    class="row items-center no-wrap relative-position full-width"
                >
                    <div style="width: 40px" class="game-story__avatar">
                        <TeamAvatar
                            :teamId="homeTeam?.team_id"
                            :color="homeTeam?.color"
                            animateRing
                        />
                    </div>
                    <div class="q-ml-sm reg-text team-name">
                        {{ homeTeam.team?.name }}
                    </div>
                </div>
                <div
                    class="xl-text q-mx-sm font-header text-center game-story-total__score home row items-center"
                    v-if="isPlaying"
                >
                    <div>{{ totalScore.home }}</div>
                </div>
                <div
                    class="xl-text q-mx-sm font-header text-center game-story-total__score away row items-center"
                    v-if="isPlaying"
                >
                    <div>{{ totalScore.away }}</div>
                </div>

                <div
                    class="row items-center justify-end no-wrap relative-position full-width"
                >
                    <div class="q-mr-sm text-right team-name">
                        {{ awayTeam.team?.name }}
                    </div>
                    <div style="width: 40px" class="game-story__avatar">
                        <TeamAvatar
                            :teamId="awayTeam?.team_id"
                            :color="awayTeam?.color"
                            animateRing
                        />
                    </div>
                </div>
            </div>
            <section
                v-for="(end, index) in ends"
                :key="end.id"
                class="end__container end"
                :id="`game-story-end-${index}`"
            >
                <header class="end__header font-header sm-text">
                    {{ `End ${index + 1}` }}
                    <div
                        class="hammer-icon--floating"
                        :class="{
                            right: isTeam(
                                awayTeam.team_id,
                                ends[index].hammer_team_id
                            ),
                        }"
                    >
                        <q-icon name="hardware" />
                    </div>
                </header>
                <div
                    class="lg-text font-header row justify-end items-center text-right event-container"
                    :class="homeTeam?.color"
                >
                    <!-- {{ getEndMomentum(index, "home") }} -->
                    <div v-if="endMomentum[index].team === 'home'">
                        <div
                            class="font-header game-story-event"
                            v-if="endEvents[index].blank"
                            :class="$q.screen.xs ? 'smmd-text' : 'md-text'"
                        >
                            blank
                        </div>
                        <div
                            class="font-header game-story-event"
                            v-if="endEvents[index].conversion"
                            :class="$q.screen.xs ? 'smmd-text' : 'md-text'"
                        >
                            conversion
                        </div>
                        <div
                            class="font-header game-story-event"
                            v-if="endEvents[index].force"
                            :class="$q.screen.xs ? 'smmd-text' : 'md-text'"
                        >
                            force
                        </div>
                        <div
                            class="font-header game-story-event"
                            v-if="endEvents[index].steal"
                            :class="$q.screen.xs ? 'smmd-text' : 'md-text'"
                        >
                            steal
                        </div>
                        <div
                            class="font-header row no-wrap justify-end game-story-event"
                            v-if="endEvents[index].bigend"
                            :class="$q.screen.xs ? 'reg-text' : 'smmd-text'"
                        >
                            <div style="margin-right: 0.25em">+</div>
                            <div style="width: fit-content">big end</div>
                        </div>
                        <div
                            class="font-header row no-wrap justify-end game-story-event"
                            v-if="endEvents[index].momentum"
                            :class="$q.screen.xs ? 'reg-text' : 'smmd-text'"
                        >
                            <div style="margin-right: 0.25em">+</div>
                            <div style="width: min-content">momentum shift</div>
                        </div>
                    </div>
                </div>
                <div
                    class="xl-text q-mx-sm font-header text-center game-story-points__scored"
                    :class="{
                        'no-points':
                            end.scoring_team_id === null ||
                            end.scoring_team_id === awayTeam?.team_id,
                    }"
                >
                    {{
                        end.scoring_team_id === null ||
                        end.scoring_team_id === awayTeam?.team_id
                            ? 0
                            : end.points_scored
                    }}
                </div>
                <div
                    class="xl-text q-mx-sm font-header text-center game-story-points__scored"
                    :class="{
                        'no-points': end.scoring_team_id === homeTeam?.team_id,
                    }"
                >
                    {{
                        end.scoring_team_id === null ||
                        end.scoring_team_id === awayTeam?.team_id
                            ? end.points_scored
                            : 0
                    }}
                </div>
                <div
                    class="lg-text font-header text-left row items-center event-container"
                    :class="awayTeam?.color"
                >
                    <div v-if="endMomentum[index].team === 'away'">
                        <div
                            class="font-header game-story-event"
                            v-if="endEvents[index].blank"
                            :class="$q.screen.xs ? 'smmd-text' : 'md-text'"
                        >
                            blank
                        </div>
                        <div
                            class="font-header game-story-event"
                            v-if="endEvents[index].conversion"
                            :class="$q.screen.xs ? 'smmd-text' : 'md-text'"
                        >
                            conversion
                        </div>
                        <div
                            class="font-header game-story-event"
                            v-if="endEvents[index].force"
                            :class="$q.screen.xs ? 'smmd-text' : 'md-text'"
                        >
                            force
                        </div>
                        <div
                            class="font-header game-story-event"
                            v-if="endEvents[index].steal"
                            :class="$q.screen.xs ? 'smmd-text' : 'md-text'"
                        >
                            steal
                        </div>
                        <div
                            class="font-header row no-wrap game-story-event"
                            v-if="endEvents[index].bigend"
                            :class="$q.screen.xs ? 'reg-text' : 'smmd-text'"
                        >
                            <div style="margin-right: 0.25em">+</div>
                            <div style="width: fit-content">big end</div>
                        </div>
                        <div
                            class="font-header row no-wrap game-story-event"
                            v-if="endEvents[index].momentum"
                            :class="$q.screen.xs ? 'reg-text' : 'smmd-text'"
                        >
                            <div style="margin-right: 0.25em">+</div>
                            <div style="width: min-content">momentum shift</div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- FINAL SCORE -->
            <div class="end__container full-width last" id="game-story-footer">
                <header class="end__header font-header sm-text">FINAL</header>
                <div class="row items-center no-wrap">
                    <div style="width: 40px">
                        <TeamAvatar
                            :teamId="homeTeam?.team_id"
                            :color="homeTeam?.color"
                            animateRing
                        />
                    </div>
                    <div class="q-ml-sm">{{ homeTeam.team?.name }}</div>
                </div>
                <div class="xl-text q-mx-sm font-header text-center">
                    {{ homeTeam.points_scored }}
                </div>
                <div class="xl-text q-mx-sm font-header text-center">
                    {{ awayTeam.points_scored }}
                </div>
                <div class="row items-center justify-end no-wrap">
                    <div class="q-mr-sm text-right">
                        {{ awayTeam.team?.name }}
                    </div>
                    <div style="width: 40px">
                        <TeamAvatar
                            :teamId="awayTeam?.team_id"
                            :color="awayTeam?.color"
                            animateRing
                        />
                    </div>
                </div>
            </div>
        </div>
        <div class="momentum-scale__floating">
            <div class="momentum-scale__container">
                <div
                    class="momentum-scale__value home"
                    :style="{ backgroundColor: getColor(homeTeam?.color) }"
                />
                <div
                    class="momentum-scale__value away"
                    :style="{ backgroundColor: getColor(awayTeam?.color) }"
                />
            </div>
        </div>
    </LayoutSection>
</template>
<style lang="scss" scoped>
.color-bg {
    position: absolute;
    height: 100%;
    width: calc(50% + var(--space-sm));
    transform-origin: left;
    top: 0;
    left: calc(-1 * var(--space-sm));

    overflow: hidden;
    &.away {
        left: unset;
        right: calc(-1 * var(--space-sm));
        transform-origin: right;
    }
    .color-bg__inner {
        border-radius: 50%;
        opacity: 0;
        &.home {
            position: absolute;
            top: 0;
            bottom: 0;
            margin: auto;
            left: -25%;
           
            width: 100%;
            aspect-ratio: 1/1;
        }
        &.away {
            position: absolute;
            top: 0;
            bottom: 0;
            margin: auto;
            right: -25%;
            
            width: 100%;
             aspect-ratio: 1/1;
        }
    }
}
.momentum-scale__floating {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    padding: unset;
    .momentum-scale__container {
        width: 100%;
        height: 12px;
        // background-color: gray;
        position: relative;
        .momentum-scale__value {
            height: 100%;
            width: 50%;
            background-color: white;

            transition: all 1s;

            position: absolute;

            margin: auto;

            &.home {
                transform-origin: right;
                transform: v-bind(momentumTransformHome);
                left: 0;
                border-top-left-radius: 12px;
                border-bottom-left-radius: 12px;
            }
            &.away {
                transform-origin: left;
                transform: v-bind(momentumTransformAway);
                left: 50%;
                border-top-right-radius: 12px;
                border-bottom-right-radius: 12px;
            }
        }
    }
}
.end__container {
    display: grid;
    grid-template-columns: 1fr 3em 3em 1fr;
    column-gap: var(--space-sm);
    padding: var(--space-lg) 0px;
    position: relative;
    &.first {
        margin-top: calc(-1 * var(--space-lg));
        &:not(.show-score) {
            grid-template-columns: repeat(2, 50%);
            column-gap: unset;
        }

        // overflow: hidden;
        padding: unset;

        > div:not(.momentum-scale__floating):not(.game-story-total__score) {
            overflow: hidden;
            padding: var(--space-md) var(--space-xs);
        }
        .game-story-total__score {
            z-index: 1;
            color: white;
        }
    }
    .end__header {
        position: absolute;
        top: -0.85em;
        margin: auto;
        left: 0;
        right: 0;
        width: 100%;
        text-align: center;
        color: rgba(0, 0, 0, 0.6);

        &:before {
            content: "";
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            height: 1px;
            margin: auto;
            background-color: rgba(0, 0, 0, 0.08);
        }
        .hammer-icon--floating {
            position: absolute;
            top: 0;
            bottom: 0;
            margin: auto;
            left: 20%;
            background-color: $app-slate;
            color: white;
            border-radius: 50%;
            border: 1px solid rgba(0, 0, 0, 0.08);
            height: 30px;
            width: 30px;
            display: flex;
            justify-content: center;
            align-items: center;
            transform: rotateZ(35deg);
            &.right {
                right: 20%;
                left: unset;
            }
        }
    }
    .event-container {
        &.yellow {
            color: $app-yellow;
        }
        &.red {
            color: $app-red;
        }
        &.blue {
            color: $app-blue;
        }
        @include line-tight;
        row-gap: -5px;
    }
}
</style>
<script setup>
import { useQuery } from "@tanstack/vue-query";
import Game from "@/store/models/game";
import Team from "@/store/models/team";
import gsap from "gsap";
const props = defineProps({
    gameId: Number,
});

const game = computed(() =>
    useRepo(Game).withAllRecursive().where("id", props.gameId).first()
);
const homeTeam = computed(() =>
    game.value?.teams.find(({ home_team }) => !!home_team)
);
const awayTeam = computed(() =>
    game.value?.teams.find(({ home_team }) => !home_team)
);

const isHomeTeam = (id) => {
    return id === homeTeam.value?.team_id;
};

const isTeam = (id, id2) => {
    if (id > 100000000) return id2 === null || id === id2;
    return id === id2;
};

const getMomentumTeam = (
    homeId,
    awayId,
    hammerTeamId,
    scoringTeamId,
    pointsScored
) => {
    if (isTeam(homeId, hammerTeamId)) {
        if (!isTeam(homeId, scoringTeamId)) return "away";
        return pointsScored === 1 ? "away" : "home";
    } else {
        if (!isTeam(awayId, scoringTeamId)) return "home";
        return pointsScored === 1 ? "home" : "away";
    }
};

const endMomentum = computed(() => {
    if (!ends.value) return;

    let runningMomentum = {
        home: 0,
        away: 0,
        hasMom: null,
    };

    const homeId = homeTeam?.value?.team_id;
    const awayId = awayTeam?.value?.team_id;
    if (!homeId) return;

    return ends.value.reduce((all, end, index) => {
        const allClone = [...all];
        const { scoring_team_id, hammer_team_id, points_scored } = end;

        const momentumTeam = getMomentumTeam(
            homeId,
            awayId,
            hammer_team_id,
            scoring_team_id,
            points_scored
        );
        const momentumTeamId = momentumTeam === "home" ? homeId : awayId;

        let modifier = 0;
        let runningTotal = 0;

        const isSteal = !isTeam(momentumTeamId, scoring_team_id);

        if (isSteal) modifier = 1;
        runningTotal += modifier + points_scored;

        const hasHammer = isTeam(momentumTeamId, hammer_team_id);

        const { end_count } = game.value;
        const numEndsPlayed = ends.value?.length;
        if (
            numEndsPlayed >= end_count &&
            index + 1 === numEndsPlayed &&
            hasHammer
        ) {
            if (isTeam(momentumTeamId, hammer_team_id))
                allClone[index - 1][momentumTeam] =
                    allClone[index - 1][momentumTeam] + 2;
        }

        const running = { ...runningMomentum };

        const newMomentum = {
            team: momentumTeam,
            home:
                momentumTeam === "home"
                    ? (running[momentumTeam] += runningTotal)
                    : running.home,
            away:
                momentumTeam === "away"
                    ? (running[momentumTeam] += runningTotal)
                    : running.away,
        };

        runningMomentum = newMomentum;

        return [...allClone, newMomentum];
    }, []);
});

const endEvents = computed(() => {
    if (!endMomentum.value?.length) return;
    const shiftHistory = [];
    return endMomentum.value.reduce((all, current, index) => {
        const momentum = endMomentum.value[index] ?? {};
        const momentumTeam =
            momentum.home - 1 > momentum.away
                ? "home"
                : momentum.away - 1 > momentum.home
                ? "away"
                : null;

        shiftHistory.push(momentumTeam);

        const returnObj = {
            momentum: false,
            bigend: false,
            force: false,
            steal: false,
            conversion: false,
            blank: false,
        };
        // Calculate BIG END event
        // 2+ points scored

        if (ends.value[index].points_scored > 2) returnObj.bigend = true;

        // Calculate FORCE event
        // Team takes 1 with hammer
        if (
            ends.value[index].scoring_team_id ===
                ends.value[index].hammer_team_id &&
            ends.value[index].points_scored === 1
        )
            returnObj.force = true;

        // Calculate STEAL event
        // Take points without hammer
        if (
            ends.value[index].scoring_team_id !==
            ends.value[index].hammer_team_id
        )
            returnObj.steal = true;

        // Calculate CONVERSION event
        // Score at least 2 points with hammer
        if (
            ends.value[index].scoring_team_id ===
                ends.value[index].hammer_team_id &&
            ends.value[index].points_scored >= 2
        )
            returnObj.conversion = true;

        // Calculate BLANK event
        // No points are scored
        if (!ends.value[index].points_scored) returnObj.blank = true;

        const lastMomentum = shiftHistory[index - 1];
        if (!!index && !!momentumTeam && lastMomentum !== momentumTeam)
            returnObj.momentum = true;
        return [...all, returnObj];
    }, []);
});

const getEndMomentum = (index, team) => {
    const teamId =
        team === "home" ? homeTeam.value?.team_id : awayTeam?.value?.team_id;
    const hasHammer = isTeam(teamId, ends.value[index + 1].hammer_team_id);
    return endMomentum.value[index][team] + (hasHammer ? 1 : 0);
};

const getGameEnds = async () => {
    const client = useSupabaseClient();
    const { data } = await client
        .from("ends")
        .select("*")
        .eq("game_id", props.gameId);
    return data;
};

const momentumTransformHome = ref(`scaleX(0)`);
const momentumTransformAway = ref(`scaleX(0)`);

const { getColor } = useColor();

const setMomentum = (index) => {
    if (index >= ends.value?.length - 1) return;
    const home = getEndMomentum(index, "home");
    const away = getEndMomentum(index, "away");
    if (home > away) {
        const lead = (home - away) / 5;
        momentumTransformHome.value = `scaleX(${lead})`;
        momentumTransformAway.value = "scaleX(0)";
    } else if (away > home) {
        const lead = (away - home) / 5;
        momentumTransformAway.value = `scaleX(${lead})`;
        momentumTransformHome.value = "scaleX(0)";
    } else {
        momentumTransformHome.value = `scaleX(0)`;
        momentumTransformAway.value = `scaleX(0)`;
    }
};

const totalScore = ref({
    home: 0,
    away: 0,
});

const setTotalScore = (index) => {
    const endScores = [...ends.value].splice(0, index + 1);
    totalScore.value = endScores.reduce(
        (all, current) => {
            const { scoring_team_id, points_scored } = current;

            if (isTeam(homeTeam.value.team_id, scoring_team_id)) {
                return {
                    home: all.home + points_scored,
                    away: all.away,
                };
            }
            return {
                home: all.home,
                away: all.away + points_scored,
            };
        },
        {
            home: 0,
            away: 0,
        }
    );
};

const { isLoading, data: ends } = useQuery({
    queryKey: ["game", "ends", props.gameId],
    queryFn: getGameEnds,
    refetchOnWindowFocus: false,
});

// ANIMATION

const animation = ref(null);
const isPlaying = ref(false);

const play = () => {
    isPlaying.value = true;
    if (animation.value) {
        animation.value.restart();
        return;
    }
    const tl = gsap.timeline();

    tl.add("start");

    // Remove elements for beginning state

    tl.to(
        "#game-story-container",
        {
            paddingBottom: 0,
            duration: 0.2,
        },
        "start"
    );
    tl.to(
        "#game-story-footer",
        {
            height: 0,
            opacity: 0,
            padding: 0,
            duration: 0.2,
        },
        "start"
    );

    tl.to(
        ".hammer-icon--floating",
        {
            opacity: 0,
            duration: 0.2,
        },
        "start"
    );

    // Apply container styling

    tl.to(
        "#game-story-container",
        {
            border: "1px solid rgba(0,0,0,0.2)",
            borderRadius: "16px",
            overflow: "hidden",
            paddingRight: 0,
            paddingLeft: 0,
            duration: 0.3,
        },
        "start"
    );

    // Collapse ends
    tl.to(
        ".end__container.end:not(#game-story-end-0)",
        {
            height: 0,
            opacity: 0,
            padding: 0,
            duration: 1,
        },
        "start"
    );
    tl.to(
        "#game-story-end-0>div,#game-story-end-0>header",
        {
            opacity: 0,
            scale: 0,
        },
        "start"
    );

    tl.fromTo(
        ".color-bg__inner",
        {
            scale: 0,
            opacity: 1,
        },
        {
            transformOrigin: "center",
            scale: 2,
            opacity: 1,
            duration: 1,
        },
        "start"
    );
    tl.to(
        ".team-name",
        {
            color: "white",
            duration: 0.2,
            zIndex: 1,
            fontFamily: '"Koulen", sans-serif',
            fontSize: 20,
        },
        "start"
    );

    // BEGIN END LOOP

    ends.value.forEach((end, index) => {
        tl.fromTo(
            `#game-story-end-${index}>header`,
            {
                opacity: 0,
                scale: 0,
                // x: -1000,
                y: 0,
            },
            {
                opacity: 1,
                scale: 3,
                y: 25,
                transformOrigin: "top",
                // x:0,
                duration: 0.4,
            }
        );
        tl.to(`#game-story-end-${index}>header`, {
            // x: -1000,
            y: -12,
            scale: 2,
            duration: 0.5,
            delay: 0.5,
        });

        const endEl = document.querySelector(`#game-story-end-${index}`);

        tl.fromTo(
            endEl.querySelectorAll(".game-story-points__scored"),
            {
                scale: 0,
                opacity: 0,
            },
            {
                scale: 1,
                opacity: 1,
                duration: 0.5,
            }
        );
 
        tl.add("events");

        tl.fromTo(
            endEl.querySelectorAll(".game-story-event"),
            {
                opacity: 0,
                y: (e) => !!e ? 0 : -100,
                scale: (e) => !!e ? 0 : 1
            },
            {
                opacity: 1,
                y:0,
                scale: 1,
                duration: 0.5,
                stagger: 0.8,
                ease: 'sine',
                
                onComplete: () => setMomentum(index),
            },
            "events"
        );
        tl.add("end");
        tl.to(
            `#game-story-end-${index}`,
            {
                height: 0,
                opacity: 0,
                padding: 0,
                duration: 1,
                minHeight: "unset",
                delay: 2,
            },
            "end"
        );
        tl.to(
            `#game-story-end-${index + 1}`,
            {
                height: "auto",
                paddingTop: 32,
                paddingBottom: 32,
                opacity: 1,
                duration: 1,
                scale: 1,
                minHeight: "128px",
                delay: 2,
                onComplete: () => setTotalScore(index),
            },
            "end"
        );
    });
    animation.value = tl;
    tl.eventCallback('onComplete', () => {
        isPlaying.value = false;
    })
};

const playAnimation = () => {
    
    if (animation.value?.paused()) {
        console.log(animation.value.totalProgress());

        animation.value.resume();
        isPlaying.value = true;
    } else {
        play();
    }
};

const pauseAnimation = () => {
    if (!animation.value) return;
    animation.value.pause();
    isPlaying.value = false;
};

const restartAnimation = () => {
    if (!animation.value) return;
    animation.value.restart();
    isPlaying.value = true;
};
</script>
<script>
export default {
    name: "GameStory",
};
</script>
