<template>
<div :id="`game-story-${uniqueId}`" class="relative-position" @click="onClick">
   <!-- <LayoutSection title="Game Story"  > -->
      
        <!-- <template v-slot:append-left>
<q-btn
                flat
                round
                dense
                icon="close"
                v-if="isPaused || isEnded"
                @click="doEndAnimation"
            />
        </template> -->
        <!-- <template v-slot:append-right>
            <q-btn
                flat
                round
                dense
                icon="refresh"
                v-if="isEnded || isPaused"
                @click="restartAnimation"
            />
            <q-btn
                flat
                round
                dense
                icon="play_arrow"
                @click="playAnimation"
                
            />
            <q-btn
                flat
                round
                dense
                icon="pause"
                v-if="isPlaying"
                @click="pauseAnimation"
            />
            
        </template> -->

        <div v-if="ends?.length">
            <!-- HEADER -->
            <div
                class="end__container full-width first"
                :class="{ 'show-score': isPlaying || isPaused }"
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
                    <div style="width: 30px; min-width: 30px" class="game-story__avatar">
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
                    v-if="isPlaying || isPaused"
                >
                    <div>{{ totalScore.home }}</div>
                </div>
                <div
                    class="xl-text q-mx-sm font-header text-center game-story-total__score away row items-center"
                    v-if="isPlaying || isPaused"
                >
                    <div>{{ totalScore.away }}</div>
                </div>

                <div
                    class="row items-center justify-end no-wrap relative-position full-width"
                >
                    <div class="q-mr-sm text-right team-name">
                        {{ awayTeam.team?.name }}
                    </div>
                    <div style="width: 30px; min-width: 30px" class="game-story__avatar">
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
                <!-- <div class="text-xs">
                    {{ getEndStartMomentum(index, "home") }} 
                

                </div> -->
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
              <!-- <div class="text-xs">
                    {{ getEndStartMomentum(index, "away") }}

                </div> -->
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
                <!-- <div class="momentum-total left">
                    {{momentumTotalHome}}
                </div> -->
                <div
                    class="momentum-scale__value home"
                    :style="{ backgroundColor: getColor(homeTeam?.color) }"
                />
                <div
                    class="momentum-scale__value away"
                    :style="{ backgroundColor: getColor(awayTeam?.color) }"
                />
                <!-- <div class="momentum-total right">
  {{momentumTotalAway}}
                </div> -->
            </div>
        </div>
   <!-- </LayoutSection> -->
   </div>
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
    .momentum-total {
        position: absolute;
        bottom: 0px;
        &.right {
            right: 12px;

        }
        &.left {
            left: 12px;
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
import {Flip} from 'gsap/Flip';
gsap.registerPlugin(Flip)
const props = defineProps({
    gameId: Number,
    animated: Boolean,
});


const uniqueId = (Math.random() * 1000000000000).toFixed();

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

    if (id === awayTeam.value?.team_id) return id2 === null || id === id2;
    return id === id2;
};

const getMomentumTeam = (index) => {
    const homeId = homeTeam.value.team_id;
    const awayId = awayTeam.value.team_id;
    const { scoring_team_id, hammer_team_id, points_scored } =
        ends.value[index];
    let t = null;
    if (isTeam(homeId, hammer_team_id)) {
        if (!isTeam(homeId, scoring_team_id)) {
            t = "away";
        } else {
            t = points_scored === 1 ? "away" : "home";
        }
    } else {
        if (!isTeam(awayId, scoring_team_id)) {
            t = "home";
        } else {
            t = points_scored === 1 ? "home" : "away";
        }
    }
    return t;
};

const getEndMomentum = (teamId, index, includeHammer) => {
    let total = 0;
    let end;
    if (index > ends.value?.length - 1) {
        end = ends.value[ends.value.length - 1];
    } else {
        end = ends.value[index];
    }

    const { scoring_team_id, points_scored, end_number, hammer_team_id } = end;
    const isHome = teamId === homeTeam?.value?.team_id;
    const hasHammer = isTeam(teamId, hammer_team_id);

    const isScoringTeam = isTeam(teamId, scoring_team_id);
    const isSteal = !!isScoringTeam && !hasHammer;
    const isForce = !isScoringTeam && !hasHammer && points_scored === 1;

    if (isScoringTeam) {
        total += points_scored + (isSteal ? 1 : 0);
    } else if (isForce) {
        total += 1;
    }

    // LAST END MODIFIERS
    const { end_count } = game.value;
    const lastEnd = Math.max(ends.value.length, end_count);
    if (end_number === lastEnd && hasHammer) {
        const score = getTotalScore(index - 1);
        const lead = isHome ? score.home - score.away : score.away - score.home;
        total += 1 + lead;
    }else if ( includeHammer && hasHammer && !isSteal) {
        total += 1;
    }

    return total;
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

        const momentumTeam = getMomentumTeam(index);

        const running = { ...runningMomentum };

        const newMomentum = {
            team: momentumTeam,
            home: getEndMomentum(homeId, index, false) + running.home,
            away: getEndMomentum(awayId, index, false) + running.away,
        };

        runningMomentum = newMomentum;

        return [...allClone, newMomentum];
    }, []);
});

