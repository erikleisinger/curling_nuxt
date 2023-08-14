<template>
    <!-- @click="editGame(result.id)" -->
    <div class="result__container--wrap" :class="{ expanded }">
        <div class="result__container" ref="header">
            <div class="team__profile--container column no-wrap">
                <div class="team-avatar__container">
                    <div class="team-avatar--wrap">
                        <Avataaar v-bind="parseAvatar(result.home_avatar)" />

                        <RockIcon
                            :draggable="false"
                            :color="result.home_color"
                        />
                    </div>
                </div>

                <h2 class="text-sm truncate-text text-center">
                    {{ result.home_name }}
                </h2>
            </div>
            <div class="row justify-around items-center text-xxxl">
                <div class="column justify-center items-center no-wrap">
                    <div class="score">{{ result.home_points ?? 0 }}</div>
                    <!-- <q-icon
                            name="check_circle"
                            color="positive"
                            size="xs"
                            :style="{
                                visibility: isVisible('home', result)
                            }"
                        /> -->
                </div>
                <div class="column justify-center items-center no-wrap">
                    <div class="score">{{ result.away_points ?? 0 }}</div>
                    <!-- <q-icon
                            name="check_circle"
                            color="positive"
                            size="xs"
                            :style="{
                                visibility: isVisible('away', result)
                            }"
                        /> -->
                </div>
            </div>

            <div class="team__profile--container column no-wrap">
                <div class="team-avatar__container">
                    <div class="team-avatar--wrap">
                        <Avataaar v-bind="parseAvatar(result.away_avatar)" />

                        <RockIcon
                            :draggable="false"
                            :color="result.away_color"
                        />
                    </div>
                </div>

                <h2 class="text-sm truncate-text text-center">
                    {{ result.away_name }}
                </h2>
            </div>
        </div>
        <transition
            appear
            enter-active-class="animated slideInDown"
            leave-active-class="animated slideOutUp"
        >
            <div class="content__expandable" :class="{ expanded }">
                <div class="h2h-container" v-if="scoreDetails?.length">
                    <percentage
                        :percent="getPercent('home_conversions')"
                        :color="result.home_color"
                        label="Hammer Conv"
                    />
                    <percentage
                        :percent="getPercent('away_conversions')"
                        :color="result.away_color"
                        label="Hammer Conv"
                        reverse
                    />
                </div>
                <div class="h2h-container" v-if="scoreDetails?.length">
                    <percentage
                        :percent="getPercent('home_forces')"
                        :color="result.home_color"
                        label="Force eff"
                    />
                    <percentage
                        :percent="getPercent('away_forces')"
                        :color="result.away_color"
                        label="Force eff"
                        reverse
                    />
                </div>
                <div class="h2h-container" v-if="scoreDetails?.length">
                    <percentage
                        :percent="getPercent('home_steals')"
                        :color="result.home_color"
                        label="Steal eff"
                    />
                    <percentage
                        :percent="getPercent('away_steals')"
                        :color="result.away_color"
                        label="Steal eff"
                        reverse
                    />
                </div>
                <div class="h2h-container" v-if="scoreDetails?.length">
                    <percentage
                        :percent="getPercent('home_hammer')"
                        :color="result.home_color"
                        label="Hammer pos"
                    />
                    <percentage
                        :percent="getPercent('away_hammer')"
                        :color="result.away_color"
                        label="Hammer pos"
                        reverse
                    />
                </div>
                <table class="score_detail_card" >
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

                <!-- <div>
                    <div>Average points per end</div>
                    <div class="head-to-head__container">
                        <div class="h2h-team-result__container">Hi</div>
                        <div class="h2h-chart__container">
                            <ChartHeadToHead :datasets="datasets" />
                        </div>
                        <div class="h2h-team-result__container">Hi</div>
                    </div>
                </div>
                <div>
                    <div>Hammer conversion</div>
                    <div class="head-to-head__container">
                        <div class="h2h-team-result__container">Hi</div>
                        <div class="h2h-chart__container">
                            <ChartHeadToHead :datasets="datasets2" />
                        </div>
                        <div class="h2h-team-result__container">Hi</div>
                    </div>
                </div>
                <div>
                    <div>Stolen ends</div>
                    <div class="head-to-head__container">
                        <div class="h2h-team-result__container">Hi</div>
                        <div class="h2h-chart__container">
                            <ChartHeadToHead :datasets="datasets" />
                        </div>
                        <div class="h2h-team-result__container">Hi</div>
                    </div>
                </div>
                <div>
                    <div>Hammer possession</div>
                    <div class="head-to-head__container">
                        <div class="h2h-team-result__container">Hi</div>
                        <div class="h2h-chart__container">
                            <ChartHeadToHead :datasets="datasets" />
                        </div>
                        <div class="h2h-team-result__container">Hi</div>
                    </div>
                </div>
                <div>
                    <div>Hammer conversion</div>
                    <div class="head-to-head__container">
                        <div class="h2h-team-result__container">Hi</div>
                        <div class="h2h-chart__container">
                            <ChartHeadToHead :datasets="datasets" />
                        </div>
                        <div class="h2h-team-result__container">Hi</div>
                    </div>
                </div> -->
            </div>
        </transition>
    </div>
