<template>
     <div
                class="content__expandable column" v-if="score && scoreDetails"

            >
                            <!-- :style="{ backgroundColor }" -->
                <div
                    style="
                        border-radius: 16px;
                        overflow: hidden;
                        margin-top: 1em;
                    "
                >
                    <LinescoreGridView
                        :game="{
                            home: {
                                id: 1,
                                avatar: result.is_home_team
                                    ? result.home_avatar
                                    : result.away_avatar,
                                color: result.is_home_team
                                    ? result.home_color
                                    : result.away_color,
                            },
                            away: {
                                id: 2,
                                avatar: result.is_home_team
                                    ? result.away_avatar
                                    : result.home_avatar,
                                color: result.is_home_team
                                    ? result.away_color
                                    : result.home_color,
                            },
                        }"
                        :endCount="
                            Math.max(result.end_count, scoreDetails.length)
                        "
                        :score="score"
                        :selected="20"
                    />
                </div>

                <div class="h2h-container" v-if="scoreDetails?.length">
                    <div class="text-center text-bold h2h__header">
                        Hammer conversion
                    </div>
                    <div class="text-center h2h__header text-sm text-italic">
                        Scoring 2+ points with hammer
                    </div>
                    <div class="h2h-percentage--wrap">
                        <percentage
                            :percent="getPercent('home_conversions')"
                            :color="result.home_color"
                            label=""
                            reverse
                        />
                        <div>
                            <q-btn
                                flat
                                round
                                icon="visibility"
                                :color="showConversions ? 'primary' : 'grey-9'"
                                @click.prevent.stop="
                                    showConversions = !showConversions
                                "
                            />
                        </div>
                        <percentage
                            :percent="getPercent('away_conversions')"
                            :color="result.away_color"
                            label=""
                        />
                    </div>
                    <div style="overflow: hidden">
                        <transition
                            appear
                            enter-active-class="animated slideInDown"
                            leave-active-class="animated slideOutUp"
                        >
                            <LinescoreGridView
                                v-if="showConversions"
                                :game="{
                                    home: {
                                        id: 1,
                                        avatar: result.home_avatar,
                                        color: result.home_color,
                                    },
                                    away: {
                                        id: 2,
                                        avatar: result.away_avatar,
                                        color: result.away_color,
                                    },
                                }"
                                :endCount="
                                    Math.max(
                                        result.end_count,
                                        scoreDetails.length
                                    )
                                "
                                :score="getScore"
                                :selected="20"
                                style="margin-top: 1em"
                                :transparent="true"
                            >
                                <template v-slot:header>
                                    <div style="visibility: hidden">F</div>
                                    <div style="visibility: hidden">F</div>
                                </template>
                                <template v-slot:row="{ end }">
                                    <div>
                                        <q-icon
                                            size="6vw"
                                            :name="
                                                getIcon(
                                                    scoreDetails[end - 1]
                                                        ?.home_conversions
                                                )
                                            "
                                            :color="
                                                getIconColor(
                                                    scoreDetails[end - 1]
                                                        ?.home_conversions
                                                )
                                            "
                                        />
                                    </div>
                                    <div>
                                        <q-icon
                                            size="6vw"
                                            :name="
                                                getIcon(
                                                    scoreDetails[end - 1]
                                                        ?.away_conversions
                                                )
                                            "
                                            :color="
                                                getIconColor(
                                                    scoreDetails[end - 1]
                                                        ?.away_conversions
                                                )
                                            "
                                        />
                                    </div>
                                </template>
                                <template v-slot:footer>
                                    <div style="font-size: 6vw">
                                        {{
                                            getPercent(
                                                "home_conversions"
                                            ).toFixed()
                                        }}%
                                    </div>
                                    <div style="font-size: 6vw">
                                        {{
                                            getPercent(
                                                "away_conversions"
                                            ).toFixed()
                                        }}%
                                    </div>
                                </template>
                            </LinescoreGridView>
                        </transition>
                    </div>
                </div>

                <div class="h2h-container" v-if="scoreDetails?.length">
                    <div class="text-center text-bold h2h__header">
                        Force efficiency
                    </div>
                    <div class="text-center h2h__header text-sm text-italic">
                        Without hammer, forcing opposition to 1
                    </div>
                    <div class="h2h-percentage--wrap">
                        <percentage
                            :percent="getPercent('home_forces')"
                            :color="result.home_color"
                            label=""
                            reverse
                        />
                        <div>
                            <q-btn
                                flat
                                round
                                icon="visibility"
                                :color="showForces ? 'primary' : 'grey-9'"
                                @click.prevent.stop="showForces = !showForces"
                            />
                        </div>
                        <percentage
                            :percent="getPercent('away_forces')"
                            :color="result.away_color"
                            label=""
                        />
                    </div>

                    <div style="overflow: hidden">
                        <transition
                            appear
                            enter-active-class="animated slideInDown"
                            leave-active-class="animated slideOutUp"
                        >
                            <LinescoreGridView
                                v-if="showForces"
                                :game="{
                                    home: {
                                        id: 1,
                                        avatar: result.home_avatar,
                                        color: result.home_color,
                                    },
                                    away: {
                                        id: 2,
                                        avatar: result.away_avatar,
                                        color: result.away_color,
                                    },
                                }"
                                :endCount="
                                    Math.max(
                                        result.end_count,
                                        scoreDetails.length
                                    )
                                "
                                :score="getScore"
                                :selected="20"
                                style="margin-top: 1em"
                                :transparent="true"
                            >
                                <template v-slot:header>
                                    <div style="visibility: hidden">F</div>
                                    <div style="visibility: hidden">F</div>
                                </template>
                                <template v-slot:row="{ end }">
                                    <div>
                                        <q-icon
                                            size="6vw"
                                            :name="
                                                getIcon(
                                                    scoreDetails[end - 1]
                                                        ?.home_forces
                                                )
                                            "
                                            :color="
                                                getIconColor(
                                                    scoreDetails[end - 1]
                                                        ?.home_forces
                                                )
                                            "
                                        />
                                    </div>
                                    <div>
                                        <q-icon
                                            size="6vw"
                                            :name="
                                                getIcon(
                                                    scoreDetails[end - 1]
                                                        ?.away_forces
                                                )
                                            "
                                            :color="
                                                getIconColor(
                                                    scoreDetails[end - 1]
                                                        ?.away_forces
                                                )
                                            "
                                        />
                                    </div>
                                </template>
                                <template v-slot:footer>
                                    <div style="font-size: 6vw">
                                        {{
                                            getPercent("home_forces").toFixed()
                                        }}%
                                    </div>
                                    <div style="font-size: 6vw">
                                        {{
                                            getPercent("away_forces").toFixed()
                                        }}%
                                    </div>
                                </template>
                            </LinescoreGridView>
                        </transition>
                    </div>
                </div>
                <div class="h2h-container" v-if="scoreDetails?.length">
                    <div class="text-center text-bold h2h__header">
                        Steal efficiency
                    </div>
                    <div class="text-center h2h__header text-sm text-italic">
                        Scoring without hammer
                    </div>
                    <div class="h2h-percentage--wrap">
                        <percentage
                            :percent="getPercent('home_steals')"
                            :color="result.home_color"
                            label=""
                            reverse
                        />
                        <div>
                            <q-btn
                                flat
                                round
                                icon="visibility"
                                :color="showSteals ? 'primary' : 'grey-9'"
                                @click.prevent.stop="showSteals = !showSteals"
                            />
                        </div>
                        <percentage
                            :percent="getPercent('away_steals')"
                            :color="result.away_color"
                            label=""
                        />
                    </div>
                    <div style="overflow: hidden">
                        <transition
                            appear
                            enter-active-class="animated slideInDown"
                            leave-active-class="animated slideOutUp"
                        >
                            <LinescoreGridView
                                v-if="showSteals"
                                :game="{
                                    home: {
                                        id: 1,
                                        avatar: result.home_avatar,
                                        color: result.home_color,
                                    },
                                    away: {
                                        id: 2,
                                        avatar: result.away_avatar,
                                        color: result.away_color,
                                    },
                                }"
                                :endCount="
                                    Math.max(
                                        result.end_count,
                                        scoreDetails.length
                                    )
                                "
                                :score="getScore"
                                :selected="20"
                                style="margin-top: 1em"
                                :transparent="true"
                            >
                                <template v-slot:header>
                                    <div style="visibility: hidden">F</div>
                                    <div style="visibility: hidden">F</div>
                                </template>
                                <template v-slot:row="{ end }">
                                    <div>
                                        <q-icon
                                            size="6vw"
                                            :name="
                                                getIcon(
                                                    scoreDetails[end - 1]
                                                        ?.home_steals
                                                )
                                            "
                                            :color="
                                                getIconColor(
                                                    scoreDetails[end - 1]
                                                        ?.home_steals
                                                )
                                            "
                                        />
                                    </div>
                                    <div>
                                        <q-icon
                                            size="6vw"
                                            :name="
                                                getIcon(
                                                    scoreDetails[end - 1]
                                                        ?.away_steals
                                                )
                                            "
                                            :color="
                                                getIconColor(
                                                    scoreDetails[end - 1]
                                                        ?.away_steals
                                                )
                                            "
                                        />
                                    </div>
                                </template>
                                <template v-slot:footer>
                                    <div style="font-size: 6vw">
                                        {{
                                            getPercent("home_steals").toFixed()
                                        }}%
                                    </div>
                                    <div style="font-size: 6vw">
                                        {{
                                            getPercent("away_steals").toFixed()
                                        }}%
                                    </div>
                                </template>
                            </LinescoreGridView>
                        </transition>
                    </div>
                </div>
                <div class="h2h-container" v-if="scoreDetails?.length">
                    <div class="text-center text-bold h2h__header">
                        Hammer possession
                    </div>
                    <div class="h2h-percentage--wrap">
                        <percentage
                            :percent="getPercent('home_hammer')"
                            :color="result.home_color"
                            label=""
                            reverse
                        />
                        <div>
                            <q-btn
                                flat
                                round
                                icon="visibility"
                                :color="showHammer ? 'primary' : 'grey-9'"
                                @click.prevent.stop="showHammer = !showHammer"
                            />
                        </div>
                        <percentage
                            :percent="getPercent('away_hammer')"
                            :color="result.away_color"
                            label=""
                        />
                    </div>
                    <div style="overflow: hidden">
                        <transition
                            appear
                            enter-active-class="animated slideInDown"
                            leave-active-class="animated slideOutUp"
                        >
                            <LinescoreGridView
                                v-if="showHammer"
                                :game="{
                                    home: {
                                        id: 1,
                                        avatar: result.home_avatar,
                                        color: result.home_color,
                                    },
                                    away: {
                                        id: 2,
                                        avatar: result.away_avatar,
                                        color: result.away_color,
                                    },
                                }"
                                :endCount="
                                    Math.max(
                                        result.end_count,
                                        scoreDetails.length
                                    )
                                "
                                :score="getScore"
                                :selected="20"
                                style="margin-top: 1em"
                                :transparent="true"
                            >
                                <template v-slot:header>
                                    <div style="visibility: hidden">F</div>
                                    <div style="visibility: hidden">F</div>
                                </template>
                                <template v-slot:row="{ end }">
                                    <div>
                                        <q-icon
                                            size="6vw"
                                            :name="
                                                getIcon(
                                                    scoreDetails[end - 1]
                                                        ?.home_hammer
                                                )
                                            "
                                            :color="
                                                getIconColor(
                                                    scoreDetails[end - 1]
                                                        ?.home_hammer
                                                )
                                            "
                                        />
                                    </div>
                                    <div>
                                        <q-icon
                                            size="6vw"
                                            :name="
                                                getIcon(
                                                    scoreDetails[end - 1]
                                                        ?.away_hammer
                                                )
                                            "
                                            :color="
                                                getIconColor(
                                                    scoreDetails[end - 1]
                                                        ?.away_hammer
                                                )
                                            "
                                        />
                                    </div>
                                </template>
                                <template v-slot:footer>
                                    <div style="font-size: 6vw">
                                        {{
                                            getPercent("home_hammer").toFixed()
                                        }}%
                                    </div>
                                    <div style="font-size: 6vw">
                                        {{
                                            getPercent("away_hammer").toFixed()
                                        }}%
                                    </div>
                                </template>
                            </LinescoreGridView>
                        </transition>
                    </div>
                </div>
                <table class="score_detail_card" v-if="false">
                    <thead>
                        <th>Sco</th>
                        <th>Ham</th>
                        <th>Fo</th>
                        <th>St</th>
                        <!-- <th>Cont</th> -->
                        <th>#</th>
                        <!-- <th>Cont</th> -->
                        <th>St</th>
                        <th>Fo</th>
                        <th>Ham</th>
                        <th>Sco</th>
                    </thead>
                    <tbody>
                        <tr v-for="row in scoreDetails" :key="row.end_number">
                            <td>
                                <div class="score">
                                    {{
                                        row.scoring_team_id === row.home_team
                                            ? row.points_scored
                                            : 0
                                    }}
                                </div>
                            </td>
                            <td>
                                <q-icon
                                    size="6vw"
                                    :name="getIcon(row.home_conversions)"
                                    :color="getIconColor(row.home_conversions)"
                                />
                            </td>
                            <td>
                                <q-icon
                                    size="6vw"
                                    :name="getIcon(row.home_forces)"
                                    :color="getIconColor(row.home_forces)"
                                />
                            </td>
                            <td>
                                <q-icon
                                    size="6vw"
                                    :name="getIcon(row.home_steals)"
                                    :color="getIconColor(row.home_steals)"
                                />
                            </td>
                            <!-- <td/> -->
                            <td>{{ row.end_number }}</td>
                            <!-- <td /> -->
                            <td>
                                <q-icon
                                    size="6vw"
                                    :name="getIcon(row.away_steals)"
                                    :color="getIconColor(row.away_steals)"
                                />
                            </td>
                            <td>
                                <q-icon
                                    size="6vw"
                                    :name="getIcon(row.away_forces)"
                                    :color="getIconColor(row.away_forces)"
                                />
                            </td>
                            <td>
                                <q-icon
                                    size="6vw"
                                    :name="getIcon(row.away_conversions)"
                                    :color="getIconColor(row.away_conversions)"
                                />
                            </td>

                            <td>
                                <div class="score">
                                    {{
                                        row.scoring_team_id === row.away_team
                                            ? row.points_scored
                                            : 0
                                    }}
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
</template>
<style lang="scss" scoped>
$result-height: 7vh;
$columns: 20% 60% 20%;
.result__container--wrap {
    border-radius: 16px;
    max-height: fit-content;
    border: 1px solid $grey-3;
    margin-bottom: var(--space-sm);
    transition: all 1s;
   
    .content__expandable {
        transition: all 0.3s;
        height: 0px;
        overflow: hidden;
        padding-left: var(--space-sm);
        padding-right: var(--space-sm);
        border-bottom-left-radius: inherit;
        border-bottom-right-radius: inherit;
     
        height: fit-content;
        padding-bottom: var(--space-sm);
        .head-to-head__container {
            display: grid;
            grid-template-columns: $columns;

            .h2h-chart__container {
                max-height: 50px;
            }
            .h2h-team-result__container {
                display: flex;
                justify-content: center;
                align-items: center;
            }
        }
        .score_detail_card {
            width: 100%;
            td {
                .q-icon {
                    margin: auto !important;
                }
                .score {
                    margin: auto !important;
                    font-size: 7vw;
                }
                text-align: center;
            }
        }
    }
    .score {
        margin: auto !important;
        font-size: min(7vw, 50px);
    }
    .h2h-container {
        border: 1px solid $grey-4;
        box-shadow: $pretty-shadow;
        margin-top: var(--space-sm);
        padding: var(--space-xs);
        border-radius: 16px;
        background-color: rgba(255, 255, 255, 0.8);
        .h2h-percentage--wrap {
            display: grid;
            grid-template-columns: calc(50% - 40px) auto calc(50% - 40px);
            grid-column-gap: 1em;
        }
        .h2h__header {
            margin-bottom: calc(-1 * var(--space-xs));
        }
    }
}
</style>
<script setup>
    const props = defineProps({
        result: Object,
    })

    const showForces = ref(false);
