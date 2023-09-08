<template>
    <header class="game__header">
        <slot name="prepend" />
        <nav
            class="row no-wrap justify-center full-width items-center"
            v-if="!hideValues.includes('details')"
        >
            <div
                :class="{
                    'help--highlight help--animation':
                        selectionMode === 'details',
                }"
            >
                <h2 class="text-sm text-center">Game</h2>
                <h1 class="text-md text-bold text-center" @click="clickTime">
                    {{ format(selections.start_time, "MMMM DD, YYYY ") }}
                </h1>
                <h2 class="text-sm text-center">
                    {{ format(selections.start_time, "HH:mm a") }}
                </h2>
                <InputDate v-if="canEdit" v-model="selections.start_time" />
            </div>
        </nav>
        <div
            class="row no-wrap justify-between col-12 teams-container"
            style="position: relative"
        >
            <div
                class="end-count__container"
                v-if="!hideValues.includes('score')"
            >
                {{ `After ${endCount}` }}
            </div>
            <div
                class="column team__header items-center no-wrap"
                :class="hideValues.includes('away') ? 'col-12' : 'col-6'"
            >
                <div
                    class="avatar__container q-mb-md"
                    ref="avatarHome"
                    @click="
                        emit('avatarClick', {
                            value: 'home',
                        })
                    "
                >
                    <TeamAvatar
                        :teamId="selections.home?.id"
                        :color="
                            hideValues.includes('colors')
                                ? null
                                : selections.homeColor
                        "
                        :viewable="!!selections.home.id && !static"
                        :animateRing="
                            selectionMode === 'colors' &&
                            !hideValues.includes('colors')
                        "
                        :highlight="selectionMode === 'home'"
                    />

                    <div
                        class="hammer-container bg-primary"
                        :class="{
                            'animated help--highlight help--animation':
                                selectionMode === 'hammer',
                            'bg-primary flash':
                                selections.hammerFirstEndTeam ===
                                selections.home?.id,
                            'bg-grey-4':
                                selections.hammerFirstEndTeam !==
                                selections.home?.id,
                        }"
                        v-if="
                            selectionMode === 'hammer' ||
                            (!hideValues.includes('hammer') &&
                                !!selections.hammerFirstEndTeam &&
                                selections.hammerFirstEndTeam ===
                                    selections.home?.id)
                        "
                    >
                        <q-icon
                            name="hardware"
                            :color="
                                selections.hammerFirstEndTeam ===
                                selections.home?.id
                                    ? 'white'
                                    : 'grey-9'
                            "
                        />
                    </div>
                </div>

                <div class="column items-center full-width ">
                    <div class="text-sm" v-if="selections.home.id || selections.home.name">Team</div>
                    <h2
                        class="text-sm text-bold text-center truncate-text full-width"
                    >
                        {{ selections.home.name }}
                    </h2>
                    <slot name="appendHomeName" />
                </div>
                <div
                    class="score__container"
                    v-if="!hideValues.includes('score')"
                >
                    {{ homePoints ?? 0 }}
                </div>
            </div>
            <div
                class="column team__header items-center col-6 no-wrap"
                v-if="!hideValues.includes('away')"
            >
                <div
                    class="avatar__container q-mb-md"
                    ref="avatarAway"
                    @click="
                        emit('avatarClick', {
                            value: 'away',
                        })
                    "
                >
                    <TeamAvatar
                        :teamId="selections.away?.id"
                        :color="
                            hideValues.includes('colors')
                                ? null
                                : selections.awayColor
                        "
                        :viewable="!!selections.away.id && !static"
                        :animateRing="
                            selectionMode === 'colors' &&
                            !hideValues.includes('colors')
                        "
                        :highlight="selectionMode === 'away'"
                    />

                    <div
                        class="hammer-container"
                        :class="{
                            'animated help--highlight help--animation':
                                selectionMode === 'hammer',
                            'bg-primary flash':
                                selections.hammerFirstEndTeam ===
                                selections.away?.id,
                            'bg-grey-4':
                                selections.hammerFirstEndTeam !==
                                selections.away?.id,
                        }"
                        v-if="
                            selectionMode === 'hammer' ||
                            (!hideValues.includes('hammer') &&
                                !!selections.hammerFirstEndTeam &&
                                selections.hammerFirstEndTeam ===
                                    selections.away?.id)
                        "
                    >
                        <q-icon
                            name="hardware"
                            :color="
                                selections.hammerFirstEndTeam ===
                                selections.away?.id
                                    ? 'white'
                                    : 'grey-9'
                            "
                        />
                    </div>
                </div>

                <div class="column items-center full-width">
                    <div style="position: relative" class="full-width">
                        <div
                            class="verified__container"
                            v-if="selections.verified"
                        >
                            <q-icon
                                name="verified"
                                :color="
                                    selections.verified ? 'primary' : 'grey-5'
                                "
                            />
                        </div>
                        <div class="column items-center full-width">
                            <slot name="awayName">
                                <div class="text-sm">Team</div>
                                <h2
                                    class="text-sm text-bold text-center truncate-text full-width"
                                >
                                    {{ selections.away.name }}
                                </h2>
                            </slot>
                            <slot name="appendAwayName" />
                        </div>
                    </div>
                </div>
                <div
                    class="score__container"
                    v-if="!hideValues.includes('score')"
                >
                    {{ awayPoints ?? 0 }}
                </div>
            </div>
        </div>
        <div
            class="column justify-around items-center no-wrap"
            v-if="!hideValues.includes('location')"
        >
            <div
                class="info__section"
                style="width: fit-content"
                @click="emit('update:rink')"
                :class="{
                    'help--highlight help--animation':
                        selectionMode === 'details',
                }"
            >
                <q-icon name="location_on" color="grey-6" />
                <h2
                    class="text-sm"
                    v-if="!canEdit"
                    :class="{ 'text-bold': rink?.name }"
                >
                    {{ rink?.name ?? "Unspecified rink" }}
                </h2>
                <h2
                    class="text-sm text-bold"
                    v-else
                    :class="{ 'text-underline text-primary ': canEdit }"
                >
                    {{ rink?.name ?? "Click to select rink" }}
                </h2>
            </div>
            <div
                class="info__section column items-center"
                v-if="rink"
                :class="{ 'q-mt-md': selectionMode === 'details' }"
            >
                <h2 class="text-sm" v-if="!canEdit">
                    {{
                        sheet?.number
                            ? `Sheet ${sheet?.number}${numberToLetter(
                                  sheet?.number
                              )}`
                            : "Unspecified sheet"
                    }}
                </h2>
                <h2
                    class="text-sm"
                    v-else
                    :class="{
                        'text-underline text-primary text-bold': canEdit,
                        'help--highlight help--animation ':
                            selectionMode === 'details',
                    }"
                    @click="showSheetSelect = true"
                >
                    {{
                        sheet?.number
                            ? `Sheet ${sheet?.number}${numberToLetter(
                                  sheet?.number
                              )}`
                            : "Click to select a sheet"
                    }}
                </h2>
                <transition
                    appear
                    enter-active-class="animated slideInLeft"
                    leave-active-class="animated slideOutRight"
                >
                    <div class="row justify-center" v-if="showSheetSelect">
                        <div
                            v-for="number in [
                                ...Array(rink?.sheets).keys(),
                            ].map((i) => i + 1)"
                            :key="`sheet-${number}`"
                            class="sheet__number"
                            :class="{ selected: sheet?.number === number }"
                            @click="selectSheet(number)"
                        >
                            <span
                                >{{ number }}{{ numberToLetter(number) }}</span
                            >
                        </div>
                    </div>
                </transition>
            </div>
        </div>
        <transition
            appear
            enter-active-class="animated slideInLeft"
            leave-active-class="animated slideOutRight"
        >
            <div
                class="linescore-container"
                v-if="
                    !(
                        hideValues.includes('linescore') &&
                        hideValues.includes('linescoreHeader')
                    )
                "
            >
                <div
                    class="row justify-between items-end q-my-sm"
                    v-if="!hideValues.includes('linescore')"
                >
                    <div class="row items-center">
                        <q-icon
                            name="o_scoreboard"
                            color="deep-purple"
                            class="text-md q-mr-sm"
                        />
                        <h2 class="text-md text-bold">Linescore</h2>
                    </div>
                </div>
                <q-separator />
                <LinescoreGridView
                    ref="nav"
                    :game="selections"
                    :endCount="endCount"
                    :score="score"
                    :colorCode="false"
                    :headerOnly="hideValues.includes('linescore')"
                >
                    <template
                        v-slot:prependHeader
                        v-if="selectionMode === 'endcount'"
                    >
                        <q-btn
                            round
                            icon="remove"
                            dense
                            color="primary"
                            class="help--animation help--highlight"
                            @click="emit('update:endCount', -2)"
                        />
                    </template>
                    <template
                        v-slot:appendHeader
                        v-if="selectionMode === 'endcount'"
                    >
                        <q-btn
                            round
                            icon="add"
                            dense
                            color="primary"
                            class="help--animation help--highlight"
                            @click="emit('update:endCount', 2)"
                        />
                    </template>
                </LinescoreGridView>
            </div>
        </transition>
        <div
            class="linescore-container"
            v-if="
                !(
                    hideValues.includes('linescore') &&
                    hideValues.includes('linescoreHeader')
                )
            "
        ></div>
    </header>
