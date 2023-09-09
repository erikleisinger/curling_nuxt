<template>
    <div
        class="linescore-editor__container hide-scroll"
        :style="{
            minHeight: compact ? '' : 'calc(100% - 25px)',
        }"
    >
        <nav
            class="row no-wrap justify-center full-width items-center q-mt-md"
            v-if="summary"
            ref="dateContainer"
        >
            <div class="relative-position">
                <h2 class="text-sm text-center">Game Summary</h2>
                <h1 class="text-md text-bold text-center">
                    {{ format(selections.start_time, "MMMM DD, YYYY") }}
                </h1>
                <h2 class="text-sm text-center">
                    {{ format(selections.start_time, "HH:mm a") }}
                </h2>
                <div class="edit--floating">
                    <q-btn
                        icon="edit"
                        flat
                        round
                        padding="4px"
                        color="grey-8"
                        dense
                        @click="dateSelectOpen = true"
                    />
                </div>
            </div>
            <InputDate
                v-if="canEditDetails && dateSelectOpen"
                v-model="selections.start_time"
            />
        </nav>
        <LinescoreGrid
            :score="score"
            v-if="isMounted"
            :selected="selected"
            @select="onGridClick"
            :style="{
                order: summary ? 1 : 0,
                marginTop: summary ? '18px' : '',
            }"
        >
            <template v-slot:avatarHome>
                <div class="nested-avatar__container">
                    <LinescoreAvatar
                        v-if="summary"
                        avatarSize="100%"
                        v-model="selections.home"
                        :hasHammer="
                            selections.hammerFirstEndTeam ===
                            selections.home?.id
                        "
                    />
                    <Teleport
                        to=".avatar-unnested__home"
                        :disabled="!mode.includes('home')"
                    >
                        <LinescoreAvatar
                            avatarSize="100%"
                            id="avatar-home"
                            @click="onAvatarClick('home')"
                            :editing="canEdit && mode.includes('home')"
                            v-model="selections.home"
                            @update:modelValue="onTeamChange('home', $event)"
                            @update:color="onColorUpdate"
                            @confirm="onAvatarConfirm('home')"
                            :selectColor="
                                !!(
                                    selections.home?.name &&
                                    selections.away?.name &&
                                    mode.includes('home')
                                )
                            "
                            :selectHammer="
                                !!(
                                    selections.home?.name &&
                                    selections.away?.name &&
                                    mode.includes('home')
                                )
                            "
                            :preventColors="[selections.away?.color]"
                            defaultColor="red"
                            :hasHammer="
                                selections.hammerFirstEndTeam ===
                                selections.home?.id
                            "
                            @update:hammer="
                                selections.hammerFirstEndTeam =
                                    selections.home?.id
                            "
                            :canConfirm="
                                !summary &&
                                canEdit &&
                                !!selections.home?.id &&
                                !!selections.away?.name &&
                                !!(
                                    selections.hammerFirstEndTeam ===
                                        selections.away?.id ||
                                    selections.hammerFirstEndTeam ===
                                        selections.home?.id
                                ) &&
                                mode.includes('home')
                            "
                            :showNames="summary"
                            :restrictIds="userTeamStore.userTeams.map(({id}) => id)"
                        >
                        </LinescoreAvatar>
                    </Teleport>
                </div>
            </template>
            <template v-slot:avatarAway>
                <div class="nested-avatar__container">
                    <LinescoreAvatar
                        v-if="summary"
                        avatarSize="100%"
                        v-model="selections.away"
                        :hasHammer="
                            selections.hammerFirstEndTeam ===
                            selections.away?.id
                        "
                    />
                    <Teleport
                        to=".avatar-unnested__away"
                        :disabled="!mode.includes('away')"
                    >
                        <LinescoreAvatar
                            avatarSize="100%"
                            id="avatar-away"
                            @click="onAvatarClick('away')"
                            :editing="mode.includes('away')"
                            v-model="selections.away"
                            @confirm="onAvatarConfirm('away')"
                            @update:modelValue="onTeamChange('away', $event)"
                            @update:color="onColorUpdate"
                            :selectColor="
                                !!(
                                    selections.home?.name &&
                                    selections.away?.name &&
                                    mode.includes('away')
                                )
                            "
                            :selectHammer="
                                !!(
                                    selections.home?.name &&
                                    selections.away?.name &&
                                    mode.includes('away')
                                )
                            "
                            :preventColors="[selections.home?.color]"
                            defaultColor="blue"
                            :hasHammer="
                                selections.hammerFirstEndTeam ===
                                selections.away?.id
                            "
                            @update:hammer="
                                selections.hammerFirstEndTeam =
                                    selections.away?.id
                            "
                            allowCustom
                            :canConfirm="
                                !summary &&
                                canEdit &&
                                !!selections.home?.id &&
                                !!selections.away?.name &&
                                !!(
                                    selections.hammerFirstEndTeam ===
                                        selections.away?.id ||
                                    selections.hammerFirstEndTeam ===
                                        selections.home?.id
                                ) &&
                                mode.includes('away')
                            "
                            :showNames="summary"
                            :filterIds="[selections.home?.id]"
                        >
                        </LinescoreAvatar>
                    </Teleport>
                </div>
            </template>

            <template v-slot:homeScore>
                {{ totalScore.home }}
                <!-- <Teleport to="#totalscore-home" :disabled="!summary" v-if="isMounted">
                    <div>
                        {{ totalScore.home }}
                    </div>
                </Teleport> -->
            </template>
            <template v-slot:awayScore>
                {{ totalScore.away }}
                <!-- <Teleport to="#totalscore-away" :disabled="!summary" v-if="isMounted">
                    <div>
                        {{ totalScore.away }}
                    </div>
                </Teleport> -->
            </template>
        </LinescoreGrid>
        <div
            class="avatars-unnested__container"
            :class="{ visible: mode.includes('home') || mode.includes('away') }"
            :style="{ order: summary ? 0 : 1 }"
        >
            <div
                class="avatar-unnested__home"
                :style="{ 'grid-column': mode.includes('away') ? '' : '1/3' }"
            />
            <div
                class="avatar-unnested__away"
                :style="{ 'grid-column': mode.includes('home') ? '' : '1/3' }"
            />
        </div>
        <div
            class="row no-wrap full-width justify-around relative-position"
            v-if="summary"
        >
            <div class="totalscore--summary" id="totalscore-home">
                {{ tweenedHomeScore.total.toFixed() }}
            </div>
            <div class="totalscore--summary" id="totalscore-away">
                {{ tweenedAwayScore.total.toFixed() }}
            </div>
            <div class="end-count__container text-sm">
                After
                {{
                    Object.values(score).filter((e) => e?.home !== "X")?.length
                }}
            </div>
        </div>
        <div class="full-width row justify-center" v-if="summary">
            <div
                class="info__section relative-position"
                style="width: fit-content"
                @click="
                    toggleGlobalSearch({
                        open: true,
                        options: {
                            inputLabel: 'Search for a rink',
                            resourceTypes: ['rink'],
                            callback: (selection) => {
                                selections.rink = selection;
                            },
                        },
                    })
                "
            >
                <q-icon name="location_on" color="red" />
                <h2
                    class="text-sm"
                    :class="{ 'text-bold': selections.rink?.name }"
                >
                    {{ selections?.rink?.name ?? "Unspecified rink" }}
                </h2>
                <div class="edit--floating text-sm" v-if="canEditDetails">
                    <q-btn
                        icon="edit"
                        flat
                        round
                        padding="0px"
                        color="grey-8"
                        dense
                        size="sm"
                    />
                </div>
            </div>
        </div>
        <div
            class="info__section column items-center q-mt-xs"
            v-if="selections.rink?.id && canEditDetails"
        >
            <div class="row relative-position" @click="showSheetSelect = true">
                <q-icon name="crop_portrait" color="grey-6" />
                <h2 class="text-sm">
                    {{
                        selections.sheet?.number
                            ? `Sheet ${
                                  selections.sheet?.number
                              }${numberToLetter(selections.sheet?.number)}`
                            : "Unspecified sheet"
                    }}
                </h2>
                <div class="edit--floating text-sm" v-if="canEditDetails">
                    <q-btn
                        icon="edit"
                        flat
                        round
                        padding="0px"
                        color="grey-8"
                        dense
                        size="sm"
                    />
                </div>
            </div>

            <transition
                appear
                enter-active-class="animated slideInLeft"
                leave-active-class="animated slideOutRight"
            >
                <div class="row justify-center" v-if="showSheetSelect">
                    <div
                        v-for="number in [
                            ...Array(selections.rink?.sheets).keys(),
                        ].map((i) => i + 1)"
                        :key="`sheet-${number}`"
                        class="sheet__number"
                        :class="{
                            selected: selections.sheet?.number === number,
                        }"
                        @click="selectSheet(number)"
                    >
                        <!-- -->
                        <span>{{ number }}{{ numberToLetter(number) }}</span>
                    </div>
                </div>
            </transition>
        </div>
        <q-space v-if="summary" />
    </div>