</template>
<style lang="scss" scoped>
$result-height: 7vh;
$columns: 20% 60% 20%;
.result__container--wrap {
    // padding: var(--space-sm);
    width: min(600px, 100%);
    // max-height: fit-content;
    // height: 100%;
    transition: all 1s;
    &.expanded {
        // max-height: 100%;
    }
    .content__expandable {
        transition: all 0.3s;
        height: 0px;
        overflow: hidden;
        &.expanded {
            height: fit-content;
        }
        // &:not(.expanded) {
        //     animation: expand 1s linear forwards;
        //     animation-direction: reverse;
        // }
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

    .result__container {
        display: grid;
        // grid-template-rows: 1fr auto;
        padding-top: var(--space-sm);
        grid-template-rows: 100%;
        grid-template-columns: $columns;

        position: relative;

        .team__profile--container {
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
        font-size: 7vw;
    }
    .h2h-container {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        grid-column-gap: 1em;
    }
}
@keyframes expand {
    0% {
        height: 0px;
    }
    100% {
        height: 50px;
    }
}
</style>
<script setup>
import { useEditorStore } from "@/store/editor";
import {
    useElementBounding,
    useElementSize,
    useParentElement,
    watchDebounced,
} from "@vueuse/core";
const props = defineProps({
    expanded: Boolean,
    result: Object,
});

const isVisible = (team, { home_points, away_points }) => {
    if (team === "home") {
        return home_points > away_points ? "visible" : "hidden";
    } else if (team === "away") {
        return away_points > home_points ? "visible" : "hidden";
    }

    return "hidden";
};

const editGame = (gameId) => {
    const editorStore = useEditorStore();
    editorStore.toggleLineScore({ open: true, editedGame: { id: gameId } });
};

const { height: parentHeight } = useElementSize(useParentElement());
const header = ref(null);

const { height: headerHeight } = useElementBounding(header);

const expandedHeight = computed(
    () => `${parentHeight.value - headerHeight.value}px`
);
const { getColor } = useColor();
const datasets = [
    {
        backgroundColor: getColor(props.result.home_color),
        barPercentage: 1,
        categoryPercentage: 1,
        borderRadius: 12,
        borderSkipped: "middle",
        fontColor: props.result.home_color === "yellow" ? "black" : "white",
        barThickness: 15,
        data: [2.2],
    },
    {
        backgroundColor: getColor(props.result.away_color),
        barPercentage: 1,
        categoryPercentage: 1,
        borderRadius: 12,
        borderSkipped: "middle",
        fontColor: props.result.away_color === "yellow" ? "black" : "white",
        barThickness: 15,
        data: [1],
    },
];
const datasets2 = [
    {
        backgroundColor: getColor(props.result.home_color),
        barPercentage: 1,
        categoryPercentage: 1,
        borderRadius: 12,
        borderSkipped: "middle",
        fontColor: props.result.home_color === "yellow" ? "black" : "white",
        barThickness: 15,
        data: [76],
    },
    {
        backgroundColor: getColor(props.result.away_color),
        barPercentage: 1,
        categoryPercentage: 1,
        borderRadius: 12,
        borderSkipped: "middle",
        fontColor: props.result.away_color === "yellow" ? "black" : "white",
        barThickness: 15,
        data: [52],
    },
];

const scoreDetails = ref([]);

const getScoreDetails = async () => {
    const client = useSupabaseClient();
    const { data } = await client.rpc("get_game_score_detailed", {
        game_id_param: props.result?.id,
    });

    scoreDetails.value = data.sort((a, b) => a.end_number - b.end_number);
};

const isExpanded = computed(() => props.expanded);

watchDebounced(isExpanded, (v) => {
    if (!v) return;
    getScoreDetails();
});

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
    console.log(allItems, scoreDetails.value[0]);
    return (
        (allItems.filter((e) => e[key] === true)?.length / allItems.length) *
        100
    );
};
</script>