const getEndStartMomentum = (index, team) => {
    let lastEndMomentum;
    if (index === 0) {
        lastEndMomentum = 0;
    } else if (index > endMomentum.value.length - 1) {
        lastEndMomentum = endMomentum.value[endMomentum.value.length - 1][team]
    } else {
        lastEndMomentum = endMomentum.value[index - 1][team];
    }
    let end;
    if (index > ends.value.length - 1) {
        end = ends.value[ends.value.length - 1];
    } else {
        end = ends.value[index];
    }

    const { hammer_team_id } = end;
    const teamId =
        team === "home" ? homeTeam.value.team_id : awayTeam.value.team_id;
    const hasHammer = isTeam(teamId, hammer_team_id);
    const mod = hasHammer ? 1 : 0;
    return lastEndMomentum + mod;
};

const endEvents = computed(() => {
    if (!endMomentum.value?.length) return;
    const shiftHistory = [];
    return endMomentum.value.reduce((all, current, index) => {
        const lastTeamWithMomentum = [...shiftHistory]
            .reverse()
            .find((i) => !!i);
        const homeMomentum = getEndStartMomentum(index + 1, "home");
        const awayMomentum = getEndStartMomentum(index + 1, "away");

        const momentumTeam =
            homeMomentum > awayMomentum
                ? "home"
                : awayMomentum > homeMomentum
                ? "away"
                : lastTeamWithMomentum;
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

        const lastMomentumTeam = shiftHistory[shiftHistory.length - 2];

        if (momentumTeam === "home") {
            if (
                getEndStartMomentum(index + 1, "home") >
                    getEndStartMomentum(index + 1, "away") &&
                lastMomentumTeam === "away"
            ) {
                returnObj.momentum = true;
            }


        } else if (momentumTeam === "away") {
            if (
                getEndStartMomentum(index + 1, "away") >
                    getEndStartMomentum(index + 1, "home") &&
                lastMomentumTeam === "home"
            )
                returnObj.momentum = true;
        }

        return [...all, returnObj];
    }, []);
});

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

const momentumTotalHome = ref(0);
const momentumTotalAway = ref(0)