</template>
<style lang="scss" scoped>
.linescore-editor__container {
    overflow-x: hidden;
    padding-bottom: var(--space-sm);
    display: flex;
    flex-direction: column;
    overflow-y: visible;
    .avatars-unnested__container {
        width: 100%;
        box-sizing: border-box;
        display: grid;
        grid-template-columns: repeat(2, 45%);
        column-gap: 10%;

        &.visible {
            padding: var(--space-md);
            padding-bottom: 0px;
        }

        .avatar-unnested__away,
        .avatar-unnested__home {
            .team__header {
                margin: auto;
                box-sizing: border-box;
            }
        }
    }
    .nested-avatar__container {
        padding: 10%;
    }
    .totalscore--summary {
        font-size: 5em;
    }
    .end-count__container {
        position: absolute;
        bottom: 1em;

        margin: auto;
        left: 0;
        right: 0;
        width: fit-content;
        height: fit-content;
    }
    .edit--floating {
        position: absolute;
        right: -2em;
        top: 0;
        bottom: 0;
        margin: auto;
        height: fit-content;
    }
    .info__section {
        display: flex;
        justify-content: center;
        .q-icon {
            margin-right: var(--space-xxxs);
        }
    }
    .sheet__number {
        padding: var(--space-xs);
        border: 1px solid rgba(0, 0, 0, 0.2);
        margin: var(--space-xs);
        text-align: center;
        border-radius: 4px;
        width: calc(2ch + var(--space-xs) * 2);
        transition: transform 0.1s;
        height: fit-content;
        &.selected {
            color: white;
            background-color: $deep-purple;
            transform: scale(1.1);
            font-weight: bold;
        }
    }
}
</style>