</template>
<style lang="scss" scoped>
.game__header {
    padding: 0px var(--space-md);
    padding-bottom: var(--space-sm);
    overflow-x: hidden;
    nav {
        padding: var(--space-sm) 0px;
        margin-bottom: var(--space-md);
    }
    h1 {
        text-align: center;
    }
    .info__section {
        display: flex;
        justify-content: center;
        .q-icon {
            margin-right: var(--space-xxxs);
        }
    }
    .team__header {
        // transition: all 0.2s;
        .avatar__container {
            height: 7em;
            max-width: 100%;
            width: 7em;
            position: relative;
            .hammer-container {
                position: absolute;
                bottom: -1;
                right: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 6px;
                border-radius: 50%;
                font-size: 1.2em;
                border: 1px solid rgba(0, 0, 0, 0.3);
                &:not(.animated) {
                    box-shadow: $pretty-shadow-2;
                }
                &.flash {
                    animation: flash 0.4s linear forwards;
                }
            }
        }
        .score__container {
            font-size: 4em;
            position: relative;
        }
    }
    .end-count__container {
        position: absolute;
        bottom: 1em;
        left: 0;
        right: 0;
        margin: auto;
        width: fit-content;
        color: $grey-8;
        font-size: 0.8em;
    }
    .linescore-container {
        margin-top: var(--space-sm);
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

@keyframes flash {
    0% {
        transform: scale(1);
    }

    50% {
        transform: scale(1.3);
    }
    100% {
        transform: scale(1);
    }
}
</style>
<script setup>
import gsap from "gsap";
import Flip  from "gsap/Flip";
gsap.registerPlugin(Flip);
const props = defineProps({
    awayPoints: Number,
    canEdit: Boolean,
    homePoints: Number,
    endCount: Number,
    game: Object,
    hideValues: {
        type: Array,
        default: [],
    },
    modelValue: Object,
    rink: Object,
    selectionMode: String,
    score: Object,
    sheet: Object,
    static: Boolean,
});

const emit = defineEmits([
    "avatarClick",
    "update:endCount",
    "update:rink",
    "update:sheet",
    "update:modelValue",
]);

const selections = computed({
    get() {
        return props.modelValue;
    },
    set(val) {
        emit("update:modelValue", val);
    },
});
const $q = useQuasar();
const { format, toTimezone } = useTime();

const showSheetSelect = ref(false);

const selectSheet = (number) => {
    emit("update:sheet", number);
    showSheetSelect.value = false;
};

const clickTime = () => {
    if (!props.canEdit) return;
};

const avatarHome = ref(null);
const avatarAway = ref(null);

watch(
    () => props.hideValues,
    (val, oldVal) => {
       
            const state = Flip.getState(".team__header");
            nextTick(() => {
                Flip.from(state, {
                    duration: 0.5,
                    stagger: 0.1,
                    ease: "back",
                });
            });
        
    },
    { deep: true }
);

watch(() => [selections.value.home, selections.value.away], ([home, away], oldData) => {
    const [oldHome, oldAway] = oldData ?? [];
    console.log('home: ', home, 'away: ', away)
     if (home.id !== oldHome?.id) {
            if (home.id) {
                gsap.from(avatarHome.value, {
                    scale: 3,
                    duration: 0.6,
                    ease: "bounce",
                });
            } else {
                gsap.from(avatarHome.value, {
                    scale: 0,
                    duration: 0.6,
                    ease: "bounce",
                });
            }
        } 

         if (away.id !== oldAway?.id) {
            if (away.id) {
                gsap.from(avatarAway.value, {
                    scale: 3,
                    duration: 0.6,
                    ease: "bounce",
                });
            } else {
                gsap.from(avatarAway.value, {
                    scale: 0,
                    duration: 0.6,
                    ease: "bounce",
                });
            }
        } 
}, {deep: true})
</script>