const setMomentum = (index) => {
    if (index >= ends.value?.length - 1) return;
     const {hammer_team_id} = ends.value[index + 1] ?? ends.value[index];
    const home = endMomentum.value[index].home + (isTeam(homeTeam.value.team_id, hammer_team_id) ? 1 : 0);
    const away = endMomentum.value[index].away + (isTeam(awayTeam.value.team_id, hammer_team_id) ? 1 : 0);

   

    momentumTotalHome.value = home;
    momentumTotalAway.value = away;
    
    if (home > away) {
        const homeLead = (home - away) / 10;
 momentumTransformHome.value = `scaleX(${homeLead})`;
  momentumTransformAway.value = `scaleX(0)`;
    } else if (away > home) {
const awayLead = (away - home) / 10;
          momentumTransformAway.value = `scaleX(${awayLead})`;
          momentumTransformHome.value = `scaleX(0)`;
    } else {
         momentumTransformAway.value = `scaleX(0)`;
           momentumTransformHome.value = `scaleX(0)`;
    }
   
   
    
     
   
    // if (home > away) {
    //     const lead = (home - away) / 5;

    //     momentumTransformHome.value = `scaleX(${lead})`;
    //     // momentumTransformAway.value = "scaleX(0)";
    // } else if (away > home) {
    //     const lead = (away - home) / 5;

    //     momentumTransformAway.value = `scaleX(${lead})`;
    //     momentumTransformHome.value = "scaleX(0)";
    // } else {
    //     momentumTransformHome.value = `scaleX(0)`;
    //     momentumTransformAway.value = `scaleX(0)`;
    // }
};

const defaultTotalScore = {
    home: 0,
    away: 0,
}
const totalScore = ref({...defaultTotalScore});