<script setup>
import { useMounted, useRefHistory, useVModel } from "@vueuse/core";
import { useDialogStore } from "@/store/dialog";
import {useUserTeamStore} from '@/store/user-teams'
import gsap from "gsap";
import { Flip } from "gsap/Flip";
gsap.registerPlugin(Flip);
const props = defineProps({
    canEdit: Boolean,
    canEditDetails: Boolean,
    compact: Boolean,
    modelValue: Object,
    score: Object,
    selected: Number,
    summary: Boolean,
});

const emit = defineEmits([
    "edit",
    "linescore",
    "scroll",
    "ready",
    "update:modelValue",
]);

const selections = useVModel(props, "modelValue", emit);

const { toggleGlobalSearch } = useDialogStore();

const userTeamStore = useUserTeamStore()

const isMounted = useMounted();

const endCount = computed(() => Object.keys(props.score)?.length ?? 0);

const onGridClick = (num) => {
    if (props.summary) {
        nestAll();
        emit("linescore");
    } else {
        const s = Flip.getState(
            ".linescore-column--item, .linescore-column--item.selected",
            { props: "backgroundColor" }
        );
        emit("scroll", num);
        nextTick(() => {
            Flip.from(s, {
                duration: 0.2,
                ease: "linear",
                // fade: true,
            });
        });
    }
};

const mode = ref([]);

const onAvatarClick = (team) => {
    if (mode.value.includes(team)) return;
    toggleAvatarNesting(team, !mode.value.includes(team));

    emit("edit");
};

const onAvatarConfirm = (team) => {
    if (props.summary) return;
    toggleAvatarNesting(team, false);
};

const hammerFE = computed(() => selections.value.hammerFirstEndTeam);
const { history: hammerHistory } = useRefHistory(hammerFE);

const onTeamChange = (team, newValue) => {
    nextTick(() => {
        selections.value[team] = newValue;
        if (team === "home" && !selections.value.away?.name) {
            toggleAvatarNesting("away", true, 1000);
        }
    });
};

watch(() => selections.value.away, (val, oldVal) => {
    if (hammerHistory.value[0]?.snapshot === oldVal?.id) selections.value.hammerFirstEndTeam = val?.id
}, {deep: true})

watch(() => selections.value.home, (val, oldVal) => {
    if (hammerHistory.value[0]?.snapshot === oldVal?.id) selections.value.hammerFirstEndTeam = val?.id
}, {deep: true})

/**
 * ANIMATIONS
 */

//loading

