<template>
    <!-- @click="editGame(result.id)" -->
    <AreaSearch
        v-if="showSearch"
        @close="showSearch = false"
        @select="onSelect"
        globalOnly
        tableName="teams"
        :query="`
        id,
        name,
        team_avatar
        `"
    />
    <div class="result__container--wrap" :class="{ expanded }">
        <div
            class="result__header"
            :style="{ backgroundImage }"
            ref="container"
        >
            <div class="result__container" ref="header" @click="emit('expand')">
                <div class="team__profile--container column no-wrap">
                    <div class="team-avatar__container">
                        <div class="team-avatar--wrap">
                            <Avataaar
                                v-bind="parseAvatar(result.home_avatar)"
                            />

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

                <div class="row items-center full-width">
                    <div
                        class="row justify-around items-center text-xxxl full-width"
                    >
                        <div class="column justify-center items-center no-wrap">
                            <div class="score">
                                {{ result.home_points ?? 0 }}
                            </div>
                        </div>
                        <div class="column justify-center items-center no-wrap">
                            <div class="score">
                                {{ result.away_points ?? 0 }}
                            </div>
                        </div>
                    </div>
                </div>

                <div class="team__profile--container column no-wrap">
                    <div class="team-avatar__container">
                        <div class="team-avatar--wrap">
                            <Avataaar
                                v-bind="parseAvatar(result.away_avatar)"
                            />

                            <RockIcon
                                :draggable="false"
                                :color="result.away_color"
                            />
                        </div>
                    </div>

                    <h2 class="text-sm truncate-text text-center">
                        <span v-if="result.away_name">{{
                            result.away_name
                        }}</span>
                        <q-chip
                            v-else
                            dense
                            color="deep-purple"
                            text-color="white"
                            class="text-bold q-mx-none"
                            clickable
                            icon="add"
                            @click.stop="showSearch = true"
                            ><span>Add</span>
                        </q-chip>
                    </h2>
                </div>
            </div>

            <!-- League / Location -->
            <div class="row justify-between q-pt-sm ">
                <div class="column no-wrap q-mr-xs ">
                    <div class="row no-wrap text-xs">
                             <q-icon name="location_on" />
                        <div class="truncate-text">
                            {{result.rink_name || 'Unknown rink'}}
                        </div>
                   
                    </div>
                    <div class="row no-wrap text-xs">
                            <q-icon name="crop_portrait" />
                        <div class="truncate-text" v-if="result.sheet_name">Sheet {{result.sheet_name}}/{{numberToLetter(result.sheet_name)}}</div>
                        <div class="truncate-text" v-else>Unknown sheet</div>
                    
                    </div>
                </div>
                <!-- <div class="column items-center justify-center">
                    <div class="text-xs">July 1, 2023 at 1:30pm</div>
                </div> -->
                <div class="row no-wrap text-xs justify-end" v-if="result.event_name">
                    <q-icon  name="emoji_events" />
                    <div class="truncate-text">{{result.event_name}}</div>
                    
                </div>
            </div>
        </div>
        <transition
            appear
            enter-active-class="animated slideInDown"
            leave-active-class="animated slideOutUp"
        >
            <div
                class="content__expandable column"
                :class="{ expanded }"
                :style="{ backgroundColor }"
            >
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
                        :score="getScore"
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
        </transition>
    </div>
</template>
<style lang="scss" scoped>
$result-height: 7vh;
$columns: 20% 60% 20%;
.result__container--wrap {
    border-radius: 16px;
    // width: min(600px, 100%);
    max-height: fit-content;
    border: 1px solid $grey-3;
    margin-bottom: var(--space-sm);

    // height: 100%;
    transition: all 1s;
    .result__header {
        padding-bottom: var(--space-xs);
        padding-top: var(--space-xs);
        border-radius: inherit;
        padding-left: var(--space-sm);
        padding-right: var(--space-sm);
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
    .content__expandable {
        transition: all 0.3s;
        height: 0px;
        overflow: hidden;
        padding-left: var(--space-sm);
        padding-right: var(--space-sm);
        border-bottom-left-radius: inherit;
        border-bottom-right-radius: inherit;
     
        &.expanded {
            height: fit-content;
               padding-bottom: var(--space-sm);
        }
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
        // padding-top: var(--space-sm);
        grid-template-rows: 100%;
        grid-template-columns: $columns;
        border-bottom: 1px solid $grey-3;

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
import {numberToLetter} from '@/utils/sheets'
const props = defineProps({
    expanded: Boolean,
    result: Object,
});

const emit = defineEmits(["expand"]);

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
    return (
        (allItems.filter((e) => e[key] === true)?.length / allItems.length) *
        100
    );
};

const getScore = computed(() => {
    return Array.from(
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
});

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

const showSearch = ref(false);
const onSelect = (t) => {
    console.log("SELECT: ", t);
    showSearch.value = false;
};

const container = ref(null);
const { height: containerHeight, width: containerWidth } =
    useElementBounding(container);

const { getEventBackground, getEventColor } = useColor();

const backgroundImage = computed(() =>
    getEventBackground(props.result.event_color, containerHeight.value, containerWidth.value)
);
const backgroundColor = computed(() => getEventColor(props.result.event_color));
</script>
