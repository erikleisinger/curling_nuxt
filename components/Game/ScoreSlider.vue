<template>
    <div
        class="score-input__wrap"
        :style="`
                max-height: 100%;
                overflow: hidden;
                transition: all 0.2s;
                z-index: 150;
                color: black;
                height: ${showScoreInput ? '100%' : '7em'}
            `"
    >
        <div
            class="player__header box-shadow--dark column no-wrap"
            :class="{
                [`${currentColor}--background`]: true,
                showing: showScoreInput,
            }"
            ref="headerEl"
        >
            <div
                class="row justify-center"
                style="margin-bottom: -4px"
                :style="{ order: showScoreInput ? '2' : '0' }"
            >
                <q-icon
                    name="drag_handle"
                    color="white"
                    size="sm"
                    @click="showScoreInput = !showScoreInput"
                />
            </div>
            <div class="row items-center justify-between">
                <div class="row justify-end">
                    <q-btn
                        flat
                        round
                        icon="chevron_left"
                        color="white"
                        @click="onBack"
                    />
                </div>
                <div class="column items-center justify-center">
                    <div class="header" @click="emit('navigate')">End {{ end }}</div>
                    <div class="text-white footer">{{ footerText }}</div>
                </div>
                <div class="row justify-end">
                    <q-btn
                        flat
                        round
                        icon="chevron_right"
                        color="white"
                        @click="onNext"
                    />
                </div>
            </div>
        </div>
        <div
            :style="{
                maxHeight: showScoreInput ? 'calc(100% - 7em)' : '0px',
                height: showScoreInput ? '100%' : '0px',
            }"
            style="transition: all 0.2s; overflow: auto"
        >
            <InputScore />
        </div>
    </div>
</template>
<style lang="scss" scoped>
.score-input__wrap {
    overflow: hidden;
    height: 0px;
    position: absolute;
    z-index: 5;
    bottom: 0;
    .player__header {
        position: relative;
        bottom: 0;
        padding: 8px 16px;
        width: inherit;
        border-radius: inherit;
        height: 7em;
        top: 0px;
        z-index: 10;
        width: 100%;
        transition: all 0.3s;
        &:not(.showing) {
            border-top-left-radius: 32px;
            border-top-right-radius: 32px;
        }

        .header {
            font-family: $font-family-main;
            font-weight: bold;
            color: white;

            font-size: 2em;
        }
        .footer {
            font-family: $font-family-secondary;
        }
    }
}
</style>
<script setup lang="ts">
import { useSwipe } from "@vueuse/core";
import { usePlayerStore } from "@/store/players";
import { useSessionStore } from "@/store/session";

const props = defineProps({
    onNext: Function,
    onBack: Function,
});

const emit = defineEmits(['navigate'])

const showScoreInput = ref(false);

const headerEl = ref(null);
const { direction } = useSwipe(headerEl, {
    onSwipe: () => {
        if (direction.value === "up") {
            showScoreInput.value = true;
        } else if (direction.value === "down") {
            showScoreInput.value = false;
        }
    },
});


/**
 * Get footer text
 */

// Shot color for background
const currentColor = computed(() => store.getShotColor(store.shot));

// End / Shot # for header / footer text


const store = useSessionStore();
const playerStore = usePlayerStore();

const currentThrower = computed(() => store.getCurrentThrower);

function mapNumber(inputNumber: number) {
    if (
        typeof inputNumber !== "number" ||
        inputNumber < 1 ||
        !Number.isInteger(inputNumber)
    ) {
        throw new Error("Invalid input. Please provide a positive integer.");
    }

    const adjustedInput = (Math.floor((inputNumber - 1) / 2) % 2) + 1;
    return adjustedInput;
}

const end = computed<number>(() => store.end);
const { capitalizeFirstLetter, formatNumberWithSuffix } = useFormat();
const footerText = computed(
    () =>
        `${currentThrower.value.name}'s ${formatNumberWithSuffix(
            mapNumber(store.shot)
        )}`
);
</script>