const showSteals = ref(false);
const showHammer = ref(false);
const showConversions = ref(false);

const visibleStat = ref(null);

const showStat = (stat) => {
    if (visibleStat.value === stat) {
        visibleStat.value = null;
    } else {
        visibleStat.value = stat;
    }
};

const scoreDetails = ref(null);

const getScoreDetails = async () => {
    const client = useSupabaseClient();
    const { data } = await client.rpc("get_game_score_detailed", {
        game_id_param: props.result?.id,
    });
    scoreDetails.value = data
        .sort((a, b) => a.end_number - b.end_number)
        .map((e) => {
            const { is_home_team: isHome } = props.result;
            return {
                ...e,
                away_conversions: isHome
                    ? e.away_conversions
                    : e.home_conversions,
                away_forces: isHome ? e.away_forces : e.home_forces,
                away_hammer: isHome ? e.away_hammer : e.home_hammer,
                away_steals: isHome ? e.away_steals : e.home_steals,
                home_conversions: isHome
                    ? e.home_conversions
                    : e.away_conversions,
                home_forces: isHome ? e.home_forces : e.away_forces,
                home_hammer: isHome ? e.home_hammer : e.away_hammer,
                home_steals: isHome ? e.home_steals : e.away_steals,
            };
        });
};

const score = ref(null)