const getTotalScore = (index) => {
    const endScores = [...ends.value].splice(0, index + 1);
    return endScores.reduce(
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
const tl = gsap.timeline();
const isPlaying = ref(false);
const isPaused = ref(false);
const isEnded = ref(false)

const play = (startAnimated = false) => {
    if (tl.isActive()) {
        tl.restart();
        return;
    }
    tl.add("start");

    // Remove elements for beginning state
    const parentEl = document.querySelector(`#game-story-${uniqueId}`)
    console.log(parentEl)

    tl.to(
    parentEl.querySelectorAll("#game-story-footer"),
        {
            height: 0,
            opacity: 0,
            padding: 0,
            duration: 0.2,
        },
        "start"
    );

    tl.to(
        parentEl.querySelectorAll(".hammer-icon--floating"),
        {
            opacity: 0,
            duration: 0.2,
        },
        "start"
    );

    // Apply container styling



    // Collapse ends
    tl.to(
        parentEl.querySelectorAll(".end__container.end:not(#game-story-end-0)"),
        {
            height: 0,
            opacity: 0,
            padding: 0,
            duration: 1,
        },
        "start"
    );
    // tl.to(
    //     "#game-story-end-0>div,#game-story-end-0>header",
    //     {
    //         opacity: 0,
    //         scale: 0,
    //     },
    //     "start"
    // );

    tl.fromTo(
        parentEl.querySelectorAll(".color-bg__inner"),
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
        parentEl.querySelectorAll(".team-name"),
        {
            color: "white",
            duration: 0.2,
            zIndex: 1,
            fontFamily: '"Koulen", sans-serif',
            fontSize: 20,
        },
        "start"
    );

tl.add('intro-end')
    // BEGIN END LOOP

    ends.value.forEach((end, index) => {
       tl.add('headerlg')
        tl.fromTo(
            parentEl.querySelector(`#game-story-end-${index}>header`),
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
                immediateRender: true,
                // x:0,
                duration: 0.4,
            }, 'headerlg'
        );
         tl.add('header')
        tl.to(parentEl.querySelector(`#game-story-end-${index}>header`), {
            // x: -1000,
            y: -12,
            scale: 2,
            duration: 0.5,
            immediateRender: false,
            delay: 0.5,
        }, 'header');
       

        const endEl = parentEl.querySelector(`#game-story-end-${index}`);
        tl.to(endEl.querySelector('.hammer-icon--floating'), {
            scale: 0.5,
            duration: 0,
            opacity: 0,
         
        }, 'headerlg')

        tl.add('gamedata')
        tl.to(endEl.querySelector('.hammer-icon--floating:not(.right)'), 
        {
            duration: 1,
            opacity: 1,
            x: 30,
          
          
        }, 'gamedata')
        tl.to(endEl.querySelector('.hammer-icon--floating.right'), 
        {
            duration: 1,
            opacity: 1,
            x: -30,
           
          
        }, 'gamedata')
        //  tl.to('.hammer-icon--floating.right', {
        //     scale: 0.5,
        //     opacity: 1,
        //     duration: 0.2,
        //     x: -50,
        // })

        tl.fromTo(
            endEl.querySelectorAll(".game-story-points__scored"),
            {
                // scale: 0,
                x: (e) => !!e ? 50 : -50,
                y: -50,
                opacity: 0,
            },
            {
                
                opacity: 1,
                x: 0,
                y: 0,
                duration: 0.5,
                delay: 0.2,
                stagger: 0.2,
                immediateRender: true,
                onComplete: () => setMomentum(index),
               
            }, 'gamedata'
        );

        tl.add("events");

        tl.fromTo(
            endEl.querySelectorAll(".game-story-event"),
            {
                opacity: 0,
                x: (e) => (!e ? 0 : -100),
                scaleX: (e) => (!e ? 0 : 1),
            },
            {
                opacity: 1,
                x: 0,
                scaleX: 1,
                transformOrigin: (e) => !!e ? 'right' : 'left',
                duration: 0.5,
                stagger: 0.8,
                ease: "sine",

                
            },
            "events"
        );
        tl.add("end");
        tl.to(
            parentEl.querySelectorAll(`#game-story-end-${index}`),
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
            parentEl.querySelectorAll(`#game-story-end-${index + 1}`),
            {
                height: "auto",
                paddingTop: 32,
                paddingBottom: 32,
                opacity: 1,
                duration: 1,
                scale: 1,
                minHeight: "128px",
                delay: 2,
                onComplete: () => {
                    totalScore.value = getTotalScore(index);
                },
             
            },
            "end"
        );
    });
    tl.eventCallback("onComplete", () => {
        isPlaying.value = false;
        isEnded.value = true;
       
    });
    if (startAnimated) {
        tl.play('intro-end')
    }
};


const doEndAnimation = () => {
    const state = Flip.getState('#game-story-footer,.hammer-icon--floating, .end__container, .end,.color-bg__inner,.team-name,.end__container')
    tl.revert();
    tl.kill();
    nextTick(() => {
          isEnded.value = false;
        isPaused.value = false;
 Flip.from(state, {
    duration: 0.5,
    nested: true,
    fade: true,
 
 })
    })
   
    // gsap.to('#game-story-container', {
    //     rotateY: 360,
    //     duration: 0.1,
    //     repeat: 2,
    // })
}

const playAnimation = (startAnimated) => {
    if (tl.paused()) {
        tl.resume();
    
    } else {
         totalScore.value = {...defaultTotalScore}
       momentumTotalHome.value = 0;
    momentumTotalAway.value = 0;
        play(startAnimated);
    }

    isPlaying.value = true;
    isPaused.value = false;
};

const pauseAnimation = () => {
    tl.pause();
    isPlaying.value = false;
    isPaused.value = true;
};

const restartAnimation = () => {
    tl.restart();
    totalScore.value = {...defaultTotalScore}
        momentumTotalHome.value = 0;
    momentumTotalAway.value = 0;
     isPlaying.value = true;
    isPaused.value = false;
    
};

const onClick = () => {
    if (!props.animated) return;
    if (isEnded.value) {
        restartAnimation()
    } else if (isPlaying.value) {
        pauseAnimation()
    } else {
        playAnimation(true)
    }
}

onMounted(() => {
    if (props.animated) {
        playAnimation(true);
    }
})
</script>
<script>
export default {
    name: "GameStory",
};
</script>
