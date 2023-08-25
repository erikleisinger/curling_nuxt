<template>
<div style="position: relative">
    <slot/>
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
            <div class="result__container"  @click="emit('expand')">
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
            <TeamGameResultDetails v-if="expanded" :result="props.result"/>
        </transition>
    </div>
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

    .result__container {
        display: grid;
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
  
}

</style>
<script setup>
import { useDialogStore } from "@/store/dialog";
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
    const editorStore = useDialogStore();
    editorStore.toggleLineScore({ open: true, editedGame: { id: gameId } });
};

const showSearch = ref(false);
const onSelect = (t) => {
    showSearch.value = false;
};

const container = ref(null);
const { height: containerHeight, width: containerWidth } =
    useElementBounding(container);

const { getEventBackground } = useColor();

const backgroundImage = ref(null)

watch(containerHeight, () => {
     backgroundImage.value = getEventBackground(props.result.event_color, containerHeight.value, containerWidth.value);
})
</script>