onMounted(() => {
    if (!props.canEdit) return;
    const tl = gsap.timeline({});
    setTimeout(() => {
        tl.from(".linescore-column--item", {
            x: 400,
            stagger: 0.02,
            ease: "power1",
        });
        tl.from("#avatar-home", {
            duration: 0.4,
            scale: 0,
            ease: "bounce",
        });
        tl.from("#avatar-away", {
            duration: 0.4,
            scale: 0,
            ease: "bounce",
            onComplete: () => toggleAvatarNesting("home", true, 300),
        });
    }, 0);
});

const unnested = ref(false);

const toggleAvatarNesting = (team, isNested, delay = 0) => {
    const state = Flip.getState(
        `#avatar-home,#avatar-away,.avatar-unnested__away,.avatar-unnested__home,.avatars-unnested__container,.linescore-row,.linescore-container,.linescore-row--inner`
    );
    setTimeout(() => {
        if (isNested) {
            mode.value.push(team);
        } else {
            mode.value = mode.value.filter((t) => t !== team);
        }

        nextTick(() => {
            Flip.from(state, {
                stagger: 0.01,
                ease: "back",
                nested: true,
                absolute: ".linescore-row--inner,.linescore-row",
                onComplete: () => checkCompletionState(),
            });
        });
    }, delay);
};

const checkCompletionState = () => {
    if (mode.value.includes("home") || mode.value.includes("away")) return;
    if (
        !selections.value.home?.id ||
        !selections.value.away?.name ||
        !selections.value.home?.color ||
        !selections.value.away?.color ||
        !selections.value.hammerFirstEndTeam
    )
        return;
    emit("ready");
};

const onColorUpdate = () => {
    selections.value.homeColor = selections.value.home?.color;
    selections.value.awayColor = selections.value.away?.color;
};

const totalScore = computed(() => {
    return Object.keys(props.score).reduce(
        (all, current) => {
            const scoreObj = props.score[current];
            return {
                home:
                    scoreObj.home === "X" ? all.home : all.home + scoreObj.home,
                away:
                    scoreObj.away === "X" ? all.away : all.away + scoreObj.away,
            };
        },
        {
            home: 0,
            away: 0,
        }
    );
});
const tweenedHomeScore = reactive({
    total: 0,
});
const tweenedAwayScore = reactive({
    total: 0,
});

const dateContainer = ref(null);

const unnestAll = () => {
    const state = Flip.getState(
        `#avatar-home,#avatar-away,.avatar-unnested__away,.avatar-unnested__home,.avatars-unnested__container`
    );
    mode.value.push("away");
    mode.value.push("home");

    nextTick(() => {
        Flip.from(state, {
            stagger: 0.01,
            duration: 0.3,
            nested: true,
        });
    });
};

const nestAll = () => {
    const state = Flip.getState(
        `#avatar-home,#avatar-away,.avatar-unnested__away,.avatar-unnested__home,.avatars-unnested__container`
    );
    const iHome = mode.value.indexOf("home");
    if (iHome !== -1) mode.value.splice(iHome, 1);
    const iAway = mode.value.indexOf("away");
    if (iAway !== -1) mode.value.splice(iAway, 1);
    nextTick(() => {
        Flip.from(state, {
            stagger: 0.01,
            duration: 0.3,
            nested: true,
        });
    });
};

watch(
    () => props.summary,
    (val) => {
        if (!val) return;
        unnestAll();
        gsap.from(".totalscore--summary", {
            scaleY: 0,
            duration: 0.2,
            delay: 0.2,
            transformOrigin: "top",
        });
        gsap.to(tweenedHomeScore, {
            delay: 0.3,
            duration: (Number(totalScore.value.home) || 0) / 8,
            total: Number(totalScore.value.home) || 0,
        });
        gsap.to(tweenedAwayScore, {
            delay: 0.3,
            duration: (Number(totalScore.value.away) || 0) / 8,
            total: Number(totalScore.value.away) || 0,
        });
        gsap.from(dateContainer.value, {
            scaleY: 0,
            delay: 0.3,
            duration: 0.3,
            transformOrigin: "top",
            ease: "elastic",
        });
    }
);
const { format, toTimezone } = useTime();

const showSheetSelect = ref(null);

const selectSheet = (number) => {
    selections.value.sheet = {
        number,
    };
    showSheetSelect.value = false;
};

const dateSelectOpen = ref(false);
</script>

<script>
export default {
    name: "LinescoreEditor",
};
</script>
