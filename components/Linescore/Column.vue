<template>
    <div
        class="scoreboard__end-row items-end top"
        :class="isInverted ? 'justify-start ' : 'justify-end '"
        :style="{ order: isInverted ? '1' : '0',  }"
        v-memo="[score.home, isInverted]"
        :id="`endcol-${endno}-home`"
        ref="row"
    >
        <div
            class="inner row items-center justify-center q-pt-sm"
            :class="{ highlight: !!score.home }"
            @click.prevent.stop="setTop"
            ref="top"
        >
            <div class="inner-scorecard text-center">
                {{ score.home }}
            </div>
        </div>
    </div>

    <div
        class="scoreboard__end-row items-center bottom"
        :class="isInverted ? 'justify-end ' : 'justify-start'"
        :style="{ order: isInverted ? '0' : '1' }"
        v-memo="[score.away, isInverted]"
        :id="`endcol-${endno}-away`"
    >
        <div
            class="inner row items-center justify-center q-pt-sm"
            ref="bottom"
            :class="{ highlight: !!score.away }"
            @click.prevent.stop="setBottom"
        >
            <div class="inner-scorecard text-center">
                {{ score.away }}
            </div>
        </div>
    </div>
    <div class="extra__container" v-if="extra">
        <q-btn icon="remove" round @click="emit('remove')"></q-btn>
    </div>
    <div
        class="shake__container"
        v-if="shakeable || canExtra"
        ref="shaker"

    >
        <Button
            v-if="shakeable && !isRevealedEndGame"
            :round="!isRevealed"
            rounded
            :color="isRevealed ? 'mint' : 'white'"
            @click="handleShake"
            no-wrap
            class="shake-button"
            icon="handshake"
            :textColor="isRevealed ? null : 'mint'"
            size="0.9em"
        >
            <span class="shake-hands__text" :class="{ isRevealed }"
                >Shake hands?</span
            >
            <q-tooltip v-if="$q.platform.is.desktop"> Shake hands </q-tooltip>
        </Button>
        <Button
            v-if="shakeable && !isRevealed"
            :round="!isRevealedEndGame"
            rounded
            :color="isRevealedEndGame ? 'mint' : 'white'"
            @click="handleEndGame"
            no-wrap
            class="shake-button"
            icon="fast_forward"
            :textColor="isRevealedEndGame ? null : 'mint'"
            size="0.9em"
        >
            <span
                class="shake-hands__text"
                :class="{ isRevealed: isRevealedEndGame }"
                >End game early?</span
            >
            <q-tooltip v-if="$q.platform.is.desktop">
                End game early
            </q-tooltip>
        </Button>

        <q-btn v-if="canExtra" round no-wrap icon="add">
            <q-tooltip> Extra end </q-tooltip>
        </q-btn>
    </div>
</template>
<style lang="scss" scoped>
.shake-hands__text {
    max-width: 0px;
    overflow: hidden;
    &.isRevealed {
        max-width: 500px;
    }
}
.scoreboard__end-row {
    position: relative;
    display: flex;
    flex-direction: column;
    // justify-content: center;
    align-items: center;
    overflow: hidden;

    transform-origin: bottom;
    &:nth-child(2) {
        transform-origin: top;
    }

    padding: var(--space-md);
    .inner {
        border: 1px solid $grey-5;
        aspect-ratio: 1/1;
        text-align: center;
        border-radius: 32px;
        font-size: calc(50%);
        line-height: 15vh;
        width: 100%;
        font-size: 12vh;
        padding-top: 0.1em;
        transition: border 0.2s;
        &.highlight {
            border-color: #00cd93;
            border-width: 4px;
        }
    }
}
.extra__container {
    position: absolute;
    top: 0;
    bottom: 0;
    height: 40px;

    left: 0;
    right: 0;
    margin: auto;
    display: flex;
    justify-content: center;
    align-items: center;
}
.shake__container {
    position: absolute;
    top: v-bind(shakeTop);

    height: 40px;
    left: 0;
    right: 0;
    z-index: 2;
    margin: auto;
    display: flex;

    justify-content: center;
    align-items: center;
    .shake-button {
        &:nth-child(2) {
            margin-left: var(--space-sm);
        }
    }
}
</style>
<script setup>
import {
    onClickOutside,
    useConfirmDialog,
    useElementBounding,
} from "@vueuse/core";
import { triggerClickAnimation } from "@/utils/gsap";
import gsap from "gsap";
import Flip from "gsap/Flip";
gsap.registerPlugin(Flip);

const props = defineProps({
    canExtra: Boolean,
    endno: Number,
    inverted: Boolean,
    extra: Boolean,
    modelValue: Object,
    shakeable: Boolean,
    visible: Boolean,
});

const emit = defineEmits(["shake", "remove", "update:model-value", "click", 'endGame']);

const score = computed({
    get() {
        return props.modelValue;
    },
    set(val) {
        emit("update:model-value", val);
    },
});

const reset = () => {
    score.value.home = 0;
    score.value.away = 0;
};

const isInverted = ref(props.inverted);

const top = ref(null);
const bottom = ref(null);

const setTop = () => {
    emit("click");
    if (!props.visible) return;
    triggerClickAnimation(top.value);

    if (score.value.away) {
        reset();
    } else if (score.value.home + 1 < 9) {
        score.value.home += 1;
    }
};
const setBottom = () => {
    emit("click");
    if (!props.visible) return;
    triggerClickAnimation(bottom.value);
    if (score.value.home) {
        reset();
    } else if (score.value.away + 1 < 9) {
        score.value.away += 1;
    }
};

const { isRevealed, reveal, confirm, cancel, onConfirm } = useConfirmDialog();

const {
    isRevealed: isRevealedEndGame,
    reveal: revealEndGame,
    confirm: confirmEndGame,
    cancel: cancelEndGame,
    onConfirm: onConfirmEndGame,
} = useConfirmDialog();

const handleShake = () => {
    if (!isRevealed.value) {
        reveal();
    } else {
        confirm();
    }
};

const handleEndGame = () => {
    if (!isRevealedEndGame.value) {
        revealEndGame();
    } else {
        confirmEndGame();
    }
};

onConfirm(() => {
    emit("shake");
});

onConfirmEndGame(() => {
    emit("endGame");
});

const shaker = ref(null);
onClickOutside(shaker, () => {
    cancel();
    cancelEndGame();
});

const $q = useQuasar();

const { width } = useElementBounding(shaker);


watch(
    () => props.inverted,
    (val) => {
        const state = Flip.getState(
            `#endcol-${props.endno}-home, #endcol-${props.endno}-away`
        );
        isInverted.value = val;
        nextTick(() => {
            Flip.from(state, {
                duration: 0.2,
                nested: true,
            });
        });
    }
);

const {y:tileY} = useElementBounding(top);

const row = ref(null);

const {y: rowY} = useElementBounding(row);

const shakeTop = computed(() => `${((tileY.value - rowY.value) / 2) - 20}px`)

</script>