const getScore = () => {
     score.value = Array.from(
        {
            length: Math.max(
                props.result.end_count,
                scoreDetails.value?.length
            ),
        },
        (_, i) => i + 1
    ).reduce((all, current, index) => {
        if (!scoreDetails.value[index]) {
            return {
                ...all,
                [index + 1]: {
                    home: "X",
                    away: "X",
                },
            };
        } else {
            return {
                ...all,
                [index + 1]: {
                    home:
                        scoreDetails.value[index]?.points_scored === null
                            ? "X"
                            : scoreDetails.value[index]?.scoring_team_id ===
                              scoreDetails.value[index]?.home_team
                            ? scoreDetails.value[index]?.points_scored
                            : 0,
                    away:
                        scoreDetails.value[index]?.points_scored === null
                            ? "X"
                            : scoreDetails.value[index]?.scoring_team_id ===
                              scoreDetails.value[index]?.away_team
                            ? scoreDetails.value[index]?.points_scored
                            : 0,
                },
            };
        }
    }, {});


};

const getIcon = (val) => {
    if (val === true) {
        return "check_circle";
    } else if (val === false) {
        return "cancel";
    }
    return "remove";
};

const getIconColor = (val) => {
    if (val === true) {
        return "positive";
    } else if (val === false) {
        return "negative";
    }
    return "";
};

const getPercent = (key) => {
    const allItems = scoreDetails.value.filter((e) => e[key] !== null);
    return (
        (allItems.filter((e) => e[key] === true)?.length / allItems.length) *
        100
    );
};

onMounted(async () => {

    await getScoreDetails();
    await getScore();
})

</script>